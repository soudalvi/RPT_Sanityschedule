var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/GLinesAbstractSingleQueryProvider", "view/query/queryUtil"], function (require, exports, GLinesAbstractSingleQueryProvider_1, qu) {
    "use strict";
    ;
    var SingleData = (function (_super) {
        __extends(SingleData, _super);
        function SingleData(queriesCount) {
            _super.call(this, queriesCount);
            this.dims = [0];
            this.countersDimIndex = 0;
        }
        SingleData.prototype.extractPoints = function (values, groupIndex, interval, timeDomain) {
            var ret = new Array(this.queriesCount);
            var bindex = groupIndex * this.queriesCount;
            var _loop_1 = function(i) {
                var vindex = bindex + i;
                ret[i] = qu.toCoordinates(values.map(function (v) { return v[vindex]; }), interval, timeDomain);
            };
            for (var i = 0; i < this.queriesCount; i++) {
                _loop_1(i);
            }
            return ret;
        };
        SingleData.prototype.concatPoints = function (points, added) {
            qu.concatDeepCoordinates(points, added, 1);
        };
        return SingleData;
    }(GLinesAbstractSingleQueryProvider_1.GLinesSingleData));
    var GLinesSingleQueryProvider = (function (_super) {
        __extends(GLinesSingleQueryProvider, _super);
        function GLinesSingleQueryProvider(counterQuerySet, options) {
            _super.call(this, counterQuerySet, options, new SingleData(counterQuerySet.counterQueries.length));
            this.countersDimIndex = 0;
            this.dimensions = [
                this.createCountersDimension(),
            ];
        }
        GLinesSingleQueryProvider.prototype.getRequestUrl = function (sampleDomain, interval) {
            var url = _super.prototype.getRequestUrl.call(this, sampleDomain, interval);
            url += this.session.hostsRoot.getEnabledHostsQuery();
            return url;
        };
        GLinesSingleQueryProvider.prototype.createData = function () {
            return new SingleData(this.counterQueries.length);
        };
        return GLinesSingleQueryProvider;
    }(GLinesAbstractSingleQueryProvider_1.GLinesAbstractSingleQueryProvider));
    exports.GLinesSingleQueryProvider = GLinesSingleQueryProvider;
});
