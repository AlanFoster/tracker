# README

Folder descriptions:

- `bootstrap` - Configuration for the AWS account itself, such as creating the terraform buckets required for terraform.
- `app` - Maintains the terraform for the main application.

## Linting

```
docker run --rm -v $(pwd):/data -t ghcr.io/terraform-linters/tflint
```

## Setup

Initial bootstrap:

```
# Pre-requisite AWS setup
cd bootstrap
tofu init
tofu plan -out plan
tofu apply plan
```

Manual steps that need terraform'd and are created in the AWS UI:
- Manually create a Route53 hosted zone in AWS
- Manually request an ACM cert and add the CNAME entries to the above hosted zone

Installing the application:

```
# AWS setup for the application
cd environments/production
tofu init
tofu plan -out plan
tofu apply plan
```

Deploying with Kamal:

```
cd ../
kamal registry login
kamal setup
```
