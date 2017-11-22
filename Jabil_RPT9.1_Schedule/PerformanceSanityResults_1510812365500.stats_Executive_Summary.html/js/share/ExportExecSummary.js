var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "share/AbstractExportHTML", "jrptlib/Form", "jrptlib/Dialog", "ui/HelpContextIds", "jrptlib/Properties!SHAREMSG"], function (require, exports, AbstractExportHTML, Form, Dialog, HelpContextIds, SHAREMSG) {
    "use strict";
    var ExportExecSummary = (function (_super) {
        __extends(ExportExecSummary, _super);
        function ExportExecSummary() {
            _super.call(this);
        }
        ExportExecSummary.prototype.openDialog = function () {
            var _this = this;
            var dialog = new Dialog($("<div id=\"execsum_share_dialog\" class=\"form-dialog\" style=\"display: none\">" +
                "<p class=\"ui-dialog-message\"></p>" +
                "<form>" +
                "<fieldset>" +
                "<input id=\"another_page\" type=\"radio\" name=\"export_type\">" + SHAREMSG.EXECSUM_ANOTHER_PAGE + "</input><br>" +
                "<input id=\"html_export\" type=\"radio\" name=\"export_type\">" + SHAREMSG.EXECSUM_HTML + "</input>" +
                "</fieldset>" +
                "</form></div>"), SHAREMSG.EXECSUM_Generate_button, SHAREMSG.Cancel_button);
            dialog.getDialog().dialog("option", "dialogClass", "execsum-export-dialog");
            dialog.getDialog().dialog("option", "title", SHAREMSG.EXECSUM_Dialog_title);
            this.form = $(dialog.getDialog()).find("form")[0];
            var form_object = new Form(this.form, $(dialog.getDialog()).find(".ui-dialog-message"));
            form_object.setMessage(SHAREMSG.EXECSUM_Dialog_Message);
            this.init(this.form);
            form_object.on("submit", function (form) {
                dialog.close();
                dialog.destroy();
            });
            $(this.form).find("input[name='another_page']").change(function () {
                _this.updateState(_this.form);
            });
            $(this.form).find("input[name='html_export']").change(function () {
                _this.updateState(_this.form);
            });
            _app.getHelpSystem().setHelp($(".execsum-export-dialog")[0], HelpContextIds.EXPORT_EXECSUM_DIALOG);
            $(".execsum-export-dialog").find("#apply_button").focus();
            return dialog;
        };
        ExportExecSummary.prototype.init = function (form) {
            $(form).find("input[id='another_page']").prop("checked", true);
            this.updateState(form);
        };
        ExportExecSummary.prototype.updateState = function (form) {
        };
        ExportExecSummary.prototype.getSessionPaths = function () {
            var sset = this.session.sessionSet;
            var session_list = new Array();
            for (var i = 0; i < sset.list().length; i++) {
                session_list.push(sset.list()[i].sessionPath);
            }
            return session_list;
        };
        ExportExecSummary.prototype.getReportIds = function () {
            var report_list = new Array();
            report_list.push(this.report.reportId);
            return report_list;
        };
        ExportExecSummary.prototype.exportData = function (reportKind, terminated) {
            var full = $(this.form).find("input[id='another_page']");
            var in_another_page = $(full).prop("checked");
            if (in_another_page) {
                if (_app.isEclipseBrowser()) {
                    openPrintVersion();
                }
                else {
                    window.open(window.location + "&display=print", '_blank');
                }
                terminated();
                return;
            }
            else {
                this.display_mode = "print";
                _super.prototype.exportData.call(this, reportKind, terminated);
            }
        };
        return ExportExecSummary;
    }(AbstractExportHTML));
    return ExportExecSummary;
});
