var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Layout"], function (require, exports, Layout) {
    "use strict";
    var StackLayout = (function (_super) {
        __extends(StackLayout, _super);
        function StackLayout(event_handlers) {
            _super.call(this, "stacklayout");
            this.busy = false;
            this.event_handlers = event_handlers;
        }
        StackLayout.prototype.layout = function () {
            _super.prototype.layout.call(this);
            var items = this.getComposite().getItems();
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var item = items_1[_i];
                if (item != this.current) {
                    $(item.getContainer()).hide();
                }
                else {
                    this.top(item);
                    $(item.getContainer()).show();
                }
            }
        };
        StackLayout.prototype.top = function (item) {
            this.current = item;
            $(item.getContainer()).addClass("top-item");
            if (this.event_handlers && this.event_handlers.placeOnTop) {
                this.event_handlers.placeOnTop(this.current);
            }
        };
        StackLayout.prototype.pop = function () {
            if (this.current == null)
                return;
            $(this.current.getContainer()).hide();
            $(this.current.getContainer()).removeClass("top-item");
            if (this.event_handlers && this.event_handlers.placeToBack) {
                this.event_handlers.placeToBack(this.current);
            }
            this.current = null;
        };
        StackLayout.prototype.unlayout = function () {
            this.pop();
            _super.prototype.unlayout.call(this);
        };
        StackLayout.prototype.showItem = function (item) {
            if (item == null || this.busy)
                return;
            if ($(item).hasClass("top-item"))
                return;
            this.busy = true;
            var layout = this;
            if (this.current != null) {
                this.pop();
            }
            $(item.getContainer()).addClass("top-item");
            $(item.getContainer()).show({
                duration: "fast",
                done: function () {
                    layout.top(item);
                    layout.busy = false;
                }
            });
            this.current = item;
        };
        return StackLayout;
    }(Layout));
    return StackLayout;
});
