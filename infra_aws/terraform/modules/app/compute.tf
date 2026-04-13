data "aws_vpc" "vpc" {
  id = var.vpc_id
}

data "aws_subnets" "private_subnet_ids" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.vpc.id]
  }
}

## Only allow SSH access

resource "aws_security_group" "app-security-group" {
  name   = "${local.project_name}-app-security-group"
  vpc_id = data.aws_vpc.vpc.id

  ingress {
    cidr_blocks = concat(
      # allow VPC access - this will still be accessible via VPN
      [data.aws_vpc.vpc.cidr_block],
      var.allowed_cidrs_ssh
    )
    from_port = 22
    to_port   = 22
    protocol  = "tcp"
  }

  ingress {
    cidr_blocks = concat(
      # Only allow VPC access - this will still be accessible via VPN
      [data.aws_vpc.vpc.cidr_block],
      var.allowed_cidrs_app
    )
    from_port = 80
    to_port   = 80
    protocol  = "tcp"
  }

  ingress {
    cidr_blocks = concat(
      # Only allow VPC access - this will still be accessible via VPN
      [data.aws_vpc.vpc.cidr_block],
      var.allowed_cidrs_app
    )
    from_port = 443
    to_port   = 443
    protocol  = "tcp"
  }

  # Allow egress to all addresses
  egress {
    from_port = 0
    to_port   = 0
    protocol  = -1
    cidr_blocks = [
      "0.0.0.0/0"
    ]
  }
}

# aws ec2 describe-images --owners amazon --filters "Name=name,Values=amzn*" --query 'sort_by(Images, &CreationDate)[]'
data "aws_ami" "amazon_ami" {
  most_recent = true

  filter {
    name   = "name"
    values = ["al2023-ami-*"]
  }

  filter {
    name   = "architecture"
    values = ["arm64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["amazon"]
}

# Application instance
resource "aws_instance" "app" {
  count                       = var.instance_count
  ami                         = data.aws_ami.amazon_ami.image_id
  instance_type               = var.instance_size
  vpc_security_group_ids      = [aws_security_group.app-security-group.id]
  # Associated with a public ip so that it has internet access, as NAT costs aren't worth it
  # internet access is currently required to pull from ECR; this isn't required on ECS though
  associate_public_ip_address = true
  # Round robin the instances amongst the available subnets
  subnet_id                   = data.aws_subnets.private_subnet_ids.ids[count.index % length(data.aws_subnets.private_subnet_ids.ids)]
  key_name                    = data.aws_key_pair.access.key_name

  tags = {
    Name = "${local.project_name}-App-Instance-${count.index}"
  }

  root_block_device {
    volume_size = 32
    volume_type = "gp3"
    encrypted   = true

    tags = {
      Name = "${local.project_name}-App-Instance-${count.index}"
    }
  }
}
