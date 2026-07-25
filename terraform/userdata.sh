#!/bin/bash

# Update packages
sudo apt-get update -y

# Install Nginx
sudo apt-get install -y nginx

# Enable Nginx
systemctl enable nginx

# Start Nginx
systemctl start nginx

# Verify service
systemctl status nginx

# Create a custom home page
echo "<h1>Welcome to Terraform Auto Scaling Group</h1>" > /var/www/html/index.html