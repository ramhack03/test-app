#############################################
# Auto Scaling Group
#############################################

resource "aws_autoscaling_group" "nginx_asg" {

  name = "Nginx-ASG"

  desired_capacity = 2
  min_size         = 2
  max_size         = 5

  vpc_zone_identifier = [
    aws_subnet.private_subnet_1.id,
    aws_subnet.private_subnet_2.id
  ]

  target_group_arns = [
    aws_lb_target_group.nginx_tg.arn
  ]

  health_check_type         = "ELB"
  health_check_grace_period = 300

  launch_template {

    id      = aws_launch_template.nginx_lt.id
    version = "$Latest"

  }

  tag {

    key                 = "Name"
    value               = "ASG-Nginx-Instance"
    propagate_at_launch = true

  }

  lifecycle {
    create_before_destroy = true
  }

}