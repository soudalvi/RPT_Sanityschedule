var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented"], function (require, exports, Evented) {
    "use strict";
    function null2str(v) {
        return v ? v : "__NULL__";
    }
    function str2null(v) {
        return v == "__NULL__" ? null : v;
    }
    function value(option) {
        return $.isFunction(option.value) ? option.value() : option.value;
    }
    var Field = (function () {
        function Field(option) {
            this.option = option;
        }
        Field.prototype.create = function (container) {
            this.widget = this.doCreate(this.option, container);
        };
        Field.prototype.update = function () {
            this.doUpdate(value(this.option), this.widget);
        };
        Field.prototype.isLabelAfter = function () {
            return false;
        };
        return Field;
    }());
    var TextField = (function (_super) {
        __extends(TextField, _super);
        function TextField() {
            _super.apply(this, arguments);
        }
        TextField.prototype.doCreate = function (option, container) {
            var _this = this;
            var handler = function () {
                if (option.change)
                    option.change($(opt).val(), false);
                _this.modified = true;
            };
            var opt = $("<input>")
                .appendTo($(container))
                .attr("id", option.id)
                .attr("type", option.type)
                .change(handler)
                .keypress(function () {
                var interval = setInterval(function () {
                    handler();
                    clearInterval(interval);
                }, 300);
            });
            return opt;
        };
        TextField.prototype.doUpdate = function (value, widget) {
            widget.val(value);
        };
        return TextField;
    }(Field));
    var NumberField = (function (_super) {
        __extends(NumberField, _super);
        function NumberField() {
            _super.apply(this, arguments);
        }
        NumberField.prototype.doCreate = function (option, container) {
            var opt = _super.prototype.doCreate.call(this, option, container);
            if (option.type === "NUMBER") {
                if (typeof option.min !== 'undefined')
                    opt.attr("min", option.min);
                if (typeof option.step !== 'undefined')
                    opt.attr("step", option.step);
                opt.css("padding", "0.4em");
            }
            return opt;
        };
        return NumberField;
    }(TextField));
    var BooleanField = (function (_super) {
        __extends(BooleanField, _super);
        function BooleanField() {
            _super.apply(this, arguments);
        }
        BooleanField.prototype.doCreate = function (option, container) {
            var _this = this;
            return $("<input>")
                .appendTo($(container))
                .attr("id", option.id)
                .attr("type", "checkbox")
                .change(function () {
                if (option.change)
                    option.change($(this).prop("checked"), false);
                _this.modified = true;
            });
        };
        BooleanField.prototype.isLabelAfter = function () {
            return true;
        };
        BooleanField.prototype.doUpdate = function (value, widget) {
            widget.prop("checked", value);
        };
        return BooleanField;
    }(Field));
    var RadioField = (function (_super) {
        __extends(RadioField, _super);
        function RadioField() {
            _super.apply(this, arguments);
        }
        RadioField.prototype.doCreate = function (option, container) {
            var _this = this;
            return $("<input>")
                .appendTo($(container))
                .attr("id", option.id)
                .attr("type", "radio")
                .attr("name", option.name)
                .change(function () {
                if (option.change)
                    option.change($(this).prop("checked"), false);
                _this.modified = true;
            });
        };
        RadioField.prototype.isLabelAfter = function () {
            return true;
        };
        RadioField.prototype.doUpdate = function (value, widget) {
            widget.prop("checked", value);
        };
        return RadioField;
    }(Field));
    var YesNoField = (function (_super) {
        __extends(YesNoField, _super);
        function YesNoField() {
            _super.apply(this, arguments);
        }
        YesNoField.prototype.doCreate = function (option, container) {
            var _this = this;
            return $("<input>")
                .appendTo($(container))
                .attr("id", option.id)
                .attr("type", "radio")
                .change(function () {
                _this.modified = true;
                if (option.change)
                    option.change($(this).val(), false);
            });
        };
        YesNoField.prototype.doUpdate = function (value, widget) {
            widget.val(value);
        };
        return YesNoField;
    }(Field));
    var SelectField = (function (_super) {
        __extends(SelectField, _super);
        function SelectField() {
            _super.apply(this, arguments);
        }
        SelectField.prototype.doCreate = function (option, container) {
            var _this = this;
            var opt = $("<select>")
                .appendTo($(container))
                .attr("id", option.id)
                .change(function () {
                _this.modified = true;
                if (option.change)
                    option.change(str2null($(this).val()), false);
            });
            return opt;
        };
        SelectField.prototype.update = function () {
            var v = this.option.values;
            var opt = this.widget;
            opt.children("option").remove();
            var values = $.isFunction(v) ? v() : v;
            for (var i = 0; i < values.length; i++) {
                $("<option value='" + null2str(values[i].value) + "'>" + values[i].label + "</option>").appendTo($(opt));
            }
            _super.prototype.update.call(this);
        };
        SelectField.prototype.doUpdate = function (value, widget) {
            widget.val(null2str(value));
            if (widget.data("ui-selectmenu"))
                widget.selectmenu("refresh");
        };
        return SelectField;
    }(Field));
    function createField(option) {
        switch (option.type) {
            case "TEXT":
                return new TextField(option);
            case "NUMBER":
                return new NumberField(option);
            case "BOOLEAN":
                return new BooleanField(option);
            case "RADIO":
                return new RadioField(option);
            case "YESNO":
                return new YesNoField(option);
            case "SELECT":
                return new SelectField(option);
            default:
                throw "Unhandled option type " + option.type;
        }
    }
    var OptionProvider = (function (_super) {
        __extends(OptionProvider, _super);
        function OptionProvider() {
            _super.call(this);
            this.options = [];
        }
        OptionProvider.prototype.addOption = function (option) {
            this.options.push(option);
            return option;
        };
        OptionProvider.prototype.changeOption = function (id, value) {
            function apply(option) {
                if (option.change) {
                    option.change(value, true);
                }
            }
            if (this.fields) {
                for (var _i = 0, _a = this.fields; _i < _a.length; _i++) {
                    var f = _a[_i];
                    if (f.option.id === id) {
                        apply(f.option);
                    }
                    f.update();
                }
            }
            else {
                for (var _b = 0, _c = this.options; _b < _c.length; _b++) {
                    var option = _c[_b];
                    if (option.id === id) {
                        apply(option);
                    }
                }
            }
        };
        OptionProvider.prototype.save = function (to) {
            if (!this.fields)
                return;
            for (var _i = 0, _a = this.fields; _i < _a.length; _i++) {
                var f = _a[_i];
                if (f.modified) {
                    to.changeOption(f.option.id, f.option.value());
                }
            }
        };
        OptionProvider.prototype.getOptions = function () {
            return this.options;
        };
        OptionProvider.prototype.createWidgets = function (container) {
            this.fields = [];
            for (var _i = 0, _a = this.options; _i < _a.length; _i++) {
                var o = _a[_i];
                var field = createField(o);
                this.createWidget(field, this.createWidgetContainer(container));
                this.fields.push(field);
            }
        };
        OptionProvider.prototype.createWidgetContainer = function (container) {
            return container;
        };
        OptionProvider.prototype.createWidget = function (field, container) {
            function addLabel() {
                $("<label>")
                    .appendTo($(container))
                    .attr("for", option.id)
                    .css("margin-right", "10px")
                    .text(option.label);
            }
            var option = field.option;
            var label_after_option = option.label && field.isLabelAfter();
            if (!label_after_option)
                addLabel();
            field.create(container);
            if (label_after_option)
                addLabel();
        };
        OptionProvider.prototype.update = function () {
            if (!this.fields)
                return;
            for (var _i = 0, _a = this.fields; _i < _a.length; _i++) {
                var f = _a[_i];
                f.update();
            }
        };
        return OptionProvider;
    }(Evented));
    exports.OptionProvider = OptionProvider;
    var ListOptionProvider = (function (_super) {
        __extends(ListOptionProvider, _super);
        function ListOptionProvider() {
            _super.apply(this, arguments);
        }
        ListOptionProvider.prototype.createWidgetContainer = function (container) {
            return $("<li>").appendTo(container);
        };
        return ListOptionProvider;
    }(OptionProvider));
    exports.ListOptionProvider = ListOptionProvider;
});
