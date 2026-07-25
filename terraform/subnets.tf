############################################
# Public Subnet 1
############################################

resource "aws_subnet" "public_subnet_1" {

  vpc_id                  = aws_vpc.nginx_vpc.id
  cidr_block              = var.public_subnet_1_cidr
  availability_zone       = var.az_1
  map_public_ip_on_launch = true

  tags = {
    Name = "Public-Subnet-1"
    Type = "Public"
  }
}

############################################
# Public Subnet 2
############################################

resource "aws_subnet" "public_subnet_2" {

  vpc_id                  = aws_vpc.nginx_vpc.id
  cidr_block              = var.public_subnet_2_cidr
  availability_zone       = var.az_2
  map_public_ip_on_launch = true

  tags = {
    Name = "Public-Subnet-2"
    Type = "Public"
  }
}

############################################
# Private Subnet 1
############################################

resource "aws_subnet" "private_subnet_1" {

  vpc_id            = aws_vpc.nginx_vpc.id
  cidr_block        = var.private_subnet_1_cidr
  availability_zone = var.az_1

  tags = {
    Name = "Private-Subnet-1"
    Type = "Private"
  }
}

############################################
# Private Subnet 2
############################################

resource "aws_subnet" "private_subnet_2" {

  vpc_id            = aws_vpc.nginx_vpc.id
  cidr_block        = var.private_subnet_2_cidr
  availability_zone = var.az_2

  tags = {
    Name = "Private-Subnet-2"
    Type = "Private"
  }
}
