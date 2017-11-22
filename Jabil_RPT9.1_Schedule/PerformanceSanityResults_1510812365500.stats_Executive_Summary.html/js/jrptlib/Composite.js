var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/LayoutedWidget"], function (require, exports, LayoutedWidget) {
    "use strict";
    var Composite = (function (_super) {
        __extends(Composite, _super);
        function Composite(container) {
            _super.call(this, container);
            this.items = new Array();
        }
        Composite.prototype.getItems = function () {
            return this.items;
        };
        Composite.prototype.addItem = function (item) {
            this.items.push(item);
            if (this.layout)
                this.layout.addItem(item);
        };
        Composite.prototype.removeItem = function (item) {
            var index = this.items.indexOf(item);
            if (index > -1) {
                this.items.splice(index, 1);
                if (this.layout)
                    this.layout.removeItem(item);
            }
            return index;
        };
        Composite.prototype.removeAll = function () {
            for (var i = 0; i < this.items.length; i++) {
                this.removeItem(this.items[i]);
            }
        };
        Composite.prototype.setLayout = function (layout) {
            if (this.layout != null)
                this.layout.unlayout();
            this.layout = layout;
            this.layout.setComposite(this);
            this.update();
        };
        Composite.prototype.getLayout = function () {
            return this.layout;
        };
        Composite.prototype.update = function () {
            if (this.layout)
                this.layout.layout();
        };
        return Composite;
    }(LayoutedWidget));
    return Composite;
});
