var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented", 'jrptlib/TreeBrowser', "ui/SessionContentProvider", "ui/SessionLabelProvider", 'jrptlib/Nls', "jrptlib/Properties!APPMSG"], function (require, exports, Evented, TreeBrowser, SessionContentProvider_1, SessionLabelProvider, NLS, APPMSG) {
    "use strict";
    var SessionSelector = (function (_super) {
        __extends(SessionSelector, _super);
        function SessionSelector(currentSessionSet) {
            _super.call(this);
            this.currentSessionSet = currentSessionSet;
        }
        SessionSelector.prototype.build_dialog = function () {
            var session_selector = this;
            this.session_browser = new TreeBrowser($("#session_browser")[0]);
            this.session_browser.setContentProvider(new SessionContentProvider_1.SessionContentProvider(this.currentSessionSet));
            this.session_browser.setLabelProvider(new SessionLabelProvider());
            this.session_browser.on("selectionChanged", function (selection) {
                if (selection && selection.type == "Session") {
                    session_selector.session_dialog.dialog("close");
                    session_selector.emit("selected", selection);
                }
            });
            this.session_dialog = $("#session_dialog").dialog({
                autoOpen: true,
                modal: true,
                closeText: APPMSG.Close_button,
                dialogClass: "session-dialog",
                width: $(window).width() * 0.7,
                height: $(window).height() * 0.6,
                maxHeight: 600,
                buttons: [
                    {
                        text: APPMSG.Close_button,
                        click: function () {
                            $(this).dialog("close");
                        } }]
            });
        };
        SessionSelector.prototype.select = function () {
            var first_use = false;
            if (this.session_dialog == null) {
                this.build_dialog();
                first_use = true;
            }
            var session_selector = this;
            var url = "/analytics/sessions/";
            $.getJSON(url, null).done(function (data) {
                session_selector.session_browser.setInput(data);
                session_selector.session_dialog.dialog("open");
            }).fail(function (jqXHR, textStatus, errorThrown) {
                _app.showErrorMessage(NLS.bind(APPMSG.Unable_Retrieve_Sessions, errorThrown));
            });
        };
        return SessionSelector;
    }(Evented));
    return SessionSelector;
});
