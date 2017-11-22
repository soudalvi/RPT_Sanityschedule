var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented", "jrptlib/Form", "ui/ViewsFactory", "ui/CounterContentProvider", "edit/CounterEditList", "edit/WildcardFilterEdit", "edit/CounterComponentEdit", "ui/OptionProvider", "ui/HelpContextIds"], function (require, exports, Evented, Form, ViewsFactory, CounterContentProvider, CounterEditList, WildcardFilterEdit, CounterComponentEdit, OptionProvider_1, HelpContextIds) {
    "use strict";
    function isQueryView(view) {
        return "getCounterQuerySet" in view;
    }
    var ViewEdit = (function (_super) {
        __extends(ViewEdit, _super);
        function ViewEdit(view) {
            _super.call(this);
            this.initialized = false;
            this.view = view;
            this.container = $("#view_edit_panel");
            $("#view_edit_panel .help-button").button();
            if (!this.initialized) {
                _app.getHelpSystem().setHelp($("#view_edit_panel .help-button"), HelpContextIds.VIEW_EDIT, {
                    of: $("#view_edit_panel header"),
                    my: "left+20px top+15", at: "left bottom", collision: "none"
                });
                this.initialized = true;
            }
        }
        ViewEdit.prototype.resizeContents = function () {
            var h = window.innerHeight;
            var w = window.innerWidth;
            $(this.container)
                .css("min-height", h)
                .outerWidth(w);
            if (this.counterList)
                this.counterList.resizeContents();
            if (this.counterComponentEdit)
                this.counterComponentEdit.resizeContents();
            if (this.preview)
                this.preview.resizeContents();
        };
        ViewEdit.prototype.edit = function () {
            var _this = this;
            this.signal = _app.on("windowResized", function () {
                _this.resizeContents();
            });
            this.resizeContents();
            this.window_scroll_top = $(window).scrollTop();
            this.window_scroll_left = $(window).scrollLeft();
            window.scrollBy(-this.window_scroll_left, -this.window_scroll_top);
            this.old_focused = $(':focus');
            $(this.container).css("position", "absolute")
                .css("left", window.innerWidth)
                .css("top", 0)
                .show()
                .animate({
                left: "0px"
            }, 1000, function () {
                $("#content").hide();
                $("#app_header").hide();
                $(".cancel-button").focus();
            });
            $(".cancel-button").button().click(function () {
                _this.close();
                _this.emit("cancelChanges", {});
            });
            this.setApplyClickFunction();
            if (!isQueryView(this.view)) {
                $(this.container).find(".counter_list_panel").hide();
                $(this.container).find(".counter_options_panel_arrow").hide();
                $(this.container).find(".counter_options_panel").hide();
                $(this.container).find("#filters_container").hide();
                this.createPreview();
                this.createViewOptionPanel();
            }
            else {
                $(this.container).find(".counter_list_panel").show();
                $(this.container).find(".counter_options_panel_arrow").show();
                $(this.container).find(".counter_options_panel").show();
                $(this.container).find("#filters_container").show();
                this.counterProvider = new CounterContentProvider(this.view.getSession(), function () {
                    _this.createViewOptionPanel();
                    _this.createCounterList();
                    _this.updateFilters();
                });
                this.createPreview();
                this.createCounterOptionPanel();
            }
        };
        ViewEdit.prototype.setApplyClickFunction = function () {
            var _this = this;
            $(".apply-button").button()
                .unbind("click")
                .click(function () {
                _this.apply();
                _this.emit("applyChanges", {});
            });
        };
        ViewEdit.prototype.close = function () {
            this.signal.remove();
            $("#content").show();
            $("#app_header").show();
            $(".cancel-button").unbind();
            $(".apply-button").unbind();
            if (isQueryView(this.view)) {
                this.counterList.destroy();
            }
            this.preview.destroy();
            var _this = this;
            $(this.container)
                .animate({
                left: window.innerWidth + "px"
            }, 1000, function () {
                $(this).hide();
                window.scrollBy(_this.window_scroll_left, _this.window_scroll_top);
                _this.old_focused.focus();
            });
        };
        ViewEdit.prototype.apply = function () {
            var view_node = this.view.getModel();
            if (isQueryView(this.view)) {
                var cqs = $(view_node).find("counterQueries");
                if (cqs.length > 0)
                    $(cqs).children().remove();
                else {
                    cqs = $($.parseXML("<counterQueries/>").documentElement);
                    $(cqs).appendTo(view_node);
                }
                for (var i = 0; i < this.cqSet.counterQueries.length; i++) {
                    var cq = this.cqSet.counterQueries[i];
                    var nlunit = this.cqSet.getUnitLabel(cq);
                    var counterInfo = $.parseXML("<QueryInfo/>").documentElement;
                    $(counterInfo).attr("path", cq.path())
                        .attr("label", cq.counterLabel)
                        .attr("unit", cq.unit.id)
                        .attr("nlunit", nlunit)
                        .appendTo($(cqs));
                    if (cq.componentType) {
                        $(counterInfo).attr("componentType", cq.componentType.toString());
                    }
                    if (cq.counterType) {
                        $(counterInfo).attr("counterType", cq.counterType.toString());
                    }
                }
                var wfs = $(view_node).find("wildcardOptions");
                if (wfs.length > 0) {
                    $(wfs).children().remove();
                }
                else {
                    wfs = $($.parseXML("<wildcardOptions/>").documentElement);
                    $(wfs).appendTo(view_node);
                }
                for (var i = 0; i < this.cqSet.wildcardOptions.length; i++) {
                    var wf = this.cqSet.wildcardOptions[i];
                    wf.saveToView($(wfs));
                }
            }
            this.close();
            if (!this.viewOptions) {
                this.viewOptions = new OptionProvider_1.OptionProvider();
                this.view.createOptions(this.viewOptions, this.counterProvider);
            }
            this.previewOptions.save(this.viewOptions);
            this.view.update();
        };
        ViewEdit.prototype.createPreview = function () {
            this.preview = new ViewsFactory().create($(this.container).find(".view_preview")[0], this.view.getPage(), "preview-" + this.view.getModel().nodeName, this.view.getModel(), this.view.getInstances());
            this.preview.setSession(this.view.getSession());
            this.preview.show();
            var p = this.preview;
            if (isQueryView(p)) {
                this.cqSet = p.getCounterQuerySet();
            }
        };
        ViewEdit.prototype.createViewOptionPanel = function () {
            var option_panel = $(this.container).find(".view_options");
            $(option_panel).children().remove();
            this.previewOptions = new OptionProvider_1.ListOptionProvider();
            this.preview.createOptions(this.previewOptions, this.counterProvider);
            var form = $("<form>").appendTo($(option_panel));
            var ul = $("<ul>").appendTo($(form));
            this.previewOptions.createWidgets(ul);
            this.previewOptions.update();
            new Form(form, null);
        };
        ViewEdit.prototype.createCounterList = function () {
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
                getText: function (item) {
                    return item.label;
                },
                getDescription: function (item) {
                    return null;
                },
                getIcon: function (item) {
                    return null;
                },
                getCssClass: function (item) {
                    return "";
                }
            };
            var counters = [];
            for (var i = 0; i < this.cqSet.counterQueries.length; i++) {
                var cq = this.cqSet.counterQueries[i];
                counters.push({ label: cq.counterLabel,
                    path: cq.path(),
                    unit: cq.unit.id,
                    nlunit: this.cqSet.getUnitLabel(cq),
                    counterType: cq.counterType,
                    componentType: cq.componentType,
                    counterQuery: cq });
            }
            if (counters.length == 0) {
                counters.push({ label: "",
                    path: "",
                    unit: "",
                    nlunit: "",
                    counterType: null,
                    componentType: null,
                    counterQuery: null });
            }
            this.counterList = new CounterEditList($(this.container).find(".counter_list").get(0), this.counterProvider.getCounters());
            this.counterList.setContentProvider(content_provider);
            this.counterList.setLabelProvider(label_provider);
            this.counterList.setWildcardsProvider(function () { return _this.cqSet.rawWildcards; });
            this.counterList.setEditMode(true);
            this.counterList.on("selectionChanged", function (counter) {
                _this.updateCounterOptionPanel(counter);
            });
            this.counterList.on("removeCounter", function (args) {
                _this.cqSet.remove(args.counterQuery);
                _this.counterQuerySetChanged();
                _this.updateFilters();
            });
            this.counterList.on("insertCounterAfter", function (args) {
                var cq = _this.cqSet.insertAfter(args.counterQuery, args.counter.counterType, args.counter.componentType, args.counter.unit, args.counter.nlunit, args.counter.path, args.counter.label);
                args.counter.counterQuery = cq;
                _this.counterQuerySetChanged();
                _this.updateFilters();
            });
            this.counterList.on("addCounter", function (args) {
                var cq = _this.cqSet.add(args.counter.counterType, args.counter.componentType, args.counter.unit, args.counter.nlunit, args.counter.path, args.counter.label);
                args.counter.counterQuery = cq;
                _this.counterQuerySetChanged();
                _this.updateFilters();
            });
            this.counterList.on("changeCounter", function (args) {
                var cq = _this.cqSet.modify(args.counterQuery, args.counter.counterType, args.counter.componentType, args.counter.unit, args.counter.nlunit, args.counter.path, args.counter.label);
                args.counter.counterQuery = cq;
                _this.counterQuerySetChanged();
                _this.updateFilters();
            });
            this.counterList.on("moveUpCounter", function (args) {
                var cq = _this.cqSet.move(-1, args.counterQuery);
                args.counter.counterQuery = cq;
            });
            this.counterList.on("moveDownCounter", function (args) {
                var cq = _this.cqSet.move(+1, args.counterQuery);
                args.counter.counterQuery = cq;
            });
            this.counterList.setInput(counters);
            if (counters.length > 0)
                this.counterList.setSelection(counters[0]);
        };
        ViewEdit.prototype.counterQuerySetChanged = function () {
            var p = this.preview;
            if (isQueryView(p)) {
                p.counterQuerySetChanged();
                this.previewOptions.update();
            }
        };
        ViewEdit.prototype.updateFilters = function () {
            if ((!this.cqSet || !this.cqSet.wildcardOptions || this.cqSet.wildcardOptions.length == 0)) {
                $("#filters_container").hide();
            }
            else {
                var container = $("#filters_container");
                container.show();
                container.children().remove();
                var _this = this;
                for (var i = 0; i < this.cqSet.wildcardOptions.length; i++) {
                    var wf = this.cqSet.wildcardOptions[i];
                    var editor = new WildcardFilterEdit(container, this.counterProvider, this.cqSet, wf);
                    wf.on("filtersChanged", function () { _this._onFiltersChanged(); });
                }
            }
        };
        ViewEdit.prototype._onFiltersChanged = function () {
            var valid = true;
            if (this.cqSet.wildcardOptions) {
                for (var i = 0; i < this.cqSet.wildcardOptions.length; i++) {
                    valid = this.cqSet.wildcardOptions[i].isValid();
                    if (!valid)
                        break;
                }
            }
            if (valid) {
                $(".apply-button").removeClass("ui-button-disabled ui-state-disabled");
                this.setApplyClickFunction();
            }
            else {
                $(".apply-button").addClass("ui-button-disabled ui-state-disabled")
                    .unbind("click");
            }
        };
        ViewEdit.prototype.createCounterOptionPanel = function () {
            var _this = this;
            var option_panel = $(this.container).find(".counter_options");
            $(option_panel).children().remove();
            this.counterComponentEdit = new CounterComponentEdit(option_panel);
            this.counterComponentEdit.on("counterComponentChanged", function (args) {
                var counter = args.model;
                counter.componentType = args.componentType;
                counter.component = args.componentKey;
                _this.onCounterModified(counter);
            });
            this.counterComponentEdit.on("counterCumulatedChanged", function (args) {
                var counter = args.model;
                counter.isCumulated = args.counterQuery.isCumulated;
                _this.onCounterModified(counter);
            });
        };
        ViewEdit.prototype.updateCounterOptionPanel = function (counter) {
            if (counter == null)
                return;
            var ctype = counter.counterType;
            var is_void = !(ctype) || ctype == null;
            if (is_void) {
                $(this.container).find(".counter_options").hide();
                $(this.container).find(".empty_counter_options").show();
            }
            else {
                $(this.container).find(".empty_counter_options").hide();
                $(this.container).find(".counter_options").show();
                this.counterComponentEdit.updateContents(counter.counterQuery, counter);
            }
        };
        ViewEdit.prototype.onCounterModified = function (counter) {
            counter.path = counter.counterQuery.path();
            this.counterList.emit("changeCounter", { counterQuery: counter.counterQuery, counter: counter });
            counter.path = counter.counterQuery.path();
            this.counterComponentEdit.updateContents(counter.counterQuery, counter);
            if (counter.counterlistItemCombobox) {
                counter.counterlistItemCombobox.setText(counter.counterQuery.label());
            }
        };
        return ViewEdit;
    }(Evented));
    return ViewEdit;
});
