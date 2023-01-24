'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = require('./' + (process.env.NODE_ENV ? process.env.NODE_ENV : 'default') + '.json');

var sensibleData = {
  user: ['password', 'confirmation_token', 'password_reset_token', 'password_reset_date', 'confirmation_date'],
  device: ['sns_arn'],
  device_has_user: ['token', 'refresh_token'],
  wistiki: ['recovery_key', 'manufacturing_date', 'msn', 'flan', 'authorization_key', 'last_reset_date'],
  application: ['master_key']
};
exports.sensibleData = sensibleData;
//# sourceMappingURL=index.js.map
