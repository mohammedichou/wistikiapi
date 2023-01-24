'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.accountConfirmationEmail = accountConfirmationEmail;
exports.promoWistiKeys = promoWistiKeys;
exports.forgotPasswordEmail = forgotPasswordEmail;
exports.newFriendEmail = newFriendEmail;
exports.foundWistikiEmail = foundWistikiEmail;
exports.tutoEmail = tutoEmail;
exports.positionUpdateEmail = positionUpdateEmail;

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _jade = require('jade');

var _jade2 = _interopRequireDefault(_jade);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _nodemailerSesTransport = require('nodemailer-ses-transport');

var _nodemailerSesTransport2 = _interopRequireDefault(_nodemailerSesTransport);

var _i18n = require('../lib/i18n');

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Wistiki SAS
 * Created by adnene on 08/12/2015.
 */
_awsSdk2.default.config.loadFromPath('./dist/config/aws_credentials.json');
var ses = new _awsSdk2.default.SES();
var debug = require('debug')('darwin:email');

var transport = _nodemailer2.default.createTransport((0, _nodemailerSesTransport2.default)({
  ses: ses
}));
var templates = {
  email: {
    template: './static/html/verify/email.jade',
    confirmation_template: './static/html/user/confirmation.jade',
    wistikeys_template: './static/html/user/wistikeys.jade',
    reset_template: './static/html/user/reset_password.jade',
    tuto_template: './static/html/user/tuto.jade',
    new_friend_template: './static/html/share/new_friend.jade',
    found_wistiki_template: './static/html/wistiki/found.jade',
    position_update_template: './static/html/wistiki/position_update.jade',
    attachments: [{
      filename: 'dfd8a5d8af444e5e8ee95c527174a3e0.png',
      path: _path2.default.resolve('./static/img/dfd8a5d8af444e5e8ee95c527174a3e0.png'),
      cid: 'dfd8a5d8af444e5e8ee95c527174a3e0' // should be as unique as possible
    }, {
      filename: 'facebook.png',
      path: _path2.default.resolve('./static/img/facebook.png'),
      cid: 'facebook' // should be as unique as possible
    }, {
      filename: 'twitter.png',
      path: _path2.default.resolve('./static/img/twitter.png'),
      cid: 'twitter' // should be as unique as possible
    }, {
      filename: 'linkedin.png',
      path: _path2.default.resolve('./static/img/linkedin.png'),
      cid: 'linkedin' // should be as unique as possible
    }]
  }
};
var generateUrl = function generateUrl() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';

  var baseUrl = (process.env.NODE_ENV == 'production' ? 'https' : 'http') + '://web.wistiki.' + (process.env.NODE_ENV == 'production' ? 'com' : 'io');
  return '' + (baseUrl + url);
};

/**
 * Sends a confirmation email to user based on provided param
 *
 * @param params - Object {email: string, confirmation_token: string , subject: string (optional)}
 * @returns {Promise}
 */
function accountConfirmationEmail(params) {
  debug('accountConfirmationEmail', (0, _stringify2.default)(params, null, 2));
  var emailFn = _jade2.default.compileFile(_path2.default.resolve(templates.email.confirmation_template));
  // TODO: Translate message
  var html = emailFn({
    url: generateUrl('/activation/' + params.email + '/' + params.confirmation_token),
    MAIL_CONFIRMATION_GREETINGS: _i18n2.default.__({
      phrase: 'MAIL_CONFIRMATION_GREETINGS',
      locale: params.language
    }, '' + params.first_name),
    MAIL_CONFIRMATION_BODY: _i18n2.default.__({ phrase: 'MAIL_CONFIRMATION_BODY', locale: params.language }),
    MAIL_CONFIRMATION_BUTTON: _i18n2.default.__({
      phrase: 'MAIL_CONFIRMATION_BUTTON',
      locale: params.language
    }),
    MAIL_CONFIRMATION_LOSE_RELAX: _i18n2.default.__({
      phrase: 'MAIL_CONFIRMATION_LOSE_RELAX',
      locale: params.language
    }),
    MAIL_CONFIRMATION_WISTIKI: _i18n2.default.__({
      phrase: 'MAIL_CONFIRMATION_WISTIKI',
      locale: params.language
    }),
    MAIL_CONFIRMATION_SOCIAL: _i18n2.default.__({
      phrase: 'MAIL_CONFIRMATION_SOCIAL',
      locale: params.language
    })
  });
  var email = {
    from: 'L\'équipe Wistiki <notification@wistiki.com>',
    to: params.email,
    subject: _i18n2.default.__({ phrase: 'MAIL_CONFIRMATION_SUBJECT', locale: params.language }),
    html: html
    // attachments: templates.email.attachments
  };
  return new _promise2.default(function (resolve, reject) {
    transport.sendMail(email, function (err, info) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        // console.log(info);
      }
      resolve(info);
    });
  });
}

