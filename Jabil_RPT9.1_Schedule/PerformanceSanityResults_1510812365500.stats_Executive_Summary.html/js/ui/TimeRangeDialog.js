var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented", "dojo/number", "jrptlib/Form", "jrptlib/Listview", "jrptlib/DateFormat", "model/session/TimeRange", "jrptlib/Properties!APPMSG", "ui/HelpContextIds"], function (require, exports, Evented, dnumber, Form, Listview, DateFormat, TimeRange, APPMSG, HelpContextIds) {
    "use strict";
    var TimeRangeDialog = (function (_super) {
        __extends(TimeRangeDialog, _super);
        function TimeRangeDialog() {
            var _this = this;
            _super.call(this);
            this.session = null;
            this.timeRanges = null;
            this.dialog = $("#time_range_dialog").dialog({
                autoOpen: false,
                width: "auto",
                height: 450,
                modal: true,
                closeText: APPMSG.Close_button,
                dialogClass: "timerange-dialog",
                buttons: [{
                        id: "applyTimeRange",
                        text: APPMSG.Apply_button,
                        click: function () {
                            _this.apply();
                            $(_this.dialog).dialog("close");
                        } },
                    {
                        text: APPMSG.Cancel_button,
                        click: function () {
                            $(_this.dialog).dialog("close");
                        } }]
            });
            this.form = new Form($(this.dialog).find("form"), $(this.dialog).find("p.ui-dialog-message"));
            this.timerange_list = new Listview($(this.dialog).find(".timerange-list")[0]);
            this.timerange_list.setLabelProvider({
                getText: function (timerange) {
                    return timerange.name;
                },
                getIcon: function (timerange) { return ""; },
                getDescription: function (timerange) { return ""; }
            });
            var tr_dialog = this;
            this.timerange_list.setContentProvider({
                getElements: function (session, handler) {
                    if (session == null)
                        handler([]);
                    else
                        handler(tr_dialog.timeRanges.list());
                }
            });
            this.timerange_list.on("selectionChanged", function (selection) {
                _this.updateForm();
            });
            this.form.on("modified", function (event) {
                if (event.name === "absolute_time") {
                    _this.updateForm();
                    return;
                }
                var timerange = _this.timerange_list.getSelection();
                if (timerange == null)
                    return;
                if (event.name === "timerange_name") {
                    timerange.name = event.value;
                    _this.timerange_list.updateItem(timerange);
                    _this.validate();
                }
                else if (event.name === "timerange_starttime") {
                    var v = dnumber.round(dnumber.parse(event.value) * 1000);
                    if (isNaN(v))
                        return;
                    _this.form.setValue("input[name='absolute_time']", false);
                    var offset = timerange.startTime - v;
                    timerange.startTime = v;
                    timerange.duration += offset;
                    _this.updateForm();
                    _this.validate();
                }
                else if (event.name === "timerange_endtime") {
                    var v = dnumber.round(dnumber.parse(event.value) * 1000);
                    if (isNaN(v))
                        return;
                    _this.form.setValue("input[name='absolute_time']", false);
                    if (v == -1)
                        timerange.duration = 0;
                    else
                        timerange.duration = v - timerange.startTime;
                    _this.updateForm();
                    _this.validate();
                }
            });
            var tr_dialog = this;
            this.timerange_list.setEditMode(true);
            this.timerange_list.setModelModifierProvider({
                getLabel: function (action) {
                    if (action == this.remove)
                        return APPMSG.Remove_Action;
                    if (action == this.insertAfter)
                        return APPMSG.Add_Action;
                    if (action == this.moveUp)
                        return APPMSG.MoveUp_Action;
                    if (action == this.moveDown)
                        return APPMSG.MoveDown_Action;
                    return null;
                },
                remove: function (timerange, done) {
                    var removed_index = tr_dialog.timeRanges.list().indexOf(timerange);
                    tr_dialog.timeRanges.remove(removed_index);
                    var selection = null;
                    if (removed_index < tr_dialog.timeRanges.list().length) {
                        selection = tr_dialog.timeRanges.get(removed_index);
                    }
                    else {
                        selection = tr_dialog.timeRanges.get(removed_index - 1);
                    }
                    done(selection);
                },
                insertAfter: function (timerange, done) {
                    var tr = new TimeRange(APPMSG.TRD_UnamedTimeRange, 0, 0);
                    tr_dialog.timeRanges.insert(tr_dialog.timeRanges.list().indexOf(timerange) + 1, tr);
                    done(tr);
                    tr_dialog.updateForm();
                },
                moveUp: function (timerange, done) {
                    var idx = tr_dialog.timeRanges.list().indexOf(timerange);
                    tr_dialog.timeRanges.move(idx, idx - 1);
                    done(tr_dialog.timeRanges.get(idx - 1));
                },
                moveDown: function (timerange, done) {
                    var idx = tr_dialog.timeRanges.list().indexOf(timerange);
                    tr_dialog.timeRanges.move(idx, idx + 2);
                    done(tr_dialog.timeRanges.get(idx + 1));
                }
            });
            _app.getHelpSystem().setHelp($(".timerange-dialog")[0], HelpContextIds.TIME_RANGE_DIALOG);
        }
        TimeRangeDialog.prototype.updateForm = function () {
            var timerange = this.timerange_list.getSelection();
            if (timerange == null) {
                this.form.setValue("input[name='timerange_name']", "");
                this.form.setValue("input[name='timerange_starttime']", "");
                this.form.setValue("input[name='timerange_endtime']", "");
                return;
            }
            var abs_time = this.form.getValue("input[name='absolute_time']");
            if (abs_time) {
                this.form.setValue("input[name='timerange_starttime']", (new DateFormat(this.session.getStartTime() + timerange.startTime)).toDateString());
            }
            else {
                this.form.setValue("input[name='timerange_starttime']", dnumber.format(timerange.startTime / 1000));
            }
            this.form.setValue("input[name='timerange_name']", timerange.name);
            if (timerange.duration == 0) {
                this.form.setValue("input[name='timerange_endtime']", APPMSG.TimeRangeDialog_EndOfRun);
            }
            else {
                if (abs_time) {
                    this.form.setValue("input[name='timerange_endtime']", (new DateFormat(this.session.getStartTime() + timerange.startTime + timerange.duration).toDateString()));
                }
                else
                    this.form.setValue("input[name='timerange_endtime']", dnumber.format((timerange.startTime + timerange.duration) / 1000));
            }
        };
        TimeRangeDialog.prototype.validate = function () {
            var timerange = this.timerange_list.getSelection();
            if (timerange == null)
                return;
            if (timerange.name === "") {
                this.form.setErrorMessage(APPMSG.TRD_NameNotEmptyError);
                this.form.setErrorField("input[name='timerange_name']");
            }
            else if (timerange.duration < 0) {
                this.form.setErrorMessage(APPMSG.TRD_EndTimeError);
                this.form.setErrorField("input[name='timerange_endtime']");
            }
            else {
                this.form.setErrorMessage(null);
                this.form.setErrorField(null);
            }
            $("#applyTimeRange").button("option", "disabled", timerange.duration < 0 || timerange.startTime < 0 || timerange.name === "");
        };
        TimeRangeDialog.prototype.setSession = function (session) {
            this.session = session;
        };
        TimeRangeDialog.prototype.open = function () {
            this.timeRanges = this.session.copyTimeRanges();
            this.timerange_list.setInput(this.session);
            if (this.timeRanges.list().length > 0)
                this.timerange_list.setSelection(this.timeRanges.get(0));
            this.dialog.dialog("open");
        };
        TimeRangeDialog.prototype.apply = function () {
            this.session.setTimeRanges(this.timeRanges);
        };
        TimeRangeDialog.prototype.add = function (timerange_def) {
            if (!this.dialog.dialog("isOpen"))
                return;
            var tr_name = APPMSG.TRD_UnamedTimeRange;
            var tr_start = 0;
            var tr_end = 0;
            if (timerange_def) {
                tr_name = timerange_def.name;
                tr_start = timerange_def.start;
                tr_end = timerange_def.end;
            }
            var tr = new TimeRange(tr_name, tr_start, tr_end - tr_start);
            this.timeRanges.insert(this.timeRanges.list().length, tr);
            this.timerange_list.update();
            this.timerange_list.setSelection(tr);
            this.timerange_list.scrollToItem(tr);
            $("input[name='timerange_name']").focus();
            $("input[name='timerange_name']").select();
        };
        return TimeRangeDialog;
    }(Evented));
    return TimeRangeDialog;
});
