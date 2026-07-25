#############################################
# Launch Template
#############################################

resource "aws_launch_template" "nginx_lt" {

  name = "sample-app-launch-template"

  image_id = var.ami_id

  instance_type = var.instance_type

  key_name = var.key_name

  vpc_security_group_ids = [
    aws_security_group.private_ec2_sg.id
  ]

  user_data = base64encode(file("${path.module}/userdata.sh"))

  tag_specifications {

    resource_type = "instance"

    tags = {
      Name = "Nginx-ASG-Instance"
    }
  }

  monitoring {
    enabled = true
  }

  update_default_version = true
}
