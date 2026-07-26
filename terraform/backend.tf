terraform {
  backend "s3" {
    bucket  = "ramkumar-terraform-state-122610514582"
    key     = "sample-app/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true

    # Enables native S3 locking (Requires Terraform 1.10+)
    use_lockfile = true
  }
}
