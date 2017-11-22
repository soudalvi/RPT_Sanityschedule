var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented", "dojo/Deferred", "dojo/json", "jrptlib/Url"], function (require, exports, Evented, Deferred, json, Url) {
    "use strict";
    var GRequestProvider = (function (_super) {
        __extends(GRequestProvider, _super);
        function GRequestProvider() {
            _super.call(this);
            this.requestsPending = 0;
            this.dataPromise = new Deferred();
            this.isOn = false;
            this.currentRequest = new Array();
            this._nbUpdate = 0;
        }
        GRequestProvider.prototype.getDataPromise = function () {
            return this.dataPromise.promise;
        };
        GRequestProvider.prototype.incrementRequests = function (inc) {
            this.requestsPending += inc;
            this.emit("requestsPending");
        };
        GRequestProvider.prototype._requestOneUrl = function (url, postData, idx, notify, nb) {
            var _this = this;
            this.request(url, postData, idx).then(function (response) {
                _this.currentRequest[idx] = undefined;
                _this.setData(response, notify, idx);
                response.sessionObject = _this;
                if (!notify)
                    _this.dataPromise.resolve(response);
                if (_this.isOn && response.live == true && nb >= _this._nbUpdate) {
                    d3.timer(function () { return _this.timerExpired(idx, nb); }, 5000);
                }
            }, function (error) {
                console.log(error);
            });
        };
        GRequestProvider.prototype.isRequestPending = function () {
            return this.requestsPending > 0;
        };
        GRequestProvider.prototype.update = function (notify) {
            this._update(notify, ++this._nbUpdate);
        };
        GRequestProvider.prototype._update = function (notify, nb) {
            var url = this.getRequestUrl();
            var data = this.getPostData();
            if (Array.isArray(url)) {
                for (var i = 0; i < url.length; i++) {
                    this._requestOneUrl(url[i], data, i, notify, nb);
                }
            }
            else {
                this._requestOneUrl(url, data, 0, notify, nb);
            }
        };
        GRequestProvider.prototype.timerExpired = function (idx, nb) {
            if (this.isOn == true) {
                this._update(true, nb);
            }
            return true;
        };
        GRequestProvider.prototype.request = function (url, postData, idx) {
            var _this = this;
            this.incrementRequests(1);
            if (idx >= this.currentRequest.length) {
                for (var i = 0; (idx - this.currentRequest.length) + 1; i++)
                    this.currentRequest.push(null);
            }
            if (this.currentRequest[idx]) {
                this.currentRequest[idx].cancel(null, false);
            }
            var nurl = new Url(url);
            var ret;
            if (postData) {
                ret = nurl.request_post({
                    data: json.stringify(postData),
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        "Accept": "application/json"
                    },
                    handleAs: "json"
                });
            }
            else {
                ret = nurl.request_get({
                    handleAs: "json",
                    headers: { "Accept": "application/json" }
                });
            }
            var dec = function () { return _this.incrementRequests(-1); };
            ret.then(dec, dec);
            return this.currentRequest[idx] = ret;
        };
        GRequestProvider.prototype.setOn = function () {
            this.isOn = true;
        };
        GRequestProvider.prototype.setOff = function () {
            this.isOn = false;
        };
        return GRequestProvider;
    }(Evented));
    return GRequestProvider;
});
