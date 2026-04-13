module "app" {
  source            = "../../modules/app"
  domain            = local.domain
  allowed_cidrs_app = concat(
    local.office_cidrs,
    # Allow public access to the app
    ["0.0.0.0/0"]
  )
  allowed_cidrs_ssh = local.office_cidrs
  instance_count    = 1
  instance_size     = "t4g.small"
  environment_name  = local.environment_name
  project_name      = local.project_name
  create_dns_zone   = false
  vpc_id            = module.vpc.vpc_id
  key_pair_id       = aws_key_pair.access.key_pair_id
}

output "app" {
  value = module.app
}

output "app_instance_private_ips" {
  value       = module.app.instance_private_ips
  description = "App instance private IPs that can be accessed"
}

output "app_instance_public_ips" {
  value       = module.app.instance_public_ips
  description = "App instance public IPs that can be accessed - this should be removed in favor of private IPs and a VPN"
}

output "app_ecr_repository_url_base" {
  value       = module.app.app_ecr_repository_url_base
  description = "repository url base, i.e. aws_account_id.dkr.ecr.region.amazonaws.com"
}

output "app_ecr_repository_name" {
  value       = module.app.app_ecr_repository_name
  description = "repository name, i.e. staging-tracker-app"
}

output "app_a_record" {
  value       = module.app.app_a_record
  description = "The a record for the application"
}

output "app_postgres_host" {
  value       = module.app.app_postgres_host
  description = "The host address of the postgres server which will be maintained by kamal"
}
