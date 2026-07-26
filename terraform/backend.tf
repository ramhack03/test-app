terraform {
  backend "s3" {
    bucket  = "ramkumar-terraform-state-122610514582"
    key     = "sample-app/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
    use_lockfile = true
  }
}