data "http" "deploy_ip" {
  url = "https://ipv4.icanhazip.com"
}

locals {
  environment_name  = "production"
  project_name      = "tracker"
  full_project_name = "${local.environment_name}-${local.project_name}"
}

resource "hcloud_ssh_key" "access" {
  name       = "${local.full_project_name}-access"
  public_key = file("~/.ssh/id_ed25519.pub")
}
