var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/GLinesCompareQueryProvider", "view/query/queryUtil"], function (require, exports, GLinesCompareQueryProvider_1, qu) {
    "use strict";
    ;
    var SingleData = (function (_super) {
        __extends(SingleData, _super);
        function SingleData(queriesCount, sessionCount) {
            _super.call(this, sessionCount);
            this.queriesCount = queriesCount;
            this.counterValues = new Array(sessionCount);
        }
        SingleData.prototype.extractValues = function (values, groupIndex, interval, timeDomain, queriesCount) {
            var ret = new Array(queriesCount);
            var bindex = groupIndex * this.queriesCount;
            var _loop_1 = function(i) {
                var vindex = bindex + i;
                ret[i] = qu.toCoordinates(values.map(function (v) { return v[vindex]; }), interval, timeDomain);
            };
            for (var i = 0; i < queriesCount; i++) {
                _loop_1(i);
            }
            return ret;
        };
        SingleData.prototype.values = function (index) {
            var sidx = index[1];
            var cidx = index[0];
            var cvs = this.counterValues[sidx];
            if (cvs == undefined)
                return [];
            var v = cvs[cidx];
            if (v == undefined)
                return [];
            return v;
        };
        SingleData.prototype.domain = function (unit, indices) {
            var counterIndices = unit.counterIndices;
            var sessionIndices;
            if (indices) {
                counterIndices = unit.getCounterIndices(indices[0]);
                sessionIndices = indices[1];
            }
            return qu.uextent(unit, this.counterValues, 3, [undefined, counterIndices, sessionIndices], [qu.pointValue, undefined, undefined]);
        };
        SingleData.prototype.setData = function (response, startTime, sessionIndex) {
            var timeDomain = _super.prototype._setData.call(this, response, startTime, sessionIndex);
            var values = response.index !== undefined ? response.values : [];
            this.counterValues[sessionIndex] = this.extractValues(values, response.index, this._interval[sessionIndex], timeDomain, this.queriesCount);
        };
        SingleData.prototype.addData = function (response, startTime, sessionIndex) {
            var addedTimeDomain = _super.prototype._addData.call(this, response, startTime, sessionIndex);
            var values = response.index !== undefined ? response.values : [];
            var counterValues = this.extractValues(values, response.index, this._interval[sessionIndex], addedTimeDomain, this.queriesCount);
            for (var i = 0; i < this.counterValues[sessionIndex].length; i++) {
                qu.concatCoordinates(this.counterValues[sessionIndex][i], counterValues[i]);
            }
        };
        SingleData.prototype.reorderCounters = function (reordering) {
            for (var i = 0; i < this.counterValues.length; i++) {
                this.counterValues[i] = reordering.apply(this.counterValues[i], []);
            }
        };
        return SingleData;
    }(GLinesCompareQueryProvider_1.Data));
    var GLinesCompareSingleQueryProvider = (function (_super) {
        __extends(GLinesCompareSingleQueryProvider, _super);
        function GLinesCompareSingleQueryProvider(counterQuerySet, sessions, options) {
            _super.call(this, counterQuerySet, sessions, options, new SingleData(counterQuerySet.counterQueries.length, sessions.length));
            this.dimensions = [
                this.createCountersDimension(),
                this.sessions
            ];
        }
        GLinesCompareSingleQueryProvider.prototype.counterQuerySetChanged = function (reordering) {
            _super.prototype.counterQuerySetChanged.call(this, reordering);
            this._data.reorderCounters(reordering);
            if (this.localData)
                this.localData.reorderCounters(reordering);
            this.changed({
                unitsChanged: true,
                dimensionsChanged: [true, false]
            });
            if (reordering.hasAddedElements()) {
                this.update(true);
            }
        };
        GLinesCompareSingleQueryProvider.prototype.createData = function () {
            return new SingleData(this.counterQueries.length, this.sessions.size());
        };
        GLinesCompareSingleQueryProvider.prototype.processLocalData = function (data, response, startTime, sessionIndex) {
            data.setData(response, startTime, sessionIndex);
        };
        GLinesCompareSingleQueryProvider.prototype.processData = function (response, sessionIndex) {
            var wasEmpty = this._data.isEmpty();
            this._data.setData(response, this.getRunStartTime(), sessionIndex);
            return {
                domainChanged: true,
                xDomainChanged: true,
                dataChanged: true,
                dimensionsChanged: [],
                majorChange: wasEmpty
            };
        };
        GLinesCompareSingleQueryProvider.prototype.processIncrementalData = function (data, response, startTime, sessionIndex) {
            data.addData(response, startTime, sessionIndex);
            return {
                domainChanged: true,
                xDomainChanged: true,
                dimensionsChanged: [],
                dataChanged: true
            };
        };
        GLinesCompareSingleQueryProvider.prototype.dataDomain = function (unitIndex, indices) {
            var unit = this.units[unitIndex];
            if (this.localData)
                return this.localData.domain(unit, indices);
            return this._data.domain(unit, indices);
        };
        GLinesCompareSingleQueryProvider.prototype.dataUnit = function (index) {
            var cidx = index[0];
            return this.counterQueries[cidx].unitIndex;
        };
        GLinesCompareSingleQueryProvider.prototype.dataUnits = function (indices) {
            var counterIndices = indices[0];
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
        GLinesCompareSingleQueryProvider.prototype.dataText = function (data, index) {
            var cidx = index[0];
            return this.counterQueries[cidx].displayValue(data);
        };
        GLinesCompareSingleQueryProvider.prototype.getActions = function (index) {
            return this.getCounterActions(index[0]);
        };
        return GLinesCompareSingleQueryProvider;
    }(GLinesCompareQueryProvider_1.GLinesCompareQueryProvider));
    exports.GLinesCompareSingleQueryProvider = GLinesCompareSingleQueryProvider;
});
