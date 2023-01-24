![Logo](https://bitbucket.org/wistiki_team/api_server/raw/master/docs/logo.png)  
[![Dependency Status](https://www.versioneye.com/user/projects/56522e69ff016c0033000567/badge.svg?style=flat)](https://www.versioneye.com/user/projects/56522e69ff016c0033000567)
# Wistiki Darwin API Server  
## 1. Directory Structure   
### 1.1 src  
   TODO  
### 1.2 test  
   TODO  
### 1.3 tasks  
   TODO  
### 1.4 api  
  Contains swagger json files. Must be generated using [Swagger Editor](http://editor.swagger.io/).  
  Please refer to [Swagger 2.0 Specification](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md).
## 2. Getting Started  
* Install gulp on your machine  

``` 
    ` npm install -g gulp  
```

* Then Install package dependencies  

```
    $ npm install  
```

* To run all development tasks and launch server 

```
    $ gulp  
```

* To run server without developement tasks

```
    $ gulp server  
```

* To run tests with mocha

```
    $ gulp mocha  
```

* To commit patch (you can also use `feature` or `release`) this will bump version then commit changes  
   if no argument is provided commit message will be "Release vx.y.z".  
   If you want to customize commit message add argument `--message "your commit message"`

```
    $ gulp commit:patch  
```

* To commit and create a tag for a patch (you can also use `feature` or `release`) this will bump version, then 
commit changes, then create a tag for version vx.y.z and finally update CHANGELOG.md

```
    $ gulp tag:patch  
```

* To test Swagger, connect to [http://127.0.0.1:3000/swagger](http://127.0.0.1:3000/swagger)  

```
    $ npm install -g sequelize-auto
    $ npm install -g mysql
    $ sequelize-auto -o "./models" -d schema_v3 -h localhost -u root -p 3306 -e mysql
```

* To generate database models modules use [sequelize-auto](https://github.com/sequelize/sequelize-auto)

* To update server to last version

```
	$ git pull && sudo forever stop 0 && sudo npm start
```

#### Environment configuration  
## configuration file  
configuration path can be set via Node Env Tag: ``NODE_CONFIG_DIR``. If not set, default value will be ``./dist/config``  
- Given a root and configuration path load a `default.json` in that path
- When the `NODE_ENV` is not `development`, also try to load `<NODE_ENV>.json` in that path and merge both configurations
- Go through each configuration value and sets it on the application (via `app.set(name, value)`).
  - If the value is a valid environment variable (e.v. `NODE_ENV`), use its value instead
  - If the value starts with `./` or `../` turn it into an absolute path relative to the configuration file path
  - If the value is escaped (starting with a `\`) always use that value (e.g. `\\NODE_ENV` will become `NODE_ENV`)
- Both `default` and `<env>` configurations can be modules which provide their computed settings with `module.exports = {...}` and a `.js` file suffix.  
All rules listed above apply for `.js` modules.

```javascript
	{
  	"port": 3000,             //Port to listen to
  	"hostname": "127.0.0.1",  //IP address to listen to
  	"database": {
  		"port": 3306,           //Database port
  		"schema": "schema_v3",  //Database schema
  		"username": "root",     //Database user name
  		"password": "",         //Database password
  		"replication": {        //If replication dabases, set hosts here for read & write
  			"write": {
  				"host": "127.0.0.1"
  			},
  			"read": [
  				{
  					"host": "127.0.0.1"
  				}
  			]
  		}
  	},
  	"socket": {               //Redi server to be used for sockets Pub/Sub
  		"host": "127.0.0.1",
  		"port": 6379
  	},
  	"redis": {                //Redis server to be used to cache data
  		"host": "127.0.0.1",
  		"port": 6380
  	},
  	"password": {             //Password configuration to be used for user creation
  		"salt": "5fypt5910qo622zoeo86bgyp3",
  		"type": "sha256",
  		"digest": "hex",
  		"resetLinkExpiresIn": 60
  	},
  	"jwt": {                  //JWT tokens configuration
  		"secretOrPrivateKey": "7cYUTW4ZBdmVZ4ILB08hcTdm5ib0E0zcy+I7pHpNQfJHtI7BJ4omys5S19ufJPBJ",
  		"options": {
  			"algorithm": "HS256",
  			"expiresIn": "30d",
  			"audience": "wistiki.com",
  			"issuer": "darwin.wistiki.com"
  		}
  	},
  	"debug": true,
  	"sns": {                  //AWS SNS ARNs
  		"arn": {
  			"production": {
  				"android": "arn:aws:sns:eu-central-1:132150634641:app/GCM/darwin.android",
  				"ios": "arn:aws:sns:eu-central-1:132150634641:app/APNS/darwin.ios.production"
  			},
  			"staging": {
  				"android": "arn:aws:sns:eu-central-1:132150634641:app/GCM/darwin.android",
  				"ios": "arn:aws:sns:eu-central-1:132150634641:app/APNS_SANDBOX/darwin.ios.dev"
  			},
  			"development": {
  				"ios": "arn:aws:sns:eu-central-1:132150634641:app/APNS_SANDBOX/darwin.ios.dev"
  			}
  		},
  		"topic": {
  			"arn": {
  				"wakemeup": "arn:aws:sns:eu-central-1:132150634641:iOS_WakemeUp"
  			}
  		}
  	},
  	"google": {
  		"geocoder": {
  			"apiKey": "AIzaSyB-TPnCMbMMVE5dR-k0fkW2m9lIYA-94L8"
  		}
  	},
  	"swagger": {                  //Swagger firewall
  		"firewall": {
  			"allow": [
  				"127.0.0.1",
  				"::ffff:127.0.0.1",
  				"90.63.237.51",
  				"::ffff:90.63.237.51",
  				"77.157.28.233",
  				"::ffff:77.157.28.233",
  				"217.109.174.105",
  				"::ffff:217.109.174.105"
  			]
  		}
  	},
  	"email": {                  //Ignore email confirmation for these domains
  		"ignoredConfirmationDomains": [
  			"ezweb.ne.jp",
  			"docomo.ne.jp",
  			"softbank.ne.jp",
  			"icloud.com"
  		]
  	},
  	"twilio": {
  		"accountSid": "AC555de85c31e3381712f5aa803bd5e735",
  		"authToken":"241a64380a160914fd4e89a6f61062ad"
  	}
  }
```  
When in development environment:  
1. Confirmation email will not be sent. Confirmation token will be displayed on logs and you must confirm the account
manually (http://127.0.0.1:3000/verify/user@gmail.com/token)[http://127.0.0.1:3000/verify/user@gmail.com/token]  
2. Swagger host will be 127.0.0.1:3000
When in production environment:  
1. Swagger host is darwin.wistiki.io  

* debug: if set to true, stack errors will be displayed


# Socket.io
## Authentication

[https://www.npmjs.com/package/socketio-auth](https://www.npmjs.com/package/socketio-auth)

* To enable debug on a browser execute this command on console: `localStorage.debug = '*'`

# Push Notification Messages 
## Heads'up
* When AWS SNS respond to API server: EndpointDisabled error, API will automatically set sns_arn of concerned device to null so further requests will ignore notifications to that device  
* Application MUST insure that API has the latest APNS/GCM Token by updating it during each login and whenever it receives a new value (update can be made via a PUT call to [http://baseurl/devices/{uid}](http://darwin.wistiki.io/devices/{uid})  

## Position notification
* Sent each time a new POST request to [http://baseurl/position](http://darwin.wistiki.io/positions) is received.  
* One notification per Wistiki will be send to each device concerned by the message (typically owner devices, friends' devices, **except the device that sent the POST request**)
* Position datetime can be found in data.position.date
* data.timestamp indicates when the push notification was send from the server to AWS SNS
* When data.source_uid is different from device that is receiving the notification, it is assumed that data.position is the last position of that device. Application may use it to update device position.  

```
	data: {
       "id":"POS",
       "position":{
          "id":167,
          "position":{
             "type":"Point",
             "coordinates":[
                48.880947,
                2.347352
             ]
          },
          "accuracy":30,
          "date":"2016-02-05T17:05:48.857Z",
          "formatted_address":"24 Rue Petrelle, 75009 Paris, France",
          "street_number":"24",
          "street_name":"Rue Petrelle",
          "city":"Paris",
          "country":"France",
          "country_code":"FR",
          "zip_code":"75009"
       },
       "serial_number":216035001243,
       "source_uid":"",
       "timestamp":"2016-02-08T16:20:49.192Z"
    }
```
## Transfer Owner Notification
* Sent each time a new POST request to [http://baseurl/wistikis/{serial_number}/owner](http://darwin.wistiki.io/wistikis/{serial_number}/owner) is received
* Owner devices (other than request originating device) will receive notification about the new status of the Wistiki
* New Owner devices will receive a notification about the new status of the Wistiki
* if `reset_friends` flag is set to true during POST call, all friends, will receive notification indicating that the concerned Wistiki is no more shared with them

### Notification to previous/new owner

```
	"data":{  
             "id":"TOWN",
             "wistiki":{  
                "serial_number":216035001243,
                "mac_address":"15:3C:23:00:0C:2B",
                "authentication_key":null,
                "activation_date":"2016-01-25T18:47:18.000Z",
                "last_software_update":"2016-01-25T18:47:31.000Z",
                "last_software_version":"1.0.0",
                "owner":{  
                   "email":"adnene@adnene.com",
                   "first_name":"Adnene",
                   "last_name":"KHALFA",
                   "gender":"M",
                   "avatar_url":null,
                   "phone_number":"0606060600",
                   "creation_date":"2016-01-19T00:00:00.000Z",
                   "confirmation_date":null,
                   "update_date":"2016-01-19T12:38:52.000Z",
                   "status":"CONFIRMED",
                   "wistiki_has_owner":{  
                      "wistiki_alias":"v",
                      "wistiki_picture":null,
                      "link_loss":true,
                      "inverted_link_loss":false,
                      "ownership_start_date":"2016-02-09T11:06:50.000Z",
                      "ownership_end_date":null
                   }
                },
                "friends":[  
                   {  
                      "email":"adnene.khalfa@wistiki.com",
                      "first_name":"Adnene",
                      "last_name":"KHALFA",
                      "gender":"M",
                      "avatar_url":null,
                      "phone_number":"0658182526",
                      "creation_date":"2016-01-19T12:38:52.000Z",
                      "confirmation_date":null,
                      "update_date":"2016-01-19T12:38:52.000Z",
                      "status":"CONFIRMED",
                      "wistiki_has_friend":{  
                         "wistiki_alias":"v",
                         "wistiki_picture":null,
                         "link_loss":true,
                         "inverted_link_loss":false,
                         "share_start_date":"2016-02-09T11:06:50.000Z",
                         "share_end_date":null
                      }
                   }
                ]
             },
             "source_uid":"94DD4B37-54E5-475E-9F9F-69F025052815",
             "timestamp":"2016-02-09T11:06:50.503Z"
          }
```  
### Notification to friends  

```
	"data":{  
			 "id":"UNSH",
			 "cause": "TOWN",
			 "serial_number": 216035001243,
			 "source_uid":"94DD4B37-54E5-475E-9F9F-69F025052815",
			 "timestamp":"2016-02-09T11:06:50.503Z"
		}
```  

## Share notification  
* Sent each time a new POST request to [http://baseurl/wistikis/{serial_number}/friends](http://darwin.wistiki.io/wistikis/{serial_number}/friends) is received.
* Friend devices will receive notification indicating Wistiki infos and Owner basic informations
* Owner devices (except device that sent the request) will receive a notification indicating friend identity and concerned Wistiki. 

### To owner devices
```
	"data":{  
             "id":"SHARE",
             "wistiki":{  
                "email":"adnene.khalfa@wistiki.com",
                "first_name":"Adnene",
                "last_name":"KHALFA",
                "gender":"M",
                "avatar_url":null,
                "phone_number":"0658182526",
                "creation_date":"2016-01-19T12:38:52.000Z",
                "confirmation_date":null,
                "update_date":"2016-01-19T12:38:52.000Z",
                "status":"CONFIRMED",
                "wistiki_has_owner":{  
                   "wistiki_alias":"Voil",
                   "wistiki_picture":null,
                   "link_loss":true,
                   "inverted_link_loss":false,
                   "ownership_start_date":"2016-01-25T00:00:00.000Z",
                   "ownership_end_date":null
                }
             },
             "shared":true,
             "with":{  
                "email":"adnene@adnene.com",
                "first_name":"Adnene",
                "last_name":"KHALFA",
                "gender":"M",
                "avatar_url":null,
                "phone_number":"0606060600",
                "creation_date":"2016-01-19T00:00:00.000Z",
                "confirmation_date":null,
                "update_date":"2016-01-19T12:38:52.000Z",
                "status":"CONFIRMED"
             },
             "timestamp":"2016-02-08T17:45:18.672Z"
          }
```
### To friend devices
```
	"data":{  
             "id":"SHARE",
             "wistiki":{  
                "email":"adnene.khalfa@wistiki.com",
                "first_name":"Adnene",
                "last_name":"KHALFA",
                "gender":"M",
                "avatar_url":null,
                "phone_number":"0658182526",
                "creation_date":"2016-01-19T12:38:52.000Z",
                "confirmation_date":null,
                "update_date":"2016-01-19T12:38:52.000Z",
                "status":"CONFIRMED",
                "wistiki_has_owner":{  
                   "wistiki_alias":"Voil",
                   "wistiki_picture":null,
                   "link_loss":true,
                   "inverted_link_loss":false,
                   "ownership_start_date":"2016-01-25T00:00:00.000Z",
                   "ownership_end_date":null
                }
             },
             "shared":true,
             "timestamp":"2016-02-08T17:34:52.310Z"
          }
```
## Found Wistiki
* Send found message to all devices of the Wistiki's owner
```  
	"data":{  
         id: 'WISTIKI_FOUND',
          wistiki: 
           { serial_number: 216035001243,
             wistiki_alias: 'mon Wistiki',
             wistiki_picture: null 
           },
          user: { first_name: 'Adnene', avatar_url: null },
          owner: { first_name: 'Tototo', avatar_url: null },
          message_id: 12,
          thread_id: 15

    }
``` 
## WakeMeUp to all iOS each 5minutes
* Send Wake up message to all iOS devices that was subscribed to iOS_WakemeUp topic  
* In order to receive these pushes, you have to call [http://darwin.wistiki.io/sns](http://darwin.wistiki.io/sns) and post
the token send by AWS to confirm subscription to WakeMeUp topic

```javascript  
	"data":{  
        "id":"WAKEUP"
    }
``` 
# AWS  
## Policies  
### S3  

```javascript
{
	"Id": "Policy1450350058089",
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "Stmt1450350053924",
			"Action": [
				"s3:PutObject",
				"s3:PutObjectAcl"
			],
			"Effect": "Allow",
			"Resource": "arn:aws:s3:::avatars.wistiki.2/*",
			"Principal": {
				"AWS": [
					"arn:aws:iam::132150634641:user/ses-smtp-darwin"
				]
			}
		}
	]
}
```  

### SNS

```javascript
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Stmt1453730002000",
            "Effect": "Allow",
            "Action": [
                "sns:CreatePlatformEndpoint"
            ],
            "Resource": [
                "arn:aws:sns:eu-central-1:132150634641:app/GCM/darwin.android",
                "arn:aws:sns:eu-central-1:132150634641:app/APNS/darwin.ios.production",
                "arn:aws:sns:eu-central-1:132150634641:app/APNS_SANDBOX/darwin.ios.dev"
            ]
        }
    ]
}
```

### IAM  
AmazonSesSendingAccess  

```javascript
{
"Version": "2012-10-17",
"Statement": [
 {
   "Effect": "Allow",
   "Action": "ses:SendRawEmail",
   "Resource": "*"
 }
]
}
```  
 Darwin_S3  
 
```javascript
{
 "Version": "2012-10-17",
 "Statement": [
	 {
		 "Sid": "Stmt1450349025000",
		 "Effect": "Allow",
		 "Action": [
			 "s3:PutObject",
			 "s3:PutObjectAcl"
		 ],
		 "Resource": [
			 "arn:aws:s3:::avatars.wistiki.2/*"
		 ]
	 }
 ]
}
```
 
# Emails

Dans le dossier emails, un projet foundation a été créé: [http://foundation.zurb.com/emails/docs/sass-guide.html](http://foundation.zurb.com/emails/docs/sass-guide.html)

# Note pour plus tard`
* Les erreurs de validation par swagger-tools
 
