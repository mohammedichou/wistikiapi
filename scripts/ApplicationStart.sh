#!/bin/bash
set -x #echo on
. "/home/ec2-user/.bashrc"
if [ -z "$NODE_ENV" ]
then
	if [[ "$DEPLOYMENT_GROUP_NAME" == "darwinProduction"* ]]
	then
		NODE_ENV="production"

	elif [[ "$DEPLOYMENT_GROUP_NAME" == "darwinStaging"* ]]
	then
		NODE_ENV="staging"

	elif [[ "$DEPLOYMENT_GROUP_NAME" == "darwinSandbox"* ]]
	then
		NODE_ENV="sandbox"

	fi
else
	NODE_ENV="production"
fi

cd /var/darwin/
/home/ec2-user/.nvm/versions/node/v8.7.0/bin/yarn
NODE_ENV=$NODE_ENV NODE_CONFIG_DIR=./dist/config/ /home/ec2-user/.nvm/versions/node/v8.7.0/bin/forever start -a -l /var/log/darwin ./dist/server.js
sudo service nginx start
sudo service nginx reload
sudo service nginx status
sleep 3
if P=$(pgrep nginx)
then
	# nginx is runnging
    echo "nginx is running, PID is $P -> OK"
    exit 0
else
    echo "nginx is not running...stop"
    exit 1
fi
