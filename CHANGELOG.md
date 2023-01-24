## [2.0.1-0](https://bitbucket.org/api_server/app.wistiki.com/commits/tag/v2.0.1-0) (2017-11-27)




# [2.0.0](https://bitbucket.org/api_server/app.wistiki.com/commits/tag/v2.0.0) (2017-11-27)


### Build

* Build: add commit hash to deployment artifact    ([8716eb727db42cda957dfa737c304b9b06d8e21c](https://bitbucket.org/wistiki_team/api_server/commits/8716eb727db42cda957dfa737c304b9b06d8e21c))
* Build: add logs to deploy task    ([975c9feda5a802a7a2dc634106221d94bae8035c](https://bitbucket.org/wistiki_team/api_server/commits/975c9feda5a802a7a2dc634106221d94bae8035c))
* Build: add logs to deploy task    ([3f014937495fc2ab2c014c2f4d51a6424d0c2fcc](https://bitbucket.org/wistiki_team/api_server/commits/3f014937495fc2ab2c014c2f4d51a6424d0c2fcc))
* Build: Fix bug in current directory to zip during pipelines step    ([7bad7fc950b0e4657aa0cf93163845bda739afb0](https://bitbucket.org/wistiki_team/api_server/commits/7bad7fc950b0e4657aa0cf93163845bda739afb0))
* Build: fix bug in deploy script    ([a71dd0f0897cb121ddc846d952a188271e900006](https://bitbucket.org/wistiki_team/api_server/commits/a71dd0f0897cb121ddc846d952a188271e900006))
* Build: fix spaces issues in bitbucket-pipelines config    ([f305f70ebc108805aa438fa82356ee5d56a07c82](https://bitbucket.org/wistiki_team/api_server/commits/f305f70ebc108805aa438fa82356ee5d56a07c82))
* Build: fix spaces issues in bitbucket-pipelines config    ([41bf4816d9789122f475d95b6bfc8cbf320e5377](https://bitbucket.org/wistiki_team/api_server/commits/41bf4816d9789122f475d95b6bfc8cbf320e5377))
* Build: force node version in pipelines config    ([fcb94bfd08658c047e424d314618f33b82843ad2](https://bitbucket.org/wistiki_team/api_server/commits/fcb94bfd08658c047e424d314618f33b82843ad2))
* Build: Gulp mocha hang when test fails    ([44d931b30a32e7d8e0f1663946f1fbda26a9a135](https://bitbucket.org/wistiki_team/api_server/commits/44d931b30a32e7d8e0f1663946f1fbda26a9a135))
* Build: Gulp mocha tests modification    ([8dc8e5670a1b0935d709209950ceb5da941f4aa2](https://bitbucket.org/wistiki_team/api_server/commits/8dc8e5670a1b0935d709209950ceb5da941f4aa2))
* Build: install gulp globally    ([e2cddd7da1a8d2670e1d5d08acdd1453c8d7d276](https://bitbucket.org/wistiki_team/api_server/commits/e2cddd7da1a8d2670e1d5d08acdd1453c8d7d276))
* Build: Launch Redis server before tests    ([420a35ef939f48d1a59aca22aac352921fec7c86](https://bitbucket.org/wistiki_team/api_server/commits/420a35ef939f48d1a59aca22aac352921fec7c86))
* Build: new gulp tasks organisation & migration to ES2017    ([1770dfa1d20f251cb06797b3d9409f7a252dc0a6](https://bitbucket.org/wistiki_team/api_server/commits/1770dfa1d20f251cb06797b3d9409f7a252dc0a6))
* Build: Pipelines launches redis-server before starting tests    ([f83214d1c68cd77b2b505241d753a01befff15fb](https://bitbucket.org/wistiki_team/api_server/commits/f83214d1c68cd77b2b505241d753a01befff15fb))
* Build: remove default pipeline configuration    ([54137c2286a18a67113b79351c1f54c709197701](https://bitbucket.org/wistiki_team/api_server/commits/54137c2286a18a67113b79351c1f54c709197701))
* Build: remove npm install from CodeDeploy afterInstall and set AppStart timeout to 600sec to fit micro instance    ([9f2972d177114f9d69413e7c830fa08d6c33f846](https://bitbucket.org/wistiki_team/api_server/commits/9f2972d177114f9d69413e7c830fa08d6c33f846))
* Build: Set Cache_Host when launching mocha tests so local Redis Server is used instead of production one (inaccessible)    ([8393ea784bb61bb648ecf0a6202af04cfa40726f](https://bitbucket.org/wistiki_team/api_server/commits/8393ea784bb61bb648ecf0a6202af04cfa40726f))
* Build: set CodeDeploy afterInstall timeout to 360sec    ([01b3dc03abedf9082400876b6e9aba917174d5b5](https://bitbucket.org/wistiki_team/api_server/commits/01b3dc03abedf9082400876b6e9aba917174d5b5))
* Build: set default NODE_ENV to sandbox during building via Pipelines, start npm install after install to avoid service lauch timeout in sandbox and set timeout to 240    ([4cd42876005bf947a1f4622d83c9f2f5e22ba411](https://bitbucket.org/wistiki_team/api_server/commits/4cd42876005bf947a1f4622d83c9f2f5e22ba411))
* Build: set NODE_ENV in pipelines config    ([afc82a84dc052f075c88e1974d4c6014c19a4648](https://bitbucket.org/wistiki_team/api_server/commits/afc82a84dc052f075c88e1974d4c6014c19a4648))
* Build: set NODE_ENV in pipelines config    ([1ed17b01b6e8116c23069002d59dcf42fe836293](https://bitbucket.org/wistiki_team/api_server/commits/1ed17b01b6e8116c23069002d59dcf42fe836293))
* Build: Try pipelines config without launching redis-server (launched in container)    ([4b8c1b413a92a55a32f88ced64ce5d543815f2b0](https://bitbucket.org/wistiki_team/api_server/commits/4b8c1b413a92a55a32f88ced64ce5d543815f2b0))
* Build: Update babel version    ([a46a0e83288b7f6e957d5013cac80c23460cc734](https://bitbucket.org/wistiki_team/api_server/commits/a46a0e83288b7f6e957d5013cac80c23460cc734))
* Build: update feathers from 2.0.0 -> 2.1.3, feathers-rest from 1.5.1 -> 1.7.3, feathers-socketio from 1.4.0 -> 2.0.0    ([8efb79d804a0893669850b5cc8b2954e080b6c8c](https://bitbucket.org/wistiki_team/api_server/commits/8efb79d804a0893669850b5cc8b2954e080b6c8c))
* Build: Update gulp task watch:mocha    ([a489731d93e08573324012dd15e7b85a6907df65](https://bitbucket.org/wistiki_team/api_server/commits/a489731d93e08573324012dd15e7b85a6907df65))
* Build: Update Node js to v8.7.0    ([8c60bb33a7cb68428f2b24b310b1167772fd2094](https://bitbucket.org/wistiki_team/api_server/commits/8c60bb33a7cb68428f2b24b310b1167772fd2094))
* Build: update pipelines for staging, master and sandbox    ([df62887699b6d0ae63adae74069d181b2024a7a9](https://bitbucket.org/wistiki_team/api_server/commits/df62887699b6d0ae63adae74069d181b2024a7a9))
* Build: use image adnene/node-redis:1.0.1    ([9bb828c1a1ea3b9eb4fcb44622edf8d049434874](https://bitbucket.org/wistiki_team/api_server/commits/9bb828c1a1ea3b9eb4fcb44622edf8d049434874))
* Build: use istanbul and gulp test to generate test coverage    ([4a59b2381984e9b32844af6465a2f623089d9996](https://bitbucket.org/wistiki_team/api_server/commits/4a59b2381984e9b32844af6465a2f623089d9996))
* Build: Use latest Docker image version    ([6673526160d8748a3d109054ace73631a02f2fdb](https://bitbucket.org/wistiki_team/api_server/commits/6673526160d8748a3d109054ace73631a02f2fdb))
* Build: use little commit hash to deployment artifact    ([098528d95be2f74e973f11b1852f3d4d3415843d](https://bitbucket.org/wistiki_team/api_server/commits/098528d95be2f74e973f11b1852f3d4d3415843d))
* Build: use Yarn instead of npm    ([0b832bd52a7c5c8d40110fddd8fa9b22695dd1ca](https://bitbucket.org/wistiki_team/api_server/commits/0b832bd52a7c5c8d40110fddd8fa9b22695dd1ca))
* Build: write commit build hash to file    ([91725911c85ad7db95527478728d092805e57f77](https://bitbucket.org/wistiki_team/api_server/commits/91725911c85ad7db95527478728d092805e57f77))
* Build: Zip artifcats and launch deploy on code deploy    ([8a0cd9fba322622f84c4dbdc4c8f5760a03ca5fb](https://bitbucket.org/wistiki_team/api_server/commits/8a0cd9fba322622f84c4dbdc4c8f5760a03ca5fb))

### Debug

* Debug: disable autorollback on code deploy failure    ([06d0ea724bd901d7b34d2892d8366e433287ee69](https://bitbucket.org/wistiki_team/api_server/commits/06d0ea724bd901d7b34d2892d8366e433287ee69))

### Docs

* Docs: Update readme file    ([ce1acbc75ac3675820dde3b7d1b30291f08b077a](https://bitbucket.org/wistiki_team/api_server/commits/ce1acbc75ac3675820dde3b7d1b30291f08b077a))

### Feature

* Feature: add socket event /users/:user updated    ([2a4b043da92b3fa13cb8bfe62c953f93739226b7](https://bitbucket.org/wistiki_team/api_server/commits/2a4b043da92b3fa13cb8bfe62c953f93739226b7))
* Feature: add Twilio support to callback user when wistikette is found    ([dd0d2c5925774b3b73bca5a02e6727ddc420f69d](https://bitbucket.org/wistiki_team/api_server/commits/dd0d2c5925774b3b73bca5a02e6727ddc420f69d))
* Feature: add Wistikette found endpoint    ([2bd2314e07626f6e871e156d7d681d07f2c6cfa4](https://bitbucket.org/wistiki_team/api_server/commits/2bd2314e07626f6e871e156d7d681d07f2c6cfa4))
* Feature: Electronic leash & inverted electronic leash socket management    ([50b76131bc30fbdaa0611fa09d54d17c6efc6a93](https://bitbucket.org/wistiki_team/api_server/commits/50b76131bc30fbdaa0611fa09d54d17c6efc6a93))
* Feature: make twilio callback programmable    ([f9dbe53a9d8300948c7dcbeacd6a87d9dbc6f6ee](https://bitbucket.org/wistiki_team/api_server/commits/f9dbe53a9d8300948c7dcbeacd6a87d9dbc6f6ee))
* Feature: sent login logout event to other devices when new auth succeed from another device    ([3eaf1534c0aac1e5eccab086ed380db4b5347c80](https://bitbucket.org/wistiki_team/api_server/commits/3eaf1534c0aac1e5eccab086ed380db4b5347c80))
* Feature: sync messages via sockets    ([4a129ec7b63b03b8af19d9a1aa8bef2406c3f053](https://bitbucket.org/wistiki_team/api_server/commits/4a129ec7b63b03b8af19d9a1aa8bef2406c3f053))

### Fix

* Fix: /login POST, PUT, DELETE    ([e45e337a5db5d442c15a2e9a7d7b878012bdd1a4](https://bitbucket.org/wistiki_team/api_server/commits/e45e337a5db5d442c15a2e9a7d7b878012bdd1a4))
* Fix: /users/:email/wistikis first node upgrade refactoring (To be continued)    ([63b92a51be2835b6e7e421d608102a292d52667c](https://bitbucket.org/wistiki_team/api_server/commits/63b92a51be2835b6e7e421d608102a292d52667c))
* Fix: /users/:email/wistikis PUT    ([da80afaf4cc8040e7ac4744ddc5de29cc2932e7a](https://bitbucket.org/wistiki_team/api_server/commits/da80afaf4cc8040e7ac4744ddc5de29cc2932e7a))
* Fix: /wistiki/:sn/friends    ([1c0d80ddf089ca4f07289965bfbc816a2123f12f](https://bitbucket.org/wistiki_team/api_server/commits/1c0d80ddf089ca4f07289965bfbc816a2123f12f))
* Fix: add message’s author details in push notification    ([70fea58134a4c9bae2b667b13f75a30d7896f6ab](https://bitbucket.org/wistiki_team/api_server/commits/70fea58134a4c9bae2b667b13f75a30d7896f6ab))
* Fix: add twilio module to package.json    ([295ebabbc8e84d93bb4402ecca4c422343d646ac](https://bitbucket.org/wistiki_team/api_server/commits/295ebabbc8e84d93bb4402ecca4c422343d646ac))
* Fix: branch conflicts    ([73739b4ed18e508fcc0787e1834fe10b863f9bde](https://bitbucket.org/wistiki_team/api_server/commits/73739b4ed18e508fcc0787e1834fe10b863f9bde))
* Fix: data may be transfered between instances in json object format    ([f7c675f54f048f279a5f0419405491a1683024f6](https://bitbucket.org/wistiki_team/api_server/commits/f7c675f54f048f279a5f0419405491a1683024f6))
* Fix: debug not found error    ([056d913a657ce2d3d1cdcde834186c92169f1044](https://bitbucket.org/wistiki_team/api_server/commits/056d913a657ce2d3d1cdcde834186c92169f1044))
* Fix: Disable Cloudwatch SQL logging in production    ([ffef1e764aa6d0587189ed771ccf963303288c53](https://bitbucket.org/wistiki_team/api_server/commits/ffef1e764aa6d0587189ed771ccf963303288c53))
* Fix: Feathers custom socket events broadcast from services    ([569f2d9b713b7aa896cfd3ec9f04387409822191](https://bitbucket.org/wistiki_team/api_server/commits/569f2d9b713b7aa896cfd3ec9f04387409822191))
* Fix: GET /models & /models/:__feathersId    ([317e86053cbdb0d1f18b89ce1f3bfc47eb3ee4a2](https://bitbucket.org/wistiki_team/api_server/commits/317e86053cbdb0d1f18b89ce1f3bfc47eb3ee4a2))
* Fix: get devices will return only devices that did not expire    ([47ebe003212bbf3d8d3b86da60956ddeb1dc46ea](https://bitbucket.org/wistiki_team/api_server/commits/47ebe003212bbf3d8d3b86da60956ddeb1dc46ea))
* Fix: JWT Token TypeError: Cannot read property 'get' of null    ([f4e215b759c603dae47b0af7036a41d384521ff1](https://bitbucket.org/wistiki_team/api_server/commits/f4e215b759c603dae47b0af7036a41d384521ff1))
* Fix: language detection when sending confirmation email    ([5f25f3bec3b91813d5581ae7fbefccff3aa69a56](https://bitbucket.org/wistiki_team/api_server/commits/5f25f3bec3b91813d5581ae7fbefccff3aa69a56))
* Fix: let socket events in /users/:user/devices be sent to tablets and mobiles    ([359adb54ec4414f12022bf11682fea34b9a9a35a](https://bitbucket.org/wistiki_team/api_server/commits/359adb54ec4414f12022bf11682fea34b9a9a35a))
* Fix: new line symbole in build rev when calling /version    ([6f81592807b90d48c19996947f88dce6b93ed22e](https://bitbucket.org/wistiki_team/api_server/commits/6f81592807b90d48c19996947f88dce6b93ed22e))
* Fix: no need to send user identity in socket event wistiki position    ([1a631e3f9096665b0a09a0e43fe8914b13c5f97a](https://bitbucket.org/wistiki_team/api_server/commits/1a631e3f9096665b0a09a0e43fe8914b13c5f97a))
* Fix: no need to send user identity in socket event wistiki position    ([a262902546a687a0e8a8bae4f4a3b0181e95480f](https://bitbucket.org/wistiki_team/api_server/commits/a262902546a687a0e8a8bae4f4a3b0181e95480f))
* Fix: remove socket events in /users/:user/devices    ([61174df0799dd3943f868e020c3ab4f1c17299cd](https://bitbucket.org/wistiki_team/api_server/commits/61174df0799dd3943f868e020c3ab4f1c17299cd))
* Fix: Remove Swagger firewall when in development env    ([fd590ef6ce72fbc5373b4de49ecf73de3d5120ec](https://bitbucket.org/wistiki_team/api_server/commits/fd590ef6ce72fbc5373b4de49ecf73de3d5120ec))
* Fix: send socket event when wistiki is found    ([0ba41caad31b1a29cf97d853bea4d22e7629f736](https://bitbucket.org/wistiki_team/api_server/commits/0ba41caad31b1a29cf97d853bea4d22e7629f736))
* Fix: Set Wistiki status to disconnected when device on which it's connected for the last time disconnect    ([d21d32f1d7b21b4dd61073f53bf8c9e3b430634c](https://bitbucket.org/wistiki_team/api_server/commits/d21d32f1d7b21b4dd61073f53bf8c9e3b430634c))
* Fix: synchronise feathers event between instances using feathers-sync    ([e19af721b17ab9c6b545af0746577d74759edf98](https://bitbucket.org/wistiki_team/api_server/commits/e19af721b17ab9c6b545af0746577d74759edf98))
* Fix: Token expiration date is set to 7 instead of 30 when calling device update    ([5c9a08f7f4f8ba25cf94996c26c325c799c939bd](https://bitbucket.org/wistiki_team/api_server/commits/5c9a08f7f4f8ba25cf94996c26c325c799c939bd))
* Fix: Update to Sequelize 4 and use cache    ([e173375999cbf12a070cb9fe4db03160187db2c7](https://bitbucket.org/wistiki_team/api_server/commits/e173375999cbf12a070cb9fe4db03160187db2c7))
* Fix: use moment().utc().toISOString() instead of moment().utc()    ([47bb580cf58925f841b02ca6b012e85e76605afd](https://bitbucket.org/wistiki_team/api_server/commits/47bb580cf58925f841b02ca6b012e85e76605afd))
* Fix: use moment().utc().toISOString() instead of moment().utc()    ([a2278b94583892b3fd6561bee37971b938bb0662](https://bitbucket.org/wistiki_team/api_server/commits/a2278b94583892b3fd6561bee37971b938bb0662))
* Fix: user confirmation unit tests use sandbox for stubs    ([d0fd0ac6d34b26544ceb785253b8a38d0da1a783](https://bitbucket.org/wistiki_team/api_server/commits/d0fd0ac6d34b26544ceb785253b8a38d0da1a783))
* Fix: warning a promise was created in a handler but was not returned from it    ([92396c48b84426f51a6d66104e65eec1efe065e3](https://bitbucket.org/wistiki_team/api_server/commits/92396c48b84426f51a6d66104e65eec1efe065e3))

### Refactor

* Refactor: Socket code refactoring    ([0fbac62fab9f2324e5792665eea8d08286ee5472](https://bitbucket.org/wistiki_team/api_server/commits/0fbac62fab9f2324e5792665eea8d08286ee5472))

### Update

* Update: Account confirmation refactoring with 100% unit Tests    ([6ce3d360275c4b95c6f7b54ca50bd7e89f0823eb](https://bitbucket.org/wistiki_team/api_server/commits/6ce3d360275c4b95c6f7b54ca50bd7e89f0823eb))
* Update: Account verification endpoint to use cache    ([0d1f9638d2897cecd494447146f537ddf3602a49](https://bitbucket.org/wistiki_team/api_server/commits/0d1f9638d2897cecd494447146f537ddf3602a49))
* Update: add /Version to swagger and fix build issue gulp exit when lauching server    ([70eaf6df29f614904fb496fd4f55f88114ddfefa](https://bitbucket.org/wistiki_team/api_server/commits/70eaf6df29f614904fb496fd4f55f88114ddfefa))
* Update: add build number to /version    ([014f40a945f3e521b6ee94c89760f9e67c063d21](https://bitbucket.org/wistiki_team/api_server/commits/014f40a945f3e521b6ee94c89760f9e67c063d21))
* Update: add ignored domains in account creation    ([39460820e607d593b14377e27eafb19d24226074](https://bitbucket.org/wistiki_team/api_server/commits/39460820e607d593b14377e27eafb19d24226074))
* Update: code refactoring and ESLint enhancement    ([a033c5c178e93bfee0d41fd6fd4520344ab22287](https://bitbucket.org/wistiki_team/api_server/commits/a033c5c178e93bfee0d41fd6fd4520344ab22287))
* Update: code refactoring and ESLint enhancement    ([492214928d8f5372a22c1b2be9e7f133d3ffdada](https://bitbucket.org/wistiki_team/api_server/commits/492214928d8f5372a22c1b2be9e7f133d3ffdada))
* Update: code refactoring and ESLint enhancement    ([57ab811ebedbc818ad0ada1e495be8fb462bf763](https://bitbucket.org/wistiki_team/api_server/commits/57ab811ebedbc818ad0ada1e495be8fb462bf763))
* Update: code refactoring and ESLint enhancement    ([e2da97c9968f2b432eaf3376ac71fc538cdad383](https://bitbucket.org/wistiki_team/api_server/commits/e2da97c9968f2b432eaf3376ac71fc538cdad383))
* Update: Delete User-Device association rather than deleting Device instance    ([3ca6eff4c72cdc6697abe02045cbf44b3792feab](https://bitbucket.org/wistiki_team/api_server/commits/3ca6eff4c72cdc6697abe02045cbf44b3792feab))
* Update: Disable temporarily application access to Wistiki GET PUT Services    ([e72f22ca7a9709fe760d6a78455e04ab964c1005](https://bitbucket.org/wistiki_team/api_server/commits/e72f22ca7a9709fe760d6a78455e04ab964c1005))
* Update: GET /models & /models/:__feathersId --> 100% Unit Tests    ([995394aceaa56615fe469d81c5f9ec429b8b8ee6](https://bitbucket.org/wistiki_team/api_server/commits/995394aceaa56615fe469d81c5f9ec429b8b8ee6))
* Update: GET /users/:email/devices & /users/:email/devices/:__feathersId    ([c0e7d6d30e4656dd2b4ca612b80b19881cc934a8](https://bitbucket.org/wistiki_team/api_server/commits/c0e7d6d30e4656dd2b4ca612b80b19881cc934a8))
* Update: Let Application Role send Wistiki positions    ([95a39a4afed8a4fd5c9565228cf03df4c1ecd086](https://bitbucket.org/wistiki_team/api_server/commits/95a39a4afed8a4fd5c9565228cf03df4c1ecd086))
* Update: Login delete unit test    ([af5c24e966a5be2148f6c22a4275b04aaf583b97](https://bitbucket.org/wistiki_team/api_server/commits/af5c24e966a5be2148f6c22a4275b04aaf583b97))
* Update: Login endpoint optimisation    ([c0126cba911afa6942a439620137c665467afa87](https://bitbucket.org/wistiki_team/api_server/commits/c0126cba911afa6942a439620137c665467afa87))
* Update: Login Post unit test    ([36bc53e783b96af5a4135f1aca9dcc914a86f419](https://bitbucket.org/wistiki_team/api_server/commits/36bc53e783b96af5a4135f1aca9dcc914a86f419))
* Update: Login Service --> 100% test coverage    ([85c035ed7aa8cdc0bd720ad35f30858a5bdc802d](https://bitbucket.org/wistiki_team/api_server/commits/85c035ed7aa8cdc0bd720ad35f30858a5bdc802d))
* Update: Refactor /users code and unit tests    ([fd9aabf3fd5311e2f3c697879814db495fc3457d](https://bitbucket.org/wistiki_team/api_server/commits/fd9aabf3fd5311e2f3c697879814db495fc3457d))
* Update: Websockets    ([25d1202da660ee1e85f6483cf93b0a3d7245d10f](https://bitbucket.org/wistiki_team/api_server/commits/25d1202da660ee1e85f6483cf93b0a3d7245d10f))

### Upgrade

* Upgrade: update node packages to their last version    ([790d6629a7eeed57bfbe9e6a125dfdfd0c5995bf](https://bitbucket.org/wistiki_team/api_server/commits/790d6629a7eeed57bfbe9e6a125dfdfd0c5995bf))



## [1.0.10](https://bitbucket.org/api_server/app.wistiki.com/commits/tag/v1.0.10) (2016-12-30)


### Fix

* Fix: Delete Notification message content alert for APNS    ([82585776e5462d0cc1eb9a8388c87c21335f8563](https://bitbucket.org/wistiki_team/api_server/commits/82585776e5462d0cc1eb9a8388c87c21335f8563))
* Fix: Null pointer error quand le Wistiki n'existe pas en base    ([6301e0d309b574e8dd975c37887af606fb96da0a](https://bitbucket.org/wistiki_team/api_server/commits/6301e0d309b574e8dd975c37887af606fb96da0a))
* Fix: Send Message content in alert object for APNS    ([3dcecbcfd596ae3bd8ab04380d7049efd6bce984](https://bitbucket.org/wistiki_team/api_server/commits/3dcecbcfd596ae3bd8ab04380d7049efd6bce984))



## [1.0.9](https://bitbucket.org/api_server/app.wistiki.com/commits/tag/v1.0.9) (2016-12-05)


### Fix

* Fix: Rollback APNS notification for found and new message push message    ([4f3bd8f75e2c544db04da8918090f957db0b17c8](https://bitbucket.org/wistiki_team/api_server/commits/4f3bd8f75e2c544db04da8918090f957db0b17c8))



## [1.0.8](https://bitbucket.org/api_server/app.wistiki.com/commits/tag/v1.0.8) (2016-12-01)


### Fix

* Fix: La langue du mail Wistiki retrouvé ne correspond pas à la langue du propriétaire (Fixes #DAR-187)    ([72119f8d27b7d1f05c6227ae5f532ebb8a980f69](https://bitbucket.org/wistiki_team/api_server/commits/72119f8d27b7d1f05c6227ae5f532ebb8a980f69)), closes 
    [#DAR-187](https://wistiki.atlassian.net/projects//issues/-DAR-187/)
* Fix: Le mail de Wistiki perdu retrouvé est envoyé à chaque scan de position (Fixes #DAR-186)    ([1e553993f997acac1f15f61af2a98de5c2c44dbe](https://bitbucket.org/wistiki_team/api_server/commits/1e553993f997acac1f15f61af2a98de5c2c44dbe)), closes 
    [#DAR-186](https://wistiki.atlassian.net/projects//issues/-DAR-186/)
* Fix: Notification Message est envoyé en double sur les devices Apple (Fixes #DAR-184)    ([2834b7851b20277fe7a6ff89468673d5cb8cb0e2](https://bitbucket.org/wistiki_team/api_server/commits/2834b7851b20277fe7a6ff89468673d5cb8cb0e2)), closes 
    [#DAR-184](https://wistiki.atlassian.net/projects//issues/-DAR-184/)
* Fix: Notification Wistiki found est envoyé en double sur les devices Apple (Fixes #DAR-185)    ([35a69063f518f5da698df3f7e73546bfdf8238f6](https://bitbucket.org/wistiki_team/api_server/commits/35a69063f518f5da698df3f7e73546bfdf8238f6)), closes 
    [#DAR-185](https://wistiki.atlassian.net/projects//issues/-DAR-185/)



## [1.0.7](https://bitbucket.org/api_server/app.wistiki.com/commits/tag/v1.0.7) (2016-11-22)


### Fix

* Fix: Wistiki creation via application role    ([cf49fc1a31a9856ff769d26f9d2ff30aa59b3dbd](https://bitbucket.org/wistiki_team/api_server/commits/cf49fc1a31a9856ff769d26f9d2ff30aa59b3dbd))



## [1.0.6](https://bitbucket.org/api_server/app.wistiki.com/commits/tag/v1.0.6) (2016-11-07)


### Fix

* Fix: Saveposition send mail & push blocked by error due to typo in wisitiki_has_owner instead of wistiki_has_owner    ([6d9094f696f3c8227b64bf7723bc501f1aa51bc1](https://bitbucket.org/wistiki_team/api_server/commits/6d9094f696f3c8227b64bf7723bc501f1aa51bc1))



## [1.0.5](https://bitbucket.org/api_server/app.wistiki.com/commits/tag/v1.0.5) (2016-10-28)


### Build

* Build: Correction des liens vers Bitbucket dans les Changelog    ([3f0d6c3cde65cbab93ec3bea95e6d38261b9d2db](https://bitbucket.org/wistiki_team/api_server/commits/3f0d6c3cde65cbab93ec3bea95e6d38261b9d2db))
* Build: Correction des liens vers Bitbucket dans les Changelog    ([134a3d32742bdcac265cd352da91f17857cc1445](https://bitbucket.org/wistiki_team/api_server/commits/134a3d32742bdcac265cd352da91f17857cc1445))

### Fix

* Fix: Cannot DELETE /login/name@mail.com on logout (DAR-183)    ([c97f5e7fd43d2c5421dd4690ad66ba936c73ae38](https://bitbucket.org/wistiki_team/api_server/commits/c97f5e7fd43d2c5421dd4690ad66ba936c73ae38))



## [1.0.4](https://bitbucket.org/api_server/app.wistiki.com/commits/tag/v1.0.4) (2016-10-24)


### Docs

* Docs: Account confirmation doc update    ([b36b96d561b93a51f69a46b1e4d097ce08570e2e](https://bitbucket.org/wistiki_team/api_server/commits/b36b96d561b93a51f69a46b1e4d097ce08570e2e))

### Fix

* Fix: Remove time debug messages from console    ([9baf79f0db09fb3b5bc9d13b2f3aeda9465156e2](https://bitbucket.org/wistiki_team/api_server/commits/9baf79f0db09fb3b5bc9d13b2f3aeda9465156e2))
* Fix: Replace :id by :__feathersId in Service ACL    ([46880dad28cf6b83773197640f4c4a70e7d2fa8c](https://bitbucket.org/wistiki_team/api_server/commits/46880dad28cf6b83773197640f4c4a70e7d2fa8c))



## [1.0.3](https://bitbucket.org/api_server/app.wistiki.com/commits/tag/v1.0.3) (2016-10-06)


### Fix

* Fix: 404 error on logout    ([22bc4138d953d156e7e2fc9bde29f2d6c9ac5878](https://bitbucket.org/wistiki_team/api_server/commits/22bc4138d953d156e7e2fc9bde29f2d6c9ac5878))
* Fix: Code refactoring /positions root    ([d3200d7a4d1a5fc4136c582ee3918f48ce7a54ff](https://bitbucket.org/wistiki_team/api_server/commits/d3200d7a4d1a5fc4136c582ee3918f48ce7a54ff))



## [1.0.2](https://bitbucket.org/api_server/app.wistiki.com/commits/tag/v1.0.2) (2016-08-30)


### Fix

* Fix: 404 error Cannot « Method » « url »    ([b250141ef5f870be86ef9943ff3e9fc4ab328a5e](https://bitbucket.org/wistiki_team/api_server/commits/b250141ef5f870be86ef9943ff3e9fc4ab328a5e))
* Fix: Error 500 quand on ajoute un Wistiki    ([526d3ed422456faa14b7f298bd164e2096c19af7](https://bitbucket.org/wistiki_team/api_server/commits/526d3ed422456faa14b7f298bd164e2096c19af7))
* Fix: Error 500 quand on ajoute un Wistiki et où lastposition est null    ([6b446f41e34eed03a93dc06d76e786c8797f7e52](https://bitbucket.org/wistiki_team/api_server/commits/6b446f41e34eed03a93dc06d76e786c8797f7e52))
* Fix: MODEL_ACL error when trying to update wistiki software version    ([a7fbd6beac7ed0532041352aeb4dc5f4477cdd4a](https://bitbucket.org/wistiki_team/api_server/commits/a7fbd6beac7ed0532041352aeb4dc5f4477cdd4a))
* Fix: Return last position from cache instead of throwing error    ([bfa44c882a889677a3e7128f2e51fa279f3cc40c](https://bitbucket.org/wistiki_team/api_server/commits/bfa44c882a889677a3e7128f2e51fa279f3cc40c))
* Fix: Wistiki last position not returned after wistiki update    ([e745304d9fe6483f83553adeca8e14861426cc43](https://bitbucket.org/wistiki_team/api_server/commits/e745304d9fe6483f83553adeca8e14861426cc43))
* Fix: Wistiki model ACL update when wistiki model contains wistiki_has_owner attribute and not owner    ([d87f8c48d53401acee2fa3b1c9780d6cc829901b](https://bitbucket.org/wistiki_team/api_server/commits/d87f8c48d53401acee2fa3b1c9780d6cc829901b))

### Update

* Update: Nginx set client body size to 10M    ([1dcbd0f27c57c25b3112ae9c26a4876045db6e12](https://bitbucket.org/wistiki_team/api_server/commits/1dcbd0f27c57c25b3112ae9c26a4876045db6e12))



## [1.0.1](https://bitbucket.org/api_server/app.wistiki.com/commits/tag/v1.0.1) (2016-08-11)


### Docs

* Docs: Update readme file    ([dbac879a71e78597852a576e93d9c6ab5ea6091e](https://bitbucket.org/wistiki_team/api_server/commits/dbac879a71e78597852a576e93d9c6ab5ea6091e))

### Fix

* Fix: last_position is not returned on first call of get wistiki list when data is not found in cache    ([78c80d0f86b917683500950dfcb07357a0c73da2](https://bitbucket.org/wistiki_team/api_server/commits/78c80d0f86b917683500950dfcb07357a0c73da2))
* Fix: last_position.position is now object instead of string when returned from cache    ([edf3933313965a42570d97a51788dd931bb1066b](https://bitbucket.org/wistiki_team/api_server/commits/edf3933313965a42570d97a51788dd931bb1066b))
* Fix: parseInt when storing position accuracy data in cache & when retrieving position object    ([33616d89be1229dee4c284728fdf9fd851bfe5cf](https://bitbucket.org/wistiki_team/api_server/commits/33616d89be1229dee4c284728fdf9fd851bfe5cf))

### New

* New: get all wistikis models including last active firmware version    ([de35831682895f199587731c54f9fad923c02e17](https://bitbucket.org/wistiki_team/api_server/commits/de35831682895f199587731c54f9fad923c02e17))
* New: now app_version is available for device update/create    ([34400254d387f29ee6067b28323424eeb4a5ee33](https://bitbucket.org/wistiki_team/api_server/commits/34400254d387f29ee6067b28323424eeb4a5ee33))
* New: user can now update last_software_version & last_software_update date    ([2fef93f40ecd755938d740619c6b31a9984c6174](https://bitbucket.org/wistiki_team/api_server/commits/2fef93f40ecd755938d740619c6b31a9984c6174))

### Update

* Update: set sender email notification@wistiki.com    ([5f9f3baa8dfad371245bb53c8c12ed8014bd9d4a](https://bitbucket.org/wistiki_team/api_server/commits/5f9f3baa8dfad371245bb53c8c12ed8014bd9d4a))
* Update: update email description and title for email creation and password reset    ([bab5f9dbe300e559d537dbdd8abee65836e5e521](https://bitbucket.org/wistiki_team/api_server/commits/bab5f9dbe300e559d537dbdd8abee65836e5e521))
* Update: use cache to speed up wistiki listing and position retrieve    ([6d7353534068958db60f5deda71d65a62eb5be60](https://bitbucket.org/wistiki_team/api_server/commits/6d7353534068958db60f5deda71d65a62eb5be60))



# [1.0.0](https://bitbucket.org/api_server/app.wistiki.com/commits/tag/v1.0.0) (2016-07-07)


### bugfix

* bugfix: feathers error    ([f275409a4df7761bcebfbed44c6158cc2739c6de](https://bitbucket.org/wistiki_team/api_server/commits/f275409a4df7761bcebfbed44c6158cc2739c6de))
* bugfix: remove sensible data in notification share    ([63645400517bf3dc7940ef4b051b9fa2fc7f71ba](https://bitbucket.org/wistiki_team/api_server/commits/63645400517bf3dc7940ef4b051b9fa2fc7f71ba))

### Bugfix

* Bugfix: Account Verification    ([09a19b3ca87a19ec7a17f56f4ff551cd3979269e](https://bitbucket.org/wistiki_team/api_server/commits/09a19b3ca87a19ec7a17f56f4ff551cd3979269e))
* Bugfix: code: 403, name: "Forbidden", message: "Error" when trying to reset password    ([4517b7ba554207e900f5bda683f4f8447dfe3c8c](https://bitbucket.org/wistiki_team/api_server/commits/4517b7ba554207e900f5bda683f4f8447dfe3c8c))
* Bugfix: ER_DATA_TOO_LONG: Data too long for column 'token' at row 1 when logging in    ([dd737ea6314d27b07cb4d3ff3ed707546112e2ca](https://bitbucket.org/wistiki_team/api_server/commits/dd737ea6314d27b07cb4d3ff3ed707546112e2ca))
* Bugfix: notification not send when wistiki is found    ([83f85efa388dfd9f29c5bc2b64698f914c87c16d](https://bitbucket.org/wistiki_team/api_server/commits/83f85efa388dfd9f29c5bc2b64698f914c87c16d))
* Bugfix: send back all messages in which user is particpating instead of sending only the messages posted by the user    ([9c868af7ed2ba21d039b0e99a7e25528a25d86f4](https://bitbucket.org/wistiki_team/api_server/commits/9c868af7ed2ba21d039b0e99a7e25528a25d86f4))
* Bugfix: unable to unshare due to ACL error    ([a48e4b23d178e0ded82fb79951e7351f7b8ad516](https://bitbucket.org/wistiki_team/api_server/commits/a48e4b23d178e0ded82fb79951e7351f7b8ad516))
* Bugfix: unable to unshare due to ACL error    ([e88abc4ea5a95bd0c5290de8fe2cf04064d9ffa7](https://bitbucket.org/wistiki_team/api_server/commits/e88abc4ea5a95bd0c5290de8fe2cf04064d9ffa7))
* Bugfix: Unhandled rejection TypeError: Cannot read property 'get' of undefined at /var/api_server/src/services/users/threads/messages.js:184:37    ([52c9dff0ec2d2517d309eec40fc07ea1d7c98d2b](https://bitbucket.org/wistiki_team/api_server/commits/52c9dff0ec2d2517d309eec40fc07ea1d7c98d2b))
* Bugfix: Unhandled rejection TypeError: Cannot read property 'get' of undefined at /var/api_server/src/services/users/threads/messages.js:184:37    ([1bdc689401ab4d5879e274b1fc68ed972eef77b0](https://bitbucket.org/wistiki_team/api_server/commits/1bdc689401ab4d5879e274b1fc68ed972eef77b0))
* Bugfix: When request authenticity fail should return BadRequestError instead of Notfound    ([fdbe52352fdf00a94a12993a209a185fb9a3eb0e](https://bitbucket.org/wistiki_team/api_server/commits/fdbe52352fdf00a94a12993a209a185fb9a3eb0e))

### Doc

* Doc: Add schema validation error example    ([7554b894660eda0bdb187f2be3076649e4558cc3](https://bitbucket.org/wistiki_team/api_server/commits/7554b894660eda0bdb187f2be3076649e4558cc3))
* Doc: link to unit-testing-express-middleware    ([7fc26d278d93ed554e1e77bf0ae0e4905b6f9c67](https://bitbucket.org/wistiki_team/api_server/commits/7fc26d278d93ed554e1e77bf0ae0e4905b6f9c67))
* Doc: Update Readme with AWS Policies    ([d8419875edf128a55ba0f93a80c3e0881ff6b6a0](https://bitbucket.org/wistiki_team/api_server/commits/d8419875edf128a55ba0f93a80c3e0881ff6b6a0))

### Docs

* Docs: Added SNS policy conf + updated environment config (fixes #DAR-75)    ([05beaaa500720394495515eccf869159ed5a75c8](https://bitbucket.org/wistiki_team/api_server/commits/05beaaa500720394495515eccf869159ed5a75c8)), closes 
    [#DAR-75](https://wistiki.atlassian.net/projects//issues/-DAR-75/)
* Docs: Share notification section    ([87a2b3a63e84cce56b127d006d8593a81ec71a2e](https://bitbucket.org/wistiki_team/api_server/commits/87a2b3a63e84cce56b127d006d8593a81ec71a2e))
* Docs: Update notification docs & delete endpoints when sns_arn is disabled    ([4184b3141ef5e8ebcae5636f5cc7181211d01ac5](https://bitbucket.org/wistiki_team/api_server/commits/4184b3141ef5e8ebcae5636f5cc7181211d01ac5))
* Docs: Update Readme file    ([1462cd7af13419433c6fdb335eea7c2218bbfe98](https://bitbucket.org/wistiki_team/api_server/commits/1462cd7af13419433c6fdb335eea7c2218bbfe98))
* Docs: Update Swagger document replacing position by geolocation in /positions and by geolocation in /wistikis/{serial_numer}/positions    ([26188000a39818c743e9bfee6b53823d61353f46](https://bitbucket.org/wistiki_team/api_server/commits/26188000a39818c743e9bfee6b53823d61353f46))

### Feat

* Feat: Transfer owner fixes DAR-77, DAR-78    ([b273cbed2369414fff02589c2a58be1ebce23573](https://bitbucket.org/wistiki_team/api_server/commits/b273cbed2369414fff02589c2a58be1ebce23573))

### Fix

* Fix: (fixes DAR-90) notNull Violation: last_software_version cannot be null when trying to add new Wistiki without giving last_software_version    ([e4f2a20911de73ad6b6cfb6aabd281806cb7094f](https://bitbucket.org/wistiki_team/api_server/commits/e4f2a20911de73ad6b6cfb6aabd281806cb7094f))
* Fix: (fixes DAR-90) notNull Violation: last_software_version cannot be null when trying to add new Wistiki without giving last_software_version    ([52dda7aa0a25cc836b13a73dfbe6050fcb5986e9](https://bitbucket.org/wistiki_team/api_server/commits/52dda7aa0a25cc836b13a73dfbe6050fcb5986e9))
* Fix: (fixes DAR-91) notNull Violation: link_loss cannot be null,\nnotNull Violation: inverted_link_loss cannot be null when trying to add new Wistiki    ([783825ba7bbc94c558dc4eae1c65b2c6b127398f](https://bitbucket.org/wistiki_team/api_server/commits/783825ba7bbc94c558dc4eae1c65b2c6b127398f))
* Fix: (fixes DAR-91) notNull Violation: link_loss cannot be null,\nnotNull Violation: inverted_link_loss cannot be null when trying to add new Wistiki    ([f7d9ae5afea05f080c35fe69cf280a40438725a3](https://bitbucket.org/wistiki_team/api_server/commits/f7d9ae5afea05f080c35fe69cf280a40438725a3))
* Fix: Authentication & ACL is now implemented (fixes #DAR-4)    ([ab7d9e5b1280c09934102343763d552dc9a094c1](https://bitbucket.org/wistiki_team/api_server/commits/ab7d9e5b1280c09934102343763d552dc9a094c1)), closes 
    [#DAR-4](https://wistiki.atlassian.net/projects//issues/-DAR-4/)
* Fix: Bad http response code: When returning Http code 204 code, we don't put a content hein (fixes #DAR-30)    ([5684be836a0f9c5e6e5ffc116e6886efef071de8](https://bitbucket.org/wistiki_team/api_server/commits/5684be836a0f9c5e6e5ffc116e6886efef071de8)), closes 
    [#DAR-30](https://wistiki.atlassian.net/projects//issues/-DAR-30/)
* Fix: bug when getting user devices (getDevices is now getOwnedDevices)    ([eb6039eda5aae43f445acd2b8d49e02fc497a8c4](https://bitbucket.org/wistiki_team/api_server/commits/eb6039eda5aae43f445acd2b8d49e02fc497a8c4))
* Fix: Bug when sending notification    ([23066b44c58894b0d61d64b050063c9ade4f4cf5](https://bitbucket.org/wistiki_team/api_server/commits/23066b44c58894b0d61d64b050063c9ade4f4cf5))
* Fix: bug: notification sent to all owner devices including device that sent the request    ([ccae4caa721aecbdc43acdea7586d732b2a62135](https://bitbucket.org/wistiki_team/api_server/commits/ccae4caa721aecbdc43acdea7586d732b2a62135))
* Fix: create sns endpoints in dev environment for iOS devices    ([a08a1b6c3563390037af0f20685a144e87504510](https://bitbucket.org/wistiki_team/api_server/commits/a08a1b6c3563390037af0f20685a144e87504510))
* Fix: CredentialsError: Missing credentials in config (fixes #DAR-85)    ([82abad03d13f06f261752e4e8c82ea7dff37dc81](https://bitbucket.org/wistiki_team/api_server/commits/82abad03d13f06f261752e4e8c82ea7dff37dc81)), closes 
    [#DAR-85](https://wistiki.atlassian.net/projects//issues/-DAR-85/)
* Fix: Disable "formatted address" empty check    ([840e4d0be9e68ef0c5a751a8aaac1d98bd3b6301](https://bitbucket.org/wistiki_team/api_server/commits/840e4d0be9e68ef0c5a751a8aaac1d98bd3b6301))
* Fix: error 500 & MODEL_ACL_ERROR (resolves DAR-77)    ([acd42777fb763921b2ee2f14c66151501f6e7499](https://bitbucket.org/wistiki_team/api_server/commits/acd42777fb763921b2ee2f14c66151501f6e7499))
* Fix: Error when updating Wistiki details with a picture (fixes #DAR-84)    ([911cd24235dcac6a4fd77d0d9e0d6f001065f872](https://bitbucket.org/wistiki_team/api_server/commits/911cd24235dcac6a4fd77d0d9e0d6f001065f872)), closes 
    [#DAR-84](https://wistiki.atlassian.net/projects//issues/-DAR-84/)
* Fix: fixes DAR-83, DAR-81    ([2ee6835bd9a401f0fcfdef6b73ffebd2ff93b9c9](https://bitbucket.org/wistiki_team/api_server/commits/2ee6835bd9a401f0fcfdef6b73ffebd2ff93b9c9))
* Fix: fixes DAR-93 change middleware orders    ([bf77129cfa13fb5c4606684fcc1b8aa37d2bb191](https://bitbucket.org/wistiki_team/api_server/commits/bf77129cfa13fb5c4606684fcc1b8aa37d2bb191))
* Fix: ignore null sns_arns    ([76dae137234dfaaa6217b8a390ef62714b53b907](https://bitbucket.org/wistiki_team/api_server/commits/76dae137234dfaaa6217b8a390ef62714b53b907))
* Fix: ignore null sns_arns    ([29484fdd66110edd280f78b276db7c9b466829fa](https://bitbucket.org/wistiki_team/api_server/commits/29484fdd66110edd280f78b276db7c9b466829fa))
* Fix: Method 'create' require first param to be an object    ([ce0e7381eb84ebefa09391db267acb25ee74b0b4](https://bitbucket.org/wistiki_team/api_server/commits/ce0e7381eb84ebefa09391db267acb25ee74b0b4))
* Fix: push notification is not sent when user is not authenticated    ([67235d52cfbe75604bf13ff714c7703c7efa8ba3](https://bitbucket.org/wistiki_team/api_server/commits/67235d52cfbe75604bf13ff714c7703c7efa8ba3))
* Fix: Share wistiki is now available on /wistikis/{serial_number}/friends (fixes #DAR-77)    ([2b8525f1602d20d6411f0f4df7edb992a2ccbe30](https://bitbucket.org/wistiki_team/api_server/commits/2b8525f1602d20d6411f0f4df7edb992a2ccbe30)), closes 
    [#DAR-77](https://wistiki.atlassian.net/projects//issues/-DAR-77/)
* Fix: Swagger model response when unsharing    ([2ae571cea837c9008b33c0c3a207eb850b178af0](https://bitbucket.org/wistiki_team/api_server/commits/2ae571cea837c9008b33c0c3a207eb850b178af0))
* Fix: Swagger response to save position    ([4c3faeffbdcd15b46c174395af61716faf7c8247](https://bitbucket.org/wistiki_team/api_server/commits/4c3faeffbdcd15b46c174395af61716faf7c8247))
* Fix: Unshare response, position response in swagger, add unshare notifications    ([956b71270317d8972b58238fef85f7b1fd2bd6c0](https://bitbucket.org/wistiki_team/api_server/commits/956b71270317d8972b58238fef85f7b1fd2bd6c0))
* Fix: UnShare wistiki    ([b229b14ef1f0afd45bf45c5164670baa3d51b431](https://bitbucket.org/wistiki_team/api_server/commits/b229b14ef1f0afd45bf45c5164670baa3d51b431))
* Fix: UnShare wistiki is now available on /wistikis/{serial_number}/friends/{email} (fixes #DAR-79)    ([e11337b20f1481a28b89dad09d16696d176231fc](https://bitbucket.org/wistiki_team/api_server/commits/e11337b20f1481a28b89dad09d16696d176231fc)), closes 
    [#DAR-79](https://wistiki.atlassian.net/projects//issues/-DAR-79/)
* Fix: WistikiUnshare not effective when multiple rows are present in database (resolves DAR-77)    ([4a43faadeacdefe484c5ba0d8232008687b4ba3f](https://bitbucket.org/wistiki_team/api_server/commits/4a43faadeacdefe484c5ba0d8232008687b4ba3f))
* Fix: WistikiUnshare not effective when multiple rows are present in database (resolves DAR-77)    ([cdacc219a70712d36783843855e0f1ab7c97746d](https://bitbucket.org/wistiki_team/api_server/commits/cdacc219a70712d36783843855e0f1ab7c97746d))
* Fix: Wrong response format when sharing wistiki (Fixes DAR-97)    ([303de49eaf2605c2c3d3cc20003bf62863ab5f05](https://bitbucket.org/wistiki_team/api_server/commits/303de49eaf2605c2c3d3cc20003bf62863ab5f05))

### fixes

* fixes: #DAR-73 PushNotification Token can now be sent during login    ([966e296a04953d6c01a45284487982b41428dbbd](https://bitbucket.org/wistiki_team/api_server/commits/966e296a04953d6c01a45284487982b41428dbbd))
* fixes: #DAR-76 PushNotification Token can now be updated vi /users/:email/devices/:id    ([60d1ee28148fa7e3f0de02d3f1f87d592b9d26e3](https://bitbucket.org/wistiki_team/api_server/commits/60d1ee28148fa7e3f0de02d3f1f87d592b9d26e3))

### Models

* Models: Add creation_date as primary key to table device_has_user, and hooks to device model, and device_has_user model    ([b2f1a9f8df0b0b2de7bb6b6e2b9d414bca7579a2](https://bitbucket.org/wistiki_team/api_server/commits/b2f1a9f8df0b0b2de7bb6b6e2b9d414bca7579a2))
* Models: Add token, expiration date, refresh_token to table device_has_user and add Name to table Device    ([32f3ba1c1d614c0f0d56514509d1798b7446e85e](https://bitbucket.org/wistiki_team/api_server/commits/32f3ba1c1d614c0f0d56514509d1798b7446e85e))

### New

* New: Send logs to AWS Cloudwatch (resolves DAR-88)    ([cbc22f3873d7ff9262aebe7027045d14af44734d](https://bitbucket.org/wistiki_team/api_server/commits/cbc22f3873d7ff9262aebe7027045d14af44734d))
* New: Upload photo to user profile    ([ab87d513d852292edfb37c0c1d6a8473898ea040](https://bitbucket.org/wistiki_team/api_server/commits/ab87d513d852292edfb37c0c1d6a8473898ea040))
* New: Upload photo to user profile    ([1880ae3ef672c04f034205b3c3f5efc9cf32129d](https://bitbucket.org/wistiki_team/api_server/commits/1880ae3ef672c04f034205b3c3f5efc9cf32129d))

### POST

* POST: Password => Swagger errors updated.    ([75281f6f6c7296b15a946be426db03b25ae7bfde](https://bitbucket.org/wistiki_team/api_server/commits/75281f6f6c7296b15a946be426db03b25ae7bfde))

### Swagger

* Swagger: integration of found method    ([93d4dc8f53c315885178c9befcd69271373e7fff](https://bitbucket.org/wistiki_team/api_server/commits/93d4dc8f53c315885178c9befcd69271373e7fff))
* Swagger: new header added on login step to identify the environment of the client    ([1ee79f17a2d82d69aabba4ba969874c16e928d96](https://bitbucket.org/wistiki_team/api_server/commits/1ee79f17a2d82d69aabba4ba969874c16e928d96))
* Swagger: PUT device + POST login header application env added.    ([c77b1c5caf44b96f7ee5ca78e4dbe156c5100b33](https://bitbucket.org/wistiki_team/api_server/commits/c77b1c5caf44b96f7ee5ca78e4dbe156c5100b33))

### Test

* Test: put on login return true    ([1a78e96e654dc7b123a5d9f37e871662a0ebcbe1](https://bitbucket.org/wistiki_team/api_server/commits/1a78e96e654dc7b123a5d9f37e871662a0ebcbe1))

### Threads

* Threads: Add list of participants to response    ([3cb22355647e4f8aec8f4e2ce387ca9aea91ab2f](https://bitbucket.org/wistiki_team/api_server/commits/3cb22355647e4f8aec8f4e2ce387ca9aea91ab2f))
* Threads: Add list of participants to response    ([5f308aa140a453778371df85a472c9169b240512](https://bitbucket.org/wistiki_team/api_server/commits/5f308aa140a453778371df85a472c9169b240512))

### Update

* Update: Login service code refactoring and unit tests addition    ([84f8876959d013630443e1994ebd1b991eb7efc1](https://bitbucket.org/wistiki_team/api_server/commits/84f8876959d013630443e1994ebd1b991eb7efc1))
* Update: Users service code refactoring    ([2aa2d7e71c5c74c48ae8484f096c908270ccf318](https://bitbucket.org/wistiki_team/api_server/commits/2aa2d7e71c5c74c48ae8484f096c908270ccf318))



