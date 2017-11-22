var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented", "jrptlib/Url", "jrptlib/HelpSystem", "jrptlib/Menu", "jrptlib/Form", "search/SearchSystem", "ui/ReportSelector", "ui/SessionLabelProvider", "model/session/Session", "ui/Report", "ui/ExecActionsSelector", "ui/TimeRangeSelector", "ui/SessionSetComposer", "ui/AgentSelector", "ui/Prefs!", "jrptlib/Nls", "jrptlib/Properties!APPMSG", "ui/HelpContextIds", "jrptlib/Offline!", "jrptlib/HighContrastSystem"], function (require, exports, Evented, Url, HelpSystem, Menu, Form, SearchSystem, ReportSelector, SessionLabelProvider, Session, Report, ExecActionsSelector, TimeRangeSelector, SessionSetComposer, AgentSelector, Prefs, NLS, APPMSG, HelpContextIds, Offline, HC) {
    "use strict";
    function sanitizeKind(kind) {
        return kind == "regular" || kind == "trend" ? kind : "regular";
    }
    function toReportId(reportName) {
        var id = reportName.replace(/[\s<>\:"\/\\\|\?\*]/g, '_');
        if (id.length == 0) {
            return "report_" + new Date().getTime();
        }
        return id;
    }
    var App = (function (_super) {
        __extends(App, _super);
        function App() {
            var _this = this;
            _super.call(this);
            var app = this;
            App.INSTANCE = this;
            this.report_doc = null;
            this.report_id = "";
            this.report_name = "";
            this.resizeContents();
            if (Offline.isActivated())
                $(".application").addClass("offline");
            this.computeTitle();
            if (Prefs)
                $(document).find("#welcome_text").find("span").text(Prefs.productName);
            $('#open_session').button().click(function (event) {
                app.chooseSession();
            });
            $('#create_report').button().click(function (event) {
                app.createReport();
            });
            this.shareManager = null;
            this.menu = new Menu($("#main_menu")[0]);
            this.menu.on("clicked", function (id) {
                if (id == "main_menu_button") {
                    app.toggleMainMenu();
                }
                else if (id == "session") {
                    app.chooseSession();
                }
                else if (id == "create_report_menuitem") {
                    app.createReport();
                }
                else if (id == "edit") {
                    app.editMode(app.menu.isToggledItem(id));
                }
                else if (id == "save") {
                    app.saveReport();
                }
                else if (id == "save_as") {
                    app.saveReportAs();
                }
                else if (id == "share") {
                    if (app.shareManager == null) {
                        require(["dojo/fx", "share/ShareManager"], function (fx, ShareManager) {
                            app.shareManager = new ShareManager(app);
                            app.shareManager.open();
                        });
                    }
                    else
                        app.shareManager.open();
                }
                else if (id == "help") {
                    app.getHelpSystem().openHelp();
                }
            });
            this.searchManager = null;
            this.searchLine = null;
            $("#search_button").click(function (event) {
                app.toggleHelp();
            });
            $(window).keydown(function (e) {
                if ((e.ctrlKey || e.metaKey) && e.keyCode === 70) {
                    e.preventDefault();
                    app.toggleHelp();
                }
            });
            this.lastScroll = $(document).scrollTop();
            $(window).scroll(function (e) {
                var newScroll = $(document).scrollTop();
                if (newScroll == 0) {
                    $(".application").removeClass("scrolled");
                    $("#main_menu").removeClass("tiny");
                    var h = $("#app_header").height();
                    $("#content").css("top", h);
                    $("#page_selector").css("top", h);
                    app.resizeContents();
                    return;
                }
                if ($(".application").hasClass("scrolled"))
                    return;
                $(".application").addClass("scrolled");
                $("#main_menu").addClass("tiny");
                var h = $("#app_header").height();
                $("#content").css("top", h);
                $("#page_selector").css("top", h);
                if ($("#main_menu_panel").is(":visible")) {
                    app.resizeContents();
                }
            });
            window.onbeforeunload = function (e) {
                if (_this.report && !_this.isEclipseBrowser()
                    && _this.report.isModified()) {
                    var e = e || window.event;
                    if (e) {
                        e.returnValue = APPMSG.Warning_Closing_Message;
                    }
                    return APPMSG.Warning_Closing_Message;
                }
            };
            this.report_selector = new ReportSelector($('#report_list')[0], $('#report_desc')[0]);
            this.report_selector.on("selectionChanged", function (selection) {
                if (app.report != null && app.report.isModified()) {
                    app.purposeSaveReport(function (saved) {
                        if (saved)
                            app.setReport(selection[0]);
                    });
                }
                else
                    app.setReport(selection[0]);
            });
            this.report = new Report($("#content")[0]);
            this.report.setContents($("#pages_container")[0]);
            this.report.on("modified", function () {
                app.menu.setEnabledItem($("#save"), true);
                app.report_selector.setText("*" + app.report_selector.getText());
                app.refreshMainTitle();
            });
            this.report.on("pageChanged", function (page) {
                _this.updateStateURL(null, null, null, page.getId());
            });
            this.timerange_selector = new TimeRangeSelector($('#timerange_list')[0]);
            this.timerange_selector.setEnabled(!Offline.isActivated());
            this.exec_actions_selector = new ExecActionsSelector($('#exec_actions_list')[0]);
            this.agent_selector = new AgentSelector($('#agent_list')[0]);
            this.agent_selector.setEnabled(!Offline.isActivated());
            this.session_set_composer = new SessionSetComposer($("#session_name")[0]);
            this.session_set_composer.setIsSelectLineChanged(false);
            $("#app_header").find("ul").addClass("horizontal-bar");
            $("#app_header").find("ul").find("li").addClass("horizontal-bar-item");
            this.init_state();
        }
        App.prototype.getTimeRangeSelector = function () {
            return this.timerange_selector;
        };
        App.prototype.getSession = function () {
            return this.session;
        };
        App.prototype.getReportSelector = function () {
            return this.report_selector;
        };
        App.prototype.toggleMainMenu = function () {
            var _this = this;
            $("#main_menu_panel").toggle("blind", "fast", function () {
                $(".application").toggleClass("menu-opened");
                var h = $("#app_header").height();
                $("#content").css("top", h);
                $("#page_selector").css("top", h);
                _this.resizeContents();
            });
        };
        App.prototype.toggleHelp = function () {
            var app = this;
            $("#search_button").toggleClass("activated");
            if (this.searchLine == null) {
                require(["dojo/fx", "search/Search"], function (fx, Search) {
                    app.searchLine = new Search($("#search_line"), app.getSearchSystem());
                    app.searchLine.setHelpText(APPMSG.SearchLine_HelpText);
                    $("#search_line").slideToggle("slow", function () {
                        if ($("#search_button").hasClass("activated")) {
                            app.searchLine.setText("");
                            app.searchLine.setFocus();
                        }
                    });
                });
            }
            else
                $("#search_line").slideToggle("slow", function () {
                    if ($("#search_button").hasClass("activated")) {
                        app.searchLine.setText("");
                        app.searchLine.setFocus();
                    }
                });
        };
        App.prototype.showErrorMessage = function (message) {
            var _this = this;
            $("#error_dialog").empty();
            var p = $("<p>").text(message).appendTo($("#error_dialog"));
            $(p).prepend("<span class=\"ui-icon ui-icon-alert\" style=\"float:left; margin:0 7px 20px 0;\"></span>");
            this.error_dialog = $("#error_dialog").dialog({
                autoOpen: false,
                closeText: APPMSG.Close_button,
                modal: true,
                dialogClass: "error-dialog",
                buttons: [{
                        text: APPMSG.Close_button,
                        click: function () {
                            $(this).dialog("close");
                        } }]
            });
            setTimeout(function () {
                _this.error_dialog.dialog("open");
            }, 200);
        };
        App.prototype.showEventMessage = function (message) {
            $("#event_view").text(message)
                .position({
                my: "center bottom",
                at: "center top",
                collision: "none flip",
                of: "#app_header"
            }).show().delay(3000).fadeOut("slow", function () {
                $(this).css("left", 0);
                $(this).css("top", 0);
            });
        };
        App.prototype.resizeContents = function () {
            var h = window.innerHeight;
            var w = window.innerWidth;
            var height = h - $("#content").offset().top;
            $('#content').outerHeight(height);
            var offH = $('#pages_container').innerHeight() - $('#pages_container').height();
            $('#pages_container').css("min-height", height - offH);
            var h = $("#app_header").height();
            $("#content").css("top", h);
            $("#page_selector").css("top", h);
            if (this.report != null)
                this.report.resizeContents();
        };
        App.prototype.init_state = function () {
            $('#welcome_text').show();
            $('#content').removeClass("report");
            $('#content').addClass("welcome");
            $('#app_header').removeClass("report");
            $('#app_header').addClass("welcome");
            this.report_doc = null;
            this.menu.setToggleItem($("#main_menu_button"), false);
            this.menu.setEnabledItem($("#main_menu_button"), true);
            this.menu.setEnabledItem($("#session"), true);
            this.menu.setEnabledItem($("#create_report_menuitem"), false);
            this.menu.setEnabledItem($("#edit"), false);
            this.menu.setEnabledItem($("#share"), false);
            this.menu.setEnabledItem($("#save"), false);
            this.menu.setEnabledItem($("#help"), true);
            this.menu.setToggleItem($("#help"), false);
        };
        App.prototype.updateMenuState = function () {
            var editMode = this.report.getEditMode();
            this.menu.setEnabledItem($("#create_report_menuitem"), !editMode && this.session != null);
            this.menu.setEnabledItem($("#share"), !editMode);
            this.menu.setToggleItem($("#edit"), editMode);
        };
        App.prototype.load_report_definition = function (report_kind, new_reportid, new_report_name) {
            var app = this;
            var oldname = this.report_selector.getText();
            $("#pages_container").children().remove();
            if (new_reportid === ReportSelector.EMPTY_REPORT_ID) {
                app.report_doc = null;
                app.report_id = new_reportid;
                app.report_name = new_report_name;
                app.report_selector.setText(app.report_name);
                app.display_report();
                app.refreshMainTitle();
                $("<div>").text(APPMSG.EmptyReportMessage).addClass("information-message ui-widget").appendTo($("#pages_container"));
                return;
            }
            var nurl = new Url('/analytics/reports/' + report_kind + '/' + new_reportid + '.checked');
            nurl.get(null, function (data) {
                app.report_doc = $(data).find("Report")[0];
                app.report_id = new_reportid;
                app.report_name = new_report_name;
                app.report_selector.setText(app.report_name);
                app.display_report();
                app.refreshMainTitle();
            }, "xml", function (jqXHR, textStatus, errorThrown) {
                app.report_selector.setText(oldname);
                app.showErrorMessage(NLS.bind(APPMSG.BAD_XML_REPORT, [new_report_name, nurl, errorThrown]));
            });
        };
        App.prototype.display_report = function () {
            $('#content').removeClass("welcome");
            $('#content').addClass("report");
            $('#app_header').removeClass("welcome");
            $('#app_header').addClass("report");
            this.menu.setEnabledItem($("#session"), this.report_kind == "regular");
            this.menu.setEnabledItem($("#edit"), true);
            this.menu.setEnabledItem($("#share"), true);
            this.menu.setEnabledItem($("#help"), true);
            this.report.setDefinition(this.report_doc);
            this.report.setSession(this.session);
            this.report.showPageSelector(!$(".application").hasClass("display-print"));
        };
        App.prototype.chooseSession = function () {
            var app = this;
            require(["dojo/fx", "ui/SessionSelector"], function (fx, SessionSelector) {
                if (app.session_selector == null) {
                    app.session_selector = new SessionSelector();
                    app.session_selector.on("selected", function (session) {
                        app.menu.setToggleItem($("#session"), false);
                        app.openSession(session.path + "/" + session.name);
                    });
                }
                app.session_selector.select();
            });
        };
        App.prototype.openSession = function (session_path) {
            var _app = this;
            var session = new Session(session_path, true);
            session.setOn();
            session.modelAvailable().then(function () {
                var idx = session_path.lastIndexOf('/');
                var s_id = session_path.substring(idx + 1);
                var s_path = session_path.substring(0, idx);
                _app.setSession(session);
            }, function (errorThrown) {
                _app.showErrorMessage(NLS.bind(APPMSG.Unable_Retrieve_Sessions, errorThrown));
            });
        };
        App.prototype.editMode = function (toggled) {
            var _this = this;
            var editMode = this.report.getEditMode();
            if (editMode && this.report.isModified()) {
                this.purposeSaveReport(function (saved) {
                    if (saved) {
                        _this.report.setEditMode(toggled);
                        _this.report_selector.setShowAllReports(toggled);
                    }
                    _this.updateMenuState();
                    _this.updateHeaderSize();
                });
            }
            else {
                this.report.setEditMode(toggled);
                this.report_selector.setShowAllReports(toggled);
                this.updateMenuState();
                this.updateHeaderSize();
            }
        };
        App.prototype.setReport = function (report) {
            if (report == null) {
                this.init_state();
                return;
            }
            this.getSearchSystem().clear();
            var report_id = $(report).attr("id");
            var report_name = $(report).attr("label");
            this.load_report_definition(this.report_kind, report_id, report_name);
            this.updateStateURL(null, null, report_id, null);
        };
        App.prototype.isEclipseBrowser = function () {
            return typeof (fireDirtyEvent) == "function";
        };
        App.prototype.refreshMainTitle = function () {
            this.computeTitle();
            if (this.isEclipseBrowser()) {
                fireDirtyEvent();
            }
        };
        App.prototype.computeTitle = function () {
            var title = "";
            if (this.session) {
                title = this.computeMainObjectTitle();
            }
            else {
                title = APPMSG.Application_title;
            }
            if (this.report && this.report.isModified() && !this.isEclipseBrowser()) {
                title = "*" + title;
            }
            var mainTitle = $(document).find("title");
            mainTitle.text(title);
        };
        App.prototype.setSession = function (session) {
            var _this = this;
            this.session = session;
            var nbsessions = this.compareSessionSet.length;
            if (nbsessions > 0) {
                var sessions_1 = [];
                var _loop_1 = function(i) {
                    var session_1 = new Session(this_1.compareSessionSet[i], false);
                    session_1.setOn();
                    session_1.modelAvailable().then(function () {
                        sessions_1[i] = session_1;
                        nbsessions--;
                        if (nbsessions == 0) {
                            _this.session.sessionSet.setSessions(sessions_1);
                            _this.setSessionNext();
                        }
                    });
                };
                var this_1 = this;
                for (var i = 0; i < nbsessions; i++) {
                    _loop_1(i);
                }
            }
            else {
                this.setSessionNext();
            }
        };
        App.prototype.computeMainObjectTitle = function () {
            switch (this.report_kind) {
                case "regular":
                    return new SessionLabelProvider().getText(this.session);
                case "trend":
                    return NLS.bind(APPMSG.Trend, this.session.getTestName());
                default:
                    return "";
            }
        };
        App.prototype.setSessionNext = function () {
            var _this = this;
            var session_name = this.computeMainObjectTitle();
            this.session_set_composer.setText(NLS.bind(APPMSG.ShowCurrentSession, session_name));
            var mainTitle = $(document).find("title");
            mainTitle.text(session_name);
            if (this.report_doc == null && this.report_id == null) {
                this.report_selector.selectDefaultReport(this.session);
            }
            else {
                var sessionFeatures = this.session.getFeatures();
                var reportFeatures = $(this.report_doc).children("features").children("Feature");
                if (this.hasAFeatureInCommon(sessionFeatures, reportFeatures) == true) {
                    this.report.setSession(this.session);
                }
                else if (this.report_doc == null && this.report_id == null) {
                    this.report_selector.selectDefaultReport(this.session);
                }
            }
            this.timerange_selector.setSession(this.session);
            this.agent_selector.setSession(this.session);
            this.report_selector.setSession(this.session);
            this.session_set_composer.setSession(this.session);
            this.session.sessionSet.on("selectionChanged", function (sessionSet) {
                _this.timerange_selector.setEnabled(sessionSet.selection().length == 0);
                _this.updateStateURL(_this.session.sessionPath, null, null, null);
            });
            this.updateMenuState();
            $('#app_header').addClass("session");
            $('#content').addClass("session");
            this.emit("sessionChanged", this);
            this.exec_actions_selector.setSession(this.session);
            this.exec_actions_selector.setVisible(this.report_kind == "regular");
            this.showEventMessage(NLS.bind(APPMSG.SessionLoaded, session_name));
            this.updateHeaderSize();
            this.updateStateURL(this.session.sessionPath, null, null, null);
        };
        App.prototype.updateStateURL = function (sessionPath, userId, reportId, pageId) {
            if (Offline.isActivated())
                return;
            if (sessionPath != null) {
                this.sessionPath = sessionPath;
                this.compareSessionSet = [];
                if (this.session.sessionSet && this.session.sessionSet.sessions.length > 0) {
                    for (var _i = 0, _a = this.session.sessionSet.sessions; _i < _a.length; _i++) {
                        var s = _a[_i];
                        this.compareSessionSet.push(s.sessionPath);
                    }
                }
            }
            if (userId != null) {
                this.userId = userId;
            }
            if (reportId != null) {
                this.report_id = reportId;
            }
            if (pageId != null) {
                this.pageId = pageId;
            }
            var url = "/analytics/web/index.html";
            if (this.sessionPath != null) {
                url += "?session=" + this.sessionPath;
                url += (this.report_kind != null) ? "&kind=" + this.report_kind : "";
                url += (this.userId != null) ? "&userId=" + this.userId : "";
                url += (this.report_id != null) ? "&report=" + this.report_id : "";
                url += (this.pageId != null) ? "&page=" + this.pageId : "";
                url += (this.displayMode != null && this.displayMode != "default") ? "&display=" + this.displayMode : "";
                url += (this.compareSessionSet.length > 0) ? "&compare=" + this.compareSessionSet.join(",") : "";
                if (this.isEclipseBrowser()) {
                    setUrl(url);
                }
                window.history.pushState({}, null, url);
            }
        };
        App.prototype.updateHeaderSize = function () {
            var _this = this;
            setTimeout(function () {
                _this.resizeContents();
            }, 400);
        };
        App.prototype.hasAFeatureInCommon = function (sessionFeatures, reportFeatures) {
            for (var i = 0; i < sessionFeatures.length; i++) {
                var s = sessionFeatures[i];
                if (s != "com.ibm.rational.test.lt.feature.lt") {
                    for (var j = 0; j < reportFeatures.length; j++) {
                        var text = $(reportFeatures[j]).text();
                        if (s == text) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        App.prototype.purposeSaveReport = function (handler) {
            var app = this;
            $("#app_dialog_confirm").find(".ui-dialog-message")
                .text(NLS.bind(APPMSG.Save_Report_Dialog_message, this.report_name));
            $("#app_dialog_confirm").dialog({
                resizable: true,
                modal: true,
                closeText: APPMSG.Close_button,
                title: APPMSG.Save_Report_Dialog_title,
                width: "auto",
                buttons: [
                    {
                        text: APPMSG.Save_label,
                        click: function () {
                            $(this).dialog("close");
                            app.saveReport(handler);
                        } },
                    {
                        text: APPMSG.SaveAs_label,
                        click: function () {
                            $(this).dialog("close");
                            app.saveReportAs(handler);
                        } },
                    {
                        text: APPMSG.DiscardChanges_label,
                        click: function () {
                            $(this).dialog("close");
                            app.load_report_definition(app.report_kind, app.report_id, app.report_name);
                            if (handler)
                                handler(true);
                        } },
                    {
                        text: APPMSG.Cancel_button,
                        click: function () {
                            $(this).dialog("close");
                            if (handler)
                                handler(false);
                        } }]
            });
        };
        App.prototype.saveReport = function (handler) {
            var app = this;
            require(["dojo/fx", "ui/ReportSaver"], function (fx, ReportSaver) {
                var reportSaver = new ReportSaver();
                reportSaver.save(app.report_kind, app.report_id, app.report_doc);
                reportSaver.on("saved", function (report_id) {
                    app.report.setModified(false);
                    app.menu.setEnabledItem($("#save"), false);
                    app.report_selector.setText(app.report_name);
                    app.refreshMainTitle();
                    if (handler) {
                        handler(true);
                    }
                });
                reportSaver.on("failed", function () {
                    if (handler) {
                        handler(false);
                    }
                });
            });
        };
        App.prototype.saveReportAs = function (handler) {
            var app = this;
            var dialog = null;
            var save_as = function () {
                var new_name = $("#app_input_dialog").find(".input-field").val();
                var old_id = app.report_id;
                var old_name = app.report_name;
                app.report_name = new_name;
                app.report_id = toReportId(new_name);
                $(app.report.getModel()).attr("name", new_name);
                app.saveReport(function (saved) {
                    if (!saved) {
                        app.report_name = old_name;
                        app.report_id = old_id;
                        $(app.report.getModel()).attr("name", old_name);
                    }
                    if (handler)
                        handler(false);
                    if (saved) {
                        dialog.dialog("close");
                    }
                });
            };
            dialog = $("#app_input_dialog").dialog({
                autoOpen: false,
                closeText: APPMSG.Close_button,
                height: 300,
                width: 350,
                modal: true,
                dialogClass: 'save-as-dialog',
                buttons: [
                    { text: APPMSG.Save_label,
                        click: save_as },
                    { text: APPMSG.Cancel_button,
                        click: function () {
                            dialog.dialog("close");
                            if (handler)
                                handler(false);
                        } }],
                close: function () {
                }
            });
            var form_object = new Form(dialog.find("form"), $(dialog).find(".ui-dialog-message"));
            form_object.setMessage(APPMSG.SaveAs_Dialog_message);
            form_object.on("submit", function (form) {
                save_as();
            });
            var purposeReportName = NLS.bind(APPMSG.SaveAs_purposeNamePrefix, app.report_name);
            form_object.setValue(".input-field", purposeReportName);
            app.getHelpSystem().setHelp($(".save-as-dialog")[0], HelpContextIds.SAVE_AS_DIALOG);
            dialog.dialog("open");
        };
        App.prototype.startProgress = function (caption, message) {
            $("#progress_dialog").find(".progress-label").text(message);
            var pb = $("#progress_dialog");
            this.progress_dialog = pb.dialog({
                closeText: APPMSG.Close_button,
                title: caption,
                closeOnEscape: false,
                resizable: false,
                modal: true
            });
            var progressbar = $("#progress_dialog_progressbar");
            progressbar.progressbar({
                value: false
            });
        };
        App.prototype.stopProgress = function () {
            if (this.progress_dialog)
                this.progress_dialog.dialog("close");
        };
        App.prototype.getHelpSystem = function () {
            var _this = this;
            if (this.helpSystem == null) {
                this.helpSystem = new HelpSystem();
                this.helpSystem.on("failed", function (args) {
                    _this.showErrorMessage(NLS.bind(APPMSG.CSHelpError, args.href));
                });
            }
            return this.helpSystem;
        };
        App.prototype.getSearchSystem = function () {
            var _this = this;
            if (this.searchManager == null) {
                this.searchManager = new SearchSystem();
                this.searchManager.on("selectionChanged", function (entry) {
                    if (entry.category == APPMSG.SearchCategory_Pages)
                        _this.report.setPage(entry.object);
                    else if (entry.category == APPMSG.SearchCategory_Views)
                        _this.report.showItem(entry.object);
                    else if (entry.category == APPMSG.SearchCategory_Counters)
                        _this.report.showItem(entry.object);
                });
            }
            return this.searchManager;
        };
        App.prototype.createReport = function () {
            var app = this;
            require(["dojo/fx", "ui/ReportCreator"], function (fx, ReportCreator) {
                var creator = new ReportCreator();
                creator.open();
                creator.on("finish", function (data) {
                    app.report_doc = data.report_doc;
                    app.report_id = data.report_id;
                    app.report_name = $(app.report_doc).attr("name");
                    app.report_selector.setText(app.report_name);
                    app.display_report();
                    app.editMode(true);
                    app.report.setModified(true);
                    app.menu.setToggleItem($("#edit"), true);
                    app.toggleMainMenu();
                });
            });
        };
        App.prototype.isOffline = function () {
            return Offline.isActivated();
        };
        App.prototype.initDisplayMode = function () {
            if (this.displayMode == "default" || this.displayMode == null) {
                $(".application").removeClass("display-print");
            }
            else if (this.displayMode == "print") {
                $(".application").addClass("display-print");
            }
        };
        App.prototype.start = function () {
            var _this = this;
            if (HC.detect("./images/b-paper.png")) {
                $(document.body).addClass("use-high-contrast");
            }
            $(".application").hide();
            $(document).tooltip();
            var locationUrl = new Url(window.location.search.substring(1));
            this.sessionPath = locationUrl.getParameter("session");
            this.userId = locationUrl.getParameter("userId");
            this.report_kind = sanitizeKind(locationUrl.getParameter("kind"));
            this.report_id = locationUrl.getParameter("report");
            this.pageId = locationUrl.getParameter("page");
            this.displayMode = locationUrl.getParameter("display");
            var compare = locationUrl.getParameter("compare");
            this.compareSessionSet = compare ? compare.split(",") : [];
            var a_session = null;
            if (Offline.isActivated()) {
                var session_paths = new Url("/analytics/sessions/session.stats").checkForOfflineMode();
                a_session = session_paths.split(",");
                this.sessionPath = a_session[0];
                this.displayMode = new Url("/analytics/display_mode").checkForOfflineMode();
                this.report_kind = sanitizeKind(new Url("/analytics/report_kind").checkForOfflineMode());
            }
            this.initDisplayMode();
            this.getReportSelector().setReportKind(this.report_kind);
            this.session_set_composer.setReadOnly(this.report_kind == "trend" || Offline.isActivated());
            this.exec_actions_selector.setVisible(this.session && this.report_kind == "regular");
            this.timerange_selector.setReadOnly(this.report_kind == "trend");
            $(".application").show();
            $(window).resize(function () {
                _this.resizeContents();
                _this.emit("windowResized", {});
            });
            var showApplication = function () {
                _this.resizeContents();
            };
            if (this.sessionPath && this.sessionPath != "") {
                $("#open_session").text(APPMSG.LoadingApplication);
                this.openSession(this.sessionPath);
                this.on("sessionChanged", function () {
                    showApplication();
                    if (_this.report_id != null)
                        _this.getReportSelector().setSelectionById(_this.report_id);
                    if (a_session) {
                        for (var i = 1; i < a_session.length; i++) {
                            var session = new Session(a_session[i], true);
                            session.setOn();
                            session.modelAvailable().then(function (value) {
                                _this.session.sessionSet.add(value.sessionObject);
                            });
                        }
                    }
                });
            }
            else {
                showApplication();
            }
        };
        App.INSTANCE = null;
        return App;
    }(Evented));
    return App;
});
