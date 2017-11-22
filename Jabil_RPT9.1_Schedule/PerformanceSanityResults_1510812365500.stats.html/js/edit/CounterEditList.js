var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Listview", "edit/CounterComboBox", "model/counters/CounterType", "model/counters/ComponentType", "jrptlib/Properties!APPMSG"], function (require, exports, Listview, CounterComboBox, CounterType, ComponentType, APPMSG) {
    "use strict";
    var CounterEditList = (function (_super) {
        __extends(CounterEditList, _super);
        function CounterEditList(container, counterDescTree) {
            _super.call(this, container);
            this.counterDescTree = counterDescTree;
            this.setModelModifierProvider(this);
        }
        CounterEditList.prototype.setWildcardsProvider = function (getWildcardsFunc) {
            this.wildcardsFunc = getWildcardsFunc;
        };
        CounterEditList.prototype.getWildcards = function () { return this.wildcardsFunc ? this.wildcardsFunc() : undefined; };
        CounterEditList.prototype.getLabel = function (action) {
            if (action == this.remove)
                return APPMSG.Remove_Action;
            if (action == this.insertAfter)
                return APPMSG.Add_Action;
            if (action == this.moveUp)
                return APPMSG.MoveUp_Action;
            if (action == this.moveDown)
                return APPMSG.MoveDown_Action;
            return null;
        };
        CounterEditList.prototype.remove = function (counter, done) {
            this.emit("removeCounter", { counterQuery: counter.counterQuery, counter: counter });
            var i = this.getInput().indexOf(counter);
            if (i != -1) {
                this.getInput().splice(i, 1);
            }
            if (this.getInput().length == 0) {
                var c = this.createEmptyCounter();
                this.getInput().push(c);
                done(c);
            }
            else {
                if (i >= this.getInput().length)
                    i--;
                var p = this.getInput()[i];
                done(p);
            }
        };
        CounterEditList.prototype.insertAfter = function (counter, done) {
            var idx = this.getInput().indexOf(counter);
            this.getInput().splice(idx + 1, 0, this.createEmptyCounter());
            done(this.getInput()[idx + 1]);
        };
        CounterEditList.prototype.moveUp = function (counter, done) {
            this.emit("moveUpCounter", { counterQuery: counter.counterQuery, counter: counter });
            var idx = this.getInput().indexOf(counter);
            if (idx >= 1) {
                this.getInput().splice(idx, 1);
                this.getInput().splice(idx - 1, 0, counter);
                done(counter);
            }
        };
        CounterEditList.prototype.moveDown = function (counter, done) {
            this.emit("moveDownCounter", { counterQuery: counter.counterQuery, counter: counter });
            var idx = this.getInput().indexOf(counter);
            if (idx < this.getInput().length - 1) {
                this.getInput().splice(idx, 1);
                this.getInput().splice(idx + 1, 0, counter);
                done(counter);
            }
        };
        CounterEditList.prototype.destroy = function () {
            if (this.counter_select)
                _super.prototype.destroy.call(this);
        };
        CounterEditList.prototype.createEmptyCounter = function () {
            return {
                label: "",
                path: "",
                unit: "",
                counterType: null,
                componentType: null,
                counterQuery: null };
        };
        CounterEditList.prototype.fillItemContents = function (listitem, counter, index) {
            var _this = this;
            var this_counter_select = this.counter_select = new CounterComboBox(document.createElement("span"), this.counterDescTree, function () {
                return _this.getViewItems().length > 1 ? _this.getWildcards() : undefined;
            }, function () { return counter.counterQuery; });
            this.counter_select.setSelect(function (event, ui) {
                var desc = ui.item.data;
                var counterData = {
                    label: desc.counter.label,
                    standaloneLabel: desc.counter.label,
                    path: desc.path,
                    unit: desc.counter.unit,
                    counterType: CounterType.fromString(desc.counter.counterType),
                    componentType: ComponentType.fromString(desc.counter.componentType),
                    nlunit: desc.counter.nlunit,
                    counterQuery: null,
                    isCumulated: true
                };
                _this._onCounterDataSelected(counter, counterData, ui);
            });
            var _cdata = counter;
            this.counter_select.onDropCounter = function (cq) { return _this._onDropCounter(cq, _cdata); };
            counter.counterlistItemCombobox = this.counter_select;
            this.counter_select.setText(counter.counterQuery ? counter.counterQuery.label() : "");
            var cbox = document.createElement("div");
            var container = $(this.counter_select.getContainer());
            container.appendTo($(cbox));
            $(cbox).appendTo($(listitem));
            container.find("input").css("width", $(cbox).width() - 50);
        };
        CounterEditList.prototype.resizeContents = function () {
            var cbox = this.getContainer();
            $(this.getContainer()).find(".custom-combobox-input").css("width", $(cbox).width() - 60);
        };
        CounterEditList.prototype._onCounterDataSelected = function (counterData, counterDesc, ui) {
            counterData.path = counterDesc.path;
            counterData.label = counterDesc.standaloneLabel;
            counterData.unit = counterDesc.unit;
            counterData.nlunit = counterDesc.nlunit;
            counterData.counterType = counterDesc.counterType;
            var componentKey = null;
            if (counterDesc.component) {
                componentKey = counterDesc.component;
                counterData.componentType = counterDesc.componentType;
            }
            var ct = counterData.counterType;
            if ((componentKey == null) && ct) {
                for (var _i = 0, _a = ct.components(); _i < _a.length; _i++) {
                    var key = _a[_i];
                    var cc = ct.component(key);
                    if (cc == counterData.componentType) {
                        counterData.componentType = cc;
                        componentKey = key;
                        break;
                    }
                }
            }
            if (componentKey == null) {
                for (var _b = 0, _c = ct.components(); _b < _c.length; _b++) {
                    var key = _c[_b];
                    counterData.componentType = ct.component(key);
                    componentKey = key;
                    break;
                }
            }
            counterData.isCumulated = counterDesc.isCumulated;
            if (counterData.isCumulated) {
                counterData.path += "/Cumulated";
            }
            counterData.path += "/" + componentKey;
            if (counterData.counterQuery == null) {
                var idx = this.getInput().indexOf(counterData);
                if (idx == 0) {
                    this.emit("addCounter", { counter: counterData });
                }
                else {
                    var previous = this.getInput()[idx - 1];
                    this.emit("insertCounterAfter", { counterQuery: previous.counterQuery, counter: counterData });
                }
            }
            else {
                this.emit("changeCounter", { counterQuery: counterData.counterQuery, counter: counterData });
            }
            if (ui) {
                ui.item.value = counterData.counterQuery.label();
            }
            else {
                counterData.counterlistItemCombobox.setText(counterData.counterQuery.label());
            }
            var p = $(counterData.counterlistItemCombobox.getContainer()).closest(".listview-item");
            if (p.hasClass("ui-selected")) {
                this.emitSelectionChanged(counterData);
            }
        };
        CounterEditList.prototype._onDropCounter = function (cq, counterData) {
            var eq = counterData.counterQuery && cq.path() == counterData.counterQuery.path();
            if (!eq) {
                var counterDesc = {
                    path: cq.counterPath,
                    label: cq.counterLabel,
                    unit: cq.counterUnit,
                    nlunit: cq.nlunit(),
                    counterType: cq.counterType,
                    componentType: cq.componentType,
                    counterQuery: cq,
                    component: cq.component,
                    isCumulated: cq.isCumulated
                };
                this._onCounterDataSelected(counterData, counterDesc, null);
            }
            return true;
        };
        CounterEditList.prototype.emitSelectionChanged = function (counter) {
            this.emit("selectionChanged", counter);
        };
        return CounterEditList;
    }(Listview));
    return CounterEditList;
});
