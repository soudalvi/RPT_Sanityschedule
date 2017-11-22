var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented"], function (require, exports, Evented) {
    "use strict";
    var Form = (function (_super) {
        __extends(Form, _super);
        function Form(form, message) {
            _super.call(this);
            this.form = $(form);
            $(form).addClass("ui-form");
            $(form).find("input").addClass("ui-widget-content ui-corner-all");
            $(form).find("textarea").addClass("ui-widget-content ui-corner-all");
            var _this = this;
            $(form).find("select").each(function () {
                $(this).selectmenu({
                    change: function (event, data) {
                        $(this).trigger('change');
                    }
                });
            });
            $(form).find("input").each(function () {
                _this.associateChangeEvent(this);
            });
            $(form).find("select").each(function () {
                _this.associateChangeEvent(this);
            });
            $(form).find("textarea").each(function () {
                _this.associateChangeEvent(this);
            });
            this.message = message;
            $(this.message).addClass("ui-form-message");
            this.info_message = $(this.message).text();
            $(form).on("submit", function (event) {
                event.preventDefault();
                _this.emit("submit", form);
            });
            var submit = $(form).find("input[type='submit']");
            if (submit.length == 0) {
                submit = $("<input type=\"submit\">")
                    .appendTo($(form));
            }
            $(submit).css("position", "absolute");
            $(submit).css("top", "-1000px");
            $(submit).attr("tabindex", "-1");
        }
        Form.prototype.reset = function () {
            this.form.trigger("reset");
            $(this.form).find("select").selectmenu('refresh');
        };
        Form.prototype.addFieldSet = function (type) {
            return $("<fieldset>").appendTo($(this.form));
        };
        Form.prototype.addField = function (parent, type, name, label, values) {
            if (label) {
                $("<label>")
                    .appendTo($(parent))
                    .attr("for", name)
                    .text(label);
            }
            var widget = null;
            if (type === "TEXTAREA") {
                widget = $("<textarea>")
                    .appendTo($(parent))
                    .attr("id", name)
                    .attr("type", "text")
                    .attr("name", name);
                this.associateChangeEvent(widget);
            }
            else if (type === "TEXT") {
                widget = $("<input>")
                    .appendTo($(parent))
                    .attr("id", name)
                    .attr("type", "text")
                    .attr("name", name);
                this.associateChangeEvent(widget);
            }
            else if (type === "CHECKBOX") {
                widget = $("<input>")
                    .appendTo($(parent))
                    .attr("id", name)
                    .attr("name", name)
                    .attr("type", "checkbox");
                this.associateChangeEvent(widget);
            }
            else if (type === "RADIO") {
                widget = $("<input>")
                    .appendTo($(parent))
                    .attr("id", name)
                    .attr("name", name)
                    .attr("type", "radio");
                this.associateChangeEvent(widget);
            }
            else if (type === "SELECT") {
                widget = $("<select>")
                    .appendTo($(parent))
                    .attr("id", name)
                    .attr("name", name);
                this.associateChangeEvent(widget);
                for (var i = 0; i < values.length; i++) {
                    $("<option value='" +
                        values[i].value + "'>" + values[i].label + "</option>").appendTo($(widget));
                }
            }
            $(widget).addClass("ui-widget-content ui-corner-all");
            return widget;
        };
        Form.prototype.associateChangeEvent = function (field) {
            var _this = this;
            var createChangeEvent = function (value) {
                return {
                    field: field,
                    name: $(field).attr("name"),
                    value: value
                };
            };
            if ($(field).is("input")) {
                if ($(field).attr("type") === "checkbox"
                    || $(field).attr("type") === "radio") {
                    $(field).change(function (event) {
                        _this.emit("modified", createChangeEvent($(field).prop("checked")));
                    });
                }
                else if ($(field).attr("type") === "text") {
                    $(field).keypress(function (event) {
                        var interval = setInterval(function () {
                            _this.emit("modified", createChangeEvent($(field).val()));
                            clearInterval(interval);
                        }, 300);
                    });
                }
            }
            else if ($(field).is("select")) {
                $(field).change(function (event) {
                    _this.emit("modified", createChangeEvent($(field).val()));
                });
            }
            else if ($(field).is("textarea")) {
                $(field).keypress(function (event) {
                    var interval = setInterval(function () {
                        _this.emit("modified", createChangeEvent($(field).val()));
                        clearInterval(interval);
                    }, 300);
                });
            }
        };
        Form.prototype.setErrorMessage = function (text) {
            if (text == null) {
                $(this.message).text(this.info_message);
                $(".sign-error").removeClass("sign-error");
                $(this.message).removeClass("ui-form-error");
                return;
            }
            if (this.message) {
                $(this.message).text(text);
                $(this.message).addClass("ui-form-error");
                $("<img>")
                    .attr("src", "/analytics/web/images/sign-error.png")
                    .addClass("sign-error")
                    .prependTo($(this.message));
            }
        };
        Form.prototype.setMessage = function (text) {
            if (this.message) {
                this.info_message = text;
                $(this.message).text(text);
            }
        };
        Form.prototype.setErrorField = function (selector) {
            if (selector == null) {
                $(this.error_field).removeClass("ui-form-error");
                this.error_field = null;
                return;
            }
            this.error_field = $(this.form).find(selector).addClass("ui-form-error");
        };
        Form.prototype.setValue = function (selector, value) {
            var input = $(this.form).find(selector);
            if ($(input).attr("type") == "checkbox"
                || $(input).attr("type") == "radio") {
                $(input).prop("checked", value);
            }
            else {
                $(input).val(value);
                if ($(input).is("select")) {
                    $(input).selectmenu("refresh");
                }
            }
        };
        Form.prototype.getValue = function (selector) {
            var input = $(this.form).find(selector);
            if ($(input).attr("type") == "checkbox"
                || $(input).attr("type") == "radio") {
                return $(input).prop("checked");
            }
            else
                return $(input).val();
        };
        return Form;
    }(Evented));
    return Form;
});
