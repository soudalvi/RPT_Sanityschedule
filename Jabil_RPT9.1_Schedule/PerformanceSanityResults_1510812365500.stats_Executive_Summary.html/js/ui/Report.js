var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Composite", "jrptlib/Stacklayout", "jrptlib/AlignLayout", "model/session/FilterManager", "ui/Page", "ui/PageSelector", "ui/SessionLabelProvider", "jrptlib/Nls", "jrptlib/Properties!APPMSG", "jrptlib/DateFormat"], function (require, exports, Composite, StackLayout, AlignLayout, FilterManager, Page, PageSelector, SessionLabelProvider, NLS, APPMSG, DateFormat) {
    "use strict";
    var Report = (function (_super) {
        __extends(Report, _super);
        function Report(container) {
            _super.call(this, container);
            this.edit_mode = false;
            this.modified = false;
            this.report_def = null;
            this.page_selector = null;
            this.report_layout = null;
            this.filter_manager = FilterManager.create();
        }
        Report.prototype.getModel = function () {
            return this.report_def;
        };
        Report.prototype.getRootPages = function () {
            var _this = this;
            return $.makeArray($(this.getModel()).children("pages").children("Page")).map(function (item) {
                return _this.getPageViewer(item);
            });
        };
        Report.prototype.createPageView = function (page_model, idx, parentPage) {
            var report = this;
            var page = new Page(document.createElement('div'), page_model, "page" + idx, parentPage, this);
            page.on("titleChanged", function (text) {
                $(page.getModel()).attr("name", text);
                report.page_selector.renamePage(page, text);
                report.setModified(true);
                _app.getSearchSystem().remove(page.getId());
                _app.getSearchSystem().add(page.getId(), { label: $(page.getModel()).attr("name"),
                    category: APPMSG.SearchCategory_Pages,
                    object: page });
            });
            page.on("viewAdded", function (view) {
                report.emit("viewAdded", view);
                report.setModified(true);
            });
            page.on("viewRemoved", function (view) {
                report.emit("viewRemoved", view);
                report.setModified(true);
            });
            page.on("modified", function (page) {
                report.setModified(true);
            });
            _app.getSearchSystem().add(page.getId(), {
                label: $(page.getModel()).attr("name"),
                category: APPMSG.SearchCategory_Pages,
                object: page });
            return page;
        };
        Report.prototype.addPage = function (page_node, idx, parent) {
            var page = this.createPageView(page_node, idx, parent);
            $(page.getContainer()).appendTo($(this.getContents()));
            this.addItem(page);
            var report = this;
            $(page_node).children("subPages").children("Page").each(function (subidx) {
                report.addPage(this, idx + "_" + subidx, page);
            });
            page.fillTitle();
            page.setEditMode(this.edit_mode);
        };
        Report.prototype.writeReportHeader = function () {
            var sessionLabelProvider = new SessionLabelProvider();
            var h = $("<header>").addClass("report-title").prependTo($(this.getContainer()));
            $("<h1>").text(_app.report_name).appendTo(h);
            var table = $("<table>").addClass("report-session-attributes").appendTo(h);
            var tr = $("<tr>").appendTo(table);
            $("<th>").text(APPMSG.Run_label).appendTo(tr);
            $("<td>").text(decodeURIComponent(this.session.sessionPath)).appendTo(tr);
            tr = $("<tr>").appendTo(table);
            $("<th>").text(APPMSG.StartTime_label).appendTo(tr);
            var d = new DateFormat(this.session.getDate());
            $("<td>").text(d.toDateString()).appendTo(tr);
            tr = $("<tr>").appendTo(table);
            $("<th>").text(APPMSG.Test_label).appendTo(tr);
            $("<td>").text(this.session.getTestPath()).appendTo(tr);
            if (this.session.sessionSet && this.session.sessionSet.sessions.length > 0) {
                tr = $("<tr>").addClass("row-group").appendTo(table);
                $("<th>").attr("colspan", "2").text(APPMSG.ComparisonWith_label).appendTo(tr);
                for (var _i = 0, _a = this.session.sessionSet.sessions; _i < _a.length; _i++) {
                    var s = _a[_i];
                    var tr_1 = $("<tr>").appendTo(table);
                    $("<td>").text(sessionLabelProvider.getText(s)).appendTo(tr_1);
                    $("<td>").text(decodeURIComponent(s.sessionPath)).appendTo(tr_1);
                }
            }
            if (this.session.timeRanges) {
                var tr_2 = $("<tr>").appendTo(table);
                $("<th>").text("Time ranges").appendTo(tr_2);
                var trnames = "";
                for (var _b = 0, _c = this.session.timeRanges.list(); _b < _c.length; _b++) {
                    var tr_3 = _c[_b];
                    trnames += tr_3.name + ",";
                }
                $("<td>").text(trnames).appendTo(tr_2);
            }
        };
        Report.prototype.setDefinition = function (report_def) {
            if (this.report_def != null)
                this.uninstallDefinition();
            this.report_def = report_def;
            this.modified = false;
            var report = this;
            $(report_def).children('pages').each(function () {
                $(this).children('Page').each(function (index) {
                    report.addPage(this, index.toString());
                });
            });
            if ($(".application").hasClass("display-print")) {
                $("#pages_container").addClass("full-size");
                var l = new AlignLayout(AlignLayout.DOWN);
                l.on("itemShown", function (page) {
                    page.on("sessionChanged", function () {
                        page.show();
                    });
                });
                this.setLayout(l);
            }
            else {
                this.setLayout(new StackLayout({
                    placeOnTop: function (page) {
                        page.show();
                        report.resizeContents();
                    },
                    placeToBack: function (page) {
                        page.hide();
                    }
                }));
            }
            if (this.page_selector == null) {
                this.page_selector = new PageSelector($("#page_selector")[0]);
                this.page_selector.on("toogleSize", function () {
                    $("#pages_container").toggleClass("full-size");
                    report.toggleTitles();
                    report.resizeContents();
                });
                this.page_selector.getListview().on("selectionChanged", function (page) {
                    report.showItem(page);
                    report.emit("pageChanged", page);
                });
            }
            this.page_selector.setInput(this);
            if (this.getItems().length > 0)
                this.page_selector.setSelection(this.getItems()[0]);
            this.toggleTitles();
        };
        Report.prototype.toggleTitles = function () {
            var reduced = $("#pages_container").hasClass("full-size");
            var editMode = this.edit_mode;
            var items = this.getItems();
            var show = reduced == true || editMode == true;
            for (var i = 0; i < items.length; i++) {
                items[i].setShowTitleHint(show);
            }
        };
        Report.prototype.setPage = function (page) {
            this.showItem(page);
            this.page_selector.setSelection(page.getRootPage());
        };
        Report.prototype.getPage = function () {
            return this.page_selector.getSelection();
        };
        Report.prototype.setEditMode = function (edit_mode) {
            this.edit_mode = edit_mode;
            var report = this;
            var pages = this.getItems();
            for (var i = 0; i < pages.length; i++) {
                pages[i].setEditMode(edit_mode);
            }
            if (this.page_selector != null) {
                this.page_selector.setEditMode(edit_mode);
                if (!this.page_selector.getSelection()) {
                    if (pages.length > 0)
                        this.page_selector.setSelection(pages[0]);
                }
            }
            this.toggleTitles();
        };
        Report.prototype.getEditMode = function () {
            return this.edit_mode;
        };
        Report.prototype.getPageViewer = function (page) {
            var pages = this.getItems();
            for (var i = 0; i < pages.length; i++) {
                if (pages[i].getModel() === page)
                    return pages[i];
            }
            return null;
        };
        Report.prototype.uninstallDefinition = function () {
            var pages = this.getItems();
            while (pages.length) {
                pages[0].remove();
                this.removeItem(pages[0]);
            }
            if (this.getLayout())
                this.getLayout().unlayout();
            $(this.getContents()).find(".page").remove();
            this.removeAll();
            this.page_selector.setInput(null);
            this.report_def = null;
            this.modified = false;
        };
        Report.prototype.showItem = function (item) {
            if (!item)
                return;
            var pages = this.getItems();
            if (item instanceof Page) {
                if (this.getLayout())
                    this.getLayout().showItem(item);
            }
            else {
                var view = item;
                this.setPage(view.getPage());
                view.getPage().showItem(view);
            }
        };
        Report.prototype.setSession = function (session) {
            this.session = session;
            this.filter_manager.setSession(session);
            $(this.getItems()).each(function (idx) {
                this.setSession(session);
            });
            if ($(".application").hasClass("display-print")) {
                this.writeReportHeader();
            }
        };
        Report.prototype.showPageSelector = function (show) {
            if (show) {
                $("#page_selector").show();
            }
            else {
                $("#page_selector").hide();
            }
            var pages = this.getItems();
            for (var i = 0; i < pages.length; i++) {
                pages[i].notifyResize();
            }
        };
        Report.prototype.resizeContents = function () {
            if (this.page_selector) {
                this.page_selector.resize();
                if (this.getPage()) {
                    this.getPage().resizeContents();
                }
            }
        };
        Report.prototype.getLabel = function (action) {
            if (action == this.remove)
                return APPMSG.Delete_Page;
            if (action == this.insertAfter)
                return APPMSG.Add_Page;
            if (action == this.moveUp)
                return APPMSG.MoveUp_Action;
            if (action == this.moveDown)
                return APPMSG.MoveDown_Action;
            throw action;
        };
        Report.prototype.remove = function (pages_container, done) {
            if (!pages_container)
                return;
            var page = pages_container.getModel();
            var report = this;
            $("#delete_page_dialog_confirm").dialog({
                resizable: false,
                modal: true,
                closeText: APPMSG.Close_button,
                buttons: [
                    {
                        text: APPMSG.Delete_Page,
                        click: function () {
                            $(this).dialog("close");
                            var prev = $(page).prev().length ? $(page).prev()[0] : null;
                            $(page).remove();
                            var removed_index = report.removeItem(pages_container);
                            _app.getSearchSystem().remove(pages_container.getId());
                            var pages = report.getItems();
                            var selection = null;
                            if (removed_index < pages.length) {
                                selection = pages[removed_index];
                            }
                            else {
                                selection = report.getPageViewer(prev);
                            }
                            done(selection);
                            report.emit("pageRemoved", pages_container);
                            report.setModified(true);
                        } },
                    {
                        text: APPMSG.Cancel_button,
                        click: function () {
                            $(this).dialog("close");
                        }
                    }]
            });
        };
        Report.prototype.insertAfter = function (pages_container, done) {
            var page = pages_container.getModel();
            var idx = this.getRootPages().length + 1;
            var page_def = $.parseXML("<Page />").documentElement;
            $(page_def).attr("name", NLS.bind(APPMSG.PageNew_Title, idx));
            $("<views>").appendTo($(page_def));
            $(this.report_def).find("pages").children().each(function (idx) {
                if (this === page) {
                    $(page_def).insertAfter($(this));
                }
            });
            var page_viewer = this.createPageView(page_def, idx.toString());
            page_viewer.fillTitle();
            page_viewer.setEditMode(this.edit_mode);
            $(page_viewer.getContainer()).appendTo($(this.getContents()));
            this.addItem(page_viewer);
            page_viewer.setSession(this.session);
            done(page_viewer);
            this.emit("pageAdded", page_viewer);
            this.setModified(true);
        };
        Report.prototype.moveUp = function (pages_container, done) {
            var page = pages_container.getModel();
            var prev = $(page).prev();
            if ($(prev).length > 0) {
                $(page).insertBefore($(prev));
                done(pages_container);
                this.setModified(true);
            }
        };
        Report.prototype.moveDown = function (pages_container, done) {
            var page = pages_container.getModel();
            var next = $(page).next();
            if ($(next).length > 0) {
                $(page).insertAfter($(next));
                done(pages_container);
                this.setModified(true);
            }
        };
        Report.prototype.setModified = function (value) {
            if (this.modified != value) {
                this.modified = value;
                if (value) {
                    this.emit("modified", {});
                }
            }
        };
        Report.prototype.isModified = function () {
            return this.modified;
        };
        return Report;
    }(Composite));
    return Report;
});
