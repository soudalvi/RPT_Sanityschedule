var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Form", "edit/CounterComboBox", "edit/CounterComponentEdit", "edit/FilterEdit", "model/counters/CounterType", "model/counters/CounterQuery", "model/counters/InstanceCountFilter", "model/counters/InstanceValueFilter", "jrptlib/Properties!APPMSG"], function (require, exports, Form, CounterComboBox, CounterComponentEdit, FilterEdit, CounterType, CounterQuery, InstanceCountFilter, InstanceValueFilter, APPMSG) {
    "use strict";
    var FilterPrimaryCounterEdit = (function (_super) {
        __extends(FilterPrimaryCounterEdit, _super);
        function FilterPrimaryCounterEdit(counterDescTree, wildcards) {
            _super.call(this);
            this.counterDescTree = counterDescTree;
            this.wildcards = wildcards;
        }
        FilterPrimaryCounterEdit.prototype.getWildcards = function () { return this.wildcards; };
        FilterPrimaryCounterEdit.prototype.createContents = function (container) {
            var _this = this;
            var form = $("<form>").appendTo(container);
            var ul = $("<ul>").appendTo(form);
            var li = $("<li>").appendTo(ul);
            this.counterComponentLabel = $("<label>").appendTo(li).text(APPMSG.FilterPCE_primaryCounter);
            var thisCounterComboBox = this.counterComboBox = new CounterComboBox(document.createElement("span"), this.counterDescTree, function () { return _this.getWildcards(); }, function () {
                if (_this.filter instanceof InstanceCountFilter)
                    return _this.filter.counterQuery;
                else if (_this.filter instanceof InstanceValueFilter)
                    return _this.filter.counterQuery;
                else
                    return null;
            });
            this.counterComboBox.setSelect(function (event, ui) {
                _this._onCounterChanged(ui);
            });
            this.counterComboBox.onDropCounter = function (cq) { return _this._onDropCounter(cq); };
            li = $("<li>").appendTo(ul);
            $(this.counterComboBox.getContainer()).appendTo(li);
            $(this.counterComboBox.getContainer()).find("input")
                .css("width", li.width() - 50)
                .css("margin-bottom", 0);
            this.counterComponentContainer = $("<div>").appendTo(ul);
            this.counterComponentEdit = new CounterComponentEdit(this.counterComponentContainer);
            this.counterComponentEdit.setIsCumulatedEnabled(false);
            this.counterComponentContainer.hide();
            var form_object = new Form(form, null);
            this.counterComponentEdit.on("counterComponentChanged", function (args) {
                _this._onCounterComponentChanged(args.model);
            });
        };
        FilterPrimaryCounterEdit.prototype.updateContents = function (filter) {
            this.filter = filter;
            if (filter instanceof InstanceCountFilter) {
                this.counterComboBox.setErrorState(false);
                this.counterComboBox.setText(filter.counterQuery ? filter.counterQuery.label() : "");
                this.counterComponentContainer.show();
                this.counterComponentEdit.updateContents(filter.counterQuery, filter);
                this.counterComponentEdit.form.data("instanceFilter", filter);
            }
            else if (filter instanceof InstanceValueFilter) {
                this.counterComboBox.setErrorState(false);
                this.counterComboBox.setText(filter.counterQuery ? filter.counterQuery.label() : "");
                this.counterComponentContainer.show();
                this.counterComponentEdit.updateContents(filter.counterQuery, filter);
                this.counterComponentEdit.form.data("instanceFilter", filter);
            }
            else {
                this.counterComboBox.setErrorState(true);
                this.counterComboBox.setText(APPMSG.FilterPCE_noCounter);
                this.counterComponentContainer.hide();
            }
        };
        FilterPrimaryCounterEdit.prototype._onCounterComponentChanged = function (filter) {
            this.counterComboBox.setText(filter.counterQuery.label());
            this._emitFieldChanged();
            this.counterComponentEdit.updateContents(filter.counterQuery, filter);
        };
        FilterPrimaryCounterEdit.prototype._onCounterChanged = function (ui) {
            this.counterDesc = ui.item.data;
            var counterType = CounterType.fromString(this.counterDesc.counter.counterType);
            var currComponentKey = null;
            if (this.filter instanceof InstanceCountFilter)
                currComponentKey = (this.filter.counterQuery) ? this.filter.counterQuery.component : null;
            else if (this.filter instanceof InstanceValueFilter)
                currComponentKey = (this.filter.counterQuery) ? this.filter.counterQuery.component : null;
            else
                currComponentKey = null;
            var componentKey = null;
            var currComponentType = null;
            if (currComponentKey) {
                for (var _i = 0, _a = counterType.components(); _i < _a.length; _i++) {
                    var key = _a[_i];
                    var cc = counterType.component(key);
                    if (key == currComponentKey) {
                        currComponentType = cc;
                        componentKey = key;
                        break;
                    }
                }
            }
            if (componentKey == null) {
                for (var _b = 0, _c = counterType.components(); _b < _c.length; _b++) {
                    var key = _c[_b];
                    currComponentType = counterType.component(key);
                    componentKey = key;
                    break;
                }
            }
            var counterPath = this.counterDesc.path;
            counterPath += "/Cumulated";
            counterPath += "/" + componentKey;
            if (this.filter instanceof InstanceCountFilter) {
                this.filter.counterQuery = new CounterQuery(counterPath, counterType, this.counterDesc.counter.unit, this.counterDesc.counter.standaloneLabel, this.counterDesc.counter.nlunit, currComponentType, null);
                ui.item.value = this.filter.counterQuery.label();
                this.updateContents(this.filter);
                this._emitFieldChanged();
            }
            else if (this.filter instanceof InstanceValueFilter) {
                this.filter.counterQuery = new CounterQuery(counterPath, counterType, this.counterDesc.counter.unit, this.counterDesc.counter.standaloneLabel, this.counterDesc.counter.nlunit, currComponentType, null);
                ui.item.value = this.filter.counterQuery.label();
                this.updateContents(this.filter);
                this._emitFieldChanged();
            }
        };
        FilterPrimaryCounterEdit.prototype._onDropCounter = function (cq) {
            var eq = false;
            if (this.filter instanceof InstanceCountFilter) {
                eq = this.filter.counterQuery && cq.path() == this.filter.counterQuery.path();
                if (!eq) {
                    this.filter.counterQuery = cq.duplicate();
                    this.filter.counterQuery.setCumulated(true);
                    this.counterComboBox.setText(this.filter.counterQuery.label());
                    this.updateContents(this.filter);
                    this._emitFieldChanged();
                }
            }
            else if (this.filter instanceof InstanceValueFilter) {
                eq = this.filter.counterQuery && cq.path() == this.filter.counterQuery.path();
                if (!eq) {
                    this.filter.counterQuery = cq.duplicate();
                    this.filter.counterQuery.setCumulated(true);
                    this.counterComboBox.setText(this.filter.counterQuery.label());
                    this.updateContents(this.filter);
                    this._emitFieldChanged();
                }
            }
            return true;
        };
        return FilterPrimaryCounterEdit;
    }(FilterEdit));
    return FilterPrimaryCounterEdit;
});
