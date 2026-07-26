terraform {
  backend "s3" {
    bucket         = "ramkumar-terraform-state-891377344088"
    key            = "sample-app/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
