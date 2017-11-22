var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/GItems", "view/query/GStatusQueryProvider", "ui/View"], function (require, exports, GItems, GStatusQueryProvider, View) {
    "use strict";
    var RunStatusView = (function (_super) {
        __extends(RunStatusView, _super);
        function RunStatusView(container, page, view_id, view_node, instances) {
            _super.call(this, container, page, view_id, view_node, instances);
            this.setClassName("runstatus-view");
        }
        RunStatusView.prototype.isCounterView = function () {
            return false;
        };
        RunStatusView.prototype.createContents = function (parent) {
            var w = $(parent).width();
            var h = $(parent).height();
            this.provider = new GStatusQueryProvider();
            this.provider.setSession(this.getSession());
            this.provider.setOn();
            this.runstatus = new GItems(this.provider);
            this.runstatus.renderContents(d3.select(parent), w, h);
        };
        RunStatusView.prototype.clearContents = function () {
            _super.prototype.clearContents.call(this);
            this.provider.setOff();
            this.provider = null;
            this.runstatus = null;
        };
        return RunStatusView;
    }(View));
    return RunStatusView;
});
