var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented", "jrptlib/Properties!APPMSG"], function (require, exports, Evented, APPMSG) {
    "use strict";
    var HelpSystem = (function (_super) {
        __extends(HelpSystem, _super);
        function HelpSystem() {
            _super.call(this);
            this.helpFrame = null;
            var _this = this;
            $(document).click(function (e) {
                if (HelpSystem._clickedHelpButton &&
                    (HelpSystem._clickedHelpButton == e.target ||
                        $(HelpSystem._clickedHelpButton).has(e.target).length > 0))
                    return;
                if (_this.helpFrame != null) {
                    _this.hideHelp();
                }
            });
        }
        HelpSystem.prototype.setHelpForDialog = function (htmlElement, help_context_id) {
            var _this = this;
            $("<button><span class=\"ui-icon\"></span></button>")
                .addClass("help-context")
                .addClass("help-context-dialog")
                .attr("title", APPMSG.HelpContext)
                .attr("id", help_context_id)
                .click(function (e) {
                e.preventDefault();
                HelpSystem._clickedHelpButton = this;
                _this.displayHelp($(this).attr("id"), {
                    of: $(htmlElement),
                    my: "left+15 top", at: "right top", collision: "none"
                }, { width: "auto", height: $(htmlElement).height() });
            })
                .prependTo($(htmlElement).children(".ui-dialog-buttonpane"));
        };
        HelpSystem.prototype.setHelp = function (htmlElement, help_context_id, position) {
            var cshelp = $(htmlElement).find(".help-context");
            if (cshelp.length > 0) {
                cshelp.attr("id", help_context_id);
                return;
            }
            var _this = this;
            if ($(htmlElement).hasClass("ui-dialog")) {
                this.setHelpForDialog(htmlElement, help_context_id);
            }
            else if ($(htmlElement).hasClass("help-button") || $(htmlElement).is("button")) {
                $(htmlElement).addClass("help-context")
                    .attr("id", help_context_id)
                    .click(function (e) {
                    e.preventDefault();
                    HelpSystem._clickedHelpButton = this;
                    var pos = { of: $(this),
                        my: "left top+15", at: "left bottom", collision: "none"
                    };
                    if (position)
                        pos = position;
                    _this.displayHelp($(this).attr("id"), pos);
                });
            }
            else {
                var help = $("<button><span class=\"ui-icon\"></span></button>")
                    .attr("title", APPMSG.HelpContext)
                    .addClass("help-context")
                    .addClass("help-context-label")
                    .attr("id", help_context_id)
                    .appendTo($(htmlElement))
                    .click(function (e) {
                    e.preventDefault();
                    HelpSystem._clickedHelpButton = this;
                    var pos = { of: $(this),
                        my: "left top+15", at: "left bottom", collision: "none"
                    };
                    if (position)
                        pos = position;
                    _this.displayHelp($(this).attr("id"), pos, { width: HelpSystem._savedWidth, height: HelpSystem._savedHeight });
                });
            }
        };
        HelpSystem.prototype._openInNewTab = function (url) {
            if (typeof (displayHelp) == "function") {
                displayHelp(url);
                return;
            }
            var win = window.open(url, '_blank');
            if (win) {
                win.focus();
            }
            else {
                alert(APPMSG.AllowPopups);
            }
        };
        HelpSystem.prototype.openHelp = function () {
            var _this = this;
            if (typeof (displayHelp) == "function") {
                displayHelp();
                return;
            }
            $.get("/analytics/help/overview", null, function (data) {
                _this._openInNewTab(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                _this.emit("failed", { href: "overview", server_error: errorThrown });
            });
        };
        HelpSystem.prototype.displayHelp = function (help_context_id, help_position, size) {
            if (this.helpFrame != null)
                this.hideHelp();
            this.helpFrame = $("<div>")
                .css("overflow", "hidden");
            var iframe = $("<iframe>").appendTo($(this.helpFrame)).attr("tabindex", "1");
            $(document.body).append($(this.helpFrame));
            this.helpFrame = $(this.helpFrame).dialog({
                autoOpen: true,
                width: (size && size.width) ? size.width : "auto",
                height: (size && size.height) ? size.height : "auto",
                title: APPMSG.HelpContext,
                closeText: APPMSG.Close_button,
                dialogClass: "cshelp-dialog",
                position: help_position,
                resize: function (event, ui) {
                    HelpSystem._savedWidth = ui.size.width;
                    HelpSystem._savedHeight = ui.size.height;
                }
            });
            var timer = setTimeout(function () {
                var body = $(iframe).contents().find("body");
                $("<p>").text(APPMSG.PleaseWait).appendTo(body);
            }, 50);
            var _this = this;
            $.get("/analytics/help/context", {
                id: help_context_id
            }, function (data) {
                setTimeout(function () {
                    clearTimeout(timer);
                    var iFrameDoc = iframe[0].contentDocument || iframe[0].contentWindow.document;
                    iFrameDoc.write(data);
                    iFrameDoc.close();
                    var t = $(iframe).contents().find('title');
                    var title = $(t).text();
                    if (title && title.length > 0)
                        $(_this.helpFrame).dialog("option", "title", title);
                    $(iframe).contents().find('a').each(function () {
                        $(this).click(function (e) {
                            e.preventDefault();
                            _this._openInNewTab($(this).attr("href"));
                        });
                    });
                }, 30);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                clearTimeout(timer);
                var body = $(iframe).contents().find("body");
                body.empty();
                var msg = (errorThrown == "") ? textStatus : errorThrown;
                $("<p>").text(msg).appendTo(body);
            });
        };
        HelpSystem.prototype.hideHelp = function () {
            $(this.helpFrame).remove();
            this.helpFrame = null;
        };
        return HelpSystem;
    }(Evented));
    return HelpSystem;
});
