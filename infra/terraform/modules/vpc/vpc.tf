## VPC

resource "aws_vpc" "vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = false
  enable_dns_support   = true
  tags = {
    Name = "${local.project_name}-vpc"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    Name = "${local.project_name}-igw"
  }
}

resource "aws_subnet" "subnet_a" {
  cidr_block              = "10.0.0.0/24"
  vpc_id                  = aws_vpc.vpc.id
  map_public_ip_on_launch = false
  depends_on              = [aws_internet_gateway.igw]
  availability_zone       = "us-east-1a"

  tags = {
    Name = "${local.project_name}-subnet"
  }
}

resource "aws_subnet" "subnet_b" {
  cidr_block              = "10.0.1.0/24"
  vpc_id                  = aws_vpc.vpc.id
  map_public_ip_on_launch = false
  depends_on              = [aws_internet_gateway.igw]
  availability_zone       = "us-east-1b"

  tags = {
    Name = "${local.project_name}-subnet"
  }
}

## Routing

resource "aws_route_table" "internet" {
  vpc_id = aws_vpc.vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "${local.project_name}-internet"
  }
}

resource "aws_route_table_association" "internet_a" {
  subnet_id      = aws_subnet.subnet_a.id
  route_table_id = aws_route_table.internet.id
}

resource "aws_route_table_association" "internet_b" {
  subnet_id      = aws_subnet.subnet_b.id
  route_table_id = aws_route_table.internet.id
}
