var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented", "jrptlib/Form", "jrptlib/CustomComboBox", "model/counters/ComponentType", "jrptlib/Properties!APPMSG"], function (require, exports, Evented, Form, CustomComboBox, ComponentType, APPMSG) {
    "use strict";
    var CounterComponentEdit = (function (_super) {
        __extends(CounterComponentEdit, _super);
        function CounterComponentEdit(container) {
            _super.call(this);
            this.createContents(container);
        }
        CounterComponentEdit.getComponents = function (counterQuery, handler) {
            var ctype = counterQuery.counterType;
            if (ctype) {
                for (var _i = 0, _a = ctype.components(); _i < _a.length; _i++) {
                    var name_1 = _a[_i];
                    handler(name_1, ctype.component(name_1));
                }
            }
            if (!counterQuery.isCumulated) {
                handler("FirstTime/Absolute", ComponentType.TIME);
                handler("FirstTime/Relative", ComponentType.DURATION);
                handler("FirstTime/Elapsed", ComponentType.DURATION);
            }
        };
        CounterComponentEdit.prototype.createCounterOptionPanel_counterComponent = function (container) {
            var parent = document.createElement("span");
            this.counterComponent = new CustomComboBox(parent);
            this.counterComponent.setSource(function (request, response) { });
            this.counterComponent.setSelect(function (event, ui) { });
            this.counterComponent.setRenderMenu(function (autocomplete, ul, items) {
                $.each(items, function (index, item) {
                    var li = null;
                    if (item.data && item.data.children) {
                        ul.append("<li class='ui-autocomplete-category'>" + item.label + "</li>");
                    }
                    else {
                        li = autocomplete._renderItemData(ul, item);
                    }
                });
            });
            var cbox = document.createElement("div");
            $(this.counterComponent.getContainer()).appendTo($(cbox));
            $(cbox).appendTo(container);
            this.resizeContents();
        };
        CounterComponentEdit.prototype.resizeContents = function () {
            var container = $(this.counterComponent.getContainer());
            var cbox = container.parent();
            var input = container.find("input");
            input.css("width", cbox.width() - 60);
            input.css("margin-bottom", 0);
        };
        CounterComponentEdit.prototype.setIsCumulatedEnabled = function (enabled) {
            if (enabled) {
                this.counterIsCumulated.removeAttr("disabled");
                this.counterIsCumulatedLabel.removeAttr("disabled");
            }
            else {
                this.counterIsCumulated.attr("disabled", "disabled");
                this.counterIsCumulatedLabel.attr("disabled", "disabled");
            }
        };
        CounterComponentEdit.prototype.createContents = function (container) {
            var option_panel = $(container);
            var form = $("<form>").appendTo(option_panel).attr("id", "CounterComponentEditForm");
            this.form = form;
            var table = $("<table>").appendTo(form);
            table.css("width", "100%");
            var row = $("<tr>").appendTo(table);
            var _this = this;
            var cell = $("<td>").appendTo(row);
            cell.css("width", "0%");
            this.counterComponentLabel = $("<label>").appendTo(cell).text(APPMSG.VS_OptionPanel_Component);
            cell = $("<td>").appendTo(row);
            this.createCounterOptionPanel_counterComponent(cell);
            row = $("<tr>").appendTo(table);
            cell = $("<td>").attr("colspan", "2").appendTo(row);
            if (!(CounterComponentEdit.globalIndexer))
                CounterComponentEdit.globalIndexer = 0;
            var uid = "counter_is_cumulated-" + (CounterComponentEdit.globalIndexer++);
            this.counterIsCumulated = $("<input>").appendTo(cell).attr("id", uid)
                .attr("type", "checkbox")
                .prop("checked", "false")
                .change(function (event) {
            });
            this.counterIsCumulatedLabel = $("<label>").appendTo(cell).attr("for", uid).text(APPMSG.VS_OptionPanel_CumulatedCounter);
            row = $("<tr>").appendTo(table);
            cell = $("<td>").appendTo(row);
            $("<label>").appendTo(cell).text(APPMSG.VS_OptionPanel_Label);
            cell = $("<td>").appendTo(row);
            this.counterLabel = $("<input>").appendTo(cell)
                .attr("type", "text")
                .attr("readonly", "true")
                .change(function () {
            });
            row = $("<tr>").appendTo(table);
            cell = $("<td>").appendTo(row);
            $("<label>").appendTo(cell).text(APPMSG.VS_OptionPanel_Path);
            cell = $("<td>").appendTo(row);
            this.counterPath = $("<input>").appendTo(cell)
                .attr("type", "text")
                .attr("readonly", "true")
                .change(function () {
            });
            row = $("<tr>").appendTo(table);
            cell = $("<td>").appendTo(row);
            $("<label>").appendTo(cell).text(APPMSG.VS_OptionPanel_Unit);
            cell = $("<td>").appendTo(row);
            this.unit = $("<input>").appendTo(cell)
                .attr("type", "text")
                .attr("readonly", "true")
                .change(function () {
            });
            var form_object = new Form(form, null);
        };
        CounterComponentEdit.prototype.updateCounterComponentSource = function (counterQuery, model) {
            var _this = this;
            var last_updated_counter_query = counterQuery;
            this.counterComponent.setSource(function (request, response) {
                var contents = new Array();
                if (last_updated_counter_query) {
                    CounterComponentEdit.getComponents(last_updated_counter_query, function (key, cc) {
                        var req = request ? request.term : null;
                        var label = cc.label(key);
                        if (req && req.length > 0) {
                            if (label.indexOf(req) != -1) {
                                contents.push({ label: label, value: label, componentKey: key, data: cc });
                            }
                        }
                        else {
                            contents.push({ label: label, value: label, componentKey: key, data: cc });
                        }
                    });
                }
                response(contents);
            });
            this.counterComponent.setSelect(function (event, ui) {
                var ct = ui.item.data;
                counterQuery.setComponent(ui.item.componentKey);
                _this.emit("counterComponentChanged", { componentType: ct, componentKey: ui.item.componentKey, counterQuery: counterQuery, model: model });
            });
        };
        CounterComponentEdit.prototype.updateContents = function (counterQuery, model) {
            var _this = this;
            if (counterQuery == null)
                return;
            var ctype = counterQuery.counterType;
            var is_void = !(ctype) || ctype == null;
            if (is_void) {
                this.form.hide();
            }
            else {
                this.form.show();
                this.updateCounterComponentSource(counterQuery, model);
                var path = counterQuery.path();
                var cq = counterQuery;
                var is_cumulated = cq ? cq.isCumulated : false;
                this.counterIsCumulated.attr("checked", is_cumulated ? "true" : "false");
                var selected = null;
                var keys_count = 0;
                var component = cq.component;
                CounterComponentEdit.getComponents(cq, function (compname, comptype) {
                    var is_selected = component && compname == component;
                    if (is_selected)
                        selected = comptype.label(compname);
                    keys_count++;
                });
                this.counterComponent.setText(selected != null ? selected : "");
                if (keys_count > 1) {
                    this.counterComponentLabel.show();
                    $(this.counterComponent.getContainer()).show();
                }
                else {
                    this.counterComponentLabel.hide();
                    $(this.counterComponent.getContainer()).hide();
                }
                this.counterLabel.val(counterQuery ? counterQuery.label() : "");
                this.counterPath.val(path);
                var nlu = counterQuery.nlunit();
                var sunit = nlu ? nlu : "";
                this.unit.val(sunit);
                this.counterIsCumulated
                    .prop("checked", counterQuery.isCumulated)
                    .unbind("change")
                    .change(function (event) {
                    var isCumulated = _this.counterIsCumulated.prop("checked");
                    counterQuery.setCumulated(isCumulated);
                    _this.emit("counterCumulatedChanged", { counterQuery: counterQuery, model: model });
                });
                this.form.draggable({
                    helper: function (event) {
                        return $("<div class='draggable_counter_helper'>" + counterQuery.label() + "</div>");
                    },
                    appendTo: 'body',
                    zIndex: 99999,
                    cursorAt: { left: 0, top: 0 },
                    stop: function (event, ui) { $(this).draggable('option', 'revert', true); },
                    revert: true,
                    start: function (event, ui) {
                        _this.form.data("counterQuery", counterQuery);
                    }
                });
                this.form.mouseenter(function () {
                    $(_this.form).addClass("hover_draggable_area");
                }).mouseleave(function () {
                    $(this.form).removeClass("hover_draggable_area");
                });
                this.resizeContents();
            }
        };
        CounterComponentEdit.globalIndexer = undefined;
        return CounterComponentEdit;
    }(Evented));
    return CounterComponentEdit;
});
