var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Scrollview", "jrptlib/Menu"], function (require, exports, Scrollview, Menu) {
    "use strict";
    var Listview = (function (_super) {
        __extends(Listview, _super);
        function Listview(container) {
            _super.call(this, container);
            $(container)
                .addClass("listview");
            this.modelModifierProvider = null;
            this.editMode = false;
            $(this.getContents()).width("100%");
        }
        Listview.prototype.setModelModifierProvider = function (provider) {
            this.modelModifierProvider = provider;
        };
        Listview.prototype.getModelModifierProvider = function () {
            return this.modelModifierProvider;
        };
        Listview.prototype.getSelection = function () {
            return $(this.selected_item).data("item");
        };
        Listview.prototype.setSelection = function (selection) {
            var old_selection = this.getSelection();
            if (!selection)
                return;
            if (this.selected_item != null)
                $(this.selected_item).removeClass("ui-selected");
            var sc = this;
            $(this.getContents()).find("a").each(function (idx) {
                var item = $(this).data("item");
                if (item === selection) {
                    $(this).addClass("ui-selected");
                    sc.selected_item = this;
                }
            });
            if (old_selection) {
                var vitem_1 = this.findViewItem(old_selection);
                if (vitem_1) {
                    this.hideEditToolbar(vitem_1, old_selection);
                }
            }
            var vitem = this.findViewItem(selection);
            if (vitem) {
                this.showEditToolbar(vitem, selection);
            }
            if (this.getSelection() != old_selection) {
                this.emit("selectionChanged", this.getSelection());
            }
        };
        Listview.prototype.setEditMode = function (edit) {
            var _this = this;
            this.editMode = edit;
            if (edit) {
                this.getViewItems().each(function (idx) {
                    _this.addEditToolbar(this, $(this).data("item"));
                });
                var selection = this.getSelection();
                this.showEditToolbar(this.findViewItem(selection), selection);
            }
            else {
                this.getViewItems().each(function (idx) {
                    _this.removeEditToolbar($(this), $(this).data("item"));
                });
            }
        };
        Listview.prototype.addEditToolbar = function (listitem, data) {
            if (!this.editMode)
                return;
            var _this = this;
            var el_menu = document.createElement("ul");
            $(el_menu).addClass("toolbar listitem-toolbar clearfix");
            var menu = new Menu(el_menu);
            menu.on("clicked", function (id) {
                if (!_this.modelModifierProvider)
                    return;
                var selection = _this.getSelection();
                if (id == "remove_listitem") {
                    _this.modelModifierProvider.remove(data, function (selection) {
                        _this.update();
                        _this.setSelection(selection);
                        _this.scrollToItem(selection);
                    });
                }
                else if (id == "add_listitem") {
                    _this.modelModifierProvider.insertAfter(data, function (selection) {
                        _this.update();
                        _this.setSelection(selection);
                        _this.scrollToItem(selection);
                    });
                }
                else if (id == "moveup_listitem") {
                    _this.modelModifierProvider.moveUp(data, function (selection) {
                        _this.update();
                        _this.setSelection(selection);
                        _this.scrollToItem(selection);
                    });
                }
                else if (id == "movedown_listitem") {
                    _this.modelModifierProvider.moveDown(data, function (selection) {
                        _this.update();
                        _this.setSelection(selection);
                        _this.scrollToItem(selection);
                    });
                }
            });
            menu.appendItem("add_listitem", "ui-button ui-icon ui-icon-plus", this.modelModifierProvider.getLabel ? this.modelModifierProvider.getLabel(_this.modelModifierProvider.insertAfter) : undefined);
            menu.appendItem("remove_listitem", "ui-button ui-icon ui-icon-close", this.modelModifierProvider.getLabel ? this.modelModifierProvider.getLabel(_this.modelModifierProvider.remove) : undefined);
            menu.appendItem("moveup_listitem", "ui-button ui-icon ui-icon-triangle-1-n", this.modelModifierProvider.getLabel ? this.modelModifierProvider.getLabel(_this.modelModifierProvider.moveUp) : undefined);
            menu.appendItem("movedown_listitem", "ui-button ui-icon ui-icon-triangle-1-s", this.modelModifierProvider.getLabel ? this.modelModifierProvider.getLabel(_this.modelModifierProvider.moveDown) : undefined);
            $(el_menu).prependTo($(listitem));
            this.hideEditToolbar(listitem, data);
        };
        Listview.prototype.removeEditToolbar = function (listitem, data) {
            $(listitem).find(".listitem-toolbar").remove();
        };
        Listview.prototype.fillItem = function (listitem, data, index) {
            var _this = this;
            $(listitem).hover(function () {
                _this.showEditToolbar(listitem, data);
            }, function () {
                _this.hideEditToolbar(listitem, data);
            });
            if (this.editMode)
                this.addEditToolbar(listitem, data);
            this.fillItemContents(listitem, data, index);
        };
        Listview.prototype.showEditToolbar = function (listitem, data) {
            $(listitem).find(".listitem-toolbar").css("visibility", "visible");
        };
        Listview.prototype.hideEditToolbar = function (listitem, data) {
            if (data != this.getSelection())
                $(listitem).find(".listitem-toolbar").css("visibility", "hidden");
        };
        Listview.prototype.fillItemContents = function (listitem, data, index) {
            if (!this.getLabelProvider())
                return;
            var icon = this.getLabelProvider().getIcon ? this.getLabelProvider().getIcon(data) : undefined;
            if (icon) {
                var img = document.createElement("img");
                $(img).attr("href", icon)
                    .appendTo($(listitem));
            }
            var title = this.getLabelProvider().getText ? this.getLabelProvider().getText(data) : undefined;
            if (title) {
                $("<div>").addClass("label").appendTo($(listitem)).text(title);
            }
        };
        Listview.prototype.updateContents = function (content) {
            var oldSelection = this.getSelection();
            this.selected_item = null;
            var scrollview = this;
            this.getContentProvider().getElements(this.getInput(), function (data) {
                var items = data;
                $(items).each(function (index) {
                    var list_item = document.createElement("a");
                    $(list_item).attr("href", "javascript: void(0);")
                        .data("item", this)
                        .addClass("listview-item")
                        .addClass("btn")
                        .click(function (e) {
                        e.preventDefault();
                        scrollview.setSelection($(list_item).data("item"));
                    })
                        .on("dragstart", function (e) {
                        e.preventDefault();
                    });
                    $(list_item).appendTo($(content));
                    if (scrollview.getLabelProvider())
                        scrollview.fillItem(list_item, this, index);
                    if (oldSelection == this) {
                        scrollview.selected_item = list_item;
                        $(list_item).addClass("ui-selected");
                    }
                });
                var doc_H = $(content).height();
                if (doc_H == 0)
                    return;
                var doc_y = $(content).position().top;
                var view_h = $(scrollview.getContainer()).height();
                if (doc_H + doc_y < view_h) {
                    $(content).css("top", 0);
                }
            });
        };
        Listview.prototype.getViewItems = function () {
            return $(this.getContents()).find("a.listview-item");
        };
        Listview.prototype.findViewItem = function (item) {
            if (!item)
                return null;
            var viewitem = null;
            $(this.getContents()).children("a").each(function (idx) {
                var data = $(this).data("item");
                if (data === item) {
                    viewitem = this;
                    return;
                }
            });
            return viewitem;
        };
        Listview.prototype.findViewItemIndex = function (item) {
            var ret = null;
            $(this.getContents()).children("a").each(function (idx) {
                var data = $(this).data("item");
                if (data === item) {
                    ret = { item: this, index: idx };
                    return;
                }
            });
            return ret;
        };
        Listview.prototype.updateItem = function (item) {
            var viewitem = this.findViewItemIndex(item);
            if (viewitem) {
                $(viewitem.item).children().remove();
                this.fillItem(viewitem.item, item, viewitem.index);
            }
        };
        Listview.prototype.scrollToItem = function (item) {
            var sc = this;
            $(this.getContents()).find("a").each(function (idx) {
                var data = $(this).data("item");
                if (data === item) {
                    var item_top = $(this).position().top;
                    var h_item = $(this).outerHeight();
                    var view_top = $(sc.getContents()).position().top;
                    var view_h = $(sc.getContainer()).height();
                    var diff = Math.abs(view_top) - item_top;
                    var offsetH = 0;
                    if (diff > 0) {
                        offsetH = diff;
                    }
                    else if (Math.abs(diff) + h_item > view_h) {
                        offsetH = -(Math.abs(diff) + h_item - view_h);
                    }
                    $(sc.getContents()).css("top", view_top + offsetH);
                    sc.updateVScrollBarDragPosition();
                }
            });
        };
        return Listview;
    }(Scrollview));
    return Listview;
});
