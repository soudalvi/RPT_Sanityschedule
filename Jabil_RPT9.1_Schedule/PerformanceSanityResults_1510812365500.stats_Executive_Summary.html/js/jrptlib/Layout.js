var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented"], function (require, exports, Evented) {
    "use strict";
    var Layout = (function (_super) {
        __extends(Layout, _super);
        function Layout(layout_name) {
            _super.call(this);
            this.composite = null;
            this.layout_name = layout_name;
        }
        Layout.prototype.setComposite = function (composite) {
            this.composite = composite;
        };
        Layout.prototype.getComposite = function () {
            return this.composite;
        };
        Layout.prototype.getContainer = function () {
            return this.composite.getContents();
        };
        Layout.prototype.layout = function () {
            $(this.getContainer()).addClass(this.layout_name);
            var items = this.getComposite().getItems();
            for (var i = 0; i < items.length; i++) {
                $(items[i].getContainer()).addClass(this.layout_name + "-item");
            }
        };
        Layout.prototype.addItem = function (item) {
            $(item.getContainer()).addClass(this.layout_name + "-item");
        };
        Layout.prototype.removeItem = function (item) {
            $(item.getContainer()).removeClass(this.layout_name + "-item");
        };
        Layout.prototype.setItemVisible = function (item, visible) {
            var c = $(item.getContainer());
            if (visible)
                c.show();
            else
                c.hide();
        };
        Layout.prototype.resizeContents = function () {
        };
        Layout.prototype.unlayout = function () {
            var items = this.getComposite().getItems();
            for (var i = 0; i < items.length; i++) {
                $(items[i].getContainer()).removeClass(this.layout_name + "-item");
            }
            $(this.getContainer()).removeClass(this.layout_name);
        };
        return Layout;
    }(Evented));
    return Layout;
});
