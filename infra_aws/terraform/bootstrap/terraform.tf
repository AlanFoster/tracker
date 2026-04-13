terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      version = "~> 5.71.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = {
      Environment = var.environment_name
      Project = var.project_name
    }
  }
}