```
	{
		"code":"SCHEMA_VALIDATION_FAILED",
		"failedValidation":true,
		"results":{
					"errors":
						[{
							"code":"INVALID_FORMAT",
							"message":"Object didn't pass validation for format email: adnene.khalfa@gmailcom",
							"path":["email"],
							"description":"The user email used as the id"
						},
						{
							"code":"PATTERN",
							"message":"String does not match pattern [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}: adnene.khalfa@gmailcom",
							"path":["email"],
							"description":"The user email used as the id"
						}],
					"warnings":[]
				},
		"path":["paths","/users","post","parameters","0"],
		"paramName":"user"
	}

```

* [unit-testing-express-middleware](http://fr.slideshare.net/morrissinger/unit-testing-express-middleware)
* [configure AWS credentials](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html)
* get user agent
	```javascript
	{ isMobile: false,
      isTablet: false,
      isiPad: false,
      isiPod: false,
      isiPhone: false,
      isAndroid: false,
      isBlackberry: false,
      isOpera: false,
      isIE: false,
      isEdge: false,
      isIECompatibilityMode: false,
      isSafari: false,
      isFirefox: false,
      isWebkit: false,
      isChrome: true,
      isKonqueror: false,
      isOmniWeb: false,
      isSeaMonkey: false,
      isFlock: false,
      isAmaya: false,
      isEpiphany: false,
      isDesktop: true,
      isWindows: false,
      isLinux: false,
      isLinux64: false,
      isMac: true,
      isChromeOS: false,
      isBada: false,
      isSamsung: false,
      isRaspberry: false,
      isBot: false,
      isCurl: false,
      isAndroidTablet: false,
      isWinJs: false,
      isKindleFire: false,
      isSilk: false,
      isCaptive: false,
      isSmartTV: false,
      silkAccelerated: false,
      browser: 'Chrome',
      version: '47.0.2526.73',
      os: 'OS X El Capitan',
      platform: 'Apple Mac',
      geoIp: {},
      source: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.73 Safari/537.36' }
	```
## 4. Deployment
### Bitbucket Pipelines
[Debug Pipelines locally](https://confluence.atlassian.com/bitbucket/debug-your-pipelines-locally-with-docker-838273569.html)

When Bitbucket detects changes in git branch, it launches Docker image defined in bitbucket-pipelines.yml (adnene/node-redis:last).
Docker file can be found [here](https://github.com/c10h22/node-redis)

To debug Bitbucket pipelines yaml file you can launch node-redis image locally :

``` 
	$ docker run -it --volume /path_to_your_local_project/api_server:/api_server --workdir="/api_server" adnene/node-redis:latest
```
Environment:
* Nodejs: v5.4.0
* npm: v3.3.12
