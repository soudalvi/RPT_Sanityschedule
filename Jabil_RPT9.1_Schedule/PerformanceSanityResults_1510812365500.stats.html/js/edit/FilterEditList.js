var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Listview", "jrptlib/CustomComboBox", "model/counters/CounterQuery", "model/counters/InstanceCountFilter", "model/counters/InstanceValueFilter", "model/counters/InstanceNameFilter", "jrptlib/Properties!APPMSG"], function (require, exports, Listview, CustomComboBox, CounterQuery, InstanceCountFilter, InstanceValueFilter, InstanceNameFilter, APPMSG) {
    "use strict";
    var FilterEditList = (function (_super) {
        __extends(FilterEditList, _super);
        function FilterEditList(container, content_provider, label_provider) {
            _super.call(this, container);
            this.setModelModifierProvider(this);
            this.setContentProvider(content_provider);
            this.setLabelProvider(label_provider);
        }
        FilterEditList.createEmptyFilterData = function () {
            return { filter: null };
        };
        FilterEditList.prototype.getLabel = function (action) {
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
        FilterEditList.prototype.remove = function (filterData, done) {
            this.emit("removeFilter", { filter: filterData.filter });
            var i = this.getInput().indexOf(filterData);
            if (i != -1) {
                this.getInput().splice(i, 1);
            }
            if (this.getInput().length == 0) {
                var c = FilterEditList.createEmptyFilterData();
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
        FilterEditList.prototype.insertAfter = function (filterData, done) {
            var idx = this.getInput().indexOf(filterData);
            this.getInput().splice(idx + 1, 0, FilterEditList.createEmptyFilterData());
            done(this.getInput()[idx + 1]);
        };
        FilterEditList.prototype.moveUp = function (filterData, done) {
            this.emit("moveUpFilter", { filter: filterData.filter });
            var idx = this.getInput().indexOf(filterData);
            if (idx >= 1) {
                this.getInput().splice(idx, 1);
                this.getInput().splice(idx - 1, 0, filterData);
                done(filterData);
            }
        };
        FilterEditList.prototype.moveDown = function (filterData, done) {
            this.emit("moveDownFilter", { filter: filterData.filter });
            var idx = this.getInput().indexOf(filterData);
            if (idx < this.getInput().length - 1) {
                this.getInput().splice(idx, 1);
                this.getInput().splice(idx + 1, 0, filterData);
                done(filterData);
            }
        };
        FilterEditList.prototype.destroy = function () {
            if (this.filter_select)
                _super.prototype.destroy.call(this);
        };
        FilterEditList.prototype.fillItemContents = function (listitem, filterData) {
            var _this = this;
            var this_filter_select = this.filter_select = new CustomComboBox(document.createElement("span"));
            this.filter_select.setSource(function (request, response) {
                var tmp = [];
                tmp.push({ label: APPMSG.FilterEditList_FilterByCount,
                    value: APPMSG.FilterEditList_FilterByCount,
                    data: "FilterByCount" });
                tmp.push({ label: APPMSG.FilterEditList_FilterByValue,
                    value: APPMSG.FilterEditList_FilterByValue,
                    data: "FilterByValue" });
                tmp.push({ label: APPMSG.FilterEditList_FilterByName,
                    value: APPMSG.FilterEditList_FilterByName,
                    data: "FilterByName" });
                response(tmp);
            });
            this.filter_select.setSelect(function (event, ui) {
                var filterType = ui.item.data;
                var changed = false;
                var newFilter = null;
                if (filterData.filter) {
                    if (filterType == "FilterByCount") {
                        changed = !(filterData.filter instanceof InstanceCountFilter);
                    }
                    else if (filterType == "FilterByValue") {
                        changed = !(filterData.filter instanceof InstanceValueFilter);
                    }
                    else if (filterType == "FilterByName") {
                        changed = !(filterData.filter instanceof InstanceNameFilter);
                    }
                    else
                        throw "unknown filterType:" + filterType;
                }
                else {
                    changed = true;
                }
                if (changed) {
                    if (filterType == "FilterByCount") {
                        newFilter = new InstanceCountFilter(null);
                        if (filterData.filter instanceof InstanceValueFilter) {
                            newFilter.counterQuery = filterData.filter.counterQuery;
                        }
                    }
                    else if (filterType == "FilterByValue") {
                        newFilter = new InstanceValueFilter(null);
                        if (filterData.filter instanceof InstanceCountFilter) {
                            newFilter.counterQuery = filterData.filter.counterQuery;
                        }
                    }
                    else if (filterType == "FilterByName") {
                        newFilter = new InstanceNameFilter();
                    }
                    else
                        throw "unknown filterType:" + filterType;
                }
                if (changed) {
                    var old = filterData.filter;
                    var created = !(old);
                    filterData.filter = newFilter;
                    if (created) {
                        var idx = _this.getInput().indexOf(filterData);
                        if (idx == 0) {
                            _this.emit("addFilter", { filter: filterData.filter });
                        }
                        else {
                            var previous = _this.getInput()[idx - 1];
                            _this.emit("insertFilterAfter", { afterWhat: previous.filter, filter: filterData.filter });
                        }
                    }
                    else {
                        _this.emit("changeFilter", { filterToReplace: old, filter: filterData.filter });
                    }
                    var lbl = filterData.filter.getLabel();
                    ui.item.value = lbl;
                    var valid = filterData.filter.isValid();
                    this_filter_select.setErrorState(!valid);
                    _this.emitSelectionChanged(filterData);
                }
                else {
                    ui.item.value = filterData.filter.getLabel();
                }
            });
            filterData.filterListItemCombobox = this_filter_select;
            var lbl = filterData.filter ? filterData.filter.getLabel() : APPMSG.FilterEditList_chooseFilter;
            this_filter_select.setText(lbl);
            var valid = filterData.filter ? filterData.filter.isValid() : true;
            this_filter_select.setErrorState(!valid);
            var cbox = document.createElement("div");
            var container = $(this_filter_select.getContainer());
            container.appendTo($(cbox));
            $(cbox).appendTo($(listitem));
            container.find("input").css("width", $(cbox).width() - 50).attr("readonly", "true");
            this.makeDroppable(this_filter_select, filterData);
        };
        FilterEditList.prototype.makeDroppable = function (combobox, filterData) {
            var input = $(combobox.getContainer()).find("input");
            var list = this;
            input.droppable({
                tolerance: "touch",
                accept: function (draggable) {
                    var cq2 = draggable.data("counterQuery");
                    var cq3 = null;
                    if (filterData.filter) {
                        if (filterData.filter instanceof InstanceCountFilter)
                            cq3 = filterData.filter.counterQuery;
                        else if (filterData.filter instanceof InstanceValueFilter)
                            cq3 = filterData.filter.counterQuery;
                        else
                            cq3 = null;
                    }
                    if (cq2 && cq3 && cq3.path() == cq2.path())
                        return false;
                    return draggable.attr("id") == "CounterComponentEditForm";
                },
                activeClass: "droppable_area",
                hoverClass: "droppable_area_hover",
                drop: function (event, ui) {
                    var cq = ui.draggable.data("counterQuery");
                    var filter = ui.draggable.data("instanceFilter");
                    if (filter && filter === filterData.filter) {
                        return;
                    }
                    var list_wildcards = list.getWildcards ? list.getWildcards() : null;
                    if (list_wildcards && CounterQuery.isEqualWildcards(list_wildcards, cq.wildcards)) {
                        var ncq = cq.duplicate();
                        if (list.onDropCounter(combobox, ncq, filterData)) {
                            ui.draggable.draggable('option', 'revert', false);
                        }
                    }
                }
            });
        };
        FilterEditList.prototype.onDropCounter = function (combobox, cq, filterData) {
            var newFilter = null;
            if (filterData.filter instanceof InstanceValueFilter) {
                newFilter = new InstanceValueFilter(cq);
                newFilter.thresholdValue = filterData.filter.thresholdValue;
                newFilter.showAbove = filterData.filter.showAbove;
            }
            else {
                newFilter = new InstanceCountFilter(cq);
                if (filterData.filter instanceof InstanceCountFilter) {
                    newFilter.count = filterData.filter.count;
                    newFilter.showHighest = filterData.filter.showHighest;
                }
            }
            var old = filterData.filter;
            var created = !old;
            filterData.filter = newFilter;
            if (created) {
                var idx = this.getInput().indexOf(filterData);
                if (idx == 0) {
                    this.emit("addFilter", { filter: filterData.filter });
                }
                else {
                    var previous = this.getInput()[idx - 1];
                    this.emit("insertFilterAfter", { afterWhat: previous.filter, filter: filterData.filter });
                }
            }
            else {
                this.emit("changeFilter", { filterToReplace: old, filter: filterData.filter });
            }
            var lbl = filterData.filter.getLabel();
            combobox.setText(lbl);
            var valid = filterData.filter.isValid();
            combobox.setErrorState(!valid);
            var p = $(combobox.getContainer()).closest(".scrollview-item");
            if (p.hasClass("ui-selected")) {
                this.emitSelectionChanged(filterData);
            }
            return true;
        };
        FilterEditList.prototype.emitSelectionChanged = function (filterData) {
            this.emit("selectionChanged", filterData);
        };
        FilterEditList.prototype.setWildcardProvider = function (func) {
            this.getWildcards = func;
        };
        return FilterEditList;
    }(Listview));
    return FilterEditList;
});
