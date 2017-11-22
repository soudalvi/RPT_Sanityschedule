var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Widget"], function (require, exports, Widget) {
    "use strict";
    var Viewer = (function (_super) {
        __extends(Viewer, _super);
        function Viewer(container) {
            _super.call(this, container);
        }
        Viewer.prototype.setContentProvider = function (provider) {
            if (this.contentProvider && this.contentProvider.inputChanged)
                this.contentProvider.inputChanged(this, this.input, null);
            this.contentProvider = provider;
            if (this.input) {
                if (provider.inputChanged)
                    provider.inputChanged(this, null, this.input);
                this.update();
            }
        };
        Viewer.prototype.setLabelProvider = function (provider) {
            this.labelProvider = provider;
        };
        Viewer.prototype.getContentProvider = function () {
            return this.contentProvider;
        };
        Viewer.prototype.getLabelProvider = function () {
            return this.labelProvider;
        };
        Viewer.prototype.setInput = function (input) {
            if (this.contentProvider && this.contentProvider.inputChanged)
                this.contentProvider.inputChanged(this, this.input, input);
            this.input = input;
            if (this.contentProvider)
                this.update();
        };
        Viewer.prototype.getInput = function () {
            return this.input;
        };
        Viewer.prototype.update = function () {
        };
        return Viewer;
    }(Widget));
    return Viewer;
});
