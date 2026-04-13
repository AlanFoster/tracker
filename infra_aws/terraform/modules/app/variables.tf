variable "environment_name" {
  type = string
}

variable "domain" {
  type = string
}

variable "project_name" {
  type = string
}

variable "instance_size" {
  type    = string
  default = "t4g.medium"
}

variable "instance_count" {
  type    = number
  default = 1
}

variable "create_dns_zone" {
  type    = bool
  default = false
}


# VPC ID to associate resources to
variable "vpc_id" {
  type = string
}

# Public SSH key used to access instances
variable "key_pair_id" {
  type = string
}

variable "allowed_cidrs_app" {
  type = list(string)
  description = "The CIDRs that can access the application - i.e. office IPs or 0.0.0.0/0"
}

variable "allowed_cidrs_ssh" {
  type = list(string)
  description = "The CIDRs that can ssh into the application - i.e. office IPs"
}
