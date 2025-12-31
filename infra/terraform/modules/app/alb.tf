# Load balancer -

# Redirect 80 to 443
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.load_balancer.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }

  tags = {
    Name = "${local.project_name}-lb_listener-http"
  }
}

data "aws_acm_certificate" "server" {
  domain      = "${local.subdomain}${var.domain}"
  statuses = ["ISSUED"]
  types = ["AMAZON_ISSUED"]
  most_recent = true
}

# 443 application
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.load_balancer.arn
  port              = 443
  protocol          = "HTTPS"
  certificate_arn = data.aws_acm_certificate.server.arn

  default_action {
    type = "fixed-response"

    fixed_response {
      content_type = "text/plain"
      message_body = "404: page not found"
      status_code  = "404"
    }
  }

  tags = {
    Name = "${local.project_name}-lb_listener-https"
  }
}

resource "aws_lb_target_group" "http-instances" {
  # https://github.com/hashicorp/terraform-provider-aws/issues/636#issuecomment-397459646
  lifecycle {
    create_before_destroy = true
  }

  tags = {
    # https://github.com/hashicorp/terraform-provider-aws/issues/636#issuecomment-397459646
    Name     = "${local.project_name}-instances"
  }

  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    path                = "/up"
    protocol            = "HTTPS"
    matcher             = "200"
    interval            = 15
    timeout             = 5
    healthy_threshold   = 10
    unhealthy_threshold = 10
  }
}

resource "aws_lb_target_group" "instances" {
  # https://github.com/hashicorp/terraform-provider-aws/issues/636#issuecomment-397459646
  lifecycle {
    create_before_destroy = true
  }

  tags = {
    # https://github.com/hashicorp/terraform-provider-aws/issues/636#issuecomment-397459646
    Name     = "${local.project_name}-target-group-instances"
  }

  port     = 443
  protocol = "HTTPS"
  vpc_id   = var.vpc_id

  health_check {
    path                = "/up"
    protocol            = "HTTPS"
    matcher             = "200"
    interval            = 15
    timeout             = 5
    healthy_threshold   = 10
    unhealthy_threshold = 10
  }
}

resource "aws_lb_target_group_attachment" "http-instance" {
  count            = length(aws_instance.app)
  target_group_arn = aws_lb_target_group.http-instances.arn
  target_id        = aws_instance.app[count.index].id
  port             = 80
}

resource "aws_lb_listener_rule" "http-instances" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 100

  condition {
    path_pattern {
      values = ["*"]
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.http-instances.arn
  }
}

resource "aws_security_group" "alb" {
  name   = "${local.project_name}-alb-security-group"
  vpc_id = var.vpc_id

  # Allow ingress on the application port
  ingress {
    from_port = 443
    to_port   = 443
    protocol  = "tcp"
    cidr_blocks = var.allowed_cidrs_app
  }

  # Allow ingress on the application port
  ingress {
    from_port = 80
    to_port   = 80
    protocol  = "tcp"
    cidr_blocks = var.allowed_cidrs_app
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

resource "aws_lb" "load_balancer" {
  name               = "${local.project_name}-lb"
  load_balancer_type = "application"
  subnets            = data.aws_subnets.private_subnet_ids.ids
  security_groups    = [aws_security_group.alb.id]
}
