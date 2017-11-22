var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Scrollview"], function (require, exports, Scrollview) {
    "use strict";
    var TableViewer2 = (function (_super) {
        __extends(TableViewer2, _super);
        function TableViewer2(container) {
            var _this = this;
            _super.call(this, container);
            this.columns = [];
            this.columnGroups = [];
            this.visibleLines = -1;
            this.fixedNFirstColumns = -1;
            this.showAllLines = true;
            $(container)
                .addClass("tableviewer");
            this.on("scrollVertical", function (value) {
                _this.scrollFixedColumns(value);
            });
        }
        TableViewer2.prototype.addColumnGroup = function (nbcol, cssClass) {
            this.columnGroups[this.columnGroups.length] = { span: nbcol, cssClass: cssClass };
            return this.columnGroups.length - 1;
        };
        TableViewer2.prototype.addColumn = function (label) {
            this.columns[this.columns.length] = label;
            return this.columns.length - 1;
        };
        TableViewer2.prototype.setFixedNFirstColumns = function (nbcolumns) {
            this.fixedNFirstColumns = nbcolumns;
            this.update();
        };
        TableViewer2.prototype.setShowAllLines = function (showAll) {
            this.showAllLines = showAll;
            this.update();
        };
        TableViewer2.prototype.isShowAllLines = function () {
            return this.showAllLines;
        };
        TableViewer2.prototype.setVisibleLines = function (nb) {
            this.visibleLines = nb;
            this.showAllLines = false;
            this.update();
        };
        TableViewer2.prototype.setRowDecorator = function (decorator) {
            this.rowDecorator = decorator;
            this.update();
        };
        TableViewer2.prototype.writeCell = function (item, columnIndex, tr) {
            var text = this.getLabelProvider().getText(item, columnIndex);
            var clazz = "";
            if (this.getLabelProvider().getCssClass) {
                clazz = this.getLabelProvider().getCssClass(item, columnIndex);
            }
            $("<td>").text(text).addClass(clazz).appendTo($(tr));
        };
        TableViewer2.prototype.updateContents = function (content) {
            var _this = this;
            var table = $("<table>").addClass("tableviewer-data").appendTo($(content));
            if (this.columnGroups.length > 0) {
                var colgroup = $("<colgroup>").appendTo(table);
                for (var i = 0; i < this.columnGroups.length; i++) {
                    var col = $("<col>").addClass(this.columnGroups[i].cssClass)
                        .text(this.columns[i])
                        .appendTo(colgroup);
                    if (this.columnGroups[i].span > 1) {
                        col.attr("span", this.columnGroups[i].span);
                    }
                }
            }
            var theader = $("<thead>").appendTo(table);
            var header = $("<tr>").appendTo(theader);
            for (var i = 0; i < this.columns.length; i++) {
                $("<th>").addClass("tableviewer-column").text(this.columns[i]).appendTo(header);
            }
            var emptyLines = this.visibleLines;
            var heightLines = 0;
            this.getContentProvider().getElements(this.getInput(), function (data) {
                var items = data;
                $(items).each(function (index) {
                    var tr = document.createElement("tr");
                    $(tr).addClass("tableviewer-item");
                    for (var c = 0; c < _this.columns.length; c++) {
                        _this.writeCell(items[index], c, $(tr));
                    }
                    $(tr).appendTo($(table));
                    if (_this.rowDecorator)
                        _this.rowDecorator($(tr), index);
                    emptyLines--;
                    if (emptyLines >= 0)
                        heightLines += $(tr).outerHeight();
                });
                for (var i = 0; i < emptyLines; i++) {
                    var tr = $("<tr>").addClass("tableviewer-item");
                    for (var c = 0; c < _this.columns.length; c++) {
                        $("<td>").append("&nbsp;").appendTo($(tr));
                    }
                    $(tr).appendTo($(table));
                    if (_this.rowDecorator)
                        _this.rowDecorator($(tr), (_this.visibleLines - emptyLines) + i);
                    heightLines += $(tr).outerHeight();
                }
                if (_this.showAllLines)
                    $(_this.getContainer()).height($(_this.getContents()).height() + 1);
                else if (_this.visibleLines != -1) {
                    if (emptyLines < 0) {
                        $(_this.getContainer()).height(heightLines + theader.height());
                    }
                    else {
                        $(_this.getContainer()).height($(_this.getContents()).height() + 1);
                    }
                }
            });
            if (this.fixedNFirstColumns != -1) {
                var emptyLines = this.visibleLines;
                var columnfixedPane = $("<div>").addClass("columnFixedPane").css("position", "absolute");
                $(columnfixedPane).insertAfter($(this.getContents()));
                $(columnfixedPane).height($(this.getContents()).height());
                var wfixed = 0;
                for (var i = 0; i < this.fixedNFirstColumns; i++) {
                    var col1 = $(this.getContents()).find("th")[i];
                    wfixed += $(col1).outerWidth();
                }
                $(columnfixedPane).width(wfixed);
                var table = $("<table>").addClass("tableviewer-data").appendTo($(columnfixedPane));
                if (this.columnGroups.length > 0) {
                    var colgroup = $("<colgroup>").appendTo(table);
                    for (var i = 0; i < this.columnGroups.length; i++) {
                        var col = $("<col>").addClass(this.columnGroups[i].cssClass)
                            .text(this.columns[i])
                            .appendTo(colgroup);
                        if (this.columnGroups[i].span > 1) {
                            col.attr("span", this.columnGroups[i].span);
                        }
                    }
                }
                emptyLines = this.visibleLines;
                var theader = $("<thead>").appendTo(table);
                var header = $("<tr>").appendTo(theader);
                for (var i = 0; i < this.fixedNFirstColumns; i++) {
                    $("<th>").addClass("tableviewer-column").text(this.columns[i]).appendTo(header);
                }
                this.getContentProvider().getElements(this.getInput(), function (data) {
                    var items = data;
                    $(items).each(function (index) {
                        var tr = $("<tr>").addClass("tableviewer-item");
                        for (var i = 0; i < _this.fixedNFirstColumns; i++) {
                            _this.writeCell(items[index], i, tr);
                        }
                        $(tr).appendTo($(table));
                        if (_this.rowDecorator)
                            _this.rowDecorator($(tr), index);
                        emptyLines--;
                    });
                });
                for (var i = 0; i < emptyLines; i++) {
                    var tr = $("<tr>").addClass("tableviewer-item");
                    for (var c = 0; c < this.fixedNFirstColumns; c++) {
                        $("<td>").append("&nbsp;").appendTo($(tr));
                    }
                    $(tr).appendTo($(table));
                    if (this.rowDecorator)
                        this.rowDecorator($(tr), (this.visibleLines - emptyLines) + i);
                }
            }
        };
        TableViewer2.prototype.scrollFixedColumns = function (value) {
            if (this.fixedNFirstColumns != -1) {
                $(this.getContainer()).find(".columnFixedPane").css("top", value);
            }
        };
        return TableViewer2;
    }(Scrollview));
    return TableViewer2;
});
