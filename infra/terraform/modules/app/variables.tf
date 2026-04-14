variable "environment_name" {
  type = string
}

variable "project_name" {
  type = string
}

variable "server_type" {
  type    = string
  default = "cx23"
}

variable "instance_count" {
  type    = number
  default = 1
}

variable "ssh_key_id" {
  type = string
}
