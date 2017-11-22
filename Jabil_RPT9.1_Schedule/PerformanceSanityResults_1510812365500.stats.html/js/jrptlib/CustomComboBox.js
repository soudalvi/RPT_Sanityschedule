var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Widget"], function (require, exports, Widget) {
    "use strict";
    var CustomComboBox = (function (_super) {
        __extends(CustomComboBox, _super);
        function CustomComboBox(container) {
            _super.call(this, container);
            this.setClassName("custom-combobox");
            this.createAutocomplete();
            this.createShowAllButton();
        }
        CustomComboBox.prototype.createAutocomplete = function () {
            var autocomp = this;
            var _this = this;
            this.input = $("<input>")
                .appendTo($(this.container))
                .attr("title", "")
                .addClass("custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left")
                .autocomplete({
                position: { my: "left top", at: "left bottom", collision: "flip" },
                delay: 0,
                minLength: 0,
                source: $.proxy(this, "_source"),
                select: autocomp.select
            });
            $(this.input).tooltip({
                tooltipClass: "ui-state-highlight"
            });
            $(this.input).autocomplete("widget").menu("option", "items", "> :not(.ui-autocomplete-category)");
        };
        CustomComboBox.prototype.setRenderMenu = function (renderFunction) {
            $(this.input).autocomplete("instance")._renderMenu = function (ul, item) {
                return renderFunction(this, ul, item);
            };
        };
        CustomComboBox.prototype.setRenderItem = function (renderFunction) {
            $(this.input).autocomplete("instance")._renderItem = function (ul, item) {
                return renderFunction(this, ul, item);
            };
        };
        CustomComboBox.prototype.setText = function (text) {
            $(this.input).val(text);
        };
        CustomComboBox.prototype.setErrorState = function (error) {
            if (error) {
                $(this.getContainer()).find("input").addClass("ui-state-error");
            }
            else {
                $(this.getContainer()).find("input").removeClass("ui-state-error");
            }
        };
        CustomComboBox.prototype.createShowAllButton = function () {
            var _this = this, wasOpen = false;
            $("<a>")
                .attr("tabIndex", -1)
                .tooltip()
                .appendTo($(_this.container))
                .button({
                icons: {
                    primary: "ui-icon-triangle-1-s"
                },
                text: false
            })
                .removeClass("ui-corner-all")
                .addClass("custom-combobox-toggle ui-corner-right")
                .mousedown(function () {
                wasOpen = _this.input.autocomplete("widget").is(":visible");
            })
                .click(function () {
                _this.input.focus();
                if (wasOpen) {
                    return;
                }
                _this.input.autocomplete("search", "");
            });
        };
        CustomComboBox.prototype._source = function (request, response) {
            if (this.source)
                this.source(request, response);
        };
        CustomComboBox.prototype.setSource = function (source) {
            this.source = source;
        };
        CustomComboBox.prototype.setSelect = function (select) {
            this.select = select;
            this.input.autocomplete({ select: select });
        };
        return CustomComboBox;
    }(Widget));
    return CustomComboBox;
});
