#############################################
# Application Load Balancer Target Group
#############################################

resource "aws_lb_target_group" "nginx_tg" {

  name        = "nginx-target-group"
  port        = 80
  protocol    = "HTTP"
  target_type = "instance"

  vpc_id = aws_vpc.nginx_vpc.id

  #############################################
  # Health Check
  #############################################

  health_check {

    enabled = true

    protocol = "HTTP"

    path = "/"

    port = "traffic-port"

    interval = 30

    timeout = 5

    healthy_threshold = 3

    unhealthy_threshold = 3

    matcher = "200"

  }

  tags = {
    Name = "Nginx-Target-Group"
  }
}