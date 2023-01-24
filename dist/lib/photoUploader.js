'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_awsSdk2.default.config.loadFromPath('./dist/config/aws_credentials.json'); /**
                                                                             * Wistiki SAS
                                                                             * Created by adnene on 08/12/2015.
                                                                             */


function p(base64data, bucket, key, contentType) {
  var s3 = new _awsSdk2.default.S3();
  return s3.client.putObject({
    Bucket: bucket,
    Key: key,
    Body: base64data,
    ContentType: contentType
  });
}

/**
 *
 * @param bucket
 * @param key
 * @param base64data
 * @return {Promise<String>}
 */
function uploadPhoto(bucket, key, base64data) {
  var s3 = new _awsSdk2.default.S3({
    region: 'eu-central-1',
    apiVersion: '2006-03-01'
  });
  return new _promise2.default(function (resolve, reject) {
    s3.upload({
      Bucket: bucket,
      Key: key,
      Body: Buffer.from(base64data.split(',')[1], 'base64'),
      ContentType: base64data.split(':')[1].split(';')[0],
      ACL: 'public-read'

    }).send(function (err, response) {
      if (err) {
        return reject(err);
      }
      return resolve(decodeURIComponent(response.Location));
    }, function (err) {
      return reject(err);
    });
  });
}

exports.default = {
  upload: uploadPhoto
};
//# sourceMappingURL=photoUploader.js.map
