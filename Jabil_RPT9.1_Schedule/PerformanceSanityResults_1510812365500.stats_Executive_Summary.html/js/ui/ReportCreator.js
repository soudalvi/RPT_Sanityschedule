var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented", "jrptlib/Form", "jrptlib/Nls", "jrptlib/Properties!APPMSG", "ui/HelpContextIds"], function (require, exports, Evented, Form, NLS, APPMSG, HelpContextIds) {
    "use strict";
    var ReportCreator = (function (_super) {
        __extends(ReportCreator, _super);
        function ReportCreator() {
            _super.call(this);
            this.dialog = null;
            this.form = null;
        }
        ReportCreator.prototype.newReport = function () {
            var valid = true;
            var name = $(this.form).find("#new_report_name"), desc = $(this.form).find("#new_report_desc"), allFields = $([]).add(name).add(desc), tips = $(this.dialog).find(".ui-dialog-message");
            allFields.removeClass("ui-state-error");
            if (valid) {
                this.dialog.dialog("close");
                var report_doc = $.parseXML("<Report name=\"" + name.val() + "\" description=\"" +
                    desc.val() + "\" version=\"" + ReportCreator.REPORT_CURRENT_VERSION.toString() + "\" ><pages><Page name=\"" + NLS.bind(APPMSG.PageNew_Title, 1) + "\"><views>" +
                    "</views></Page></pages></Report>").documentElement;
                this.emit("finish", { report_id: name.val(), report_doc: report_doc });
            }
            return valid;
        };
        ReportCreator.prototype.open = function () {
            var _this = this;
            this.dialog = $("#new_report_dialog").dialog({
                autoOpen: true,
                modal: true,
                title: APPMSG.NewReportDialog_title,
                closeText: APPMSG.Close_button,
                dialogClass: "new_report_dialog",
                buttons: [
                    {
                        text: APPMSG.NewReportDialog_Create_button,
                        click: function () {
                            _this.dialog.dialog("close");
                            _this.newReport();
                        } },
                    {
                        text: APPMSG.Cancel_button,
                        click: function () {
                            $(this).dialog("close");
                        } }]
            });
            this.form = this.dialog.find("form");
            var form = new Form(this.form, $(this.dialog).find(".ui-dialog-message"));
            form.setMessage(APPMSG.NewReportDialog_InviteMessage);
            form.on("submit", function (form) {
                _this.newReport();
            });
            _app.getHelpSystem().setHelp($(".new_report_dialog"), HelpContextIds.NEW_REPORT_DIALOG);
        };
        ReportCreator.REPORT_CURRENT_VERSION = 4;
        return ReportCreator;
    }(Evented));
    return ReportCreator;
});
