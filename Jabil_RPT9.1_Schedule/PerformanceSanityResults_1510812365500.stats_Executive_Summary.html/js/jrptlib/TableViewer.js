var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Viewer"], function (require, exports, Viewer) {
    "use strict";
    var TableViewer = (function (_super) {
        __extends(TableViewer, _super);
        function TableViewer(container) {
            _super.call(this, container);
            $(container).addClass("table-view");
            this.visibleLines = 5;
            this.colNumber = $(container).find("th").length;
            this.checkedElements = [];
        }
        TableViewer.prototype.setCheckStateProvider = function (checkStateProvider) {
            this.checkStateProvider = checkStateProvider;
        };
        TableViewer.prototype.getCheckStateProvider = function () {
            return this.checkStateProvider;
        };
        TableViewer.prototype.getCheckedElements = function () {
            return this.checkedElements;
        };
        TableViewer.prototype.setVisibleLines = function (nb) {
            this.visibleLines = nb;
        };
        TableViewer.prototype.setInput = function (data) {
            _super.prototype.setInput.call(this, data);
            this.clear();
            this.update();
        };
        TableViewer.prototype.clear = function () {
            $(this.getContainer()).find("tr.table-item").remove();
        };
        TableViewer.prototype.update = function () {
            if (!this.getContentProvider())
                return;
            var elements = null;
            this.getContentProvider().getElements(this.getInput(), function (data) {
                elements = data;
            });
            var _this = this;
            var emptyLines = _this.visibleLines;
            $(elements).each(function (index) {
                if (_this.getLabelProvider()) {
                    var tr = document.createElement("tr");
                    $(tr).addClass("table-item");
                    if (_this.getCheckStateProvider() && _this.getCheckStateProvider().isCheckable(this)) {
                        var td = document.createElement("td");
                        var _elem = this;
                        $("<input>").attr("type", "checkbox")
                            .change(function (e) {
                            if ($(this).prop("checked")) {
                                _this.checkedElements.push(_elem);
                            }
                            else {
                                _this.checkedElements.splice(_this.checkedElements.indexOf(_elem), 1);
                            }
                            _this.emit("checked", { selection: $(this).prop("checked"), element: _elem });
                        })
                            .appendTo($(td));
                        $(td).appendTo($(tr));
                    }
                    else {
                        var td = document.createElement("td");
                        $(td).append("&nbsp;");
                        $(td).appendTo($(tr));
                    }
                    for (var c = 0; c < _this.colNumber - 1; c++) {
                        var text = _this.getLabelProvider().getText(this, c);
                        var td = document.createElement("td");
                        $(td).text(text);
                        $(td).appendTo($(tr));
                    }
                    $(tr).appendTo($(_this.getContainer()));
                    emptyLines--;
                }
            });
            for (var i = 0; i < emptyLines; i++) {
                var tr = document.createElement("tr");
                $(tr).addClass("table-item");
                for (var c = 0; c < _this.colNumber; c++) {
                    var td = document.createElement("td");
                    $(td).append("&nbsp;");
                    $(td).appendTo($(tr));
                }
                $(tr).appendTo($(_this.getContainer()));
            }
        };
        return TableViewer;
    }(Viewer));
    return TableViewer;
});
