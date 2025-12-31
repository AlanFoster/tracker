module "vpc" {
  source           = "../../modules/vpc"
  environment_name = local.environment_name
  project_name     = local.project_name
}

output "vpc" {
  value = module.vpc
}
