var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Layout"], function (require, exports, Layout) {
    "use strict";
    var AlignLayout = (function (_super) {
        __extends(AlignLayout, _super);
        function AlignLayout(direction) {
            _super.call(this, "stacklayout");
            this.direction = AlignLayout.DOWN;
        }
        AlignLayout.prototype.layout = function () {
            _super.prototype.layout.call(this);
            var items = this.getComposite().getItems();
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var item = items_1[_i];
                if (this.direction == AlignLayout.RIGHT) {
                    $(item.getContainer()).css("float", "left");
                }
                this.showItem(item);
            }
        };
        AlignLayout.prototype.showItem = function (item) {
            var _this = this;
            $(item.getContainer()).show({
                duration: "slow",
                done: function () {
                    _this.emit("itemShown", item);
                }
            });
        };
        AlignLayout.prototype.unlayout = function () {
            _super.prototype.unlayout.call(this);
        };
        AlignLayout.DOWN = 0;
        AlignLayout.UP = 1;
        AlignLayout.LEFT = 2;
        AlignLayout.RIGHT = 3;
        return AlignLayout;
    }(Layout));
    return AlignLayout;
});
