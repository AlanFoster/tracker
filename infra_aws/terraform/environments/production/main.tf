data "http" "deploy_ip" {
  url = "https://ipv4.icanhazip.com"
}

locals {
  environment_name  = "production"
  project_name      = "tracker"
  full_project_name = "${local.environment_name}-${local.project_name}"
  domain            = var.domain

  office_cidrs = [
    # One IP for now
    "${chomp(data.http.deploy_ip.response_body)}/32"
  ]
}

resource "aws_key_pair" "access" {
  key_name   = "${local.full_project_name}-access"
  public_key = file("~/.ssh/id_ed25519.pub")
}

module "budget" {
  source           = "../../modules/budget"
  environment_name = local.environment_name
  project_name     = local.project_name
}
