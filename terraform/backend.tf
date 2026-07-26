terraform {
  backend "s3" {
<<<<<<< HEAD
    bucket         = "ramkumar-terraform-state-891377344088"
    key            = "sample-app/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  
    # Enables native S3 locking (Requires Terraform 1.10+)
    use_lockfile = true 
  }
}
>>>>>>> 0ada02dfe77f988446ec72ef56c24a4b5d33fb4a
