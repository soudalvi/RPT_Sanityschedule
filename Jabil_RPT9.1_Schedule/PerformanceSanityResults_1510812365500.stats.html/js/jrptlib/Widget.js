var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented"], function (require, exports, Evented) {
    "use strict";
    var Widget = (function (_super) {
        __extends(Widget, _super);
        function Widget(container) {
            _super.call(this);
            this.container = container;
            if (!this.container)
                throw 'Element cannot be null';
            $(this.container).addClass("ui-widget");
            $(this.container).data("widget", this);
        }
        Widget.prototype.setClassName = function (name) {
            var classes = $(this.container).attr('class');
            classes = name + ' ' + classes;
            $(this.container).attr('class', classes);
            this.class_name = name;
        };
        Widget.prototype.getContainer = function () {
            return this.container;
        };
        Widget.prototype.setDisabled = function (disabled) {
            if (disabled)
                $(this.container).addClass("ui-state-disabled");
            else
                $(this.container).removeClass("ui-state-disabled");
        };
        Widget.prototype.isDisabled = function () {
            return $(this.container).hasClass("ui-state-disabled");
        };
        Widget.prototype.destroy = function () {
            if (this.class_name)
                $(this.container).removeClass(this.class_name);
            $(this.container).removeClass("ui-state-disabled");
            $(this.container).removeClass("ui-widget");
        };
        Widget.prototype.getH = function () {
            return $(this.container).height();
        };
        Widget.prototype.getW = function () {
            return $(this.container).width();
        };
        Widget.prototype.setW = function (w) {
            $(this.container).width(w);
        };
        Widget.prototype.setH = function (h) {
            $(this.container).height(h);
        };
        return Widget;
    }(Evented));
    return Widget;
});
