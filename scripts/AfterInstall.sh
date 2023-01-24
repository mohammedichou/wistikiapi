#!/bin/bash
set -x #echo on
cd /var/darwin

darwinEnvironment="production"
darwinNginxConfig="/etc/nginx/conf.d/darwin.conf"
nginxConfig="/etc/nginx/nginx.conf"

# delete nginx config files
rm -rf $darwinNginxConfig
rm -rf $nginxConfig

# copy nginx global config file
cp ./scripts/conf/nginx.conf $nginxConfig

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

# grep nodejs port from configuration file
nodejsPort=$(jq '.port' ./dist/config/${darwinEnvironment}.json -r)

if [[ "$darwinEnvironment" == "sandbox"* ]]
then
	ips="server 172.31.50.0:$nodejsPort;\n \
		server 172.31.50.1:$nodejsPort;\n \
		server 172.31.50.2:$nodejsPort;\n \
		server 172.31.50.3:$nodejsPort;\n \
		server 172.31.50.4:$nodejsPort;\n \
		server 172.31.50.5:$nodejsPort;\n \
		server 172.31.50.6:$nodejsPort;\n \
		server 172.31.50.7:$nodejsPort;\n \
		server 172.31.50.8:$nodejsPort;\n \
		server 172.31.50.9:$nodejsPort;\n \
		server 172.31.50.10:$nodejsPort;\n \
		server 172.31.50.11:$nodejsPort;\n \
		server 172.31.50.12:$nodejsPort;\n \
		server 172.31.50.13:$nodejsPort;\n \
		server 172.31.50.14:$nodejsPort;\n \
		server 172.31.50.15:$nodejsPort;\n \

		server 172.31.51.0:$nodejsPort;\n \
		server 172.31.51.1:$nodejsPort;\n \
		server 172.31.51.2:$nodejsPort;\n \
		server 172.31.51.3:$nodejsPort;\n \
		server 172.31.51.4:$nodejsPort;\n \
		server 172.31.51.5:$nodejsPort;\n \
		server 172.31.51.6:$nodejsPort;\n \
		server 172.31.51.7:$nodejsPort;\n \
		server 172.31.51.8:$nodejsPort;\n \
		server 172.31.51.9:$nodejsPort;\n \
		server 172.31.51.10:$nodejsPort;\n \
		server 172.31.51.11:$nodejsPort;\n \
		server 172.31.51.12:$nodejsPort;\n \
		server 172.31.51.13:$nodejsPort;\n \
		server 172.31.51.14:$nodejsPort;\n \
		server 172.31.51.15:$nodejsPort;\n \
		"

elif [[ "$darwinEnvironment" == "staging"* ]]
then
	ips="server 172.31.50.16:$nodejsPort;\n \
		server 172.31.50.17:$nodejsPort;\n \
		server 172.31.50.18:$nodejsPort;\n \
		server 172.31.50.19:$nodejsPort;\n \
		server 172.31.50.20:$nodejsPort;\n \
		server 172.31.50.21:$nodejsPort;\n \
		server 172.31.50.22:$nodejsPort;\n \
		server 172.31.50.23:$nodejsPort;\n \
		server 172.31.50.24:$nodejsPort;\n \
		server 172.31.50.25:$nodejsPort;\n \
		server 172.31.50.26:$nodejsPort;\n \
		server 172.31.50.27:$nodejsPort;\n \
		server 172.31.50.28:$nodejsPort;\n \
		server 172.31.50.29:$nodejsPort;\n \
		server 172.31.50.30:$nodejsPort;\n \
		server 172.31.50.31:$nodejsPort;\n \

		server 172.31.51.16:$nodejsPort;\n \
		server 172.31.51.17:$nodejsPort;\n \
		server 172.31.51.18:$nodejsPort;\n \
		server 172.31.51.19:$nodejsPort;\n \
		server 172.31.51.20:$nodejsPort;\n \
		server 172.31.51.21:$nodejsPort;\n \
		server 172.31.51.22:$nodejsPort;\n \
		server 172.31.51.23:$nodejsPort;\n \
		server 172.31.51.24:$nodejsPort;\n \
		server 172.31.51.25:$nodejsPort;\n \
		server 172.31.51.26:$nodejsPort;\n \
		server 172.31.51.27:$nodejsPort;\n \
		server 172.31.51.28:$nodejsPort;\n \
		server 172.31.51.29:$nodejsPort;\n \
		server 172.31.51.30:$nodejsPort;\n \
		server 172.31.51.31:$nodejsPort;\n"

elif [[ "$darwinEnvironment" == "production"* ]]
then
	ips="server 172.31.50.32:$nodejsPort;\n \
		server 172.31.50.33:$nodejsPort;\n \
		server 172.31.50.34:$nodejsPort;\n \
		server 172.31.50.35:$nodejsPort;\n \
		server 172.31.50.36:$nodejsPort;\n \
		server 172.31.50.37:$nodejsPort;\n \
		server 172.31.50.38:$nodejsPort;\n \
		server 172.31.50.39:$nodejsPort;\n \
		server 172.31.50.40:$nodejsPort;\n \
		server 172.31.50.41:$nodejsPort;\n \
		server 172.31.50.42:$nodejsPort;\n \
		server 172.31.50.43:$nodejsPort;\n \
		server 172.31.50.44:$nodejsPort;\n \
		server 172.31.50.45:$nodejsPort;\n \
		server 172.31.50.46:$nodejsPort;\n \
		server 172.31.50.47:$nodejsPort;\n \

		server 172.31.51.32:$nodejsPort;\n \
		server 172.31.51.33:$nodejsPort;\n \
		server 172.31.51.34:$nodejsPort;\n \
		server 172.31.51.35:$nodejsPort;\n \
		server 172.31.51.36:$nodejsPort;\n \
		server 172.31.51.37:$nodejsPort;\n \
		server 172.31.51.38:$nodejsPort;\n \
		server 172.31.51.39:$nodejsPort;\n \
		server 172.31.51.40:$nodejsPort;\n \
		server 172.31.51.41:$nodejsPort;\n \
		server 172.31.51.42:$nodejsPort;\n \
		server 172.31.51.43:$nodejsPort;\n \
		server 172.31.51.44:$nodejsPort;\n \
		server 172.31.51.45:$nodejsPort;\n \
		server 172.31.51.46:$nodejsPort;\n \
		server 172.31.51.47:$nodejsPort;\n"
fi
# append line to darwin nginx config file
(printf "upstream socket_instance {\n ip_hash;\n $ips check interval=5000 rise=1 fall=3 timeout=1000 type=http;\n \
check_http_send 'HEAD /version HTTP/1.1\r\n\r\n';\n check_http_expect_alive http_2xx http_3xx; }"\
 && cat ./scripts/conf/darwin.conf) > $darwinNginxConfig

