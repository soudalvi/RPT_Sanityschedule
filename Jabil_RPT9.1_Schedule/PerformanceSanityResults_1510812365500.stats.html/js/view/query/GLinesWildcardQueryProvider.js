var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/GLinesAbstractWildcardQueryProvider", "view/query/queryUtil"], function (require, exports, GLinesAbstractWildcardQueryProvider_1, qu) {
    "use strict";
    ;
    var WildcardData = (function (_super) {
        __extends(WildcardData, _super);
        function WildcardData(queriesCount) {
            _super.call(this, queriesCount);
            this.dims = [0, 1];
            this.countersDimIndex = 1;
        }
        WildcardData.prototype.extractPoints = function (instances, values, interval, timeDomain, instanceNames) {
            var ret = [];
            for (var _i = 0, instances_1 = instances; _i < instances_1.length; _i++) {
                var instance = instances_1[_i];
                var instanceIndex = qu.arrayIndexOf(instanceNames, instance.name);
                var vindex = instance.index * this.queriesCount;
                var instanceValues = [];
                var _loop_1 = function(i) {
                    var bindex = vindex + i;
                    var counterValues = values.map(function (v) { return v[bindex]; });
                    instanceValues[i] = qu.toCoordinates(counterValues, interval, timeDomain);
                };
                for (var i = 0; i < this.queriesCount; i++) {
                    _loop_1(i);
                }
                ret[instanceIndex] = instanceValues;
            }
            return ret;
        };
        WildcardData.prototype.concatPoints = function (to, from) {
            qu.concatDeepCoordinates(to, from, 1);
        };
        return WildcardData;
    }(GLinesAbstractWildcardQueryProvider_1.GLinesWildcardData));
    var GLinesWildcardQueryProvider = (function (_super) {
        __extends(GLinesWildcardQueryProvider, _super);
        function GLinesWildcardQueryProvider(counterQuerySet, options) {
            _super.call(this, counterQuerySet, options, new WildcardData(counterQuerySet.counterQueries.length));
            this.countersDimIndex = 1;
            this.instancesDimIndex = 0;
            this.dimensions = [
                this.instances,
                this.createCountersDimension()
            ];
        }
        GLinesWildcardQueryProvider.prototype.createData = function () {
            return new WildcardData(this.counterQueries.length);
        };
        GLinesWildcardQueryProvider.prototype.getRequestUrl = function (sampleDomain, interval) {
            var url = _super.prototype.getRequestUrl.call(this, sampleDomain, interval);
            url += this.session.hostsRoot.getEnabledHostsQuery();
            return url;
        };
        return GLinesWildcardQueryProvider;
    }(GLinesAbstractWildcardQueryProvider_1.GLinesAbstractWildcardQueryProvider));
    exports.GLinesWildcardQueryProvider = GLinesWildcardQueryProvider;
});
