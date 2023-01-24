'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var events = {
	DEVICE_STATUS: 'deviceStatusEvent',
	WISTIKI_STATUS: 'wistikiStatusEvent'
};

var requests = {
	SET_WISTIKI_STATUS: 'setWistikiStatus',
	RING_WISTIKI: 'wistikiRingRequest',
	MUTE_WISTIKI: 'wistikiMuteRequest'
};

var deviceStatus = {
	ONLINE: 'ONLINE',
	OFFLINE: 'OFFLINE'
};

var wistikiBleStatus = {
	CONNECTED: 'CONNECTED',
	CONNECTING: 'CONNECTING',
	DISCONNECTED: 'DISCONNECTED'
};

var ringStatus = {
	RINGING: 'RINGING',
	RING_IN_PROGRESS: 'RING_IN_PROGRESS',
	NOT_RINGING: 'NOT_RINGING'
};
exports.Events = events;
exports.Requests = requests;
exports.DeviceStatus = deviceStatus;
exports.BleStatus = wistikiBleStatus;
exports.RingStatus = ringStatus;
//# sourceMappingURL=labels.js.map