/**
 * Sends a voucher by email to user based on provided param after creating an account
 *
 * @param params - Object {email: string, subject: string (optional)}
 * @returns {Promise}
 */
function promoWistiKeys(params) {
  debug('promoWistiKeys', (0, _stringify2.default)(params, null, 2));
  var emailFn = _jade2.default.compileFile(_path2.default.resolve(templates.email.wistikeys_template));
  // TODO: Translate message
  var html = emailFn({
    url: 'https://www.securkeys.com/wistikipromo',
    MAIL_WISTIKEYS_GREETINGS: _i18n2.default.__({
      phrase: 'MAIL_WISTIKEYS_GREETINGS',
      locale: params.language
    }, '' + params.first_name),
    MAIL_WISTIKEYS_BODY: _i18n2.default.__({ phrase: 'MAIL_WISTIKEYS_BODY', locale: params.language }),
    MAIL_WISTIKEYS_BUTTON: _i18n2.default.__({
      phrase: 'MAIL_WISTIKEYS_BUTTON',
      locale: params.language
    }),
    MAIL_WISTIKEYS_LOSE_RELAX: _i18n2.default.__({
      phrase: 'MAIL_WISTIKEYS_LOSE_RELAX',
      locale: params.language
    }),
    MAIL_WISTIKEYS_WISTIKI: _i18n2.default.__({
      phrase: 'MAIL_WISTIKEYS_WISTIKI',
      locale: params.language
    }),
    MAIL_WISTIKEYS_SOCIAL: _i18n2.default.__({
      phrase: 'MAIL_WISTIKEYS_SOCIAL',
      locale: params.language
    })
  });
  var email = {
    from: 'L\'équipe Wistiki <notification@wistiki.com>',
    to: params.email,
    subject: _i18n2.default.__({ phrase: 'MAIL_WISTIKEYS_SUBJECT', locale: params.language }),
    html: html
    // attachments: templates.email.attachments
  };
  return new _promise2.default(function (resolve, reject) {
    transport.sendMail(email, function (err, info) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        // console.log(info);
      }
      resolve(info);
    });
  });
}

/**
 * Send a forgot password to user based on provided param
 *
 * @param params - Object {email: string, password_reset_token: string , subject: string (optional)}
 * @returns {Promise}
 */
function forgotPasswordEmail(params) {
  var emailFn = _jade2.default.compileFile(_path2.default.resolve(templates.email.reset_template));
  var html = emailFn({
    url: generateUrl('/reset_password/' + params.email + '/' + params.password_reset_token),
    MAIL_RESET_GREETINGS: _i18n2.default.__({
      phrase: 'MAIL_RESET_GREETINGS',
      locale: params.language
    }, '' + params.user.first_name),
    MAIL_RESET_BODY: _i18n2.default.__({ phrase: 'MAIL_RESET_BODY', locale: params.language }),
    MAIL_RESET_BUTTON: _i18n2.default.__({ phrase: 'MAIL_RESET_BUTTON', locale: params.language }),
    WISTIKI: _i18n2.default.__({ phrase: 'WISTIKI', locale: params.language }),
    LOSE_AND_RELAX: _i18n2.default.__({ phrase: 'LOSE_AND_RELAX', locale: params.language })
  });
  var email = {
    from: 'L\'équipe Wistiki <notification@wistiki.com>',
    to: params.email,
    subject: _i18n2.default.__({ phrase: 'MAIL_RESET_SUBJECT', locale: params.language }),
    html: html
  };
  return new _promise2.default(function (resolve, reject) {
    transport.sendMail(email, function (err, info) {
      if (err) {
        reject(err);
      }
      resolve(info);
    });
  });
}

/**
 * Send a download app invitation to new shared with user based on provided param
 *
 * @param params - Object {email: string, user, subject: string (optional)}
 * @returns {Promise}
 */
