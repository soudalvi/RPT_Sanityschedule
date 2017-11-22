var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/InstancesDimension", "view/query/GLinesQueryProvider", "view/query/queryUtil"], function (require, exports, InstancesDimension_1, GLinesQueryProvider_1, qu) {
    "use strict";
    var GLinesWildcardData = (function (_super) {
        __extends(GLinesWildcardData, _super);
        function GLinesWildcardData(queriesCount) {
            _super.call(this);
            this.queriesCount = queriesCount;
        }
        GLinesWildcardData.prototype.setData = function (response, instances, startTime, instanceNames) {
            _super.prototype._setData.call(this, response, startTime);
            this.points = this.extractPoints(instances, response.values, this.interval, this._timeDomain, instanceNames.items());
        };
        GLinesWildcardData.prototype.addData = function (response, instances, startTime, instanceNames) {
            var addedTimeDomain = _super.prototype._addData.call(this, response, startTime);
            var points = this.extractPoints(instances, response.values, this.interval, addedTimeDomain, instanceNames.items());
            for (var instanceIndex = 0; instanceIndex < this.points.length; instanceIndex++) {
                var to = this.points[instanceIndex];
                var from = points[instanceIndex];
                if (!to) {
                    this.points[instanceIndex] = from;
                }
                else if (from) {
                    this.concatPoints(to, from);
                }
            }
            for (var x = instanceIndex; x < points.length; x++) {
                this.points[x] = points[x];
            }
        };
        GLinesWildcardData.prototype.addInstance = function () {
            if (this.points)
                this.points.push([]);
        };
        GLinesWildcardData.prototype.removeInstance = function (i) {
            if (this.points)
                this.points.splice(i, 1);
        };
        return GLinesWildcardData;
    }(GLinesQueryProvider_1.Data));
    exports.GLinesWildcardData = GLinesWildcardData;
    function getInstances(response) {
        var instances = response.groups ? response.groups[0].instances : [];
        return qu.flattenContentInstances(instances);
    }
    var GLinesAbstractWildcardQueryProvider = (function (_super) {
        __extends(GLinesAbstractWildcardQueryProvider, _super);
        function GLinesAbstractWildcardQueryProvider(counterQuerySet, options, data) {
            _super.call(this, counterQuerySet, options, data);
            this.instances = new InstancesDimension_1.InstancesDimension();
        }
        GLinesAbstractWildcardQueryProvider.prototype.processData = function (response) {
            if (response === undefined)
                throw "Empty response received from server";
            var wasEmpty = this._data.isEmpty();
            var instances = getInstances(response);
            var instancesChanged = this.updateInstances(instances);
            this._data.setData(response, instances, this.getRunStartTime(), this.instances);
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
        GLinesAbstractWildcardQueryProvider.prototype.processIncrementalData = function (data, response, startTime) {
            var instances = getInstances(response);
            var instancesChanged = this.updateInstances(instances);
            data.addData(response, instances, startTime, this.instances);
            return {
                dimensionsChanged: [instancesChanged],
                domainChanged: true,
                xDomainChanged: true,
                dataChanged: true
            };
        };
        GLinesAbstractWildcardQueryProvider.prototype.updateInstances = function (instances) {
            var _this = this;
            return this.instances.feedValues(instances, {
                instanceRemoved: function (instanceIndex) {
                    _this._data.removeInstance(instanceIndex);
                    if (_this.localData)
                        _this.localData.removeInstance(instanceIndex);
                },
                instanceAdded: function (instance) {
                    _this._data.addInstance();
                    if (_this.localData)
                        _this.localData.addInstance();
                },
                instanceModified: function (instanceIndex, instance) {
                }
            });
        };
        GLinesAbstractWildcardQueryProvider.prototype.processLocalData = function (response, startTime) {
            var instances = getInstances(response);
            var data = this.createData();
            data.setData(response, instances, startTime, this.instances);
            return data;
        };
        GLinesAbstractWildcardQueryProvider.prototype.getActions = function (index) {
            return this.getCounterActions(0, this.instances.items()[index[this.instancesDimIndex]]);
        };
        return GLinesAbstractWildcardQueryProvider;
    }(GLinesQueryProvider_1.GLinesQueryProvider));
    exports.GLinesAbstractWildcardQueryProvider = GLinesAbstractWildcardQueryProvider;
});
