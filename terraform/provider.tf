provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "Sample-App"
      Environment = "Dev"
      Owner       = "Ramkumar"
      ManagedBy   = "Terraform"
    }
  }
}
