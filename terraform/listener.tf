#############################################
# ALB Listener
#############################################

resource "aws_lb_listener" "http_listener" {

  load_balancer_arn = aws_lb.nginx_alb.arn

  port = 80

  protocol = "HTTP"

  default_action {

    type = "forward"

    target_group_arn = aws_lb_target_group.nginx_tg.arn

  }

}