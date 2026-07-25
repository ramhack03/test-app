#############################################
# Application Load Balancer
#############################################

resource "aws_lb" "nginx_alb" {

  name = "nginx-alb"

  internal = false

  load_balancer_type = "application"

  security_groups = [
    aws_security_group.alb_sg.id
  ]

  subnets = [
    aws_subnet.public_subnet_1.id,
    aws_subnet.public_subnet_2.id
  ]

  enable_deletion_protection = false

  idle_timeout = 60

  tags = {
    Name        = "Nginx-ALB"
    Environment = "Dev"
  }
}