define(["require", "exports"], function (require, exports) {
    "use strict";
    var Evented = (function () {
        function Evented() {
        }
        Evented.prototype.on = function (eventName, listener) {
            var _this = this;
            if (this.listeners === undefined) {
                this.listeners = {};
            }
            var listeners = this.listeners[eventName];
            if (listeners === undefined) {
                listeners = [];
                this.listeners[eventName] = listeners;
                this.startMonitoring(eventName);
            }
            listeners.push(listener);
            return {
                remove: function () {
                    _this.removeListener(eventName, listener);
                }
            };
        };
        Evented.prototype.removeListener = function (eventName, listener) {
            var listeners = this.listeners[eventName];
            if (listeners === undefined)
                return;
            var idx = listeners.indexOf(listener);
            if (idx != -1)
                listeners.splice(idx, 1);
            if (listeners.length == 0) {
                this.stopMonitoring(eventName);
                this.listeners[eventName] = undefined;
            }
        };
        Evented.prototype.emit = function (eventName, data) {
            if (this.listeners === undefined)
                return;
            var listeners = this.listeners[eventName];
            if (listeners === undefined)
                return;
            for (var _i = 0, _a = listeners.slice(); _i < _a.length; _i++) {
                var l = _a[_i];
                l(data);
            }
        };
        Evented.prototype.hasListeners = function (eventName) {
            if (this.listeners === undefined)
                return false;
            var listeners = this.listeners[eventName];
            return listeners !== undefined && listeners.length != 0;
        };
        Evented.prototype.startMonitoring = function (eventName) {
        };
        Evented.prototype.stopMonitoring = function (eventName) {
        };
        return Evented;
    }());
    return Evented;
});
