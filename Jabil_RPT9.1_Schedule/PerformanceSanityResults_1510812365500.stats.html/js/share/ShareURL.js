var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented", "jrptlib/Nls", "jrptlib/Properties!SHAREMSG", "dojo/Deferred"], function (require, exports, Evented, NLS, SHAREMSG, Deferred) {
    "use strict";
    var ShareURL = (function (_super) {
        __extends(ShareURL, _super);
        function ShareURL() {
            _super.call(this);
        }
        ShareURL.prototype.share = function (session, report) {
            var _this = this;
            var url = session.getBaseRequestUrl() + "/url";
            $.get(url, null, null, "text").done(function (data) {
                _this.open(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                _this.open(NLS.bind(SHAREMSG.RequestError, [session.getLabel(), errorThrown]));
            });
        };
        ShareURL.prototype.open = function (data) {
            var textarea = null;
            var message = null;
            var dialog = $("<div id=\"url_share_dialog\" class=\"form-dialog\" style=\"display: none\">" +
                "<p class=\"ui-dialog-message\"></p><textarea class=\"url_share_dialog_textarea\"></textarea>" +
                "</div>")
                .appendTo($(document.body))
                .dialog({
                autoOpen: true,
                closeText: SHAREMSG.Close_button,
                modal: true,
                dialogClass: "url-share-dialog",
                buttons: [
                    {
                        text: SHAREMSG.CopyToClipboard_label,
                        click: function () {
                            textarea.val(data).select();
                            if (_app.isEclipseBrowser()) {
                                copyToClipboard(textarea.val());
                            }
                            else {
                                document.execCommand("copy");
                            }
                            $(this).dialog("close");
                            $(this).dialog("destroy").remove();
                        } },
                    {
                        text: SHAREMSG.Close_button,
                        click: function () {
                            $(this).dialog("close");
                            $(this).dialog("destroy").remove();
                        } }],
                resize: function (event, ui) {
                    textarea.height(ui.size.height - message.height() - 100);
                }
            });
            textarea = $(dialog).find(".url_share_dialog_textarea");
            textarea.val(data).select();
            message = $(dialog).find(".ui-dialog-message");
            message.text(SHAREMSG.ShareUrl_Description);
        };
        ShareURL.prototype.isEnabled = function (id, session) {
            var ret = new Deferred();
            var url = session.getBaseRequestUrl() + "/url";
            $.get(url, null, null, "text").done(function (data) {
                ret.resolve(data != null);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                ret.resolve(false);
            });
            return ret;
        };
        return ShareURL;
    }(Evented));
    return ShareURL;
});
