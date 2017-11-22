var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "dojo/when", "jrptlib/Evented", "jrptlib/ExtensionSystem", "jrptlib/Properties!APPMSG"], function (require, exports, when, Evented, ExtensionSystem, APPMSG) {
    "use strict";
    var ShareManager = (function (_super) {
        __extends(ShareManager, _super);
        function ShareManager(app) {
            _super.call(this);
            this.app = null;
            this.dialog = null;
            this.app = app;
        }
        ShareManager.prototype.insertAt = function (index, element, parent) {
            var lastIndex = parent.children().length;
            if (index < lastIndex) {
                var item = parent.children().get(index);
                element.insertAfter(item);
            }
            else
                element.appendTo(parent);
        };
        ShareManager.prototype.addShareExtension = function (container, enabled, extension, index) {
            var _this = this;
            var li_item = $("<li>").addClass("share-plugin-item")
                .appendTo($(container));
            if (!enabled) {
                $(li_item).addClass("disabled");
                $(li_item).addClass("ui-state-disabled");
                $(li_item).find("button").button("disable");
            }
            var parent = null;
            if (enabled) {
                var handler = $(extension).attr("handler");
                parent = $("<button>").button()
                    .appendTo($(li_item))
                    .click(function (e) {
                    e.preventDefault();
                    require(["dojo/fx", handler], function (fx, ShareHandler) {
                        var module = new ShareHandler();
                        module.share(_this.app.session, { reportId: _this.app.report_id,
                            reportDoc: _this.app.report_doc,
                            reportKind: _this.app.report_kind });
                        $(_this.dialog).dialog("close");
                    });
                });
            }
            else
                parent = li_item;
            $("<img>")
                .attr("src", $(extension).attr("icon"))
                .addClass("icon")
                .appendTo($(parent));
            $("<div>")
                .addClass("label")
                .appendTo($(parent))
                .text($(extension).attr("label"));
            $(container).find(".share-plugin-item").sort(function (a, b) {
                return $(a).find(".label").text().localeCompare($(b).find(".label").text());
            });
            return li_item;
        };
        ShareManager.prototype.open = function () {
            var _this = this;
            this.dialog = $("#share_dialog").dialog({
                autoOpen: true,
                closeText: APPMSG.Close_button,
                modal: true,
                title: APPMSG.ShareDialog_title,
                dialogClass: "share_dialog",
                width: $(window).width() * 0.5,
                buttons: [{
                        text: APPMSG.Close_button,
                        click: function () {
                            $(this).dialog("close");
                        } }]
            });
            var plist = $(this.dialog).find("ul");
            $(plist).text("");
            $(plist).find("li").remove();
            var extmgr = new ExtensionSystem();
            extmgr.getExtensions("com.ibm.rational.test.lt.server.analytics.share_plugin", function (index, errorThrown) {
                if (errorThrown) {
                    $(plist).text(errorThrown);
                    return;
                }
                var extension = this;
                var id = $(this).attr("id");
                var enablement = $(this).children("enablement");
                if (enablement.length > 0) {
                    var htest = $(enablement[0]).attr("test");
                    require(["dojo/fx", htest], function (fx, EnablementHandler) {
                        var module = new EnablementHandler();
                        var enabled = module.isEnabled(id, _this.app.session);
                        when(enabled, function (enabled) {
                            _this.addShareExtension(plist, enabled, extension, index);
                        });
                    });
                }
                else
                    _this.addShareExtension(plist, true, extension, index);
            });
        };
        return ShareManager;
    }(Evented));
    return ShareManager;
});
