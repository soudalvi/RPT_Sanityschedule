var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented", "jrptlib/Properties!SHAREMSG"], function (require, exports, Evented, SHAREMSG) {
    "use strict";
    var AbstractExportHTML = (function (_super) {
        __extends(AbstractExportHTML, _super);
        function AbstractExportHTML() {
            _super.call(this);
        }
        AbstractExportHTML.prototype.share = function (session, report) {
            this.session = session;
            this.report = report;
            this.open(session, report);
        };
        AbstractExportHTML.prototype.open = function (session, report) {
            var _this = this;
            var dialog = this.openDialog(report.reportKind);
            var closeDialog = function () {
                dialog.close();
                dialog.destroy();
            };
            dialog.on("apply", function (button) {
                $(button).button("option", "disabled", true);
                _this.exportData(report.reportKind, closeDialog);
            });
            dialog.on("cancel", function () {
                $("#ExportPopupIframe").remove();
                closeDialog();
            });
            this.progressBar = dialog.getProgressBar(SHAREMSG.GenerateReport);
            this.progressBar.progressbar("option", "value", false);
        };
        AbstractExportHTML.prototype.exportData = function (reportKind, terminated) {
            var _this = this;
            var encoding = "default";
            var reports = "";
            var report_list = this.getReportIds();
            for (var i = 0; i < report_list.length; i++) {
                reports += "report_id=" + report_list[i];
                if (i < report_list.length - 1)
                    reports += "&";
            }
            var sset = this.session.sessionSet;
            var sessions = "";
            var session_list = this.getSessionPaths();
            for (var i = 0; i < session_list.length; i++) {
                sessions += "session_path=" + session_list[i];
                if (i < session_list.length - 1)
                    sessions += "&";
            }
            if (_app.isEclipseBrowser()) {
                exportEclipseBrowserHTML(this.session.sessionPath, session_list, report_list, reportKind, this.session.getSelectedTimeRangeIndices()[0], this.display_mode);
                terminated();
                return;
            }
            this.progressBar.show();
            var href = this.session.getBaseRequestUrl() + "/export/html" +
                "?encoding=" + encoding +
                "&" + reports +
                "&time_range=" + this.session.getSelectedTimeRangeIndices()[0] +
                (this.display_mode ? "&display=" + this.display_mode : "") +
                "&" + sessions;
            $("#ExportPopupIframe").remove();
            var ifr = $('<iframe/>', {
                id: 'ExportPopupIframe',
                src: href,
                style: 'display:none',
                load: function () {
                    if ($(ifr).contents().find("body").text() == "error") {
                        _this.progressBar.hide();
                        $("<p>").insertAfter(_this.progressBar)
                            .addClass("ui-dialog-errormessage")
                            .text(SHAREMSG.GenerationError);
                        return;
                    }
                    _this.progressBar.hide();
                    terminated();
                }
            });
            $('body').append(ifr);
        };
        AbstractExportHTML.prototype.isEnabled = function (id, session) {
            return !_app.session.isLive();
        };
        return AbstractExportHTML;
    }(Evented));
    return AbstractExportHTML;
});
