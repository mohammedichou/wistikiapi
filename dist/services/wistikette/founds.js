'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _db = require('../../db');

var _index = require('feathers-errors/lib/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('darwin:services:wistikette:found');

/**
 * Service for Wistiki Founds
 * @type {{
 * find: (function(*, *)),
 * get: (function(*, *, *)),
 * create: (function(*, *, *)),
 * update: (function(*, *, *, *)),
 * patch: (function(*, *, *, *)),
 * remove: (function(*, *, *)),
 * setup: (function(*=, *))
 * }}
 */
var Service = {

	/**
  *
  * @param {integer} id
  * @param {object} data
  * @param {object} params
  * @param {function} callback
  */
	create: function create(data, params, callback) {
		debug(data);
		debug(params);
		//TODO: check model before going further
		return _db.Wistiki.findById(params.sn).then( // Check if wistiki exist
		function (wistikette) {
			if (!wistikette) return _promise2.default.reject(new _index2.default.NotFound('RESOURCE_NOT_FOUND', { errors: ['Wistikette ' + params.sn + ' not found'] }));
			return _promise2.default.resolve(wistikette);
		}).then( // Check msn cipher & find owner
		function (wistikette) {
			if (!wistikette.compareMsnCipher(data.msn_cipher)) return _promise2.default.reject(new _index2.default.BadRequest('REQUEST_AUTHENTICATION_FAILED', { errors: ['MSN Cipher mismatch'] }));

			return wistikette.getOwner().then(function (wistiketteOwners) {

				if (!wistiketteOwners || wistiketteOwners.length == 0) return _promise2.default.reject(new _index2.default.NotFound('OWNER_NOT_FOUND', { errors: ['Owner not found for Wistikette ' + wistikette.get('serial_number')] }));
				var wistiketteOwner = wistiketteOwners[0];
				debug('wistiketteOwner', wistiketteOwner.get({ plain: true }));
				if (params.user && wistiketteOwner.get('email') == params.user.get('email')) return _promise2.default.reject(new _index2.default.BadRequest('OPERATION_NOT_PERMITTED', { errors: ['Owner can\'t declare its Wistikette as found'] }));

				return _promise2.default.resolve({
					first_name: wistiketteOwner.get('first_name'),
					last_name: wistiketteOwner.get('last_name')[0],
					wistikette_serial_number: wistiketteOwner.get('wistiki_has_owner').wistiki_serial_number,
					wistikette_alias: wistiketteOwner.get('wistiki_has_owner').wistiki_alias,
					wistikette_picture: wistiketteOwner.get('wistiki_has_owner').wistiki_picture,
					wistikette_color: wistiketteOwner.get('wistiki_has_owner').color,
					wistikette_icon: wistiketteOwner.get('wistiki_has_owner').icon
				});
			});
		});
	},


	/**
  * TODO: Description
  * @param app
  * @param path
  */
	setup: function setup(app, path) {
		this.app = app;
		//Bind the apps service method to service to always look services up dynamically
		this.service = app.service.bind(app);
		this.filter(function (data, connection) {
			return false;
		});
		var h = function h(service) {
			return function (hook) {
				if (hook.type == 'before') {
					//console.time(`${hook.method}:${service}`);
				} else if (hook.type == 'after') {
					//console.timeEnd(`${hook.method}:${service}`);
				}
			};
		};
		this.before({
			all: h('wistikettes/founds')
		});
		this.after({
			all: h('wistikettes/founds')
		});
	}
};

exports.default = Service;
//# sourceMappingURL=founds.js.map
