#
# Bucket
#

resource "aws_s3_bucket" "terraform_state" {
  # Use bucket_prefix to ensure the bucket is uniquely named
  bucket_prefix = "${var.environment_name}-${var.project_name}-app-tf-state-"

  lifecycle {
    prevent_destroy = true
  }
}

# Ensure the terraform bucket can't be made public
resource "aws_s3_bucket_public_access_block" "public_access" {
  bucket                  = aws_s3_bucket.terraform_state.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

#
# IAM and Policy
#

resource "aws_iam_user" "infra-user" {
  name = "${var.environment_name}-${var.project_name}-infra-user"
}

resource "aws_iam_group" "infra-group" {
  name = "${var.environment_name}-${var.project_name}-infra-group"
}

data "aws_iam_policy_document" "edit_access_to_terraform_state_bucket" {
  statement {
    effect = "Allow"
    principals {
      identifiers = [aws_iam_user.infra-user.arn]
      type = "AWS"
    }
    actions = [
      "s3:ListBucket",
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject"
    ]
    resources = [
      aws_s3_bucket.terraform_state.arn,
      "${aws_s3_bucket.terraform_state.arn}/*",
    ]
  }
}

resource "aws_s3_bucket_policy" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  policy = data.aws_iam_policy_document.edit_access_to_terraform_state_bucket.json
}
