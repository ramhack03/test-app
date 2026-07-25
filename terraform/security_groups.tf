############################################
# ALB Security Group
############################################

resource "aws_security_group" "alb_sg" {

  name        = "ALB-SG"
  description = "Security Group for Application Load Balancer"
  vpc_id      = aws_vpc.nginx_vpc.id

  ingress {

    description = "Allow HTTP"

    from_port = 80
    to_port   = 80
    protocol  = "tcp"

    cidr_blocks = ["0.0.0.0/0"]

  }

  egress {

    from_port = 0
    to_port   = 0

    protocol = "-1"

    cidr_blocks = ["0.0.0.0/0"]

  }

  tags = {
    Name = "ALB-SG"
  }
}

############################################
# Bastion Host Security Group
############################################

resource "aws_security_group" "bastion_sg" {

  name        = "Bastion-SG"
  description = "Security Group for Bastion Host"

  vpc_id = aws_vpc.nginx_vpc.id

  ingress {

    description = "Allow SSH"

    from_port = 22
    to_port   = 22

    protocol = "tcp"

    cidr_blocks = ["0.0.0.0/0"]

    # Production:
    # cidr_blocks = ["YOUR_PUBLIC_IP/32"]

  }

  egress {

    from_port = 0
    to_port   = 0

    protocol = "-1"

    cidr_blocks = ["0.0.0.0/0"]

  }

  tags = {
    Name = "Bastion-SG"
  }
}

############################################
# Private EC2 Security Group
############################################

resource "aws_security_group" "private_ec2_sg" {

  name        = "Private-EC2-SG"

  description = "Security Group for Private EC2"

  vpc_id = aws_vpc.nginx_vpc.id

  ###################################
  # SSH from Bastion Host
  ###################################

  ingress {

    description = "SSH from Bastion"

    from_port = 22
    to_port   = 22

    protocol = "tcp"

    security_groups = [
      aws_security_group.bastion_sg.id
    ]

  }

  ###################################
  # HTTP from ALB
  ###################################

  ingress {

    description = "HTTP from ALB"

    from_port = 80
    to_port   = 80

    protocol = "tcp"

    security_groups = [
      aws_security_group.alb_sg.id
    ]

  }

  ###################################
  # Outbound
  ###################################

  egress {

    from_port = 0
    to_port   = 0

    protocol = "-1"

    cidr_blocks = ["0.0.0.0/0"]

  }

  tags = {
    Name = "Private-EC2-SG"
  }
}   