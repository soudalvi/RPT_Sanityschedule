var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Viewer"], function (require, exports, Viewer) {
    "use strict";
    var TreeBrowser = (function (_super) {
        __extends(TreeBrowser, _super);
        function TreeBrowser(container) {
            _super.call(this, container);
            this.selection = null;
            this.items = [];
            this.dblclick = false;
            $(this.container).addClass("tree-browser");
        }
        TreeBrowser.prototype.setDoubleClick = function (activated) {
            this.dblclick = activated;
        };
        TreeBrowser.prototype.displayContent = function (parent, current, children) {
            this.current = current;
            this.children = children;
            var tree = this;
            if (current != null) {
                var label = this.getLabelProvider().getText(current);
                $(this.container).find("h1").text(label);
            }
            else
                $(this.container).find("h1").text("");
            $(this.container).find("ul").remove();
            var ul = document.createElement('ul');
            $(ul).addClass("ui-selectable");
            var browser = this;
            if (parent != null) {
                var cl_i = this.getLabelProvider().getCssClass(parent);
                var li = document.createElement('li');
                $(li).append("<a href=\"#\"><div class=\"icon\"></div><div class=\"label\">" + this.getLabelProvider().getText(parent) + "</div></a>")
                    .attr("idx", -1)
                    .addClass("parent_item")
                    .addClass(cl_i)
                    .addClass("selectee")
                    .appendTo($(ul));
                if (browser.dblclick)
                    $(li).dblclick(function () {
                        browser.changeSelection(this);
                        browser.openParent(this);
                    });
                else
                    $(li).click(function () {
                        browser.changeSelection(this);
                        browser.openParent(this);
                    });
            }
            if (children != null) {
                for (var i = 0; i < children.length; i++) {
                    var cl_i = this.getLabelProvider().getCssClass(children[i]);
                    var li = document.createElement('li');
                    $(li).append("<a href=\"javascript: void(0)\"><div class=\"icon\"></div><div class=\"label\">" + this.getLabelProvider().getText(children[i]) + "</div></a>")
                        .attr("idx", i)
                        .addClass("item_a")
                        .addClass(cl_i)
                        .addClass("selectee")
                        .appendTo($(ul));
                    this.getContentProvider().hasChildren(children[i], function (haschild) {
                        if (haschild) {
                            if (browser.dblclick)
                                $(li).dblclick(function () {
                                    browser.changeSelection(this);
                                    browser.openElement(this);
                                });
                            else
                                $(li).click(function () {
                                    browser.changeSelection(this);
                                    browser.openElement(this);
                                });
                        }
                        else {
                            $(li).dblclick(function () {
                                browser.emit("dblclick", browser.getSelection());
                            }).click(function () { browser.changeSelection(this); });
                        }
                    });
                }
            }
            $(ul).appendTo($(this.container));
        };
        TreeBrowser.prototype.setInput = function (item) {
            this.items = new Array();
            this.items.push(item);
            var browser = this;
            if (this.getContentProvider()) {
                this.getContentProvider().getElements(item, function (data) {
                    browser.displayContent(null, item, data);
                });
            }
        };
        TreeBrowser.prototype.openElement = function (item_a) {
            var element = this.children[parseInt($(item_a).attr("idx"))];
            var parent = this.items[this.items.length - 1];
            this.items.push(element);
            var browser = this;
            this.getContentProvider().getChildren(element, function (data) {
                browser.displayContent(parent, element, data);
                browser.setFocusOnFirstItem();
            });
        };
        TreeBrowser.prototype.setFocusOnFirstItem = function () {
            $(this.container).find("ul.ui-selectable item_a a:first-child").focus();
        };
        TreeBrowser.prototype.openParent = function (item_a) {
            this.items.pop();
            var parent = this.items[this.items.length - 1];
            var browser = this;
            if (this.items.length > 1) {
                var current = parent;
                parent = this.items[this.items.length - 2];
                this.getContentProvider().getChildren(current, function (data) {
                    browser.displayContent(parent, current, data);
                    browser.setFocusOnFirstItem();
                });
            }
            else {
                var parent = this.items[0];
                this.getContentProvider().getElements(this.items[0], function (data) {
                    browser.displayContent(null, parent, data);
                    browser.setFocusOnFirstItem();
                });
            }
        };
        TreeBrowser.prototype.changeSelection = function (item_a) {
            $(this.container).find("ul").find("li").removeClass("ui-selected");
            $(item_a).addClass("ui-selected");
            var element = this.children[parseInt($(item_a).attr("idx"))];
            if (!element)
                this.selection = null;
            else
                this.selection = element;
            this.emit("selectionChanged", this.selection);
        };
        TreeBrowser.prototype.getSelection = function () {
            return this.selection;
        };
        return TreeBrowser;
    }(Viewer));
    return TreeBrowser;
});
