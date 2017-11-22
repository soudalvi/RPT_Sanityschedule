define(["require", "exports"], function (require, exports) {
    "use strict";
    var LineToXProvider = (function () {
        function LineToXProvider(provider) {
            this.provider = provider;
        }
        LineToXProvider.prototype.on = function (type, listener) {
            var _this = this;
            return this.provider.on("changed", function (event) { return _this.forwardEvent(event, listener); });
        };
        LineToXProvider.prototype.forwardEvent = function (event, listener) {
            if (event.xDomainChanged) {
                listener({
                    domainChanged: true,
                    majorChange: event.majorChange
                });
            }
        };
        LineToXProvider.prototype.unitCount = function () {
            return 1;
        };
        LineToXProvider.prototype.unitLabel = function (unitIndex) {
            return this.provider.xLabel();
        };
        LineToXProvider.prototype.unitDomain = function (unitIndex) {
            return this.provider.xDomain();
        };
        LineToXProvider.prototype.unitScale = function (unitIndex, domain) {
            return this.provider.xScale(domain);
        };
        LineToXProvider.prototype.dataValue = function (data) {
            return this.provider.dataValue(data);
        };
        return LineToXProvider;
    }());
    return LineToXProvider;
});
