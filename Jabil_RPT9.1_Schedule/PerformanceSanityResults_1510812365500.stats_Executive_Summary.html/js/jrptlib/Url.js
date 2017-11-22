define(["require", "exports", "dojo/Deferred", "dojo/request"], function (require, exports, Deferred, request) {
    "use strict";
    var Url = (function () {
        function Url(url) {
            this.url = url;
        }
        Url.setOffline = function (offline_map_path, callback) {
            require(["dojo/fx", offline_map_path], function (fx, RequestMap) {
                var rm = new RequestMap();
                Url._offlineMap = rm.data();
                if (callback)
                    callback();
            });
        };
        Url.prototype._removeLastSegment = function (url) {
            var ret = "";
            var tmp = url.split('/');
            for (var i = 0; i < tmp.length - 1; i++) {
                ret += tmp[i];
                if (i < tmp.length - 2)
                    ret += "/";
            }
            return ret;
        };
        Url.prototype.removeLastSegment = function () {
            return this._removeLastSegment(this.url);
        };
        Url.prototype.checkForOfflineMode = function () {
            var tmp_url = this.url;
            if (Url._offlineMap) {
                var base_url = this._removeLastSegment(window.location.pathname);
                var idx = tmp_url.indexOf(base_url);
                if (idx != -1) {
                    tmp_url = tmp_url.substring(base_url.length, tmp_url.length);
                }
                tmp_url = tmp_url.replace(/\s/g, "%20");
                if (Url._offlineMap.hasOwnProperty(tmp_url)) {
                    tmp_url = Url._offlineMap[tmp_url];
                    return tmp_url;
                }
            }
            return this.url;
        };
        Url.prototype.get = function (p1, success, dataType, failed) {
            if (Url._offlineMap) {
                var nurl = this.checkForOfflineMode();
                require(["dojo/fx", nurl], function (fx, DataModule) {
                    var module = new DataModule();
                    success(module.data());
                });
                return null;
            }
            else {
                return $.get(this.url, p1, success, dataType);
            }
        };
        Url.prototype.getParameter = function (sParam) {
            var sURLVariables = this.url.split('&');
            for (var i = 0; i < sURLVariables.length; i++) {
                var sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] == sParam) {
                    return sParameterName[1];
                }
            }
            return null;
        };
        Url.prototype.request_get = function (options) {
            if (Url._offlineMap) {
                var nurl = this.checkForOfflineMode();
                var def = new Deferred();
                require(["dojo/fx", nurl], function (fx, DataModule) {
                    var module = new DataModule();
                    def.resolve(module.data());
                });
                return def.promise;
            }
            else {
                return request.get(this.url, options);
            }
        };
        Url.prototype.request_post = function (options) {
            if (Url._offlineMap) {
                var tmp = this.url;
                this.url = "P]" + this.url;
                var nurl = this.checkForOfflineMode();
                this.url = tmp;
                var def = new Deferred();
                require(["dojo/fx", nurl], function (fx, DataModule) {
                    var module = new DataModule();
                    def.resolve(module.data());
                });
                return def.promise;
            }
            else {
                return request.post(this.url, options);
            }
        };
        return Url;
    }());
    return Url;
});
