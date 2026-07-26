terraform {
  backend "s3" {
    key          = "frontend-app/terraform.tfstate"
    region       = "us-east-1"
    
    # Enables native S3 locking (Requires Terraform 1.10+)
    use_lockfile = true 
  }
}