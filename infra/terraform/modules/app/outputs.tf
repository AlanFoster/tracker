output "instance_private_ips" {
  value = aws_instance.app[*].private_ip
  description = "App instance private IPs that can be accessed"
}

output "instance_public_ips" {
  value = aws_instance.app[*].public_ip
}

output "aws_lb_dns_name" {
  value = aws_lb.load_balancer.dns_name
}

output "app_ecr_repository_url_base" {
  value = split("/", aws_ecr_repository.app.repository_url)[0]
  description = "repository url base, i.e. aws_account_id.dkr.ecr.region.amazonaws.com"
}

output "app_ecr_repository_name" {
  value = split("/", aws_ecr_repository.app.repository_url)[1]
  description = "repository name, i.e. staging-tracker-app"
}

output "app_a_record" {
  value = local.a_record
  description = "The a record for the application"
}

output "app_postgres_host" {
  # TODO: Swap this to private_ip when behind VPN
  value = aws_instance.app[0].public_ip
  description = "The host address of the postgres server which will be maintained by kamal"
}
