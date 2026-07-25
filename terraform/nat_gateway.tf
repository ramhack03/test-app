############################################
# Elastic IP for NAT Gateway
############################################

resource "aws_eip" "nat_eip" {
  domain = "vpc"

  tags = {
    Name = "NAT-EIP"
  }
}

############################################
# NAT Gateway
############################################

resource "aws_nat_gateway" "nat_gateway" {

  allocation_id = aws_eip.nat_eip.id

  subnet_id = aws_subnet.public_subnet_1.id

  depends_on = [
    aws_internet_gateway.igw
  ]

  tags = {
    Name = "NAT-Gateway"
  }
}
