aws_region = "us-east-1"

vpc_cidr = "10.0.0.0/16"

public_subnet_1_cidr = "10.0.0.0/20"
public_subnet_2_cidr = "10.0.16.0/20"

private_subnet_1_cidr = "10.0.128.0/20"
private_subnet_2_cidr = "10.0.144.0/20"

az_1 = "us-east-1a"
az_2 = "us-east-1b"

ami_id = "ami-052355af2a014bd2c"

instance_type = "t3.micro"

key_name = "test-key"

desired_capacity = 1
min_size         = 1
max_size         = 5
