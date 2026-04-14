module "app" {
  source           = "../../modules/app"
  environment_name = local.environment_name
  project_name     = local.project_name
  server_type      = "cx23"
  instance_count   = 1
  ssh_key_id       = hcloud_ssh_key.access.id
}

output "app_instance_public_ips" {
  value       = module.app.app_instance_public_ips
  description = "App instance public IPs"
}

output "app_postgres_host" {
  value       = module.app.app_postgres_host
  description = "The host address of the postgres server"
}
