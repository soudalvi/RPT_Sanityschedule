var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "model/counters/CounterQuerySet", "ui/View", "view/query/QueryFactory", "view/util/SeriesOptions", "jrptlib/Properties!APPMSG"], function (require, exports, CounterQuerySet, View, QueryFactory_1, SeriesOptions_1, APPMSG) {
    "use strict";
    var QueryView = (function (_super) {
        __extends(QueryView, _super);
        function QueryView(container, page, view_id, view_node, instances) {
            _super.call(this, container, page, view_id, view_node, instances);
            this.counterQuerySet = null;
            this.instances = instances;
            this.serieOptions = SeriesOptions_1.SeriesOptionsModel.create(view_node);
        }
        QueryView.prototype.setupBusy = function (qp) {
            var _this = this;
            this.setBusy(qp.isRequestPending());
            qp.on("requestsPending", function () { return _this.setBusy(qp.isRequestPending()); });
        };
        QueryView.prototype.computeEffectiveTitle = function (title) {
            var queries = this.getCounterQuerySet().counterQueries;
            var subst = function (match, tag, order) {
                if (order > 0 && order <= queries.length)
                    return queries[order - 1].property(tag);
                return match;
            };
            return title.replace(/\{counter\.([a-z\-]+)\:(\d+)\}/g, subst);
        };
        QueryView.prototype.counterQueryAdded = function (cq) { };
        QueryView.prototype.counterQueryRemoved = function (cq) { };
        QueryView.prototype.unloadCounterQuerySet = function () {
            if (this.counterQuerySet != null) {
                for (var i = 0; i < this.counterQuerySet.counterQueries.length; i++) {
                    var cq = this.counterQuerySet.counterQueries[i];
                    this.removeSearchEntry(cq.counterPath);
                }
                this.counterQuerySet = null;
            }
        };
        QueryView.prototype.createCounterQuerySet = function () {
            this.unloadCounterQuerySet();
            this.counterQuerySet = CounterQuerySet.loadFromView($(this.getModel()));
            this.counterQuerySet.setInstances(this.instances);
            for (var i = 0; i < this.counterQuerySet.counterQueries.length; i++) {
                var cq = this.counterQuerySet.counterQueries[i];
                this.addSearchEntry(cq.counterPath, cq.label(), APPMSG.SearchCategory_Counters);
            }
        };
        QueryView.prototype.getCounterQuerySet = function () {
            if (!this.counterQuerySet) {
                this.createCounterQuerySet();
            }
            return this.counterQuerySet;
        };
        QueryView.prototype.counterQuerySetChanged = function () {
            if (this.refreshContents()) {
                if (this.serieOptions) {
                    try {
                        this.getQueryFactory().getSeriesOptions(this.serieOptions);
                    }
                    catch (problem) {
                        this.serieOptions = null;
                    }
                }
            }
        };
        QueryView.prototype.setInstances = function (instances) {
            this.instances = instances;
            this.unloadCounterQuerySet();
            if (this.isRendered())
                this.update();
        };
        QueryView.prototype.getInstances = function () {
            return this.instances;
        };
        QueryView.prototype.update = function () {
            _super.prototype.update.call(this);
            this.createCounterQuerySet();
            this.counterQuerySetChanged();
            this.emit("counterQuerySetChanged", this);
        };
        QueryView.prototype.getSeriesOptions = function () {
            return this.serieOptions ?
                this.serieOptions :
                this.getQueryFactory() ?
                    this.getQueryFactory().getDefaultOptions() :
                    new SeriesOptions_1.SeriesOptionsModel();
        };
        QueryView.prototype.createOptions = function (provider, counterProvider) {
            var _this = this;
            _super.prototype.createOptions.call(this, provider, counterProvider);
            var availableDims = function () {
                var dims = _this.getQueryFactory() ? _this.getQueryFactory().getAcceptableDimensions(counterProvider, QueryFactory_1.LabelKind.PLURAL) : [];
                if (dims.length < _this.getSeries().ids.length) {
                    dims.splice(0, 0, { value: null, label: APPMSG.DimNotAssigned });
                }
                return dims;
            };
            var add = function (serie, label) {
                provider.addOption({ label: label,
                    type: "SELECT",
                    id: serie,
                    values: function () { return availableDims(); },
                    value: function () { return _this.getSeriesOptions().getDimension(serie); },
                    change: function (value, save) { _this.setSerieDimension(serie, value, save); provider.update(); }
                });
            };
            var series = this.getSeries();
            for (var i = 0; i < series.ids.length; i++) {
                add(series.ids[i], series.labels[i]);
            }
        };
        QueryView.prototype.setSerieDimension = function (serie, dim, save) {
            if (!this.serieOptions) {
                this.serieOptions = this.getQueryFactory() ? this.getQueryFactory().getDefaultOptions() : new SeriesOptions_1.SeriesOptionsModel();
            }
            this.serieOptions.setDimension(serie, dim);
            if (save)
                this.serieOptions.save(this.getModel());
            this.refreshContents();
        };
        return QueryView;
    }(View));
    return QueryView;
});
