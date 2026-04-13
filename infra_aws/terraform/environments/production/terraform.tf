terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      version = "~> 5.74.0"
      source  = "hashicorp/aws"
    }
    http = {
      version = "3.4.5"
      source  = "hashicorp/http"
    }
  }

  backend "s3" {
    bucket  = "test-app-terraform-state-20241012204934901500000001"
    key     = "staging/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}

provider "aws" {
  region  = "us-east-1"
  profile = "infra"

  default_tags {
    tags = {
      Environment = "production"
      Project     = "tracker"
    }
  }
}
