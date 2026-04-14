data "http" "deploy_ip" {
  url = "https://ipv4.icanhazip.com"
}

resource "hcloud_firewall" "app" {
  name = "${local.project_name}-firewall"

  # SSH — restricted to deploying machine IP
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "22"
    source_ips = ["${chomp(data.http.deploy_ip.response_body)}/32"]
  }

  # HTTP — public
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "80"
    source_ips = ["0.0.0.0/0", "::/0"]
  }

  # HTTPS — public
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "443"
    source_ips = ["0.0.0.0/0", "::/0"]
  }
}

resource "hcloud_server" "app" {
  count        = var.instance_count
  name         = "${local.project_name}-app-${count.index}"
  server_type  = var.server_type  # cx23 = 2 vCPU, 4GB RAM, nbg1
  image        = "ubuntu-24.04"
  location     = "nbg1"
  ssh_keys     = [var.ssh_key_id]
  firewall_ids = [hcloud_firewall.app.id]
  backups      = true

  labels = {
    environment = var.environment_name
    project     = var.project_name
  }

  lifecycle {
    ignore_changes  = [image]
    prevent_destroy = true
  }
}
