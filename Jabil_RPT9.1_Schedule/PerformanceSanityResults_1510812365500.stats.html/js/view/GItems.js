define(["require", "exports"], function (require, exports) {
    "use strict";
    var GItems = (function () {
        function GItems(provider) {
            this.provider = provider;
        }
        GItems.prototype.renderContents = function (parentDiv, w, h) {
            var _this = this;
            this.tableRow = parentDiv.append("table")
                .classed("status", true)
                .append("tr");
            this.displayData();
            this.provider.on("changed", function (event) { return _this.processChange(event); });
        };
        GItems.prototype.processChange = function (event) {
            if (event.itemsChanged)
                this.displayData();
        };
        GItems.prototype.displayData = function () {
            var _this = this;
            var sel = this.tableRow.selectAll("td")
                .data(this.provider.items());
            sel.enter().append("td");
            sel.exit().remove();
            sel.classed("green", function (d) { return _this.provider.isActive(d); })
                .classed("red", function (d) { return _this.provider.isError(d); })
                .text(function (d) { return _this.provider.getLabel(d); });
        };
        return GItems;
    }());
    return GItems;
});
