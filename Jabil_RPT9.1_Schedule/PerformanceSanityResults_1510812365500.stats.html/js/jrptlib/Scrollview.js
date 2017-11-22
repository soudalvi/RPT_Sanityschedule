var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Viewer"], function (require, exports, Viewer) {
    "use strict";
    var Scrollview = (function (_super) {
        __extends(Scrollview, _super);
        function Scrollview(container) {
            _super.call(this, container);
            var sc = this;
            $(container)
                .addClass("scrollview")
                .addClass("ui-widget-content");
            $(container).on("mousewheel DOMMouseScroll", function (e) {
                e.delta = null;
                if (e.originalEvent) {
                    if (e.originalEvent.detail) {
                        e.delta = e.originalEvent.detail;
                    }
                    if (e.originalEvent.wheelDelta) {
                        e.delta = e.originalEvent.wheelDelta;
                    }
                    if (e.originalEvent.wheelDeltaY) {
                        e.delta = e.originalEvent.wheelDeltaY;
                    }
                }
                sc.wheelHandler(e, e.delta > 0);
                e.preventDefault();
            });
            this.scrollPane = document.createElement("div");
            $(this.scrollPane).addClass("scrollviewPane")
                .css("padding", "0px")
                .appendTo($(this.getContainer()));
            var vscrollbarsContainer = document.createElement("div");
            $(vscrollbarsContainer).css("position", "absolute")
                .css("left", "auto")
                .css("top", 0)
                .css("right", 0)
                .css("bottom", "auto")
                .width(16)
                .height($(this.getContainer()).height())
                .appendTo($(this.getContainer()))
                .mouseenter(function () {
                sc.showVerticalScrollBar();
            })
                .mouseover(function (event) {
                $(sc.verticalScrollBar).stop();
                $(sc.verticalScrollBar).css("opacity", "");
            })
                .mouseleave(function (event) {
                sc.hideVerticalScrollBar();
            });
            this.verticalScrollBar = document.createElement("div");
            $(this.verticalScrollBar)
                .addClass("scrollviewVerticalBar")
                .appendTo($(vscrollbarsContainer)).hide();
            $("<div>").addClass("scrollviewCap")
                .addClass("scrollviewCapTop")
                .appendTo($(this.verticalScrollBar));
            this.vtrack = document.createElement("div");
            $(this.vtrack).addClass("scrollviewTrack")
                .appendTo($(this.verticalScrollBar));
            this.vdragging = false;
            this.vdrag = document.createElement("div");
            $(this.vdrag).addClass("scrollviewDrag")
                .appendTo($(this.vtrack))
                .draggable({
                axis: "y",
                containment: "parent",
                drag: function (event, ui) {
                    var H = $(sc.scrollPane).height();
                    var h = $(sc.vtrack).height();
                    sc.scroll(-((ui.position.top * H) / h), 0);
                },
                start: function (event, ui) {
                    sc.vdragging = true;
                },
                stop: function (event, ui) {
                    sc.vdragging = false;
                }
            });
            $("<div>").addClass("scrollviewDragTop")
                .appendTo($(this.vdrag));
            $("<div>").addClass("scrollviewDragBottom")
                .appendTo($(this.vdrag));
            $("<div>").addClass("scrollviewCap")
                .addClass("scrollviewCapBottom")
                .appendTo($(this.verticalScrollBar));
            var hscrollbarsContainer = document.createElement("div");
            $(hscrollbarsContainer).css("position", "absolute")
                .css("right", "auto")
                .css("top", "auto")
                .css("left", 0)
                .css("bottom", 0)
                .width($(this.getContainer()).width())
                .height(16)
                .appendTo($(this.getContainer()))
                .mouseenter(function () {
                sc.showHorizontalScrollBar();
            })
                .mouseover(function (event) {
                $(sc.horizontalScrollBar).stop();
                $(sc.horizontalScrollBar).css("opacity", "");
            })
                .mouseleave(function (event) {
                sc.hideHorizontalScrollBar();
            });
            this.horizontalScrollBar = document.createElement("div");
            $(this.horizontalScrollBar)
                .addClass("scrollviewHorizontalBar")
                .appendTo($(hscrollbarsContainer)).hide();
            $("<div>").addClass("scrollviewCap")
                .addClass("scrollviewCapTop")
                .appendTo($(this.horizontalScrollBar));
            this.htrack = document.createElement("div");
            $(this.htrack).addClass("scrollviewTrack")
                .appendTo($(this.horizontalScrollBar));
            this.hdragging = false;
            this.hdrag = document.createElement("div");
            $(this.hdrag).addClass("scrollviewDrag")
                .appendTo($(this.htrack))
                .draggable({
                axis: "x",
                containment: "parent",
                drag: function (event, ui) {
                    var W = $(sc.scrollPane).width();
                    var w = $(sc.htrack).width();
                    sc.scroll(0, -((ui.position.left * W) / w));
                },
                start: function (event, ui) {
                    sc.hdragging = true;
                },
                stop: function (event, ui) {
                    sc.hdragging = false;
                }
            });
            $("<div>").addClass("scrollviewDragLeft")
                .appendTo($(this.hdrag));
            $("<div>").addClass("scrollviewDragRight")
                .appendTo($(this.hdrag));
            $("<div>").addClass("scrollviewCap")
                .addClass("scrollviewCapBottom")
                .appendTo($(this.horizontalScrollBar));
            $(this.getContainer()).mouseenter(function () {
                sc.showVerticalScrollBar();
                sc.showHorizontalScrollBar();
            }).mouseleave(function () {
                sc.hideVerticalScrollBar();
                sc.hideHorizontalScrollBar();
            });
        }
        Scrollview.prototype.destroy = function () {
            $(this.getContainer())
                .removeClass("scrollview");
            $(this.getContainer()).children().remove();
            _super.prototype.destroy.call(this);
        };
        Scrollview.prototype.scroll = function (valueV, valueH) {
            var H = $(this.scrollPane).height();
            var h = $(this.vtrack).height();
            if (H > h) {
                if (valueV > 0)
                    valueV = 0;
                else if (valueV < -(H - h))
                    valueV = -(H - h);
                $(this.scrollPane).css("top", valueV);
                this.emit("scrollVertical", valueV);
            }
            var W = $(this.scrollPane).width();
            var w = $(this.vtrack).width();
            if (W > w) {
                if (valueH > 0)
                    valueH = 0;
                else if (valueH < -(W - w))
                    valueH = -(W - w);
                $(this.scrollPane).css("left", valueH);
                this.emit("scrollHorizontal", valueV);
            }
        };
        Scrollview.prototype.getScrollValue = function () {
            return $(this.scrollPane).position().top;
        };
        Scrollview.prototype.update = function () {
            $(this.scrollPane).children().remove();
            if (!this.getContentProvider() || this.getInput() == null)
                return;
            this.updateContents(this.scrollPane);
        };
        Scrollview.prototype.getContents = function () {
            return this.scrollPane;
        };
        Scrollview.prototype.updateVScrollBarDragSize = function () {
            $(this.vdrag).css("left", 0);
            $(this.vtrack).height($(this.getContainer()).height());
            var somein = $(this.scrollPane).height() / $(this.getContainer()).height();
            $(this.vdrag).height(Math.floor($(this.getContainer()).height() / somein));
        };
        Scrollview.prototype.updateHScrollBarDragSize = function () {
            $(this.hdrag).css("left", 0);
            $(this.htrack).width($(this.getContainer()).width());
            var somein = $(this.scrollPane).width() / $(this.getContainer()).width();
            $(this.hdrag).width(Math.floor($(this.getContainer()).width() / somein));
        };
        Scrollview.prototype.updateVScrollBarDragPosition = function () {
            var H = $(this.scrollPane).height();
            var h = $(this.vtrack).height();
            var ptop = this.getScrollValue();
            $(this.vdrag).css("top", Math.floor((h * Math.abs(ptop)) / H));
        };
        Scrollview.prototype.updateHScrollBarDragPosition = function () {
            var W = $(this.scrollPane).width();
            var w = $(this.htrack).width();
            var pleft = this.getScrollValue();
            $(this.hdrag).css("left", Math.floor((w * Math.abs(pleft)) / W));
        };
        Scrollview.prototype.showVerticalScrollBar = function () {
            var sc = this;
            this.updateVScrollBarDragSize();
            this.updateVScrollBarDragPosition();
            var doc_H = $(this.scrollPane).height();
            var doc_y = $(this.scrollPane).position().top;
            var view_h = $(this.getContainer()).height();
            if (doc_H < view_h) {
                this.hideVerticalScrollBar();
                return;
            }
            $(this.verticalScrollBar).show();
            $(this.verticalScrollBar).animate({
                "null": 1
            }, 800, function () {
                sc.hideVerticalScrollBar();
            });
        };
        Scrollview.prototype.showHorizontalScrollBar = function () {
            var sc = this;
            this.updateHScrollBarDragSize();
            this.updateHScrollBarDragPosition();
            var doc_W = $(this.scrollPane).width();
            var doc_x = $(this.scrollPane).position().left;
            var view_w = $(this.getContainer()).width();
            if (doc_W - view_w < 2) {
                this.hideHorizontalScrollBar();
                return;
            }
            $(this.horizontalScrollBar).show();
            $(this.horizontalScrollBar).animate({
                "null": 1
            }, 800, function () {
                sc.hideHorizontalScrollBar();
            });
        };
        Scrollview.prototype.hideVerticalScrollBar = function () {
            if (this.vdragging)
                return;
            $(this.verticalScrollBar).fadeOut(800);
        };
        Scrollview.prototype.hideHorizontalScrollBar = function () {
            if (this.hdragging)
                return;
            $(this.horizontalScrollBar).fadeOut(800);
        };
        Scrollview.prototype.wheelHandler = function (e, down) {
            this.scroll(down ? -30 + this.getScrollValue() : +30 + this.getScrollValue(), 0);
            this.updateVScrollBarDragPosition();
        };
        return Scrollview;
    }(Viewer));
    return Scrollview;
});
