var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Composite", "jrptlib/PopupMenu", "jrptlib/EditableLabel", "jrptlib/Action", "ui/ViewsFactory", "ui/PageLayout", "ui/InstancesSelector", "jrptlib/Properties!APPMSG", "jrptlib/Offline!"], function (require, exports, Composite, PopupMenu, EditableLabel, Action, ViewsFactory, PageLayout, InstancesSelector, APPMSG, Offline) {
    "use strict";
    var Page = (function (_super) {
        __extends(Page, _super);
        function Page(container, page_node, page_id, parent_page, report) {
            _super.call(this, container);
            this.page_node = page_node;
            this.page_id = page_id;
            this.parent_page = parent_page;
            this.report = report;
            if (this.parent_page)
                this.parent_page.addChildPage(this);
            $(this.getContainer()).attr("id", page_id);
            $(this.getContainer()).addClass("page");
            var head = document.createElement('header');
            $(head).addClass("removableTitle");
            $(head).appendTo($(this.getContainer()));
            var page = this;
            var views_container = document.createElement('section');
            this.setContents(views_container);
            $(views_container).appendTo($(this.getContainer()));
            $(this.page_node).children("views").children().each(function () {
                var view_viewer = page.createView(this);
                page.addItem(view_viewer);
                $(view_viewer.getContainer()).appendTo($(page.getContents()));
            });
            var foot = document.createElement('footer');
            $(foot).appendTo($(this.getContainer()));
            var layout = new PageLayout(this);
            this.setLayout(layout);
        }
        Page.prototype.addChildPage = function (page) {
            if (!this.child_pages)
                this.child_pages = [page];
            else
                this.child_pages.push(page);
        };
        Page.prototype.getRootPage = function () {
            if (this.parent_page)
                return this.parent_page.getRootPage();
            return this;
        };
        Page.prototype.fillTitle = function () {
            var parent = $(this.container).children("header");
            var title = $(document.createElement("h1"));
            var a = $(document.createElement("a"))
                .attr("name", this.page_id)
                .appendTo(title);
            var ul = $("<ul>").appendTo(title);
            this._fillTitle(ul, true);
            title.appendTo(parent);
            this.createWildcardSelectionForm(parent);
        };
        Page.prototype._fillTitle = function (container, leaf) {
            var _this = this;
            if (this.parent_page) {
                this.parent_page._fillTitle(container, false);
            }
            var title = $("<li>").appendTo(container);
            if (leaf || !this.child_pages) {
                title.addClass("page-title").text(this.getTitle());
            }
            else {
                $("<a>")
                    .attr("href", "javascript: void(0)")
                    .text(this.getTitle())
                    .click(function (event) { _this.report.setPage(_this); event.stopPropagation(); })
                    .appendTo(title);
            }
            if (this.child_pages) {
                var trail = $("<li>").appendTo(container);
                $(document.createTextNode(" ")).appendTo(trail);
                $("<a>")
                    .attr("href", "javascript: void(0)")
                    .text(">")
                    .click(function (event) { _this.displaySubPages(event); event.stopPropagation(); })
                    .appendTo(trail);
                $(document.createTextNode(" ")).appendTo(trail);
            }
        };
        Page.prototype.displaySubPages = function (event) {
            var actions = this.getDrilldownActions({});
            var popupMenu = new PopupMenu();
            popupMenu.setActions(actions);
            popupMenu.openPopupMenu(event);
            popupMenu.positionMenu(event.pageX, event.pageY);
        };
        Page.prototype.setShowTitleHint = function (show) {
            var required = this.parent_page != null || this.child_pages != null;
            this.applyShowTitle(required || show);
        };
        Page.prototype.applyShowTitle = function (show) {
            $(this.getContainer()).find(".removableTitle").toggleClass("removedTitle", !show);
        };
        Page.prototype.getTitle = function () {
            return $(this.page_node).attr("name");
        };
        Page.prototype.getReport = function () {
            return this.report;
        };
        Page.prototype.getModel = function () {
            return this.page_node;
        };
        Page.prototype.getId = function () {
            return this.page_id;
        };
        Page.prototype.showInTrail = function () {
            var page = this;
            this.report.filter_manager.enterRegister();
            try {
                if (this.parent_page) {
                    this.parent_page.showInTrail();
                }
                this.childPageMonitors = [];
                $(this.child_pages).each(function () {
                    var monitor = this.startFilterMonitoring();
                    if (monitor)
                        page.childPageMonitors.push(monitor);
                });
            }
            finally {
                this.report.filter_manager.exitRegister();
            }
        };
        Page.prototype.hideInTrail = function () {
            if (this.parent_page) {
                this.parent_page.hideInTrail();
            }
            $(this.childPageMonitors).each(function () {
                this.remove();
            });
            this.childPageMonitors = undefined;
        };
        Page.prototype.show = function () {
            var page = this;
            this.report.filter_manager.enterRegister();
            try {
                this.showInTrail();
                this.viewMonitors = [];
                var editMode_1 = this.isEditMode();
                $(this.getItems()).each(function (index) {
                    var monitor = this.startFilterMonitoring(function (view, visible) {
                        if (editMode_1)
                            visible = true;
                        page.getLayout().setItemVisible(view, visible);
                        if (visible) {
                            view.show();
                        }
                        else {
                            view.hide();
                        }
                    }, true);
                    if (monitor)
                        page.viewMonitors.push(monitor);
                });
            }
            finally {
                this.report.filter_manager.exitRegister();
            }
        };
        Page.prototype.hide = function () {
            this.hideInTrail();
            $(this.viewMonitors).each(function () {
                this.remove();
            });
            this.viewMonitors = undefined;
            $(this.getItems()).each(function (index) {
                this.hide();
            });
        };
        Page.prototype.startFilterMonitoring = function (handler, immediate) {
            if (this.filterMonitor === undefined) {
                this.filterMonitor = this.report.filter_manager.createMonitor(this.getModel());
            }
            if (this.filterMonitor) {
                var page = this;
                var ret = this.filterMonitor.on("existsChanged", function () {
                    if (handler)
                        handler(page, page.filterMonitor.exists());
                });
                if (immediate && handler)
                    handler(this, this.filterMonitor.exists());
                return ret;
            }
            else {
                if (immediate && handler)
                    handler(this, true);
                return null;
            }
        };
        Page.prototype.isFiltered = function () {
            return this.filterMonitor ? !this.filterMonitor.exists() : false;
        };
        Page.prototype.remove = function () {
            $(this.page_node).remove();
        };
        Page.prototype.createView = function (view_node) {
            var page = this;
            var ldata = $(view_node).find("layoutData")[0];
            var view = new ViewsFactory().create(document.createElement('div'), this, this.page_id + "-view" + this.getItems().length, view_node, this.instancesSelector ? this.instancesSelector.getInstances() : undefined);
            view.setLayoutData(ldata);
            view.on("modified", function (view) {
                page.emit("modified", page);
            });
            view.on("deleted", function (view) {
                page.removeView(view);
                _app.getSearchSystem().remove(view.getId());
            });
            var view_name = $(view_node).attr("name");
            if (!view_name)
                view_name = "";
            _app.getSearchSystem().add(view.getId(), {
                label: $(page.page_node).attr("name") + " - " + view_name,
                category: APPMSG.SearchCategory_Views,
                object: view });
            return view;
        };
        Page.prototype.removeView = function (view) {
            this.removeItem(view);
            $(view.getModel()).remove();
            this.emit("viewRemoved", view);
            this.emit("modified", this);
        };
        Page.prototype.getView = function (item) {
            var views = this.getItems();
            for (var i = 0; i < views.length; i++) {
                if (views[i].getModel() == item)
                    return views[i];
            }
            return null;
        };
        Page.prototype.showItem = function (item) {
            if (this.getLayout() != null)
                this.getLayout().showItem(item);
        };
        Page.prototype.setEditMode = function (edit_mode) {
            var _this = this;
            this.getLayout().setEditable(edit_mode);
            var views = this.getItems();
            for (var _i = 0, _a = this.getItems(); _i < _a.length; _i++) {
                var v = _a[_i];
                if (this.viewMonitors) {
                    if (v.isFiltered()) {
                        this.getLayout().setItemVisible(v, edit_mode);
                        if (edit_mode)
                            v.show();
                        else
                            v.hide();
                    }
                }
                v.setEditMode(edit_mode);
            }
            var edit_title = $(this.getContainer()).children("header").children("h1").find(".page-title");
            if (edit_mode) {
                this.editable_title = new EditableLabel(edit_title[0]);
                this.editable_title.on("textChanged", function (text) {
                    _this.emit("titleChanged", text);
                });
                $(this.getContainer()).addClass("in-edition");
                edit_title.addClass("in-edition");
            }
            else {
                if (this.editable_title != null)
                    this.editable_title.destroy();
                edit_title.removeClass("in-edition");
                $(this.getContainer()).removeClass("in-edition");
            }
        };
        Page.prototype.isEditMode = function () {
            return this.getLayout().isEditable();
        };
        Page.prototype.setSession = function (session) {
            this.session = session;
            if (this.instancesSelector) {
                this.instancesSelector.setSession(session);
            }
            $(this.getItems()).each(function () {
                this.setSession(session);
            });
            if (this.session)
                this.emit("sessionChanged", session);
        };
        Page.prototype.getSession = function () {
            return this.session;
        };
        Page.prototype.createWildcardSelectionForm = function (parent) {
            var wildcards = this.getWildcards();
            if (wildcards.length == 0)
                return;
            this.instancesSelector = new InstancesSelector(wildcards, this.isAllInstancesAllowed(), this.page_id, parent);
            this.instancesSelector.setSession(this.session);
            var _this = this;
            this.instancesSelector.on("instancesChanged", function () {
                $(_this.getItems()).each(function () {
                    this.setInstances(_this.instancesSelector.getInstances());
                });
            });
        };
        Page.prototype.getWildcards = function () {
            var wildcard = $(this.page_node).attr("wildcards");
            if (wildcard)
                return wildcard.split(",");
            return [];
        };
        Page.prototype.isAllInstancesAllowed = function () {
            return $(this.page_node).attr("allInstancesAllowed") == "true";
        };
        Page.prototype.getDrilldownActions = function (instances) {
            if (!this.child_pages)
                return [];
            if (Offline.isActivated() && Object.keys(instances).length != 0)
                return [];
            var report = this.report;
            return this.child_pages
                .filter(function (page) { return !page.isFiltered(); })
                .map(function (page) { return new Action(page.getTitle(), function () {
                page.setInstances(instances);
                report.setPage(page);
            }); });
        };
        Page.prototype.setInstances = function (instances) {
            this.instancesSelector.setInstances(instances);
        };
        Page.prototype.resizeContents = function () {
            if (this.getLayout()) {
                this.getLayout().resizeContents();
            }
            var views = this.getItems();
            for (var i = 0; i < views.length; i++) {
                views[i].notifyResize();
            }
            if (this.child_pages) {
                for (var i = 0; i < this.child_pages.length; i++) {
                    this.child_pages[i].resizeContents();
                }
            }
        };
        return Page;
    }(Composite));
    return Page;
});
