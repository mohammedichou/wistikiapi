#!/bin/bash
set -x #echo on
. "/home/ec2-user/.bashrc"
/home/ec2-user/.nvm/versions/node/v8.7.0/bin/forever stopall
sudo kill $(ps aux | grep '[n]ginx' | awk '{print $2}')
sudo service nginx status
sleep 3
if P=$(pgrep nginx)
then
	# nginx is runnging
    echo "nginx is still running, PID is $P"
    exit 1
else
    echo "nginx is not running...continue"
    exit 0
fi
