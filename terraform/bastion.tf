#############################################
# Bastion Host
#############################################

resource "aws_instance" "bastion_host" {

  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public_subnet_1.id

  vpc_security_group_ids = [
    aws_security_group.bastion_sg.id
  ]

  key_name = var.key_name

  associate_public_ip_address = true

  user_data = file("${path.module}/userdata.sh")
  tags = {
    Name = "Bastion-Host"
  }
}