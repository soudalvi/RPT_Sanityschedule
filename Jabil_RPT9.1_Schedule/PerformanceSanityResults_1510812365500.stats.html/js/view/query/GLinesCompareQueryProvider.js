var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented", "model/counters/CounterUnit", "view/query/GMatrixQueryProvider", "view/util/GFixedLinesProvider", "view/query/SessionsDimension", "view/query/queryUtil"], function (require, exports, Evented, CounterUnit_1, GMatrixQueryProvider, GFixedLinesProvider_1, SessionsDimension, qu) {
    "use strict";
    var Data = (function (_super) {
        __extends(Data, _super);
        function Data(sessionCount) {
            _super.call(this);
            this.sessionCount = sessionCount;
            this._timeDomain = qu.sameElementArray(sessionCount, [0, 0]);
            this._mutable = new Array(sessionCount);
            this._interval = new Array(sessionCount);
        }
        Data.prototype.timeDomain = function () {
            var domain = this._timeDomain[0].slice();
            for (var i = 1; i < this.sessionCount; i++) {
                var d = this._timeDomain[i];
                if (d[0] < domain[0])
                    domain[0] = d[0];
                if (d[1] > domain[1])
                    domain[1] = d[1];
            }
            return domain;
        };
        Data.prototype.interval = function (sessionIndex) {
            return this._interval[sessionIndex];
        };
        Data.prototype.firstMutableTime = function (sessionIndex) {
            return this._timeDomain[sessionIndex][1] - this._mutable[sessionIndex];
        };
        Data.prototype.dataPoints = function (sessionIndex) {
            var td = this._timeDomain[sessionIndex];
            return (td[1] - td[0]) / this._interval[sessionIndex];
        };
        Data.prototype.isEmpty = function () {
            for (var _i = 0, _a = this._interval; _i < _a.length; _i++) {
                var int = _a[_i];
                if (int)
                    return false;
            }
            return true;
        };
        Data.prototype.checkResponse = function (response) {
            if (response === undefined)
                throw "Empty response received from server";
            if (response.interval === undefined ||
                response.size === undefined)
                throw "Unexpected response from server";
        };
        Data.prototype._setData = function (response, startTime, sessionIndex) {
            this.checkResponse(response);
            var interval = response.interval / 1000;
            var timeDomain = [startTime, startTime + response.size * interval];
            this._interval[sessionIndex] = interval;
            this._timeDomain[sessionIndex] = timeDomain;
            this._mutable[sessionIndex] = response.mutable !== undefined ? response.mutable * interval : 0;
            return timeDomain;
        };
        Data.prototype._addData = function (response, startTime, sessionIndex) {
            this.checkResponse(response);
            var interval = response.interval / 1000;
            var addedTimeDomain = [startTime, startTime + response.size * interval];
            if (this._interval[sessionIndex] != interval)
                throw "Interval mismatch";
            this._timeDomain[sessionIndex][1] = addedTimeDomain[1];
            this._mutable[sessionIndex] = response.mutable !== undefined ? response.mutable * interval : 0;
            return addedTimeDomain;
        };
        return Data;
    }(Evented));
    exports.Data = Data;
    var GLinesCompareQueryProvider = (function (_super) {
        __extends(GLinesCompareQueryProvider, _super);
        function GLinesCompareQueryProvider(counterQuerySet, sessions, options, data) {
            _super.call(this, counterQuerySet);
            this.points = 200;
            this.scaleOnZoomedData = options.scaleOnZoomedData == true;
            if (options.absoluteTime)
                this.xScale = this.timeScale;
            this.sessions = new SessionsDimension(sessions);
            this._data = data;
        }
        GLinesCompareQueryProvider.prototype.getOneRequestUrl = function (session, sampleDomain, interval) {
            var ret = session.getBaseRequestUrl() + "/qcontent?" + this.counterQuerySet.getUrlParameter();
            if (interval) {
                ret += "&interval=" + interval;
            }
            else {
                ret += "&points=" + this.points;
            }
            if (!sampleDomain) {
                sampleDomain = session.getRunRangeInSamples();
            }
            if (sampleDomain[0] === undefined)
                sampleDomain[0] = 0;
            ret += "&from=" + sampleDomain[0];
            if (sampleDomain[1] !== undefined) {
                ret += "&to=" + sampleDomain[1];
            }
            return ret;
        };
        GLinesCompareQueryProvider.prototype.getRequestUrl = function (sampleDomain) {
            var urls = [];
            urls.push(this.getOneRequestUrl(this.session, sampleDomain));
            for (var _i = 0, _a = this.session.getSelectedSessions(); _i < _a.length; _i++) {
                var session = _a[_i];
                urls.push(this.getOneRequestUrl(session, sampleDomain));
            }
            return urls;
        };
        GLinesCompareQueryProvider.prototype.getRunStartTime = function () {
            var runRange = this.session.getRunRangeInSamples();
            if (runRange[0] !== undefined)
                return runRange[0] * this.session.getSampleInterval() / 1000;
            return 0;
        };
        GLinesCompareQueryProvider.prototype.addData = function (data, response, startTime, sessionIndex) {
            var event = this.processIncrementalData(data, response, startTime, sessionIndex);
            if (event)
                this.changed(event);
        };
        GLinesCompareQueryProvider.prototype.timerExpired = function (sessionIndex, nb) {
            var _this = this;
            if (this.isOn == true) {
                var url = void 0;
                var startTime_1;
                var session = this.sessions.items()[sessionIndex];
                if (this._data.dataPoints(sessionIndex) < this.points * 2 + 10) {
                    startTime_1 = this._data.firstMutableTime(sessionIndex);
                    var interval = session.getSampleInterval();
                    var startSample = Math.floor(startTime_1 * 1000 / interval);
                    var endSample = session.getRunRangeInSamples()[1];
                    url = this.getOneRequestUrl(session, [startSample, endSample], this._data.interval(sessionIndex) * 1000);
                }
                else {
                    url = this.getOneRequestUrl(session);
                }
                this.request(url, undefined, sessionIndex).then(function (response) {
                    if (response.size > 0) {
                        if (startTime_1) {
                            _this.addData(_this._data, response, startTime_1, sessionIndex);
                        }
                        else {
                            _this.setData(response, true, sessionIndex);
                        }
                    }
                    if (response.live == true && nb >= _this._nbUpdate) {
                        d3.timer(function () { return _this.timerExpired(sessionIndex, nb); }, 5000);
                    }
                }, function (error) {
                    console.log(error);
                });
            }
            return true;
        };
        GLinesCompareQueryProvider.prototype.setXDomain = function (domain) {
            var globalDomain = this._data.timeDomain();
            if (domain && domain[0] == globalDomain[0] && domain[1] == globalDomain[1]) {
                domain = null;
            }
            if (this.requestedTimeDomain == domain)
                return;
            this.requestedTimeDomain = domain;
            var event = {
                dimensionsChanged: [],
                xDomainChanged: true,
                variableDomainChanged: true
            };
            if (this.localData) {
                this.unsetLocalData();
                event.dataChanged = true;
                event.domainChanged = true;
            }
            this.changed(event);
            this.updateLocalData();
        };
        GLinesCompareQueryProvider.prototype.getXDomain = function () {
            return this.requestedTimeDomain;
        };
        GLinesCompareQueryProvider.prototype._updateOneLocalData = function (session, sessionIndex, timeDomain) {
            var _this = this;
            var interval = session.getSampleInterval();
            var domain = [];
            domain[0] = Math.floor(timeDomain[0] * 1000 / interval);
            domain[1] = Math.ceil(timeDomain[1] * 1000 / interval);
            var url = this.getOneRequestUrl(session, domain);
            this.request(url, undefined, sessionIndex).then(function (response) {
                _this.setLocalData(response, domain[0] * interval / 1000, sessionIndex);
                _this.changed({
                    dimensionsChanged: [],
                    dataChanged: true,
                    domainChanged: true,
                    xDomainChanged: true,
                    variableDomainChanged: true
                });
            });
        };
        GLinesCompareQueryProvider.prototype.updateLocalData = function () {
            if (!this.requestedTimeDomain)
                return;
            this._updateOneLocalData(this.session, 0, this.requestedTimeDomain);
            var sessions = this.session.getSelectedSessions();
            for (var i = 0; i < sessions.length; i++) {
                this._updateOneLocalData(sessions[i], i + 1, this.requestedTimeDomain);
            }
        };
        GLinesCompareQueryProvider.prototype.setLocalData = function (response, startTime, sessionIndex) {
            if (!this.localData)
                this.localData = this.createData();
            this.processLocalData(this.localData, response, startTime, sessionIndex);
        };
        GLinesCompareQueryProvider.prototype.unsetLocalData = function () {
            this.localData = undefined;
        };
        GLinesCompareQueryProvider.prototype.data = function (index) {
            if (this.localData)
                return this.localData.values(index);
            return this._data.values(index);
        };
        GLinesCompareQueryProvider.prototype.dataValue = function (data) {
            return data;
        };
        GLinesCompareQueryProvider.prototype.unitDomain = function (unitIndex) {
            var unit = this.units[unitIndex];
            if (this.localData && this.scaleOnZoomedData)
                return this.localData.domain(unit);
            return this._data.domain(unit);
        };
        GLinesCompareQueryProvider.prototype.xDomain = function () {
            if (this.requestedTimeDomain) {
                return this.requestedTimeDomain;
            }
            return this._data.timeDomain();
        };
        GLinesCompareQueryProvider.prototype.xLabel = function () {
            return CounterUnit_1.CounterUnit.SECONDS.label;
        };
        GLinesCompareQueryProvider.prototype.xScale = function (domain) {
            return qu.valueScale(CounterUnit_1.CounterUnit.SECONDS.scaleFactor(domain), domain);
        };
        GLinesCompareQueryProvider.prototype.timeScale = function (domain) {
            return qu.timeScale(this.session.getStartTime(), domain);
        };
        GLinesCompareQueryProvider.prototype.dataDomain = function (unitIndex, indices) {
            var unit = this.units[unitIndex];
            if (this.localData && this.scaleOnZoomedData)
                return this.localData.domain(unit, indices);
            return this._data.domain(unit, indices);
        };
        GLinesCompareQueryProvider.prototype.getFixedProvider = function () {
            return new GFixedLinesProvider_1.GFixedLinesProvider(this);
        };
        return GLinesCompareQueryProvider;
    }(GMatrixQueryProvider));
    exports.GLinesCompareQueryProvider = GLinesCompareQueryProvider;
});
