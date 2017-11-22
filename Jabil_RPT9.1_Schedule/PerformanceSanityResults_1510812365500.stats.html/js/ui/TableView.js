var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "ui/QueryView", "view/GTable", "view/GError", "view/query/QueryFactory", "jrptlib/Properties!APPMSG", "ui/Prefs!"], function (require, exports, QueryView, GTable_1, GError, QueryFactory_1, APPMSG, Prefs) {
    "use strict";
    var TableView = (function (_super) {
        __extends(TableView, _super);
        function TableView(container, page, view_id, view_node, instances) {
            _super.call(this, container, page, view_id, view_node, instances);
            this.setClassName("table-view" + (Prefs.fixedColumn ? "" : " simple"));
            this.miniBars = !($(this.getModel()).attr("miniBars") === "false");
        }
        TableView.prototype.getSeries = function () {
            return GTable_1.TableSeries;
        };
        TableView.prototype.getQueryFactory = function () {
            return this.provider;
        };
        TableView.prototype.createChartAndProviders = function () {
            try {
                this.provider = new QueryFactory_1.TableQueryFactory(this.getCounterQuerySet(), this.getSession());
                this.setupBusy(this.provider.getQueryProvider());
                this.table = GTable_1.GTable.create(this.provider.getViewProvider(), this.computeGTableOptions(this.provider));
            }
            catch (error) {
                this.table = new GError(error);
            }
        };
        TableView.prototype.computeGTableOptions = function (provider) {
            return {
                dimensions: provider.getSeriesOptions(this.getSeriesOptions()),
                minibars: this.isMiniBars() && !$(document.body).hasClass("use-high-contrast")
            };
        };
        TableView.prototype.createContents = function (parent) {
            var _this = this;
            var w = $(parent).width();
            var h = $(parent).height();
            this.createChartAndProviders();
            this.sessionListeners = [
                this.getSession().on("selectedTimeRangesChanged", function () { return _this.refreshContents(); }),
                this.getSession().sessionSet.on("selectionChanged", function () { return _this.refreshContents(); }),
                this.getSession().on("hosts", function (details) {
                    if (details.compareChanged)
                        _this.refreshContents();
                })
            ];
            this.table.renderContents(d3.select(parent), w, h);
        };
        TableView.prototype.clearContents = function () {
            _super.prototype.clearContents.call(this);
            for (var i = 0; i < this.sessionListeners.length; i++)
                this.sessionListeners[i].remove();
            this.sessionListeners = undefined;
            if (this.provider) {
                this.provider.dispose();
                this.provider = null;
            }
            this.table = null;
        };
        TableView.prototype.setMiniBars = function (value, save) {
            if (save)
                $(this.getModel()).attr("miniBars", value.toString());
            this.miniBars = value;
            this.refreshContents();
        };
        TableView.prototype.isMiniBars = function () {
            return this.miniBars;
        };
        TableView.prototype.createOptions = function (provider, counterProvider) {
            var _this = this;
            _super.prototype.createOptions.call(this, provider, counterProvider);
            provider.addOption({ label: APPMSG.DrawMiniBars_label,
                type: "BOOLEAN",
                id: "miniBars",
                value: function () {
                    return _this.isMiniBars();
                },
                change: function (value, save) {
                    _this.setMiniBars(value, save);
                }
            });
        };
        TableView.prototype.resizedContents = function (parent) {
            if (this.table && this.table instanceof GTable_1.GTable) {
                this.table.resizeTable(parent);
            }
        };
        return TableView;
    }(QueryView));
    return TableView;
});
