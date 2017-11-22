var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Form", "jrptlib/Dialog", "jrptlib/CheckboxListview", "ui/HelpContextIds", "jrptlib/Properties!SHAREMSG", "share/AbstractExportHTML"], function (require, exports, Form, Dialog, CheckboxListview, HelpContextIds, SHAREMSG, AbstractExportHTML) {
    "use strict";
    var ExportHTML = (function (_super) {
        __extends(ExportHTML, _super);
        function ExportHTML() {
            _super.call(this);
        }
        ExportHTML.prototype.openDialog = function (report_kind) {
            var _this = this;
            var dialog = new Dialog($("<div id=\"html_share_dialog\" class=\"form-dialog\" style=\"display: none\">" +
                "<p class=\"ui-dialog-message\"></p>" +
                "<form>" +
                "<fieldset>" +
                "<legend>" + SHAREMSG.ExportReports_label + "</legend>" +
                "<div id=\"report_select_list\"></div>" +
                "</fieldset>" +
                "</form>" +
                "</div>"), SHAREMSG.ExportCSVDialog_Export_button, SHAREMSG.Cancel_button);
            dialog.getDialog().dialog("option", "dialogClass", "html-export-dialog");
            dialog.getDialog().dialog("option", "title", SHAREMSG.ExportHTMLDialog_title);
            var closeDialog = function () {
                dialog.close();
                dialog.destroy();
            };
            this.form = $(dialog.getDialog()).find("form")[0];
            var form_object = new Form(this.form, $(dialog.getDialog()).find(".ui-dialog-message"));
            form_object.setMessage(SHAREMSG.ExportHTMLDialog_Message);
            this.report_select_list = new CheckboxListview($(dialog.getDialog()).find("#report_select_list")[0]);
            this.report_select_list.setContentProvider({
                getElements: function (object, handler) {
                    _app.report_selector.retrieveReportList(handler);
                }
            });
            this.report_select_list.setLabelProvider({
                getText: function (object) {
                    return $(object).attr("label");
                }
            });
            this.report_select_list.setCheckStateProvider({
                isChecked: function (report_item) {
                    return _this.report.reportId == $(report_item).attr("id");
                }
            });
            this.report_select_list.setInput({});
            form_object.on("submit", function (form) {
                _this.exportData(report_kind, closeDialog);
            });
            this.progressBar = dialog.getProgressBar(SHAREMSG.GenerateReport);
            this.progressBar.progressbar("option", "value", false);
            _app.getHelpSystem().setHelp($(".html-export-dialog"), HelpContextIds.EXPORT_HTML_DIALOG);
            return dialog;
        };
        ExportHTML.prototype.getSessionPaths = function () {
            var sset = this.session.sessionSet;
            var session_list = new Array();
            for (var i = 0; i < sset.list().length; i++) {
                session_list.push(sset.list()[i].sessionPath);
            }
            return session_list;
        };
        ExportHTML.prototype.getReportIds = function () {
            var chkitems = this.report_select_list.getCheckedItems();
            var report_list = new Array();
            for (var i = 0; i < chkitems.length; i++) {
                report_list.push($(chkitems[i]).attr("id"));
            }
            return report_list;
        };
        return ExportHTML;
    }(AbstractExportHTML));
    return ExportHTML;
});
