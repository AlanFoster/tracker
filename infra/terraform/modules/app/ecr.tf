# ECR Repository for the application image
resource "aws_ecr_repository" "app" {
  name                 = "${local.project_name}-app"
  image_tag_mutability = "MUTABLE"
  force_delete = true
}
