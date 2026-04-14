output "app_instance_public_ips" {
  value       = hcloud_server.app[*].ipv4_address
  description = "App instance public IPs"
}

output "app_postgres_host" {
  value       = hcloud_server.app[0].ipv4_address
  description = "The host address of the postgres server which will be maintained by kamal"
}
