var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented", "edit/FilterEditList", "edit/FilterByValueEdit", "edit/FilterByCountEdit", "edit/FilterByNameEdit", "model/counters/InstanceValueFilter", "model/counters/InstanceCountFilter", "model/counters/InstanceNameFilter", "jrptlib/Nls", "jrptlib/Properties!APPMSG"], function (require, exports, Evented, FilterEditList, FilterByValueEdit, FilterByCountEdit, FilterByNameEdit, InstanceValueFilter, InstanceCountFilter, InstanceNameFilter, NLS, APPMSG) {
    "use strict";
    var WildcardFilterEdit = (function (_super) {
        __extends(WildcardFilterEdit, _super);
        function WildcardFilterEdit(container, counterProvider, cqSet, wildcardFilter) {
            _super.call(this);
            this.counterProvider = counterProvider;
            this.cqSet = cqSet;
            this.wildcardFilter = wildcardFilter;
            this.createEditor(container);
        }
        WildcardFilterEdit.prototype.createEditor = function (container) {
            var outer = $("<div>").appendTo(container);
            var panel = $("<div>").appendTo(outer);
            panel.addClass("filter_list_panel").addClass("panel");
            $("<h2>").appendTo(panel).text(NLS.bind(APPMSG.WildcardFilterEdit_filtersFor, this.wildcardFilter.getLabel(this.counterProvider)));
            this.filterListPanel = $("<div>").appendTo(panel);
            this.filterListPanel.addClass("filter_list");
            var arrow = $("<div>").appendTo(outer);
            arrow.addClass("filter_options_panel_arrow");
            panel = $("<div>").appendTo(outer);
            panel.addClass("filter_options_panel panel");
            $("<h2>").appendTo(panel).text(APPMSG.WildcardFilteredit_optionPanelLabel);
            this.filterOptionsPanel = $("<div>").appendTo(panel);
            this.filterOptionsPanel.addClass("filter_options");
            this.createFilterList();
        };
        WildcardFilterEdit.prototype.createFilterList = function () {
            var _this = this;
            var content_provider = {
                getElements: function (item, handler) {
                    handler(item);
                },
                hasChildren: function (item, handler) {
                    handler(false);
                },
                getChildren: function (item, handler) { return []; }
            };
            var label_provider = {
                getText: function (item) { return item.getLabel(); },
                getDescription: function (item) { return null; },
                getIcon: function (item) { return null; },
                getCssClass: function (item) { return ""; }
            };
            var filters = [];
            for (var i = 0; i < this.wildcardFilter.filters.length; i++) {
                var f = this.wildcardFilter.filters[i];
                var d = FilterEditList.createEmptyFilterData();
                d.filter = f;
                filters.push(d);
            }
            if (filters.length == 0) {
                filters.push(FilterEditList.createEmptyFilterData());
            }
            this.filterList = new FilterEditList(this.filterListPanel.get(0), content_provider, label_provider);
            this.filterList.setWildcardProvider(function () { return _this.wildcardFilter.wildcards; });
            this.filterList.setEditMode(true);
            this.filterList.on("selectionChanged", function (filterData) {
                _this.updateFilterOptionPanel(filterData);
            });
            this.filterList.on("removeFilter", function (args) {
                _this.wildcardFilter.remove(args.filter);
            });
            this.filterList.on("insertFilterAfter", function (args) {
                _this.wildcardFilter.insertAfter(args.afterWhat, args.filter);
            });
            this.filterList.on("addFilter", function (args) {
                _this.wildcardFilter.add(args.filter);
            });
            this.filterList.on("changeFilter", function (args) {
                _this.wildcardFilter.replace(args.filterToReplace, args.filter);
            });
            this.filterList.on("moveUpFilter", function (args) {
                _this.wildcardFilter.move(-1, args.filter);
            });
            this.filterList.on("moveDownFilter", function (args) {
                _this.wildcardFilter.move(+1, args.filter);
            });
            this.filterList.setInput(filters);
            if (filters.length > 0) {
                this.filterList.setSelection(filters[0]);
            }
            else {
                this.updateFilterOptionPanel(null);
            }
        };
        WildcardFilterEdit.prototype.updateFilterOptionPanel = function (filterData) {
            var _this = this;
            var options_container = this.filterOptionsPanel;
            options_container.children().remove();
            var filter = filterData ? filterData.filter : null;
            var editor = null;
            if (filter instanceof InstanceCountFilter) {
                editor = new FilterByCountEdit(this.counterProvider.getCounters(), this.wildcardFilter.wildcards);
            }
            else if (filter instanceof InstanceValueFilter) {
                editor = new FilterByValueEdit(this.counterProvider.getCounters(), this.wildcardFilter.wildcards);
            }
            else if (filter instanceof InstanceNameFilter) {
                editor = new FilterByNameEdit();
            }
            else {
                $("<div>").appendTo(options_container).addClass("empty_filter_options").text(APPMSG.WildcardFilterEdit_emptyFilter);
            }
            if (editor) {
                editor.createContents(options_container);
                editor.updateContents(filter);
                editor.on("fieldChanged", function (filter) {
                    var lbl = filter.getLabel();
                    filterData.filterListItemCombobox.setText(lbl);
                    filterData.filterListItemCombobox.setErrorState(!filter.isValid());
                    _this.wildcardFilter.emit("filtersChanged", {});
                });
            }
        };
        return WildcardFilterEdit;
    }(Evented));
    return WildcardFilterEdit;
});
