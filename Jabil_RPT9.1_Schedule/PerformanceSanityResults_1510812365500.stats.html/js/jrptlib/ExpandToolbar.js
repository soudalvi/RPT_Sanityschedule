var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Widget"], function (require, exports, Widget) {
    "use strict";
    var _openedToolbar;
    $(document).on("click", function (e) {
        if (_openedToolbar) {
            _openedToolbar.cancelToolbar();
        }
    });
    var ExpandToolbar = (function (_super) {
        __extends(ExpandToolbar, _super);
        function ExpandToolbar(container, label) {
            _super.call(this, container);
            var _this = this;
            this.widget = $("<div  class=\"expand-toolbar\">")
                .appendTo($(container));
            this.link = $("<button>").text(label).button({
                icons: {
                    primary: "ui-icon-plus"
                } })
                .click(function (e) {
                e.preventDefault();
                if (_openedToolbar) {
                    _openedToolbar.cancelToolbar();
                }
                _this.openToolbar(this);
            });
            $(this.link).appendTo($(this.widget));
            this.buttons = [];
        }
        ExpandToolbar.prototype.getLink = function () {
            return this.link;
        };
        ExpandToolbar.prototype.addToolButton = function (button) {
            this.buttons.push(button);
        };
        ExpandToolbar.prototype.openToolbar = function (link) {
            var _this = this;
            var _addbutton = function (button, parent) {
                var li = $("<li class=\"tool-button\" >").appendTo($(parent));
                $(li).addClass(button.className);
                var link_a = $("<button>").button()
                    .appendTo($(li))
                    .click(function (e) {
                    e.preventDefault();
                    _this.emit("buttonClicked", button);
                    _this.removeToolbar();
                });
                if (button.render)
                    button.render(link_a, button);
                else
                    $(link_a).text(button.label);
            };
            $(this.link).fadeOut("slow", function () {
                _this.toolbar = $("<ul class=\"toolbar\">").insertAfter($(_this.link));
                for (var i = 0; i < _this.buttons.length; i++) {
                    _addbutton(_this.buttons[i], _this.toolbar);
                }
                _openedToolbar = _this;
            });
        };
        ExpandToolbar.prototype.cancelToolbar = function () {
            _openedToolbar.removeToolbar();
            _openedToolbar = undefined;
        };
        ExpandToolbar.prototype.removeToolbar = function () {
            this.toolbar.remove();
            $(this.link).fadeIn("slow", function () {
                _openedToolbar = undefined;
            });
        };
        return ExpandToolbar;
    }(Widget));
    return ExpandToolbar;
});