function newFriendEmail(params) {
  debug('newFriendEmail', params);
  var emailFn = _jade2.default.compileFile(_path2.default.resolve(templates.email.new_friend_template));
  var html = emailFn({
    url_google: _i18n2.default.__({ phrase: 'URL_GOOGLE_PLAY', locale: params.language }),
    url_apple: _i18n2.default.__({ phrase: 'URL_APPLE_STORE', locale: params.language }),
    img_google: _i18n2.default.__({ phrase: 'MAIL_NEWFRIEND_GOOGLE', locale: params.language }),
    img_apple: _i18n2.default.__({ phrase: 'MAIL_NEWFRIEND_APPLE', locale: params.language }),
    MAIL_NEWFRIEND_BODY: _i18n2.default.__({ phrase: 'MAIL_NEWFRIEND_BODY', locale: params.language }),
    MAIL_NEWFRIEND_BODY_CONTENT_1: _i18n2.default.__({
      phrase: 'MAIL_NEWFRIEND_BODY_CONTENT_1',
      locale: params.language
    }, '' + params.user.first_name, '' + params.wistiki),
    MAIL_NEWFRIEND_BODY_CONTENT_2: _i18n2.default.__({
      phrase: 'MAIL_NEWFRIEND_BODY_CONTENT_2',
      locale: params.language
    }),
    MAIL_NEWFRIEND_BODY_CONTENT_3: _i18n2.default.__({
      phrase: 'MAIL_NEWFRIEND_BODY_CONTENT_3',
      locale: params.language
    }),
    LOSE_AND_RELAX: _i18n2.default.__({ phrase: 'LOSE_AND_RELAX', locale: params.language }),
    WISTIKI: _i18n2.default.__({ phrase: 'WISTIKI', locale: params.language })
  });
  var email = {
    from: 'L\'équipe Wistiki <notification@wistiki.com>',
    to: params.email,
    subject: _i18n2.default.__({
      phrase: 'MAIL_NEWFRIEND_SUBJECT',
      locale: params.language
    }, '' + params.user.first_name, '' + params.wistiki),
    html: html
  };
  return new _promise2.default(function (resolve, reject) {
    transport.sendMail(email, function (err, info) {
      if (err) {
        reject(err);
      }
      resolve(info);
    });
  });
}

/**
 * Send a found wistiki email based on provided param
 *
 * @param params - Object {email: string, wistiki: string, subject: string (optional)}
 * @returns {Promise}
 */
function foundWistikiEmail(params) {
  debug('foundWistikiEmail', params);
  var emailFn = _jade2.default.compileFile(_path2.default.resolve(templates.email.found_wistiki_template));
  var html = emailFn({
    MAIL_FOUND_BODY: _i18n2.default.__({
      phrase: 'MAIL_FOUND_BODY',
      locale: params.language
    }, '' + params.wistiki),
    MAIL_FOUND_BODY_CONTENT_1: _i18n2.default.__({
      phrase: 'MAIL_FOUND_BODY_CONTENT_1',
      locale: params.language
    }, '' + params.wistiki),
    MAIL_FOUND_BODY_CONTENT_2: _i18n2.default.__({
      phrase: 'MAIL_FOUND_BODY_CONTENT_2',
      locale: params.language
    }),
    MAIL_FOUND_BODY_CONTENT_3: _i18n2.default.__({
      phrase: 'MAIL_FOUND_BODY_CONTENT_3',
      locale: params.language
    }),
    LOSE_AND_RELAX: _i18n2.default.__({ phrase: 'LOSE_AND_RELAX', locale: params.language }),
    WISTIKI: _i18n2.default.__({ phrase: 'WISTIKI', locale: params.language })
  });
  var email = {
    from: 'L\'équipe Wistiki <notification@wistiki.com>',
    to: params.email,
    subject: _i18n2.default.__({
      phrase: 'MAIL_FOUND_SUBJECT',
      locale: params.language
    }, '' + params.wistiki),
    html: html
  };
  return new _promise2.default(function (resolve, reject) {
    transport.sendMail(email, function (err, info) {
      if (err) {
        reject(err);
      }
      resolve(info);
    });
  });
}

/**
 * Send an invitation to chekout tutorial videos of wistiki based on provided param
 *
 * @param params - Object {email: string, user, subject: string (optional)}
 * @returns {Promise}
 */
