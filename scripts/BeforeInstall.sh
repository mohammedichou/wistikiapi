#!/bin/bash
set -x #echo on
mkdir /var/darwin || true
sudo chown -R ec2-user:ec2-user /var/darwin || true
sudo touch /var/log/darwin || true
sudo chown -R ec2-user:ec2-user /var/log/darwin || true
cd /var/darwin/
sudo rm -rf *
