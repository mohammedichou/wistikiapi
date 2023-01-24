#!/bin/bash
set -x #echo on
cd /var/darwin

# Give nodejs 10seconds to start


if [ -z "$NODE_ENV" ]
then
	if [[ "$DEPLOYMENT_GROUP_NAME" == "darwinProduction"* ]]
	then
		darwinEnvironment="production"

	elif [[ "$DEPLOYMENT_GROUP_NAME" == "darwinStaging"* ]]
	then
		darwinEnvironment="staging"

	elif [[ "$DEPLOYMENT_GROUP_NAME" == "darwinSandbox"* ]]
	then
		darwinEnvironment="sandbox"

	fi
else
	darwinEnvironment="$NODE_ENV"
fi

echo "Got NODE_ENV=$NODE_ENV and DEPLOYMENT_GROUP_NAME = $DEPLOYMENT_GROUP_NAME so assume darwinEnvironment= $darwinEnvironment"

# grep nodejs listening port from configuration file
nodejsPort=$(jq '.port' ./dist/config/${darwinEnvironment}.json -r)

echo "nodeJSPort= $nodejsPort"

result="000"

while [[ "$result" != "200" ]]
do
	sleep 1
	# test if nodejs respond to our request by checking http code
	result=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:$nodejsPort/version/)
	echo "Health check got code: $result"
done
# Give time to other nginx load balancer to validate health check
sleep 10
exit 0
