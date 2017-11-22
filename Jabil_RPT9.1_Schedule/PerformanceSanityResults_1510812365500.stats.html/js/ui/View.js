var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/LayoutedWidget", "jrptlib/Menu", "jrptlib/Properties!APPMSG"], function (require, exports, LayoutedWidget, Menu, APPMSG) {
    "use strict";
    var View = (function (_super) {
        __extends(View, _super);
        function View(container, page, view_id, view_node, instances) {
            _super.call(this, container);
            this.page = page;
            this.view_id = view_id;
            this.view_node = view_node;
            this.session = null;
            this._isShown = false;
            this.isDrawn = false;
            $(this.getContainer()).attr("id", this.view_id);
            $("<a name=\"" + this.view_id + "\"/>").appendTo($(this.getContainer()));
            this.header = $("<header>").addClass("clearfix view-header").appendTo($(this.getContainer()));
            var view_name = $(view_node).attr("name") || "";
            var showTitle = !($(view_node).attr("showTitle") === "false");
            this.setTitle(view_name, false);
            this.setShowTitle(showTitle, false);
            $(this.getContainer()).append("<section class=\"view-content\"/>");
            this.setClassName("view");
            var contents = $(this.getContainer()).find("section.view-content")[0];
            this.setContents(contents);
        }
        View.prototype.destroy = function () {
            $(this.getContainer()).children().remove();
            $(this.getContainer()).attr("id", "");
            _super.prototype.destroy.call(this);
            this.emit("deleted", this);
        };
        View.prototype.setBusy = function (busy) {
            var _this = this;
            this.busy = busy;
            var set = function () { return $(_this.getContainer()).toggleClass("busy", _this.busy); };
            if (busy)
                setTimeout(set, 300);
            else
                set();
        };
        View.prototype.setInstances = function (instances) {
        };
        View.prototype.getInstances = function () {
            return undefined;
        };
        View.prototype.setTitle = function (title, save) {
            if (save)
                $(this.view_node).attr("name", title);
            this.view_name = title;
            if (this.isShown()) {
                this.updateTitle();
            }
        };
        View.prototype.updateTitle = function () {
            var h1 = $(this.header).find("h1");
            if (!this.showTitle) {
                if (h1.length != 0) {
                    h1.remove();
                }
                return;
            }
            if (h1.length == 0) {
                h1 = $("<h1>").appendTo($(this.header));
            }
            var title = this.computeEffectiveTitle(this.view_name);
            var a = h1.children("a");
            if (a.length == 0) {
                if (title === "") {
                    $(h1).remove();
                    return;
                }
                $(h1).text(title);
            }
            else {
                $(a).first().text(title);
            }
        };
        View.prototype.computeEffectiveTitle = function (title) {
            return title;
        };
        View.prototype.setDrilldownTitle = function (titleArray) {
            var _this = this;
            var root = this.computeEffectiveTitle(this.view_name);
            var h1 = $(this.header).find("h1");
            if (titleArray.length > 0) {
                h1.remove();
                h1 = $("<h1>").appendTo($(this.header));
                $("<a>").appendTo(h1)
                    .text(root)
                    .attr("href", "javascript: void(0);")
                    .click(function () { return _this.pathClicked(0); });
                for (var i = 0; i < titleArray.length - 1; i++) {
                    var index = i;
                    $(document.createTextNode(" > ")).appendTo($(h1));
                    $("<a>").appendTo($(h1))
                        .text(titleArray[index])
                        .attr("href", "javascript: void(0);")
                        .click(function () { return _this.pathClicked(index + 1); });
                }
                $(document.createTextNode(" > " + titleArray[titleArray.length - 1])).appendTo($(h1));
            }
            else {
                $(h1).text(root);
            }
        };
        View.prototype.pathClicked = function (index) {
        };
        View.prototype.getModel = function () {
            return this.view_node;
        };
        View.prototype.getPage = function () {
            return this.page;
        };
        View.prototype.getReport = function () {
            return this.page.getReport();
        };
        View.prototype.show = function () {
            if (this._isShown)
                return;
            this._isShown = true;
            this.setSize();
            this.updateTitle();
            if (this.session) {
                this.createContents(this.getContents());
                this.isDrawn = true;
            }
        };
        View.prototype.hide = function () {
            if (!this._isShown)
                return;
            if (this.isDrawn) {
                this.clearContents();
                this.isDrawn = false;
            }
            this._isShown = false;
        };
        View.prototype.isShown = function () {
            return this._isShown;
        };
        View.prototype.startFilterMonitoring = function (handler, immediate) {
            var _this = this;
            if (!this.filterMonitor) {
                this.filterMonitor = this.getReport().filter_manager.createMonitor(this.getModel());
            }
            if (this.filterMonitor) {
                var view = this;
                var ret = this.filterMonitor.on("existsChanged", function () {
                    if (handler)
                        handler(_this, _this.filterMonitor.exists());
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
        View.prototype.isFiltered = function () {
            return this.filterMonitor ? !this.filterMonitor.exists() : false;
        };
        View.prototype.setSize = function () {
            if (this.getRatio() != -1) {
                var w = this.getW();
                var h = Math.round(w / this.getRatio());
                $(this.getContents()).height(h);
            }
        };
        View.prototype.clearContents = function () {
            $(this.getContainer()).find("section.view-content").children().each(function (idx) {
                $(this).remove();
            });
        };
        View.prototype.resizedContents = function (parent) {
        };
        View.prototype.getSession = function () {
            return this.session;
        };
        View.prototype.setSession = function (session) {
            this.session = session;
            if (this._isShown) {
                this.refreshContents();
            }
        };
        View.prototype.update = function () {
        };
        View.prototype.getDrilldownActions = function (instances) {
            return this.page.getDrilldownActions(instances);
        };
        View.prototype.refreshContents = function () {
            if (this.isDrawn) {
                this.clearContents();
                this.createContents(this.getContents());
            }
        };
        View.prototype.getId = function () {
            return this.view_id;
        };
        View.prototype.isEditMode = function () {
            return $(this.getContainer()).hasClass("in-edition");
        };
        View.prototype.setEditMode = function (value) {
            this.notifyResize();
            var header = $(this.getContainer()).find("header.view-header");
            var _this = this;
            if (value) {
                $(this.getContainer()).addClass("in-edition");
                $(header).addClass("ui-widget-header");
                var el_menu = document.createElement("ul");
                $(el_menu).addClass("toolbar view-toolbar");
                var menu = new Menu(el_menu);
                menu.on("clicked", function (id) {
                    if (id == "delete") {
                        $("#delete_view_dialog_confirm").dialog({
                            resizable: false,
                            modal: true,
                            closeText: APPMSG.Close_button,
                            buttons: [
                                {
                                    text: APPMSG.Delete_View,
                                    click: function () {
                                        $(this).dialog("close");
                                        _this.emit("deleted", _this);
                                    }
                                },
                                {
                                    text: APPMSG.Cancel_button,
                                    click: function () {
                                        $(this).dialog("close");
                                    }
                                }]
                        });
                    }
                    else if (id == "settings") {
                        require(["dojo/fx", "edit/ViewEdit"], function (fx, ViewEdit) {
                            var vedit = new ViewEdit(_this);
                            vedit.on("applyChanges", function () {
                                _this.emit("modified", _this);
                            });
                            vedit.edit();
                        });
                        return;
                    }
                    else if (id == "moveup") {
                        _this.emit("moveUp", {});
                    }
                    else if (id == "movedown") {
                        _this.emit("moveDown", {});
                    }
                });
                menu.appendItem("move", "portlet-header ui-button ui-icon ui-icon-arrow-4", APPMSG.Move_Action);
                menu.appendItem("moveup", "ui-button ui-icon ui-icon-triangle-1-n", APPMSG.MoveUp_Action);
                menu.appendItem("movedown", "ui-button ui-icon ui-icon-triangle-1-s", APPMSG.MoveDown_Action);
                menu.appendItem("settings", "ui-button ui-icon ui-icon-gear", APPMSG.Settings_Action);
                menu.appendItem("delete", "ui-button ui-icon ui-icon-close", APPMSG.Delete_View);
                $(header).find("h1").addClass("portlet-header");
                $(el_menu).appendTo($(header));
            }
            else {
                $(header).removeClass("ui-widget-header");
                $(this.getContainer()).removeClass("in-edition");
                $(header).find(".view-toolbar").remove();
                $(header).find("h1").removeClass("portlet-header");
            }
        };
        View.prototype.resizeContents = function () {
            if (!this.hasContents())
                return;
            this.setSize();
            this.resizedContents(this.getContents());
        };
        View.prototype.refreshStart = function () {
            this.wait = document.createElement('span');
            $(this.wait).text(APPMSG.PleaseWait);
            $(this.wait).addClass("view-wait-message");
            var cw = $(this.getContainer()).outerWidth();
            var ch = $(this.getContainer()).outerHeight();
            $(this.wait).appendTo($(this.getContainer()));
            var w = $(this.wait).outerWidth();
            var h = $(this.wait).outerHeight();
            $(this.wait).css({ bottom: Math.floor((ch - h) / 2), left: Math.floor((cw - w) / 2) });
        };
        View.prototype.refreshDone = function () {
        };
        View.prototype.setLayoutData = function (data) {
            _super.prototype.setLayoutData.call(this, data);
            $(this.view_node).find("layoutData").remove();
            $(this.view_node).append(data);
        };
        View.prototype.createOptions = function (provider, counterProvider) {
            var _this = this;
            provider.addOption({ label: APPMSG.Title_label,
                type: "TEXT",
                id: "name",
                value: function () {
                    return _this.view_name;
                },
                change: function (value, save) {
                    _this.setTitle(value, save);
                }
            });
            provider.addOption({ label: APPMSG.ShowTitle_label,
                type: "BOOLEAN",
                id: "show_title",
                value: function () {
                    return _this.isShowTitle();
                },
                change: function (value, save) {
                    _this.setShowTitle(value, save);
                }
            });
        };
        View.prototype.setShowTitle = function (value, save) {
            this.showTitle = value;
            if (save)
                $(this.view_node).attr("showTitle", value.toString());
            if (this.isShown()) {
                this.updateTitle();
            }
        };
        View.prototype.isShowTitle = function () {
            return this.showTitle;
        };
        View.prototype.addSearchEntry = function (id, label, category) {
            _app.getSearchSystem().add(this.view_id + id, {
                label: this.view_name + " - " + label,
                category: category,
                object: this });
        };
        View.prototype.removeSearchEntry = function (id) {
            _app.getSearchSystem().remove(this.view_id + id);
        };
        View.prototype.isRendered = function () {
            return this.isDrawn;
        };
        return View;
    }(LayoutedWidget));
    return View;
});
