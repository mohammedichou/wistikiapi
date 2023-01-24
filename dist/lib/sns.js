'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.subscribeToWakeMeUpTopic = subscribeToWakeMeUpTopic;
exports.createEndpoint = createEndpoint;
exports.createAndroidEndpoint = createAndroidEndpoint;
exports.createiOSEndpoint = createiOSEndpoint;
exports.confirmSubscriptionToWakeMeUpTopic = confirmSubscriptionToWakeMeUpTopic;
exports.notifyEndpoint = notifyEndpoint;

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _logger = require('../lib/logger');

var _db = require('../db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_awsSdk2.default.config.loadFromPath('./dist/config/aws_credentials.json');
var sns = new _awsSdk2.default.SNS({
  region: 'eu-central-1'
});

/**
 * Subscribe and iOS Endpoint to WakeMeUp topic used to wake up iOS application each
 * Xmn to perform background scans
 *
 * @param endPoint arn
 * @returns {Promise}
 */
function subscribeToWakeMeUpTopic(endPoint) {
  return new _promise2.default(function (resolve, reject) {
    _logger.snsLog.debug('subscribeToWakeMeUpTopic', { endpoint: endPoint });
    sns.subscribe({
      TopicArn: _config2.default.sns.topic.arn.wakemeup,
      Protocol: 'application',
      Endpoint: endPoint
    }, function (err, data) {
      _logger.snsLog.info('subscribeToWakeMeUpTopic callback', { data: data });
      if (err) {
        _logger.snsLog.error('subscribeToWakeMeUpTopic callback error', { endpoint: endPoint, error: err });
        _logger.errorLog.error('subscribeToWakeMeUpTopic callback error', {
          endpoint: endPoint,
          error: err
        });
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}

/**
 * Creates an End point.
 *
 * @param applicationArn
 * @param deviceToken
 * @param customUserData
 * @returns {Promise}
 */
function createEndpoint(applicationArn, deviceToken, customUserData) {
  return new _promise2.default(function (resolve, reject) {
    sns.createPlatformEndpoint({
      PlatformApplicationArn: applicationArn,
      Token: deviceToken,
      CustomUserData: customUserData
    }, function (err, data) {
      if (err) {
        reject(err);
        return;
      }
      sns.setEndpointAttributes({
        EndpointArn: data.EndpointArn,
        Attributes: {
          Enabled: 'true'
        }
      });
      resolve(data);
    });
  });
}

/**
 * Creates an Android Endpoint.
 * Application ARN must be declared in environment config file config.sns.arn.android
 *
 * @param deviceToken
 * @param customUserData
 * @returns {Promise}
 */
function createAndroidEndpoint(deviceToken) {
  var customUserData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  return createEndpoint(_config2.default.sns.arn.production.android, deviceToken, customUserData);
}

/**
 * Creates an iOS Endpoint and subscribe it to WakeMeUp topic via {@link subscribeToWakeMeUpTopic}
 * Application ARN must be declared in environment config file config.sns.arn.ios
 *
 * @param deviceToken
 * @param attributes
 * @returns {Promise}
 */
function createiOSEndpoint(deviceToken) {
  var customUserData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var environment = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'production';

  // snsLog.debug('createiOSEndpoint', {
  //   device_token: deviceToken,
  //   custom_user_data: customUserData,
  //   environment,
  // });
  return createEndpoint(_config2.default.sns.arn[environment].ios, deviceToken, customUserData).then(function (data) {
    subscribeToWakeMeUpTopic(data.EndpointArn);
    return data;
  });
}

function confirmSubscriptionToWakeMeUpTopic(token) {
  return new _promise2.default(function (resolve, reject) {
    var params = {
      TopicArn: _config2.default.sns.topic.arn.wakemeup,
      Token: token
    };
    sns.confirmSubscription(params, function (err, data) {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}

/**
 * Notify device through SNS service with provided payload.
 * Payload will be stringified before sending push notif. So, it must be an object.
 * If SNS reject the request with error 'EndpointDisabled', then the endpoint is
 * updated and the push resent
 *
 * @param {String} device
 * @param {Object} payload
 * @return {Promise}
 */
function notifyEndpoint(snsArn, message) {
  var deviceUid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var payload = {
    default: (0, _stringify2.default)(message.default),
    GCM: (0, _stringify2.default)(message.GCM),
    APNS: (0, _stringify2.default)(message.APNS),
    APNS_SANDBOX: (0, _stringify2.default)(message.APNS)
  };
  var params = {
    TargetArn: snsArn,
    MessageStructure: 'json',
    Message: (0, _stringify2.default)(payload)
  };
  return new _promise2.default(function (resolve, reject) {
    sns.publish(params, function (err, data) {
      if (err) {
        // snsLog.error(`Error sending push to ${snsArn}`, {
        //   DeviceUid: deviceUid,
        //   EndpointArn: snsArn,
        //   params,
        //   error: err,
        // });
        if (err.code === 'EndpointDisabled') {
          // snsLog.warn(`Endpoint ${snsArn} Disabled`, {
          //   DeviceUid: deviceUid,
          //   EndpointArn: snsArn,
          // });

          sns.setEndpointAttributes({
            Attributes: {
              Enabled: 'true'
            },
            EndpointArn: snsArn
          }, function (er) {
            if (er) {
              // snsLog.error(`Error updating endpoint ${snsArn}`, {
              //   DeviceUid: deviceUid,
              //   EndpointArn: snsArn,
              //   error: er,
              // });
            } else {
              // snsLog.info(`Endpoint ${snsArn} updated with success`, {
              //   DeviceUid: deviceUid,
              //   EndpointArn: snsArn,
              // });

              setTimeout(function () {
                sns.publish(params, function (e, d) {
                  if (er) {
                    // snsLog.error(`Error on resending push to ${snsArn} endpoint`, {
                    //   DeviceUid: deviceUid,
                    //   EndpointArn: snsArn,
                    //   error: e,
                    //   message: d,
                    // });
                  } else {
                      // snsLog.info(`Push resent with success to ${snsArn} endpoint`, {
                      //   DeviceUid: deviceUid,
                      //   EndpointArn: snsArn,
                      //   error: e,
                      //   message: d,
                      // });
                    }
                });
              }, 1500);
            }
          });
        } else if (err.code === 'InvalidParameter') {
          _logger.snsLog.info('Invalid parameter for ' + snsArn + ' endpoint', {
            errorcode: err.code,
            errormessage: err.message,
            payload: payload,
            message: message,
            params: params,
            data: data
          });

          if (err.message === 'Invalid parameter: TargetArn Reason: No endpoint found for the target arn specified') {
            _db.Device.cache().update({ sns_arn: null }, {
              where: {
                sns_arn: snsArn
              }
            });
          }
        }
        reject(err);
        return;
      }
      if (message.default.id !== 'POS') {
        // snsLog.info(`Push sent to ${snsArn} with success`, {
        //   payload,
        //   message,
        //   params,
        //   data,
        // });
      }

      resolve(data);
    });
  });
}
//# sourceMappingURL=sns.js.map
