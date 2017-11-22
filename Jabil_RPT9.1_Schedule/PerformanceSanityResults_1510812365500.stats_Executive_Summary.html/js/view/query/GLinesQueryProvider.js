var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented", "model/counters/CounterUnit", "view/query/GMatrixQueryProvider", "view/util/GFixedLinesProvider", "view/query/queryUtil"], function (require, exports, Evented, CounterUnit_1, GMatrixQueryProvider, GFixedLinesProvider_1, qu) {
    "use strict";
    var Data = (function (_super) {
        __extends(Data, _super);
        function Data() {
            _super.call(this);
            this._timeDomain = [0, 0];
        }
        Data.prototype.timeDomain = function () {
            return this._timeDomain;
        };
        Data.prototype.firstMutableTime = function () {
            return this._timeDomain[1] - this._mutable;
        };
        Data.prototype.dataPoints = function () {
            return (this._timeDomain[1] - this._timeDomain[0]) / this.interval;
        };
        Data.prototype.isEmpty = function () {
            return this.interval === undefined;
        };
        Data.prototype.checkResponse = function (response) {
            if (response === undefined)
                throw "Empty response received from server";
            if (response.interval === undefined ||
                response.size === undefined)
                throw "Unexpected response from server";
        };
        Data.prototype._setData = function (response, startTime) {
            this.checkResponse(response);
            this.interval = response.interval / 1000;
            this._timeDomain = [startTime, startTime + response.size * this.interval];
            this._mutable = response.mutable !== undefined ? response.mutable * this.interval : 0;
        };
        Data.prototype._addData = function (response, startTime) {
            this.checkResponse(response);
            var interval = response.interval / 1000;
            var addedTimeDomain = [startTime, startTime + response.size * interval];
            if (this.interval != interval)
                throw "Interval mismatch";
            this._timeDomain[1] = addedTimeDomain[1];
            this._mutable = response.mutable !== undefined ? response.mutable * interval : 0;
            return addedTimeDomain;
        };
        Data.prototype.values = function (index) {
            if (!this.points)
                return [];
            var v = this.points;
            for (var _i = 0, _a = this.dims; _i < _a.length; _i++) {
                var dim = _a[_i];
                v = v[index[dim]];
                if (v === undefined || v === null)
                    return [];
            }
            return v;
        };
        Data.prototype.domain = function (unit, indices) {
            if (!this.points)
                return unit.defaultRange();
            if (indices === undefined) {
                var filter_1 = [];
                filter_1[this.dims.length - this.dims[this.countersDimIndex]] = unit.counterIndices;
                return qu.uextent(unit, this.points, this.dims.length + 1, filter_1, [qu.pointValue]);
            }
            var filter = [];
            for (var i = 0; i < this.dims.length; i++) {
                var f = indices[i];
                if (i == this.countersDimIndex)
                    f = unit.getCounterIndices(f);
                filter[this.dims.length - this.dims[i]] = f;
            }
            return qu.uextent(unit, this.points, this.dims.length + 1, filter, [qu.pointValue]);
        };
        Data.prototype.reorderCounters = function (reordering) {
            if (this.points)
                this.points = reordering.applyDeep(this.points, this.countersDimIndex, null);
        };
        return Data;
    }(Evented));
    exports.Data = Data;
    var GLinesQueryProvider = (function (_super) {
        __extends(GLinesQueryProvider, _super);
        function GLinesQueryProvider(counterQuerySet, options, data) {
            _super.call(this, counterQuerySet);
            this.points = 200;
            this.scaleOnZoomedData = options.scaleOnZoomedData == true;
            if (options.absoluteTime)
                this.xScale = this.timeScale;
            this._data = data;
        }
        GLinesQueryProvider.prototype.counterQuerySetChanged = function (reordering) {
            _super.prototype.counterQuerySetChanged.call(this, reordering);
            this._data.reorderCounters(reordering);
            if (this.localData)
                this.localData.reorderCounters(reordering);
            var event = {
                unitsChanged: true,
                dimensionsChanged: []
            };
            event.dimensionsChanged[this.countersDimIndex] = true;
            this.changed(event);
            if (reordering.hasAddedElements()) {
                this.update(true);
            }
        };
        GLinesQueryProvider.prototype.getRequestUrl = function (sampleDomain, interval) {
            var ret = this.getSessionFullPath() + "/qcontent?";
            ret += this.counterQuerySet.getUrlParameter();
            if (interval) {
                ret += "&interval=" + interval;
            }
            else {
                ret += "&points=" + this.points;
            }
            if (!sampleDomain) {
                sampleDomain = this.session.getRunRangeInSamples();
            }
            if (sampleDomain[0] === undefined)
                sampleDomain[0] = 0;
            ret += "&from=" + sampleDomain[0];
            if (sampleDomain[1] !== undefined) {
                ret += "&to=" + sampleDomain[1];
            }
            return ret;
        };
        GLinesQueryProvider.prototype.getRunStartTime = function () {
            var runRange = this.session.getRunRangeInSamples();
            if (runRange[0] !== undefined)
                return runRange[0] * this.session.getSampleInterval() / 1000;
            return 0;
        };
        GLinesQueryProvider.prototype.addData = function (data, response, startTime) {
            var event = this.processIncrementalData(data, response, startTime);
            if (event)
                this.changed(event);
        };
        GLinesQueryProvider.prototype.timerExpired = function (sessionIndex, nb) {
            var _this = this;
            if (this.isOn == true) {
                var url = void 0;
                var startTime_1;
                if (this._data.dataPoints() < this.points * 2 + 10) {
                    startTime_1 = this._data.firstMutableTime();
                    var interval = this.session.getSampleInterval();
                    var startSample = Math.floor(startTime_1 * 1000 / interval);
                    var endSample = this.session.getRunRangeInSamples()[1];
                    url = this.getRequestUrl([startSample, endSample], this._data.interval * 1000);
                    startTime_1 = startSample * interval / 1000;
                }
                else {
                    url = this.getRequestUrl();
                }
                this.request(url, this.getPostData(), 0).then(function (response) {
                    if (response.size > 0) {
                        if (startTime_1) {
                            _this.addData(_this._data, response, startTime_1);
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
        GLinesQueryProvider.prototype.setXDomain = function (domain) {
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
        GLinesQueryProvider.prototype.getXDomain = function () {
            return this.requestedTimeDomain;
        };
        GLinesQueryProvider.prototype.updateLocalData = function () {
            var _this = this;
            if (!this.requestedTimeDomain)
                return;
            var domain = [];
            var interval = this.session.getSampleInterval();
            domain[0] = Math.floor(this.requestedTimeDomain[0] * 1000 / interval);
            domain[1] = Math.ceil(this.requestedTimeDomain[1] * 1000 / interval);
            var localUrl = this.getRequestUrl(domain);
            this.request(localUrl, undefined, 0).then(function (response) {
                _this.setLocalData(response, domain[0] * interval / 1000);
                _this.changed({
                    dimensionsChanged: [],
                    dataChanged: true,
                    domainChanged: true,
                    variableDomainChanged: true
                });
            });
        };
        GLinesQueryProvider.prototype.setLocalData = function (response, startTime) {
            this.localData = this.processLocalData(response, startTime);
        };
        GLinesQueryProvider.prototype.unsetLocalData = function () {
            this.localData = undefined;
        };
        GLinesQueryProvider.prototype.data = function (index) {
            if (this.localData)
                return this.localData.values(index);
            return this._data.values(index);
        };
        GLinesQueryProvider.prototype.dataValue = function (data) {
            return data;
        };
        GLinesQueryProvider.prototype.unitDomain = function (unitIndex) {
            var unit = this.units[unitIndex];
            if (this.localData && this.scaleOnZoomedData)
                return this.localData.domain(unit);
            return this._data.domain(unit);
        };
        GLinesQueryProvider.prototype.xDomain = function () {
            if (this.requestedTimeDomain) {
                return this.requestedTimeDomain;
            }
            return this._data.timeDomain();
        };
        GLinesQueryProvider.prototype.xLabel = function () {
            return CounterUnit_1.CounterUnit.SECONDS.label;
        };
        GLinesQueryProvider.prototype.xScale = function (domain) {
            return qu.valueScale(CounterUnit_1.CounterUnit.SECONDS.scaleFactor(domain), domain);
        };
        GLinesQueryProvider.prototype.timeScale = function (domain) {
            return qu.timeScale(this.session.getStartTime(), domain);
        };
        GLinesQueryProvider.prototype.dataDomain = function (unitIndex, indices) {
            var unit = this.units[unitIndex];
            if (this.localData && this.scaleOnZoomedData)
                return this.localData.domain(unit, indices);
            return this._data.domain(unit, indices);
        };
        GLinesQueryProvider.prototype.dataUnit = function (index) {
            return this.counterQueries[index[this.countersDimIndex]].unitIndex;
        };
        GLinesQueryProvider.prototype.dataUnits = function (indices) {
            var counterIndices = indices[this.countersDimIndex];
            if (!counterIndices)
                return undefined;
            var ret = [];
            for (var _i = 0, counterIndices_1 = counterIndices; _i < counterIndices_1.length; _i++) {
                var i = counterIndices_1[_i];
                var u = this.counterQueries[i].unitIndex;
                if (ret.indexOf(u) == -1)
                    ret.push(u);
            }
            return ret;
        };
        GLinesQueryProvider.prototype.dataText = function (data, index) {
            return this.counterQueries[index[this.countersDimIndex]].displayValue(data);
        };
        GLinesQueryProvider.prototype.getFixedProvider = function () {
            return new GFixedLinesProvider_1.GFixedLinesProvider(this);
        };
        return GLinesQueryProvider;
    }(GMatrixQueryProvider));
    exports.GLinesQueryProvider = GLinesQueryProvider;
});
