var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/GLinesCompareQueryProvider", "view/query/InstancesDimension", "view/query/queryUtil"], function (require, exports, GLinesCompareQueryProvider_1, InstancesDimension_1, qu) {
    "use strict";
    function getInstances(response) {
        var instances = response.groups ? response.groups[0].instances : [];
        return qu.flattenContentInstances(instances);
    }
    ;
    var WildcardData = (function (_super) {
        __extends(WildcardData, _super);
        function WildcardData(instanceCount, sessionCount) {
            _super.call(this, sessionCount);
            this.instanceCount = instanceCount;
            this.points = [];
        }
        WildcardData.prototype.extractPoints = function (instances, values, interval, timeDomain, instanceNames) {
            var ret = new Array(instances.length);
            var _loop_1 = function(instance) {
                instanceIndex = qu.arrayIndexOf(instanceNames, instance.name);
                var counterValues = values.map(function (v) { return v[instance.index]; });
                ret[instanceIndex] = qu.toCoordinates(counterValues, interval, timeDomain);
            };
            var instanceIndex;
            for (var _i = 0, instances_1 = instances; _i < instances_1.length; _i++) {
                var instance = instances_1[_i];
                _loop_1(instance);
            }
            return ret;
        };
        WildcardData.prototype.values = function (index) {
            var sidx = index[1];
            var cidx = index[0];
            var cvs = this.points[sidx];
            if (cvs === undefined)
                return [];
            var v = cvs[cidx];
            if (v == undefined)
                return [];
            return v;
        };
        WildcardData.prototype.domain = function (unit, indices) {
            var sessionIndices;
            var instanceIndices;
            if (indices) {
                instanceIndices = indices[0];
                sessionIndices = indices[1];
            }
            return qu.uextent(unit, this.points, 3, [undefined, instanceIndices, sessionIndices], [qu.pointValue, undefined, undefined]);
        };
        WildcardData.prototype.setData = function (response, instances, startTime, instanceNames, sessionIndex) {
            var timeDomain = _super.prototype._setData.call(this, response, startTime, sessionIndex);
            this.points[sessionIndex] = this.extractPoints(instances, response.values, this._interval[sessionIndex], timeDomain, instanceNames.items());
        };
        WildcardData.prototype.addData = function (response, instances, startTime, instanceNames, sessionIndex) {
            var addedTimeDomain = _super.prototype._addData.call(this, response, startTime, sessionIndex);
            var data_points = this.extractPoints(instances, response.values, this._interval[sessionIndex], addedTimeDomain, instanceNames.items());
            for (var valuesIndex = 0; valuesIndex < this.points[sessionIndex].length; valuesIndex++) {
                qu.concatCoordinates(this.points[sessionIndex][valuesIndex], data_points[valuesIndex]);
            }
            for (var x = valuesIndex; x < data_points.length; x++) {
                this.points[sessionIndex][x] = data_points[x];
            }
        };
        WildcardData.prototype.addInstance = function () {
            this.instanceCount++;
            for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
                var p = _a[_i];
                p.push([]);
            }
        };
        return WildcardData;
    }(GLinesCompareQueryProvider_1.Data));
    var GLinesCompareWildcardQueryProvider = (function (_super) {
        __extends(GLinesCompareWildcardQueryProvider, _super);
        function GLinesCompareWildcardQueryProvider(counterQuerySet, sessions, options) {
            _super.call(this, counterQuerySet, sessions, options, new WildcardData(0, sessions.length));
            if (this.counterQueries.length != 1)
                throw "Only one counter query allowed for counter queries with wildcards";
            this.instances = new InstancesDimension_1.InstancesDimension();
            this.dimensions = [
                this.instances,
                this.sessions
            ];
        }
        GLinesCompareWildcardQueryProvider.prototype.createData = function () {
            return new WildcardData(this.instances.size(), this.sessions.size());
        };
        GLinesCompareWildcardQueryProvider.prototype.processLocalData = function (data, response, startTime, sessionIndex) {
            var instances = getInstances(response);
            data.setData(response, instances, startTime, this.instances, sessionIndex);
        };
        GLinesCompareWildcardQueryProvider.prototype.processData = function (response, sessionIndex) {
            if (response === undefined)
                throw "Empty response received from server";
            var wasEmpty = this._data.isEmpty();
            var instances = getInstances(response);
            var instancesChanged = this.updateInstances(instances, sessionIndex);
            this._data.setData(response, instances, this.getRunStartTime(), this.instances, sessionIndex);
            if (instancesChanged) {
                this.updateLocalData();
            }
            return {
                dimensionsChanged: [instancesChanged],
                domainChanged: true,
                xDomainChanged: true,
                dataChanged: true,
                majorChange: wasEmpty
            };
        };
        GLinesCompareWildcardQueryProvider.prototype.processIncrementalData = function (data, response, startTime, sessionIndex) {
            var instances = getInstances(response);
            var instancesChanged = this.updateInstances(instances, sessionIndex);
            data.addData(response, instances, startTime, this.instances, sessionIndex);
            return {
                dimensionsChanged: [instancesChanged],
                domainChanged: true,
                xDomainChanged: true,
                dataChanged: true
            };
        };
        GLinesCompareWildcardQueryProvider.prototype.updateInstances = function (instances, sessionIndex) {
            var _this = this;
            return this.instances.feedValues(instances, {
                instanceAdded: function (instance) {
                    _this._data.addInstance();
                    if (_this.localData)
                        _this.localData.addInstance();
                },
                instanceModified: function (instanceIndex, instance) {
                }
            });
        };
        GLinesCompareWildcardQueryProvider.prototype.dataUnit = function (index) {
            return 0;
        };
        GLinesCompareWildcardQueryProvider.prototype.dataUnits = function (indices) {
            return [0];
        };
        GLinesCompareWildcardQueryProvider.prototype.dataText = function (data, index) {
            return this.counterQueries[0].displayValue(data);
        };
        GLinesCompareWildcardQueryProvider.prototype.getActions = function (index) {
            return this.getCounterActions(0, this.instances.items()[index[0]]);
        };
        return GLinesCompareWildcardQueryProvider;
    }(GLinesCompareQueryProvider_1.GLinesCompareQueryProvider));
    exports.GLinesCompareWildcardQueryProvider = GLinesCompareWildcardQueryProvider;
});
