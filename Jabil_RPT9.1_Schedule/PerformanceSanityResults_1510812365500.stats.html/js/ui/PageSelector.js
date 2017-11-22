var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Widget", "jrptlib/Listview", "ui/ReportContentProvider", "ui/ReportFilteredContentProvider", "ui/ReportLabelProvider"], function (require, exports, Widget, Listview, ReportContentProvider, ReportFilteredContentProvider, ReportLabelProvider) {
    "use strict";
    var PageSelector = (function (_super) {
        __extends(PageSelector, _super);
        function PageSelector(widget) {
            _super.call(this, widget);
            var _this = this;
            this.list = $(widget).find(".page_selector_scrollview");
            this.scrollview = new Listview(this.list[0]);
            this.scrollview.setContentProvider(new ReportFilteredContentProvider());
            this.scrollview.setLabelProvider(new ReportLabelProvider());
            this.scrollview.on("selectionChanged", function (page) {
                var v_item = _this.scrollview.findViewItem(page);
                var help = $(v_item).find(".help-context");
                if (help.length > 0)
                    return;
                if (_app.isOffline())
                    return;
                if ($(page.getModel()).attr("helpId")) {
                    var h3 = $(v_item).find(".label");
                    _app.getHelpSystem().setHelp($(h3), $(page.getReport().getModel()).attr("helpProvider") + "." + $(page.getModel()).attr("helpId"), {
                        of: $("#page_selector"),
                        my: "left+20px top+15", at: "right top", collision: "none"
                    });
                }
            });
            $(widget).find(".reduce-control").click(function () {
                $(widget).toggleClass("reduced");
                _this.emit("toogleSize", {});
                if (!$(this).hasClass("reduced")) {
                    $(widget).find(".page_selector_size_button").focus();
                }
            });
            $(widget).find("#page_selector_reduced_panel").hover(function () { $(this).toggleClass("hover"); }, function () { $(this).toggleClass("hover"); }).focusin(function () { $(this).toggleClass("focused"); })
                .focusout(function () { $(this).toggleClass("focused"); });
            this.setEditMode(false);
            var checkVisible = setInterval(function () {
                if (!$(_this.list).is(':visible'))
                    return;
                clearInterval(checkVisible);
                _this.resize();
            }, 1000);
        }
        PageSelector.prototype.getListview = function () {
            return this.scrollview;
        };
        PageSelector.prototype.resize = function () {
            var h = window.innerHeight;
            var w = window.innerWidth;
            var apph = $("#app_header").outerHeight(true);
            var mh = 0;
            var hh = $(this.container).find("header").outerHeight(true);
            var offt = apph + mh + hh;
            h = h - offt;
            var footer = $(this.container).find("footer");
            if (footer.length && $(footer).is(':visible'))
                h = h - $(footer).outerHeight();
            $(this.list).css("height", h);
            $(this.container).find("#page_selector_reduced_panel").css("top", (h / 2)
                - $(this.container).find("#page_selector_reduced_panel").height());
        };
        PageSelector.prototype.setInput = function (input) {
            this.scrollview.setModelModifierProvider(input);
            this.scrollview.setInput(input);
        };
        PageSelector.prototype.getSelection = function () {
            return this.scrollview.getSelection();
        };
        PageSelector.prototype.setSelection = function (page) {
            if (!page)
                return;
            this.scrollview.setSelection(page);
        };
        PageSelector.prototype.scrollToItem = function (page) {
            this.scrollview.scrollToItem(page);
        };
        PageSelector.prototype.renamePage = function (page, text) {
            var item = this.scrollview.updateItem(page);
        };
        PageSelector.prototype.open = function () {
            $(this.container).show();
        };
        PageSelector.prototype.close = function () {
            $(this.container).hide();
        };
        PageSelector.prototype.isOpen = function () {
            return $(this.container).is(':visible');
        };
        PageSelector.prototype.setEditMode = function (val) {
            var sel = this.scrollview.getSelection();
            if (val) {
                this.scrollview.setContentProvider(new ReportContentProvider());
            }
            else {
                this.scrollview.setContentProvider(new ReportFilteredContentProvider());
            }
            this.scrollview.setEditMode(val);
            this.scrollview.setSelection(sel);
        };
        return PageSelector;
    }(Widget));
    return PageSelector;
});
