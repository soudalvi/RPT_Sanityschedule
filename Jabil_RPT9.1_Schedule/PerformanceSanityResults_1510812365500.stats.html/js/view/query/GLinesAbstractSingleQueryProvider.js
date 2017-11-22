var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/GLinesQueryProvider", "view/query/GLinesQueryProvider"], function (require, exports, GLinesQueryProvider_1, GLinesQueryProvider_2) {
    "use strict";
    var GLinesSingleData = (function (_super) {
        __extends(GLinesSingleData, _super);
        function GLinesSingleData(queriesCount) {
            _super.call(this);
            this.queriesCount = queriesCount;
        }
        GLinesSingleData.prototype.setData = function (response, startTime) {
            _super.prototype._setData.call(this, response, startTime);
            var values = response.index !== undefined ? response.values : [];
            this.points = this.extractPoints(values, response.index, this.interval, this._timeDomain);
        };
        GLinesSingleData.prototype.addData = function (response, startTime) {
            var addedTimeDomain = _super.prototype._addData.call(this, response, startTime);
            var values = response.index !== undefined ? response.values : [];
            var counterValues = this.extractPoints(values, response.index, this.interval, addedTimeDomain);
            this.concatPoints(this.points, counterValues);
        };
        return GLinesSingleData;
    }(GLinesQueryProvider_1.Data));
    exports.GLinesSingleData = GLinesSingleData;
    var GLinesAbstractSingleQueryProvider = (function (_super) {
        __extends(GLinesAbstractSingleQueryProvider, _super);
        function GLinesAbstractSingleQueryProvider() {
            _super.apply(this, arguments);
        }
        GLinesAbstractSingleQueryProvider.prototype.processLocalData = function (response, startTime) {
            var data = this.createData();
            data.setData(response, startTime);
            return data;
        };
        GLinesAbstractSingleQueryProvider.prototype.processData = function (response) {
            var wasEmpty = this._data.isEmpty();
            this._data.setData(response, this.getRunStartTime());
            return {
                domainChanged: true,
                xDomainChanged: true,
                dataChanged: true,
                dimensionsChanged: [],
                majorChange: wasEmpty
            };
        };
        GLinesAbstractSingleQueryProvider.prototype.processIncrementalData = function (data, response, startTime) {
            data.addData(response, startTime);
            return {
                domainChanged: true,
                xDomainChanged: true,
                dataChanged: true,
                dimensionsChanged: []
            };
        };
        GLinesAbstractSingleQueryProvider.prototype.getActions = function (index) {
            return this.getCounterActions(index[this.countersDimIndex]);
        };
        return GLinesAbstractSingleQueryProvider;
    }(GLinesQueryProvider_2.GLinesQueryProvider));
    exports.GLinesAbstractSingleQueryProvider = GLinesAbstractSingleQueryProvider;
});
