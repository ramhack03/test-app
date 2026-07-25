##############################
# AWS Region
##############################

variable "aws_region" {
  description = "AWS Region"
  type        = string
}

##############################
# VPC
##############################

variable "vpc_cidr" {
  description = "VPC CIDR Block"
  type        = string
}

##############################
# Public Subnets
##############################

variable "public_subnet_1_cidr" {
  description = "Public Subnet 1 CIDR"
  type        = string
}

variable "public_subnet_2_cidr" {
  description = "Public Subnet 2 CIDR"
  type        = string
}

##############################
# Private Subnets
##############################

variable "private_subnet_1_cidr" {
  description = "Private Subnet 1 CIDR"
  type        = string
}

variable "private_subnet_2_cidr" {
  description = "Private Subnet 2 CIDR"
  type        = string
}

##############################
# Availability Zones
##############################

variable "az_1" {
  description = "Availability Zone 1"
  type        = string
}

variable "az_2" {
  description = "Availability Zone 2"
  type        = string
}

##############################
# EC2
##############################

variable "ami_id" {
  description = "Ubuntu AMI ID"
  type        = string
}

variable "instance_type" {
  description = "EC2 Instance Type"
  type        = string

  validation {
    condition     = contains(["t2.micro", "t3.micro"], var.instance_type)
    error_message = "Use a supported instance type."
  }
}

variable "key_name" {
  description = "EC2 Key Pair"
  type        = string
}

##############################
# Auto Scaling
##############################

variable "desired_capacity" {
  description = "Desired Capacity"
  type        = number
}

variable "min_size" {
  description = "Minimum ASG Size"
  type        = number
}

variable "max_size" {
  description = "Maximum ASG Size"
  type        = number
}