function tutoEmail(params) {
  debug('tutoEmail', params);
  var emailFn = _jade2.default.compileFile(_path2.default.resolve(templates.email.tuto_template));
  var html = emailFn({
    MAIL_TUTO_BODY: _i18n2.default.__({
      phrase: 'MAIL_TUTO_BODY',
      locale: params.language
    }, '' + params.wistiki),
    MAIL_TUTO_BODY_CONTENT: _i18n2.default.__({ phrase: 'MAIL_TUTO_BODY_CONTENT', locale: params.language }),
    MAIL_TUTO_ADD: _i18n2.default.__({ phrase: 'MAIL_TUTO_ADD', locale: params.language }),
    MAIL_TUTO_RING: _i18n2.default.__({ phrase: 'MAIL_TUTO_RING', locale: params.language }),
    MAIL_TUTO_SHARE: _i18n2.default.__({ phrase: 'MAIL_TUTO_SHARE', locale: params.language }),
    MAIL_TUTO_LINK: _i18n2.default.__({ phrase: 'MAIL_TUTO_LINK', locale: params.language }),
    MAIL_TUTO_BUTTON: _i18n2.default.__({ phrase: 'MAIL_TUTO_BUTTON', locale: params.language }),
    LOSE_AND_RELAX: _i18n2.default.__({ phrase: 'LOSE_AND_RELAX', locale: params.language }),
    WISTIKI: _i18n2.default.__({ phrase: 'WISTIKI', locale: params.language })
  });
  var email = {
    from: 'L\'équipe Wistiki <notification@wistiki.com>',
    to: params.email,
    subject: _i18n2.default.__({
      phrase: 'MAIL_TUTO_SUBJECT',
      locale: params.language
    }, '' + params.user.first_name),
    html: html
  };
  return new _promise2.default(function (resolve, reject) {
    transport.sendMail(email, function (err, info) {
      if (err) {
        reject(err);
      }
      resolve(info);
    });
  });
}

/**
 * Send a wistiki position update email based on provided param
 *
 * @param params - Object {email: string, wistiki: string, subject: string (optional)}
 * @returns {Promise}
 */
function positionUpdateEmail(params) {
  debug('positionUpdateEmail', params);
  var emailFn = _jade2.default.compileFile(_path2.default.resolve(templates.email.position_update_template));
  var html = emailFn({
    MAIL_POSITION_UPDATE_BODY: _i18n2.default.__({
      phrase: 'MAIL_POSITION_UPDATE_BODY',
      locale: params.language
    }, '' + params.wistiki),
    MAIL_POSITION_UPDATE_CONTENT_1: _i18n2.default.__({
      phrase: 'MAIL_POSITION_UPDATE_CONTENT_1',
      locale: params.language
    }, '' + params.wistiki),
    MAIL_POSITION_UPDATE_CONTENT_2: _i18n2.default.__({
      phrase: 'MAIL_POSITION_UPDATE_CONTENT_2',
      locale: params.language
    }),
    MAIL_POSITION_UPDATE_CONTENT_3: _i18n2.default.__({
      phrase: 'MAIL_POSITION_UPDATE_CONTENT_3',
      locale: params.language
    }),
    MAIL_POSITION_UPDATE_CONTENT_4: _i18n2.default.__({
      phrase: 'MAIL_POSITION_UPDATE_CONTENT_4',
      locale: params.language
    }),
    LOSE_AND_RELAX: _i18n2.default.__({ phrase: 'LOSE_AND_RELAX', locale: params.language }),
    WISTIKI: _i18n2.default.__({ phrase: 'WISTIKI', locale: params.language })
  });
  var email = {
    from: 'L\'équipe Wistiki <notification@wistiki.com>',
    to: params.email,
    subject: _i18n2.default.__({
      phrase: 'MAIL_POSITION_UPDATE_SUBJECT',
      locale: params.language
    }, '' + params.wistiki),
    html: html
  };
  return new _promise2.default(function (resolve, reject) {
    transport.sendMail(email, function (err, info) {
      if (err) {
        reject(err);
      }
      resolve(info);
    });
  });
}

exports.default = {
  sendAccountConfirmationEmail: accountConfirmationEmail,
  sendPromoWistiKeys: promoWistiKeys,
  sendForgotPasswordEmail: forgotPasswordEmail,
  sendNewFriendEmail: newFriendEmail,
  sendFoundWistikiEmail: foundWistikiEmail,
  sendTutoEmail: tutoEmail,
  sendPositionUpdateEmail: positionUpdateEmail
};
//# sourceMappingURL=email.js.map
