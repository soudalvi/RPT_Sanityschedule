var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Widget"], function (require, exports, Widget) {
    "use strict";
    var Menu = (function (_super) {
        __extends(Menu, _super);
        function Menu(container) {
            _super.call(this, container);
            this.enabled = true;
            if (Menu._closeHandler == null) {
                Menu._closeHandler = $(document).on("click", function (e) {
                    if (Menu._openedDropDown != null && $(Menu._openedDropDown.container).has(e.target).length == 0) {
                        Menu._openedDropDown.closeComboList();
                    }
                });
            }
            var menu = this;
            $(container).addClass("menu");
            $(container).find("a").each(function () {
                $(this).attr("href", "javascript:void(0)");
                $(this).attr("role", "button");
                $(this).addClass("btn");
                menu.setEnabledItem(this, true);
            });
            $(container).find("li").each(function () {
                var link = $(this).children("a");
                $(this).find("ul").each(function () {
                    $(this).addClass("submenu").hide();
                    menu.setMenuItem(link, this);
                });
            });
        }
        Menu.prototype.setEnabledItem = function (item, value) {
            var menu = this;
            $(item).attr("menuitem_id", $(item).attr("id"));
            if (!value) {
                $(item).addClass("ui-state-disabled");
                $(item).unbind();
            }
            else {
                $(item).removeClass("ui-state-disabled");
                $(item).unbind();
                $(item).click(function (e) {
                    e.preventDefault();
                    var toggable = $(item).attr("toggable");
                    if (toggable) {
                        var toggled = $(item).data("toggled");
                        if (toggled == null) {
                            toggled = false;
                        }
                        menu.setToggleItem(item, !toggled);
                        menu.emit("clicked", $(this).attr("menuitem_id"));
                    }
                    else {
                        var submenu = $(item).data("menu");
                        if (submenu) {
                            if ($(submenu).is(":visible")) {
                                menu.hideSubMenu(submenu, item);
                            }
                            else {
                                menu.showSubMenu(submenu, item);
                            }
                        }
                        menu.emit("clicked", $(this).attr("menuitem_id"));
                    }
                });
            }
            this.enabled = value;
        };
        Menu.prototype.setToggable = function (item, value) {
            $(item).attr("toggable", value ? "true" : "false");
        };
        Menu.prototype.setToggleItem = function (item, value) {
            var toggled = value;
            var submenu = $(item).data("menu");
            if (value) {
                $(item).addClass("toggled");
                if (submenu)
                    this.showSubMenu(submenu, item);
            }
            else {
                $(item).removeClass("toggled");
                if (submenu)
                    this.hideSubMenu(submenu, item);
            }
            $(item).data("toggled", toggled);
        };
        Menu.prototype.isToggledItem = function (menuitem_id) {
            var item = $(this.getContainer()).find("#" + menuitem_id);
            return $(item).data("toggled");
        };
        Menu.prototype.appendItem = function (id, icon, text, css_class) {
            var sitem = "<li><a menuitem_id=\"" + id + "\" href=\"javascript:void(0)\"></a></li>";
            if (css_class)
                $(sitem).addClass(css_class);
            $(this.getContainer()).append(sitem);
            var item = $(this.getContainer()).find("li a[menuitem_id=\"" + id + "\"]");
            $(item).addClass("ui-button");
            if (icon) {
                $("<span>").addClass("ui-icon").addClass(icon)
                    .appendTo($(item));
            }
            if (text) {
                $("<div>").addClass("label").text(text).appendTo($(item));
                $(item).attr("title", text);
            }
            this.setEnabledItem(item, true);
            return item;
        };
        Menu.prototype.appendItemIcon = function (id, icon_name) {
            var sitem = "<li menuitem_id=\"" + id + "\"><a href=\"javascript:void(0)\"></a></li>";
            $(this.getContainer()).append(sitem);
            var item = $(this.getContainer()).find("#" + id);
            $(item).find("a").prepend("<span class=\"ui-button ui-icon " + icon_name + "\"></span>");
            this.setEnabledItem(item, true);
            return item;
        };
        Menu.prototype.setMenuItemById = function (id, menu) {
            var item = $(this.getContainer()).find("li a[menuitem_id=\"" + id + "\"]");
            if (!item)
                return;
            this.setMenuItem(item, menu);
        };
        Menu.prototype.showSubMenu = function (submenu, item) {
            this.emit("beforeToShow", submenu);
            $(submenu).insertAfter($(item));
            $(submenu).show();
        };
        Menu.prototype.hideSubMenu = function (submenu, item) {
            $(submenu).hide();
            $(submenu).appendTo($(item));
            this.emit("hidden", submenu);
        };
        Menu.prototype.setMenuItem = function (item, submenu) {
            if (!item)
                return;
            $(item).data("menu", submenu);
            $(submenu).hide();
        };
        Menu.prototype.getMenuItem = function (item_id) {
            return $(this.getContainer()).find("li a[menuitem_id=\"" + item_id + "\"]").data("menu");
        };
        Menu._closeHandler = null;
        Menu.openedSubMenu = null;
        Menu._openedDropDown = null;
        return Menu;
    }(Widget));
    return Menu;
});
