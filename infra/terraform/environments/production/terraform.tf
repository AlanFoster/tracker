terraform {
  required_version = ">= 1.5.0"

  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.49"
    }
    http = {
      source  = "hashicorp/http"
      version = "3.4.5"
    }
  }
}

# Token is read from the HCLOUD_TOKEN environment variable.
# Set it with: export HCLOUD_TOKEN=your_token_here
provider "hcloud" {}
