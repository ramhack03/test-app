############################################
# Public Route Table
############################################

resource "aws_route_table" "public_rt" {

  vpc_id = aws_vpc.nginx_vpc.id

  route {
    cidr_block = "0.0.0.0/0"

    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "Public-Route-Table"
  }
}

############################################
# Public Route Table Association
############################################

resource "aws_route_table_association" "public_subnet_1" {

  subnet_id = aws_subnet.public_subnet_1.id

  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "public_subnet_2" {

  subnet_id = aws_subnet.public_subnet_2.id

  route_table_id = aws_route_table.public_rt.id
}

############################################
# Private Route Table
############################################

resource "aws_route_table" "private_rt" {

  vpc_id = aws_vpc.nginx_vpc.id

  route {

    cidr_block = "0.0.0.0/0"

    nat_gateway_id = aws_nat_gateway.nat_gateway.id
  }

  tags = {
    Name = "Private-Route-Table"
  }
}

############################################
# Private Route Table Association
############################################

resource "aws_route_table_association" "private_subnet_1" {

  subnet_id = aws_subnet.private_subnet_1.id

  route_table_id = aws_route_table.private_rt.id
}

resource "aws_route_table_association" "private_subnet_2" {

  subnet_id = aws_subnet.private_subnet_2.id

  route_table_id = aws_route_table.private_rt.id
}
