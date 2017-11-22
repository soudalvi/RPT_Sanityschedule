var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Layout", "jrptlib/Menu", "jrptlib/ExpandToolbar", "jrptlib/Properties!APPMSG"], function (require, exports, Layout, Menu, ExpandToolbar, APPMSG) {
    "use strict";
    var PageLayout = (function (_super) {
        __extends(PageLayout, _super);
        function PageLayout(page) {
            _super.call(this, "rowlayout");
            this.edit_mode = false;
            this.page = page;
            this.current_dropped_column = null;
            this.view_types = [{ type: "lineChart", label: APPMSG.LineChart_label },
                { type: "barChart", label: APPMSG.BarChart_label },
                { type: "pieChart", label: APPMSG.PieChart_label },
                { type: "table", label: APPMSG.Table_label },
                { type: "text", label: APPMSG.Text_label }];
        }
        PageLayout.prototype.getRows = function () {
            return $(this.getContainer()).find(".row");
        };
        PageLayout.prototype.getItemLayoutData = function (item) {
            var ldata = item.getLayoutData();
            if (!ldata)
                return null;
            var rld = ldata.firstChild;
            if (rld && rld.nodeName == "RowLayoutData")
                return rld;
            return null;
        };
        PageLayout.prototype.createItemLayoutData = function (item) {
            var data = this.getItemLayoutData(item);
            if (!data) {
                var ldata_node = $.parseXML("<layoutData/>").documentElement;
                data = $.parseXML("<RowLayoutData/>").documentElement;
                $(ldata_node).append(data);
                item.setLayoutData(ldata_node);
            }
            return data;
        };
        PageLayout.prototype.layout = function () {
            var layout = this;
            var rows = this.getRows();
            if (rows.length > 0) {
                return;
            }
            _super.prototype.layout.call(this);
            var items = this.getComposite().getItems();
            if (items.length == 0)
                return;
            var columns = new Array();
            for (var i = 0; i < PageLayout.MAX_COLUMNS; i++) {
                columns.push(new Array());
            }
            for (var i = 0; i < items.length; i++) {
                var ldata = this.getItemLayoutData(items[i]);
                if (ldata != null) {
                    if ($(ldata).attr("ratio")) {
                        items[i].setRatio(parseFloat($(ldata).attr("ratio")));
                    }
                    if ($(ldata).attr("width")) {
                        items[i].setW(parseInt($(ldata).attr("width")));
                    }
                    if ($(ldata).attr("height")) {
                        items[i].setH(parseInt($(ldata).attr("height")));
                    }
                    if ($(ldata).attr("col") != undefined && parseInt($(ldata).attr("col")) > 0) {
                        var idx_col = parseInt($(ldata).attr("col")) - 1;
                        if (idx_col >= PageLayout.MAX_COLUMNS)
                            idx_col = PageLayout.MAX_COLUMNS - 1;
                        columns[idx_col].push(items[i]);
                        continue;
                    }
                }
                for (var k = 0; k < PageLayout.MAX_COLUMNS; k++) {
                    if (columns[k].length > 0) {
                        this.appendRow(columns);
                        break;
                    }
                }
                var columns = new Array();
                for (var k = 0; k < PageLayout.MAX_COLUMNS; k++) {
                    columns.push(new Array());
                }
                columns[0].push(items[i]);
            }
            for (var k = 0; k < PageLayout.MAX_COLUMNS; k++) {
                if (columns[k].length > 0) {
                    this.appendRow(columns);
                    break;
                }
            }
        };
        PageLayout.prototype.unlayout = function () {
            _super.prototype.unlayout.call(this);
            var rows = this.getRows();
            $(rows).each(function (index) {
                $(this).remove();
            });
        };
        PageLayout.prototype.appendRow = function (columns) {
            var nb_columns = 1;
            for (var k = 0; k < PageLayout.MAX_COLUMNS; k++) {
                if (columns[k].length > 0) {
                    nb_columns = Math.max(nb_columns, k + 1);
                }
            }
            var row = this.createRow(nb_columns);
            $(row).appendTo($(this.getContainer()));
            $(row).find(".column").each(function (idx) {
                for (var i = 0; i < columns[idx].length; i++) {
                    $(columns[idx][i].getContainer()).appendTo($(this));
                }
            });
            return row;
        };
        PageLayout.prototype.addItem = function (item) {
            _super.prototype.addItem.call(this, item);
            if (this.insertAfter != null)
                $(item.getContainer()).insertAfter($(this.insertAfter));
            else if (this.insertBefore != null)
                $(item.getContainer()).insertBefore($(this.insertBefore));
            else
                $(item.getContainer()).appendTo($(this.current_dropped_column));
            this.setEditableItem(this.edit_mode, item);
        };
        PageLayout.prototype.removeItem = function (item) {
            var column = $(item.getContainer()).parent();
            this.setEditableItem(false, item);
            $(item.getContainer()).remove();
            _super.prototype.removeItem.call(this, item);
            if (this.edit_mode) {
                this.addColumnEditToolbar(column);
            }
        };
        PageLayout.prototype.showItem = function (item) {
        };
        PageLayout.prototype.createRow = function (nb_columns) {
            var row = document.createElement('div');
            $(row).addClass("row")
                .addClass("row-column" + nb_columns)
                .addClass("clearfix");
            for (var i = 0; i < nb_columns; i++) {
                var col = document.createElement('div');
                $(col).addClass("column")
                    .data("col", i)
                    .appendTo(row);
            }
            return row;
        };
        PageLayout.prototype.removeRow = function (row) {
            var _this = this;
            $(row).find(".view").each(function (idx) {
                var w = $(this).data("widget");
                w.destroy();
            });
            $(row).fadeOut("slow", function () {
                $(row).remove();
                if (_this.getRows().length == 0) {
                    _this.removeRowEditToolbar("bottom");
                }
            });
        };
        PageLayout.prototype.setEditableColumn = function (in_edition, column) {
            var _this = this;
            if (in_edition) {
                var cc = $("<div>").addClass("column-content");
                $(column).children().each(function () {
                    $(this).appendTo($(cc));
                });
                var ch = $("<div>").addClass("column-header").appendTo($(column));
                $(cc).appendTo($(column));
                var cf = $("<div>").addClass("column-footer").appendTo($(column));
                $(cc).sortable({
                    connectWith: ".column-content",
                    handle: ".portlet-header",
                    cancel: ".portlet-toggle",
                    placeholder: "portlet-placeholder",
                    receive: function (event, ui) {
                        if ($(ui.item).hasClass("rowlayout-item")) {
                            var widget = $(ui.item).data("widget");
                            var from = ui.sender;
                            setTimeout(function () {
                                _this._updateModelChanges();
                            }, 500);
                        }
                    },
                    revert: true
                })
                    .addClass("in-edition");
                this.addColumnEditToolbar(column);
            }
            else {
                if ($(column).hasClass("in-edition")) {
                    $(column).sortable("destroy");
                }
                $(column).find(".column-header").remove();
                $(column).find(".column-footer").remove();
                $(column).find(".column-content").children().each(function () {
                    $(this).appendTo($(column));
                });
                $(column).find(".column-content").remove();
                $(column).removeClass("in-edition");
                this.removeColumnEditToolbar(column);
            }
        };
        PageLayout.prototype.setEditableRow = function (in_edition, row) {
            var _this = this;
            $(row).find(".column").each(function (idx) {
                _this.setEditableColumn(in_edition, this);
            });
            if (in_edition) {
                $(row).addClass("in-edition");
                var dmenu = document.createElement("ul");
                $(dmenu).addClass("rowlayout-toolbar toolbar clearfix");
                var edit_menu = new Menu(dmenu);
                edit_menu.on("clicked", function (id) {
                    if (id == "remove_row") {
                        if ($(row).find(".view").length > 0) {
                            $("#delete_view_dialog_confirm").dialog({
                                resizable: false,
                                modal: true,
                                closeText: APPMSG.Close_button,
                                buttons: [
                                    {
                                        text: APPMSG.Delete_View,
                                        click: function () {
                                            $(this).dialog("close");
                                            _this.removeRow(row);
                                        } },
                                    {
                                        text: APPMSG.Cancel_button,
                                        click: function () {
                                            $(this).dialog("close");
                                        }
                                    }]
                            });
                        }
                        else
                            _this.removeRow(row);
                    }
                    else if (id == "moveup_row") {
                        _this.moveupRow(row);
                    }
                    else if (id == "movedown_row") {
                        _this.movedownRow(row);
                    }
                });
                $(row).prepend(dmenu);
                edit_menu.appendItem("remove_row", "ui-icon-close", APPMSG.Delete_Row);
                edit_menu.appendItem("moveup_row", "ui-icon-triangle-1-n", APPMSG.MoveUp_Action);
                edit_menu.appendItem("movedown_row", "ui-icon-triangle-1-s", APPMSG.MoveDown_Action);
            }
            else {
                $(row).find(".rowlayout-toolbar").remove();
                $(row).removeClass("in-edition");
            }
        };
        PageLayout.prototype.moveupRow = function (row) {
            if ($(row).prev().hasClass("row")) {
                var view_prev = $(row).prev().find(".view").first();
                $(row).insertBefore($(row).prev());
                $(row).find(".view").each(function (idx) {
                    if ($(view_prev).length > 0) {
                        var widget = $(this).data("widget");
                        var widget2 = $(view_prev).data("widget");
                        $(widget.view_node).insertBefore($(widget2.view_node));
                    }
                });
                this._updateModelChanges();
            }
        };
        PageLayout.prototype.movedownRow = function (row) {
            if ($(row).next().hasClass("row")) {
                var view_next = $(row).next().find(".view").last();
                $(row).insertAfter($(row).next());
                $(row).find(".view").each(function (idx) {
                    if ($(view_next).length > 0) {
                        var widget = $(this).data("widget");
                        var widget2 = $(view_next).data("widget");
                        $(widget.view_node).insertAfter($(widget2.view_node));
                        view_next = $(this);
                    }
                });
                this._updateModelChanges();
            }
        };
        PageLayout.prototype.setEditableItem = function (in_edition, item) {
            if (in_edition) {
                var _this_1 = this;
                var mvup = item.on("moveUp", function () {
                    var after = $(item.getContainer()).next();
                    var before = $(item.getContainer()).prev();
                    if (before && $(before).hasClass("view")) {
                        $(item.getContainer()).insertBefore($(before));
                        _this_1._updateModelChanges();
                    }
                });
                var mvdn = item.on("moveDown", function () {
                    var after = $(item.getContainer()).next();
                    var before = $(item.getContainer()).prev();
                    if (after && $(after).hasClass("view")) {
                        $(item.getContainer()).insertAfter($(after));
                        _this_1._updateModelChanges();
                    }
                });
                $(item).data("mvup", mvup);
                $(item).data("mvdn", mvdn);
                var layout = this;
                $(item.getContainer()).addClass("in-edition");
                $(item.getContainer()).resizable({
                    alsoResize: "",
                    helper: "resizable-helper",
                    handles: "s",
                    stop: function (event, ui) {
                        var ih = ui.size.height;
                        var new_ratio = ui.size.width / ui.size.height;
                        item.setRatio(new_ratio);
                        var data = layout.createItemLayoutData(item);
                        $(data).attr("ratio", new_ratio.toString());
                        ui.element.width("");
                        ui.element.height("");
                        item.notifyResize();
                    }
                });
            }
            else {
                $(item).data("mvup").remove();
                $(item).data("mvdn").remove();
                if ($(item.getContainer()).hasClass("in-edition"))
                    $(item.getContainer()).resizable("destroy");
                $(item.getContainer()).removeClass("in-edition");
            }
        };
        PageLayout.prototype.addRowEditToolbar = function (position) {
            var _this = this;
            var toolbar = $("<div class=\"addrow-toolbar addrow-toolbar-" + position + "\">")[0];
            var exptoolbar = new ExpandToolbar(toolbar, APPMSG.InsertRow);
            var renderButton = function (container, button) {
                var parent = $("<div>").appendTo(container);
                parent.text(button.label);
                $("<div>").addClass("column-number").text(button.id).prependTo(parent);
            };
            exptoolbar.addToolButton({ id: "1",
                label: APPMSG.ColumnLabel,
                render: renderButton,
                className: "column-button" });
            exptoolbar.addToolButton({ id: "2",
                label: APPMSG.ColumnsLabel,
                render: renderButton,
                className: "column-button" });
            exptoolbar.addToolButton({ id: "3",
                label: APPMSG.ColumnsLabel,
                render: renderButton,
                className: "column-button" });
            exptoolbar.on("buttonClicked", function (button) {
                var new_row = _this.createRow(button.id);
                if (position === "top") {
                    $(new_row).insertAfter($(toolbar));
                }
                else if (position === "bottom") {
                    $(new_row).insertBefore($(toolbar));
                }
                var widget = _this.getFirstView($(new_row).index());
                if (widget) {
                    var data = _this.getItemLayoutData(widget);
                    $(data).removeAttr("col");
                }
                $(new_row).hide();
                _this.setEditableRow(_this.edit_mode, $(new_row));
                $(new_row).fadeIn("slow", function () {
                    if (_this.getRows().length == 1) {
                        _this.addRowEditToolbar("bottom");
                    }
                });
            });
            if (position === "top") {
                $(toolbar).prependTo($(this.getContainer()));
            }
            else if (position === "bottom")
                $(toolbar).appendTo($(this.getContainer()));
        };
        PageLayout.prototype.removeRowEditToolbar = function (position) {
            $(this.getContainer()).find(".addrow-toolbar-" + position).each(function (idx) {
                $(this).remove();
            });
        };
        PageLayout.prototype.getFirstView = function (row_index) {
            var view = null;
            var rows = this.getRows();
            if (row_index < rows.length) {
                return $(rows[row_index]).find(".view").first().data("widget");
            }
            return undefined;
        };
        PageLayout.prototype.getNextView = function (column) {
            var columns = $(column).parent().children();
            for (var i = $(column).index(); i < columns.length; i++) {
                var views = $(columns[i]).find(".view");
                if (views.length > 0) {
                    return $(views).data("widget");
                }
            }
            var rows = this.getRows();
            for (var i = $(column).parent().index(); i < rows.length; i++) {
                var widget = this.getNextView($(rows[i]));
                if (widget) {
                    return widget;
                }
            }
            return undefined;
        };
        PageLayout.prototype._updateModelChanges = function () {
            var rows = this.getRows();
            var _this = this;
            var prev = null;
            rows.each(function (idx_r) {
                $(this).find(".column").each(function (idx_c) {
                    $(this).find(".view").each(function (idx_v) {
                        var widget = $(this).data("widget");
                        if (prev)
                            $(widget.getModel()).insertAfter($(prev));
                        else
                            $(widget.getModel()).prependTo($(_this.page.getModel()).find("views"));
                        prev = widget.getModel();
                        var data = _this.getItemLayoutData(widget);
                        if (idx_c == 0) {
                            if (idx_v == 0) {
                                $(data).removeAttr("col");
                            }
                            else {
                                $(data).attr("col", 1);
                            }
                        }
                        else {
                            $(data).attr("col", idx_c + 1);
                        }
                    });
                });
            });
            this.page.emit("modified", {});
        };
        PageLayout.prototype.insertView = function (column, type, where) {
            var col_number = $(column).data("col");
            var row_number = $(column).parent().index() - 1;
            var node_name = null;
            var view_name = null;
            if (type === "barChart") {
                node_name = "BarChart";
                view_name = APPMSG.BarChart_label;
            }
            else if (type === "lineChart") {
                node_name = "LineChart";
                view_name = APPMSG.LineChart_label;
            }
            else if (type === "pieChart") {
                node_name = "PieChart";
                view_name = APPMSG.PieChart_label;
            }
            else if (type === "table") {
                node_name = "Table";
                view_name = APPMSG.Table_label;
            }
            else if (type === "text") {
                node_name = "Text";
                view_name = APPMSG.Text_label;
            }
            var idx = this.page.getItems().length;
            var view_def = $.parseXML("<" + node_name + " name=\"" + view_name + "\"/>").documentElement;
            var column_content = $(column).find(".column-content");
            this.insertAfter = undefined;
            this.insertBefore = undefined;
            this.current_dropped_column = undefined;
            var isNewLine = false;
            if (where === "top" && $(column_content).children().length > 0) {
                var widget = $(column_content).children().first().data("widget");
                $(view_def).insertBefore($(widget.view_node));
                this.insertBefore = $(column_content).children().first();
            }
            else if (where === "bottom" && $(column_content).children().length > 0) {
                var widget = $(column_content).children().last().data("widget");
                $(view_def).insertAfter($(widget.view_node));
                this.insertAfter = $(column_content).children().last();
            }
            else {
                var widget_1 = this.getNextView(column);
                if (widget_1) {
                    $(view_def).insertBefore($(widget_1.getModel()));
                }
                else {
                    $(view_def).appendTo($(this.page.getModel()).find("views"));
                }
                this.current_dropped_column = column_content;
            }
            var view_viewer = this.page.createView(view_def);
            if (view_viewer) {
                var data = this.createItemLayoutData(view_viewer);
                if (view_viewer.getRatio())
                    $(data).attr("ratio", view_viewer.getRatio());
                this.page.addItem(view_viewer);
                view_viewer.setSession(this.page.getSession());
                view_viewer.show();
                view_viewer.setEditMode(true);
                this._updateModelChanges();
                this.page.emit("viewAdded", view_viewer);
                $(view_viewer.getContainer()).find(".view-toolbar a[menuitem_id=settings]").focus();
            }
            this.current_dropped_column = null;
            this.insertBefore = null;
            this.insertAfter = null;
            return view_viewer;
        };
        PageLayout.prototype.addColumnEditToolbar = function (column) {
            var _this = this;
            var createToolbar = function (where) {
                var toolbar = $("<div class=\"addview-toolbar\">")[0];
                var exptoolbar = new ExpandToolbar(toolbar, APPMSG.InsertView);
                var renderButton = function (container, button) {
                    $("<span><div class=\"addview-icon " + button.id + "Icon \"></div><div class=\"addview-label\">" +
                        button.label + "</div></span>").appendTo(container);
                };
                var items = _this.view_types;
                for (var i = 0; i < items.length; i++) {
                    exptoolbar.addToolButton({ id: items[i].type,
                        label: items[i].label,
                        render: renderButton,
                        className: "addview-button",
                        view: items[i] });
                }
                exptoolbar.on("buttonClicked", function (button) {
                    _this.insertView(column, button.view.type, where);
                });
                return toolbar;
            };
            var toolbar = createToolbar("top");
            $(toolbar).appendTo($(column).find(".column-header"));
            if ($(column).children().length > 0) {
                toolbar = createToolbar("bottom");
                $(toolbar).appendTo($(column).find(".column-footer"));
            }
            else {
                $(column).find(".column-footer").hide();
            }
        };
        PageLayout.prototype.removeColumnEditToolbar = function (column) {
            $(column).parent().find(".addview-toolbar").each(function (idx) {
                $(this).remove();
            });
        };
        PageLayout.prototype.setEditable = function (in_edition) {
            if (this.edit_mode === in_edition)
                return;
            this.edit_mode = in_edition;
            var _this = this;
            $(this.getRows()).each(function (index) {
                _this.setEditableRow(in_edition, this);
            });
            var items = this.getComposite().getItems();
            for (var i = 0; i < items.length; i++) {
                this.setEditableItem(in_edition, items[i]);
            }
            var rows = this.getRows();
            var nb_row = rows.length;
            if (this.edit_mode) {
                _this.addRowEditToolbar("top");
                if (nb_row > 0)
                    _this.addRowEditToolbar("bottom");
            }
            else {
                _this.removeRowEditToolbar("top");
                _this.removeRowEditToolbar("bottom");
            }
        };
        PageLayout.prototype.isEditable = function () {
            return this.edit_mode;
        };
        PageLayout.prototype.resizeContents = function () {
        };
        PageLayout.MAX_COLUMNS = 3;
        return PageLayout;
    }(Layout));
    return PageLayout;
});
