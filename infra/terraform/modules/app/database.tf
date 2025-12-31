## Database - currently running as an accessory via kamal
# resource "aws_db_instance" "db_instance" {
#   allocated_storage   = 20
#   storage_type        = "gp3"
#   engine              = "postgres"
#   engine_version      = "10.3"
#   instance_class = "db.t3.micro"
#   # Don't create a final DB snapshot is before the DB instance is deleted
#   skip_final_snapshot = true
#
#   tags {
#     Name = "${local.project_name}-db-instance"
#   }
# }
