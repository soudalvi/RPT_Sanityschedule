var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented", "jrptlib/Form", "jrptlib/CheckboxListview", "jrptlib/Dialog", "ui/HelpContextIds", "jrptlib/Properties!SHAREMSG", "jrptlib/Properties!APPMSG"], function (require, exports, Evented, Form, CheckboxListview, Dialog, HelpContextIds, SHAREMSG, APPMSG) {
    "use strict";
    var ExportCSV = (function (_super) {
        __extends(ExportCSV, _super);
        function ExportCSV() {
            _super.call(this);
            this.timeRanges = null;
            this.form = null;
            this.session = null;
        }
        ExportCSV.prototype.share = function (session, report) {
            this.session = session;
            this.report = report;
            this.open(session, report);
        };
        ExportCSV.prototype.open = function (session, report) {
            var _this = this;
            var dialog = new Dialog($("<div id=\"csv_share_dialog\" class=\"form-dialog\" style=\"display: none\">" +
                "<p class=\"ui-dialog-message\"></p>" +
                "<form>" +
                "<select name=\"encoding\">" +
                "<option value=\"default\">" + SHAREMSG.Encoding_Default + "</option>" +
                "<option value=\"US-ASCII\">" + SHAREMSG.Encoding_Ascii + "</option>" +
                "<option value=\"ISO-8859-1\">" + SHAREMSG.Encoding_IsoLatin + "</option>" +
                "<option value=\"UTF-8\">" + SHAREMSG.Encoding_Unicode8bits + "</option>" +
                "<option value=\"UTF-16\">" + SHAREMSG.Encoding_UnicodeByteOrder + "</option>" +
                "<option value=\"UTF-16LE\">" + SHAREMSG.Encoding_UnicodeLittleEndian + "</option>" +
                "<option value=\"UTF-16BE\">" + SHAREMSG.Encoding_UnicodeBigEndian + "</option>" +
                "</select><br>" +
                "<label>" + SHAREMSG.ExportType_label + "</label>" +
                "<fieldset>" +
                "<input id=\"simple\" type=\"radio\" name=\"export_type\">" + SHAREMSG.Simple_label + "</input><br>" +
                "<ul class=\"field-list\">" +
                "<li><label for=\"tr_selection\">" + SHAREMSG.TimeRangeSelection_label + "</label><input id=\"tr_selection\" class=\"simple\" type=\"checkbox\" name=\"tr_selection\"/></li>" +
                "<li><div id=\"timerange_list\" /></li>" +
                "</ul>" +
                "<input id=\"full\" type=\"radio\" name=\"export_type\">" + SHAREMSG.Full_label + "</input><br>" +
                "<ul class=\"field-list\">" +
                "<li><input class=\"full\" type=\"checkbox\" name=\"split_output\">" + SHAREMSG.SplitOutput_label + "</input>" +
                "<input class=\"full\" type=\"number\" name=\"split_output_size\"></input></li></ul>" +
                "</ul>" +
                "</fieldset>" +
                "<fieldset>" +
                "<input  type=\"checkbox\" name=\"per_instance\">" + SHAREMSG.PerInstance_label + "</input>" +
                "</fieldset>" +
                "<fieldset>" +
                "<input id=\"per_agent\" type=\"checkbox\" name=\"per_agent\">" + SHAREMSG.PerAgent_label + "</input><br>" +
                "<ul class=\"field-list\">" +
                "<li><input id=\"onefile_per_agent\" type=\"checkbox\" name=\"onefile_per_agent\">" + SHAREMSG.OneFilePerAgent_label + "</input></li>" +
                "</ul>" +
                "</fieldset>" +
                "</form></div>"), SHAREMSG.ExportCSVDialog_Export_button, SHAREMSG.Cancel_button, "auto");
            dialog.getDialog().dialog("option", "dialogClass", "csv-export-dialog");
            dialog.getDialog().dialog("option", "title", SHAREMSG.ExportCSVDialog_title);
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
            this.form = $(dialog.getDialog()).find("form")[0];
            var form_object = new Form(this.form, $(dialog.getDialog()).find(".ui-dialog-message"));
            form_object.setMessage(SHAREMSG.ExportCSVDialog_Message);
            $(this.form).find("input[name='export_type']").change(function () {
                var full = $(_this.form).find("input[id='full']");
                var checked = $(full).prop("checked");
                $(_this.form).find("input[name='per_agent']").prop("checked", checked);
                $(_this.form).find("input[name='onefile_per_agent']").prop("checked", checked);
                $(_this.form).find("input[name='per_instance']").prop("checked", checked);
                _this.updateState(_this.form);
            });
            $(this.form).find("input[name='tr_selection']").change(function () {
                _this.updateState(_this.form);
            });
            $(this.form).find("input[name='per_agent']").change(function () {
                _this.updateState(_this.form);
            });
            this.timerange_list = new CheckboxListview($(dialog.getDialog()).find("#timerange_list")[0]);
            this.timerange_list.setLabelProvider({
                getText: function (timeRange) {
                    if (timeRange.index == -1) {
                        return APPMSG.TimeRangeRun;
                    }
                    else {
                        return timeRange.range.name;
                    }
                }
            });
            this.timerange_list.setContentProvider({
                getElements: function (session, handler) {
                    handler(_this.timeRanges);
                }
            });
            this.timeRanges = [];
            this.timerange_list.setInput(session);
            this.init(this.form);
            form_object.on("submit", function (form) {
                _this.exportData(report.reportKind, closeDialog);
            });
            this.progressBar = dialog.getProgressBar(SHAREMSG.GenerateReport);
            this.progressBar.progressbar("option", "value", false);
            _app.getHelpSystem().setHelp($(".csv-export-dialog"), HelpContextIds.EXPORT_CSV_DIALOG);
            dialog.getDialog().dialog("option", "width", "auto");
            $(".csv-export-dialog").find("#apply_button").focus();
        };
        ExportCSV.prototype.init = function (form) {
            $(form).find("input[id='simple']").prop("checked", true);
            $(form).find("input[name='split_output_size']").val("250");
            $(form).find("input[name='split_output']").prop("checked", true);
            $(form).find("input[name='tr_selection']").prop("checked", false);
            $(form).find("input[name='per_instance']").prop("checked", false);
            if (this.timeRanges.length < 2) {
                $(form).find("#timerange_list").hide();
                $(form).find("input[name='tr_selection']").hide();
                $(form).find("label[for='tr_selection']").hide();
            }
            this.updateState(form);
        };
        ExportCSV.prototype.updateState = function (form) {
            var full = $(form).find("input[id='full']");
            var checked = $(full).prop("checked");
            $(form).find("input.full").prop("disabled", !checked);
            $(form).find("input.simple").prop("disabled", checked);
            $(form).find("input[name='split_output_size']").prop("disabled", !checked);
            var tr_selection = $(form).find("input[name='per_agent']").prop("checked");
            $(form).find("input[id='onefile_per_agent']").prop("disabled", !tr_selection);
            var tr_selection = $(form).find("input[name='tr_selection']").prop("checked");
            this.timerange_list.setDisabled(checked || !tr_selection);
        };
        ExportCSV.prototype.exportData = function (reportKind, terminated) {
            var _this = this;
            var full = $(this.form).find("input[id='full']");
            var type = $(full).prop("checked") ? "full" : "simple";
            var per_instance = $(this.form).find("input[name='per_instance']").prop("checked");
            var per_agent = $(this.form).find("input[name='per_agent']").prop("checked");
            var onefile_per_agent = $(this.form).find("input[name='onefile_per_agent']").prop("checked");
            var split_output = $(this.form).find("input[name='split_output']").prop("checked");
            var split_output_size = parseInt($(this.form).find("input[name='split_output_size']").val());
            var encoding = $(this.form).find("select[name='encoding']").val();
            var selected = this.session.getSelectedTimeRangeIndices();
            var tranges = "";
            var trange_list = new Array();
            for (var i = 0; i < selected.length; i++) {
                tranges += "time_range=" + selected[i];
                trange_list.push(selected[i]);
                if (i < selected.length - 1)
                    tranges += "&";
            }
            if (_app.isEclipseBrowser()) {
                exportEclipseBrowserCSV(this.session.sessionPath, type, encoding, this.report.reportId, reportKind, trange_list, per_instance, per_agent, onefile_per_agent, split_output, split_output_size);
                terminated();
                return;
            }
            this.progressBar.show();
            var href = this.session.getBaseRequestUrl() + "/export/csv" +
                "?export_type=" + type +
                "&encoding=" + encoding +
                "&report_id=" + this.report.reportId +
                "&" + tranges +
                "&per_instance=" + per_instance +
                "&per_agent=" + per_agent +
                "&onefile_peragent=" + onefile_per_agent +
                "&split_output=" + split_output +
                "&split_output_size=" + split_output_size;
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
        ExportCSV.prototype.isEnabled = function (id, session) {
            return (!_app.session.isLive() && _app.report_kind == "regular");
        };
        return ExportCSV;
    }(Evented));
    return ExportCSV;
});
