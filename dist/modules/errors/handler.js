/*
 * feathers-errors
 * https://github.com/feathersjs/feathers-errors
 *
 * Copyright (c) 2014 Eric Kryski
 * Licensed under the MIT license.
 */

'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _index = require('feathers-errors/lib/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');
var fs = require('fs');
var path = require('path');


var html = fs.readFileSync(path.resolve(__dirname, '..', '..', '..', 'static', 'html', 'error', 'error.html')).toString();
var environment = require('../../config');

var debug = require('debug')('darwin:errors:handler');
/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */
var escapeHTML = function escapeHTML(html) {
	return String(html).replace(/&(?!\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

/**
 * Method for a 404 middleware
 * See http://expressjs.com/guide.html#error-handling
 * @param  {Error} err - An error
 * @param  {Object} req - the request object
 * @param  {Object} res - the response object
 * @param  {Function} next - callback to call for next step in middleware chain
 */
var fourOhFour = function fourOhFour(req, res, next) {
	next(new _index2.default.NotFound('Page not found.'));
};

/**
 * The error handler middleware.
 * See http://expressjs.com/guide.html#error-handling
 * @param  {Error} err - An error
 * @param  {Object} req - the request object
 * @param  {Object} res - the response object
 * @param  {Function} next - callback to call for next step in middleware chain
 *
 */

/* jshint unused:false */
var handler = function handler(err, req, res, next) {
	if (typeof err === 'string') {
		err = new _index2.default.GeneralError(err);
	} else if (!(err.constructor.name != 'FeathersError')) {
		var oldError = err;
		err = new _index2.default.GeneralError(oldError.message);

		if (oldError.stack) {
			err.stack = oldError.stack;
		}
	}

	// Don't show stack trace if it is a 404 error
	if (err.code === 404) {
		err.stack = null;
	}

	var statusCode = typeof err.code === 'number' ? err.code : 500;

	res.status(statusCode);

	if (req.app.logger && typeof req.app.logger.error === 'function') {
		req.app.logger.error(err.code + ' - ' + req.url, err.stack || err);
	} else if (typeof req.app.error === 'function') {
		req.app.error(err.code + ' - ' + req.url, err.stack || err);
	}
	if (!environment.debug) err.stack = null;
	res.format({
		'text/html': function textHtml() {
			// If we have a rendering engine don't show the
			// default feathers error page.
			// TODO (EK): We should let people specify this instead
			// of making a shitty assumption.
			if (req.app.get('view engine') !== undefined) {
				if (err.code === 404) {
					return res.redirect('/404');
				}

				return res.redirect('/500');
			}

			var stack = (err.stack || '').split('\n').slice(1).map(function (v) {
				return '<li>' + v + '</li>';
			}).join('');

			var errorPage = html.replace('{stack}', stack).replace('{title}', err.message).replace('{statusCode}', err.code).replace(/\{error\}/g, escapeHTML(err.toString().replace(/\n/g, '<br/>')));
			debug('text/html error', errorPage);
			res.send(errorPage);
		},

		'application/json': function applicationJson() {
			var error = {
				'code': err.code,
				'name': err.name,
				'message': err.message,
				'errors': err.errors || {}
			};
			debug('application/json error', (0, _stringify2.default)(error, null, 2));
			res.json(error);
		},

		'text/plain': function textPlain() {
			debug('text/plain error', err.message);
			res.send(err.message);
		}
	});
};

exports = module.exports = function (config) {
	if (typeof config === 'function') {
		handler = config;
		config = {};
	}

	config = _.defaults({}, config, {
		handler: handler,
		fourOhFour: fourOhFour
	});

	return function () {
		var app = this;

		// Enable the errors Plugin
		app.enable('feathers errors');

		// Set the error handlers
		app.use(config.fourOhFour).use(config.handler);

		// Set the available errors on the app for convenience
		app.errors = _index2.default;
	};
};

exports.fourOhFour = fourOhFour;
exports.handler = handler;
exports.types = _index2.default;
//# sourceMappingURL=handler.js.map
