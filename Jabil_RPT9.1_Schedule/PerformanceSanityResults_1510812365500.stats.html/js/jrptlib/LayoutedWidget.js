var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Widget"], function (require, exports, Widget) {
    "use strict";
    var LayoutedWidget = (function (_super) {
        __extends(LayoutedWidget, _super);
        function LayoutedWidget(container) {
            _super.call(this, container);
        }
        LayoutedWidget.prototype.hasContents = function () {
            if (this.contents)
                return true;
            return false;
        };
        LayoutedWidget.prototype.getContents = function () {
            if (this.contents)
                return this.contents;
            return this.getContainer();
        };
        LayoutedWidget.prototype.setContents = function (contents) {
            this.contents = contents;
        };
        LayoutedWidget.prototype.getLayoutData = function () {
            return this.layout_data;
        };
        LayoutedWidget.prototype.setLayoutData = function (data) {
            this.layout_data = data;
        };
        LayoutedWidget.prototype.setRatio = function (ratio) {
            this.ratio = ratio;
        };
        LayoutedWidget.prototype.getRatio = function () {
            return this.ratio;
        };
        LayoutedWidget.prototype.notifyResize = function () {
            var _this = this;
            setTimeout(function () {
                _this.resizeContents();
            }, 20);
        };
        LayoutedWidget.prototype.resizeContents = function () {
        };
        return LayoutedWidget;
    }(Widget));
    return LayoutedWidget;
});
