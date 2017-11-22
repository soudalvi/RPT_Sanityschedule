var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Form", "dojo/json", "dojo/request", "view/query/GStatusQueryProvider", "jrptlib/DropDownList", "jrptlib/TableViewer", "ui/HelpContextIds", "jrptlib/Properties!APPMSG"], function (require, exports, Form, json, request, GStatusQueryProvider, DropDownList, TableViewer, HelpContextIds, APPMSG) {
    "use strict";
    var ExecActionsSelector = (function (_super) {
        __extends(ExecActionsSelector, _super);
        function ExecActionsSelector(container) {
            var _this = this;
            _super.call(this, container);
            this.session = null;
            this.allowControl = false;
            this.statusProvider = new GStatusQueryProvider();
            this.statusProvider.on("changed", function (event) {
                if (event.itemsChanged)
                    _this.updateStatus();
            });
            this.getAllowControlPreference();
            this.setIsSelectLineChanged(false);
            var actions = {};
            actions[APPMSG.Exec_abandon_action_title] = function () { _this.adandonTest(); };
            actions[APPMSG.Exec_stop_action_title] = function () { _this.stopTest(); };
            actions[APPMSG.Exec_users_action_title] = function () { _this.changeUsersNumber(); };
            actions[APPMSG.Exec_log_action_title] = function () { _this.changeLogLevel(); };
            actions[APPMSG.Exec_duration_action_title] = function () { _this.changeStageDuration(); };
            actions[APPMSG.Exec_manage_sync_title] = function () { _this.manageSyncPoints(); };
            this.setContentProvider({
                getElements: function (input, callback) {
                    callback(_this.actionLabels);
                }
            });
            this.setLabelProvider({
                getText: function (element) {
                    return element;
                }
            });
            this.on("selectionChanged", function (selection) {
                actions[selection]();
            });
            this.setInput(actions);
        }
        ExecActionsSelector.prototype.getAllowControlPreference = function () {
            var _this = this;
            request.get("/externalexecutionquery", {
                handleAs: "json",
                headers: { "Accept": "application/json" }
            }).then(function (data) {
                _this.allowControl = data.isExecutionControlEnabled;
                _this.updateStatus();
            });
        };
        ExecActionsSelector.prototype.adandonTest = function () {
            $("#app_dialog_confirm").find(".ui-dialog-message").text(APPMSG.Exec_abandon_dialog_message);
            $("#app_dialog_confirm").dialog({
                resizable: true,
                modal: true,
                closeText: APPMSG.Close_button,
                title: APPMSG.Exec_abandon_dialog_title,
                buttons: [{
                        text: APPMSG.AbandonTestButton_Label,
                        click: function () {
                            $(this).dialog("close");
                            var data = {
                                btnResultCollection: false,
                                btnExecFinally: true,
                                timeout: 5,
                                timeoutScale: "milli"
                            };
                            request.post("/executioncontrol/stoptestrun", {
                                data: json.stringify(data),
                                headers: { "Content-Type": "application/json; charset=utf-8" }
                            });
                        } }, {
                        text: APPMSG.Cancel_button,
                        click: function () {
                            $(this).dialog("close");
                        } }]
            });
        };
        ExecActionsSelector.prototype.stopTest = function () {
            var stopDialog = $("#exec_stop_dialog").dialog({
                autoOpen: true,
                modal: true,
                closeText: APPMSG.Close_button,
                dialogClass: "stop-test-dialog",
                buttons: [{
                        text: APPMSG.StopTestButton_Label,
                        click: function () {
                            $(this).dialog("close");
                            var data = {
                                btnResultCollection: $("#collect_info").prop("checked"),
                                btnExecFinally: $("#finally").prop("checked"),
                                timeout: parseInt($("#timeout_option").val(), 10),
                                timeoutScale: $("#stop_test_unity").val()
                            };
                            request.post("/executioncontrol/stoptestrun", {
                                data: json.stringify(data),
                                headers: { "Content-Type": "application/json; charset=utf-8" }
                            });
                        }
                    }, {
                        text: APPMSG.Cancel_button,
                        click: function () {
                            $(this).dialog("close");
                        }
                    }]
            });
            _app.getHelpSystem().setHelp($(".abandon-test-dialog"), HelpContextIds.ABANDON_TEST_DIALOG);
        };
        ExecActionsSelector.prototype.changeUsersNumber = function () {
            var changeUsersDialog = $("#exec_change_users_dialog").dialog({
                autoOpen: true,
                modal: true,
                closeText: APPMSG.Close_button,
                dialogClass: "change-users-dialog",
                buttons: [{
                        text: APPMSG.ChangeButton_Label,
                        click: function () {
                            var _this = this;
                            $(this).dialog("close");
                            var data = {
                                addUsersRadio: $("#add_users").prop('checked'),
                                abtnAllStages: $("#apply").prop("checked"),
                                noToAdd: parseInt($("#add_users_text").val(), 10),
                                noToRemove: parseInt($("#remove_users_text").val(), 10),
                                timeoutScale: $("#stop_test_unity").val()
                            };
                            $.post("/executioncontrol/changeusers", json.stringify(data))
                                .always(function (resp) {
                                return $(_this).dialog("close");
                            })
                                .fail(function (response) {
                                return alert(response.responseText);
                            });
                        }
                    }, {
                        text: APPMSG.Cancel_button,
                        click: function () {
                            $(this).dialog("close");
                        }
                    }]
            });
            $('#add_users').click(function () {
                $('#remove_users_text').hide();
                $('#add_users_text').show();
            });
            $('#remove_users').click(function () {
                $('#add_users_text').hide();
                $('#remove_users_text').show();
            });
            _app.getHelpSystem().setHelp($(".change-users-dialog"), HelpContextIds.CHANGE_USERS_DIALOG);
        };
        ExecActionsSelector.prototype.changeLogLevel = function () {
            var changeUsersDialog = $("#exec_change_log_dialog").dialog({
                autoOpen: true,
                modal: true,
                closeText: APPMSG.Close_button,
                dialogClass: "change-log-dialog",
                buttons: [{
                        text: APPMSG.ChangeButton_Label,
                        click: function () {
                            $(this).dialog("close");
                            var data = {
                                logLevel: $("#change_log_value").val()
                            };
                            request.post("/executioncontrol/changeloglevel", {
                                data: json.stringify(data),
                                headers: { "Content-Type": "application/json; charset=utf-8" }
                            });
                        }
                    }, {
                        text: APPMSG.Cancel_button,
                        click: function () {
                            $(this).dialog("close");
                        }
                    }]
            });
            _app.getHelpSystem().setHelp($(".change-log-dialog"), HelpContextIds.CHANGE_LOG_DIALOG);
        };
        ExecActionsSelector.prototype.changeStageDuration = function () {
            var _this = this;
            var timer = -1;
            var changeUsersDialog = $("#exec_change_stage_dialog").dialog({
                autoOpen: false,
                modal: true,
                closeText: APPMSG.Close_button,
                dialogClass: "change_stage-dialog",
                buttons: [{
                        id: "applyChangeRange",
                        text: APPMSG.ChangeButton_Label,
                        click: function () {
                            if (timer != -1)
                                clearTimeout(timer);
                            $(changeUsersDialog).dialog("close");
                            var data = {
                                specifiedTime: parseInt($("#new_duration_option").val(), 10),
                                timeScale: $("#new_duration_unity").val()
                            };
                            request.post("/executioncontrol/changestage", {
                                data: json.stringify(data),
                                headers: { "Content-Type": "application/json; charset=utf-8" }
                            });
                        }
                    }, {
                        text: APPMSG.Cancel_button,
                        click: function () {
                            if (timer != -1)
                                clearTimeout(timer);
                            _this.form.reset();
                            _this.form.setErrorMessage(null);
                            _this.form.setErrorField(null);
                            $(changeUsersDialog).dialog("close");
                        }
                    }]
            });
            changeUsersDialog.dialog("open");
            this.form = new Form($(changeUsersDialog).find("form")[0], $(changeUsersDialog).find("p.ui-dialog-message"));
            this.form.on("modified", function (event) {
                if (event.name === "stage_duration" || event.name === "stage_duration_unity") {
                    _this.stageDurationValidation(event.name);
                    return;
                }
            });
            var display_info = function (data) {
                var timeLeft = data.m_lblTimeLeft.toString();
                var totalTime = data.m_lblTimeTotal.toString();
                var untilFinished = totalTime === undefined;
                if (untilFinished) {
                    totalTime = APPMSG.UntilFinished;
                    timeLeft = APPMSG.NotApplicable;
                }
                changeUsersDialog.find("#exec_stage_duration_value").text(totalTime);
                changeUsersDialog.find("#exec_stage_timeleft_value").text(timeLeft);
                $("#applyChangeRange").button("option", "disabled", untilFinished);
                return untilFinished;
            };
            var update_dialog = function () {
                $.get("/executioncontrol/changestage", function (data) {
                    if (display_info(data)) {
                        timer = setTimeout(function () {
                            update_dialog();
                        }, 2000);
                    }
                }, "json");
            };
            update_dialog();
            _app.getHelpSystem().setHelp($(".change_stage-dialog"), HelpContextIds.CHANGE_STAGE_DIALOG);
        };
        ExecActionsSelector.prototype.stageDurationValidation = function (name) {
            var newDurationNumber = parseInt($("#new_duration_option").val(), 10);
            var newDurationSec = newDurationNumber;
            var unity = $("#new_duration_unity").val();
            if (unity === "min") {
                newDurationSec = newDurationNumber * 60;
            }
            else if (unity === "hour") {
                newDurationSec = newDurationNumber * 3600;
            }
            else if (unity === "day") {
                newDurationSec = newDurationNumber * 3600 * 24;
            }
            var elapsedTime = this.computeElapsedTime();
            if (elapsedTime == 0) {
                this.form.setErrorMessage(APPMSG.ChangeDuration_Error2);
            }
            else if (newDurationSec < elapsedTime) {
                this.form.setErrorMessage(APPMSG.ChangeDuration_Error1);
                this.form.setErrorField("input[name='" + name + "']");
            }
            else {
                this.form.setErrorMessage(null);
                this.form.setErrorField(null);
            }
            $("#applyChangeRange").button("option", "disabled", (elapsedTime == 0) || (newDurationSec < elapsedTime));
        };
        ExecActionsSelector.prototype.computeElapsedTime = function () {
            var duration = $("#exec_stage_duration_value").text();
            var left = $("#exec_stage_timeleft_value").text();
            var durationSec = this.computeTimeFromStr(duration);
            var leftSec = this.computeTimeFromStr(left);
            return durationSec - leftSec;
        };
        ExecActionsSelector.prototype.manageSyncPoints = function () {
            var _this = this;
            var timer = -1;
            var requestHandle = null;
            var validate = function () {
                $("#releaseSyncPoint").button("option", "disabled", tableView.getCheckedElements().length == 0);
            };
            var manageSyncDialog = $("#exec_manage_sync_dialog").dialog({
                autoOpen: true,
                modal: true,
                width: $(window).width() * 0.6,
                height: "auto",
                closeText: APPMSG.Close_button,
                dialogClass: "manage_sync-dialog",
                buttons: [{
                        id: "releaseSyncPoint",
                        text: APPMSG.ReleaseButton_Label,
                        click: function () {
                            var points = tableView.getCheckedElements();
                            var data = {};
                            for (var i = 0; i < points.length; i++) {
                                data[points[i].name] = 0;
                            }
                            request.post("/executioncontrol/syncpoints", {
                                data: json.stringify(data),
                                headers: { "Content-Type": "application/json; charset=utf-8" }
                            });
                        }
                    }, {
                        text: APPMSG.Close_button,
                        click: function () {
                            if (timer != -1)
                                clearTimeout(timer);
                            if (requestHandle) {
                                requestHandle.cancel();
                            }
                            $(this).dialog("close");
                        }
                    }]
            });
            var tableView = new TableViewer($("#sync_points_table")[0]);
            tableView.setLabelProvider({
                getText: function (element, col) {
                    var counters = element.counters;
                    switch (col) {
                        case 0: return element.name;
                        case 1:
                            switch (counters[col - 1]) {
                                case 1: return APPMSG.SyncPointStateInactive;
                                case 2: return APPMSG.SyncPointStateActive;
                                case 3: return APPMSG.SyncPointStateReleased;
                            }
                            ;
                            return "Unknown state";
                        case 2:
                        case 3:
                        case 4:
                        case 5: return counters[col - 1] ? counters[col - 1] : 0;
                    }
                    ;
                    return "";
                },
                isElementCheckable: function (element) {
                    return element.counters[0] != 3;
                }
            });
            tableView.setContentProvider({
                getElements: function (input, callback) {
                    callback(input);
                }
            });
            var getSyncPointsServiceURL = function () {
                var url = _this.session.getBaseRequestUrl();
                var counterSTR = "counter=/Run/SyncPoint/[SYNC_POINT]/";
                url += "/qlast?";
                url += counterSTR + "State/Cumulated/Increment";
                url += "&" + counterSTR + "Arrived/Cumulated/Count";
                url += "&" + counterSTR + "Expected/Cumulated/Count";
                url += "&" + counterSTR + "Arrived/FirstTime/Elapsed";
                url += "&" + counterSTR + "Timeout/Cumulated/Count";
                url += "&f=json&i=1";
                return url;
            };
            var update_dialog = function () {
                requestHandle = request.get(getSyncPointsServiceURL(), {
                    handleAs: "json",
                    headers: { "Accept": "application/json" }
                });
                requestHandle.then(function (data) {
                    tableView.setInput(data.groups[0].instances);
                    timer = setTimeout(function () {
                        update_dialog();
                    }, 2000);
                });
            };
            update_dialog();
            tableView.on("checked", function (changedItem) {
                validate();
            });
            _app.getHelpSystem().setHelp($(".manage_sync-dialog"), HelpContextIds.MANAGE_SYNC_DIALOG);
            validate();
        };
        ExecActionsSelector.prototype.computeTimeFromStr = function (str) {
            var parts = str.split(":");
            if (parts.length != 3)
                return 0;
            var timeInSec = parseInt(parts[parts.length - 1], 10);
            timeInSec = timeInSec + parseInt(parts[parts.length - 2], 10) * 60;
            timeInSec = timeInSec + parseInt(parts[parts.length - 3], 10) * 3600;
            return timeInSec;
        };
        ExecActionsSelector.prototype.setSession = function (session) {
            this.session = session;
            this.statusProvider.setSession(session);
            this.updateAvailableActions(session);
            this.statusProvider.setOn();
        };
        ExecActionsSelector.prototype.updateStatus = function () {
            if (!this.statusProvider.session)
                return;
            var statusStr = this.statusProvider.getActiveStatus();
            this.setText(statusStr);
            this.setEnabled(this.statusProvider.canControlExecution() && this.allowControl);
        };
        ExecActionsSelector.prototype.updateAvailableActions = function (session) {
            if (session.isSchedule()) {
                this.actionLabels = [
                    APPMSG.Exec_abandon_action_title,
                    APPMSG.Exec_stop_action_title,
                    APPMSG.Exec_users_action_title,
                    APPMSG.Exec_log_action_title,
                    APPMSG.Exec_duration_action_title,
                    APPMSG.Exec_manage_sync_title
                ];
            }
            else {
                this.actionLabels = [
                    APPMSG.Exec_abandon_action_title,
                    APPMSG.Exec_stop_action_title
                ];
            }
        };
        return ExecActionsSelector;
    }(DropDownList));
    return ExecActionsSelector;
});
