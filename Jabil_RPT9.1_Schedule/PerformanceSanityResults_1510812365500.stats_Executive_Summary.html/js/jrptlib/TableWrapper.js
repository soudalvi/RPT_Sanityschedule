var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Widget"], function (require, exports, Widget) {
    "use strict";
    var TableViewer3 = (function (_super) {
        __extends(TableViewer3, _super);
        function TableViewer3(container) {
            _super.call(this, container);
            this.visibleLines = -1;
            this.fixedNFirstColumns = -1;
            this.showAllLines = true;
            this.setClassName("tableviewer");
        }
        TableViewer3.prototype.setFixedNFirstColumns = function (nbcolumns) {
            this.fixedNFirstColumns = nbcolumns;
        };
        TableViewer3.prototype.setShowAllLines = function (showAll) {
            this.showAllLines = showAll;
        };
        TableViewer3.prototype.isShowAllLines = function () {
            return this.showAllLines;
        };
        TableViewer3.prototype.setVisibleLines = function (nb) {
            this.visibleLines = nb;
            this.showAllLines = false;
        };
        TableViewer3.prototype.setAltClass = function (altClass) {
            this.altClass = altClass;
        };
        TableViewer3.prototype.setTable = function (table) {
            this.renderTable(table);
        };
        TableViewer3.prototype.getWidthColumns = function (table, nbcol) {
            var w = 0;
            $(table).find("thead tr").children().each(function (idx) {
                if (idx < nbcol)
                    w += $(this).outerWidth();
            });
            return w;
        };
        TableViewer3.prototype.renderTable = function (table) {
            var _this = this;
            $(table).appendTo($(this.getContainer()));
            $(this.fixedHeader).remove();
            $(this.fixedBody).remove();
            $(this.fixedFooter).remove();
            $(this.fixedColumn).remove();
            $(this.fixedColHeader).remove();
            $(this.fixedColBody).remove();
            this.fixedHeader = $("<div>").addClass("tableviewer-header").appendTo($(this.getContainer()));
            this.fixedBody = $("<div>").addClass("tableviewer-body").appendTo($(this.getContainer()));
            if ($(table).find("tfoot").length > 0)
                this.fixedFooter = $("<div>").addClass("tableviewer-footer").appendTo($(this.getContainer()));
            $(table).find("thead .tableviewer-cell").remove();
            $(table).find("thead tr th").each(function () {
                $("<div>").addClass("tableviewer-cell").width($(this).width()).appendTo($(this));
            });
            $(table).find("thead tr td").each(function () {
                $("<div>").addClass("tableviewer-cell").width($(this).width()).appendTo($(this));
            });
            var tableH = $("<table>").addClass("tableviewer-table " + $(table).attr("class"))
                .css("margin-left", "0px")
                .appendTo(this.fixedHeader);
            $(table).find("colgroup").clone().appendTo(tableH);
            $(table).find("thead").clone().appendTo(tableH);
            var headerH = $(tableH).outerHeight();
            $(table).addClass("tableviewer-table").appendTo($(this.fixedBody));
            $(table).css("margin-top", "-" + headerH + "px");
            this.fixedBody.scroll(function () {
                _this.scrollFixedHeader(_this.fixedBody.scrollLeft());
            });
            if (this.fixedNFirstColumns > 0) {
                var fb = $("<div>").addClass("tableviewer-fixed-body").prependTo($(this.getContainer()));
                $(this.fixedHeader).appendTo($(fb));
                $(this.fixedBody).appendTo($(fb));
                $(this.fixedFooter).appendTo($(fb));
                var fc = $("<div>").addClass("tableviewer-fixed-column").prependTo($(this.getContainer()));
                $(this.fixedHeader).clone().appendTo(fc);
                $(this.fixedBody).clone().appendTo(fc);
                $(this.fixedFooter).clone().appendTo(fc);
                $(fc).find(".tableviewer-body").css("height", $(fb).find(".tableviewer-body table tbody").height());
                $(fc).find(".tableviewer-body table").css("margin-top", "0px");
                $(fc).outerWidth(this.getWidthColumns(table, this.fixedNFirstColumns) - 1);
                $(fc).find(".tableviewer-header table colgroup").children().slice(1).remove();
                $(fc).find(".tableviewer-header table thead tr").children().slice(1).remove();
                $(fc).find(".tableviewer-body table thead").remove();
                $(fc).find(".tableviewer-body table colgroup").children().slice(1).remove();
                var nbcol = this.fixedNFirstColumns;
                $(fc).find(".tableviewer-header table thead tr").children().each(function (idx) {
                    var cellH = $($(table).find("thead tr").children().get(idx)).height();
                    $(this).height(cellH);
                });
                $(fc).find(".tableviewer-body table tbody tr").each(function (idx) {
                    var hM = 0;
                    var originalLine = $($(table).find("tbody tr")[idx]);
                    originalLine.children().each(function () {
                        hM = Math.max(hM, $(this).outerHeight());
                    });
                    $(this).children().slice(nbcol).remove();
                    $(this).children().each(function (index) {
                        $(this).outerHeight(hM);
                        $(this).width($(originalLine.children().get(index)).width());
                    });
                });
                $(fc).appendTo($(this.getContainer()));
                this.fixedColBody = fb;
                this.fixedColHeader = fc;
            }
        };
        TableViewer3.prototype.scrollFixedColumns = function (value) {
            if (this.fixedNFirstColumns != -1) {
                $(this.getContainer()).find(".columnFixedPane").css("top", value);
            }
        };
        TableViewer3.prototype.scrollFixedHeader = function (value) {
            $(this.fixedHeader).find("table").css("margin-left", "-" + value + "px");
        };
        return TableViewer3;
    }(Widget));
    return TableViewer3;
});
