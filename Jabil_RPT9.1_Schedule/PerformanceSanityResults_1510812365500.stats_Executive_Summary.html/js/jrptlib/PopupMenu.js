define(["require", "exports", "dojo/domReady!"], function (require, exports) {
    "use strict";
    var openedMenu;
    $(document).click(function (e) {
        if (openedMenu && !$.data(e.originalEvent, "popupMenu"))
            openedMenu.closePopupMenu();
    });
    function markEvent(e) {
        $.data(e, "popupMenu", true);
    }
    var PopupMenu = (function () {
        function PopupMenu() {
            this.menuIsVisible = false;
            this.keyupListener();
        }
        PopupMenu.prototype.keyupListener = function () {
            var _this = this;
            window.onkeyup = function (e) {
                if (e.keyCode === 27) {
                    _this.closePopupMenu();
                }
            };
        };
        PopupMenu.prototype.openPopupMenu = function (event) {
            if (event) {
                markEvent(event);
            }
            if (!this.menuIsVisible) {
                this.menuIsVisible = true;
                var menu = $("#context-menu");
                menu.addClass("context-menu--active");
                openedMenu = this;
            }
        };
        PopupMenu.prototype.closePopupMenu = function () {
            if (this.menuIsVisible) {
                this.menuIsVisible = false;
                var menu = $("#context-menu");
                menu.removeClass("context-menu--active");
                openedMenu = undefined;
            }
        };
        PopupMenu.prototype.addAction = function (container, action) {
            var li = $("<li>").appendTo($(container))
                .attr("class", "context-menu__item");
            $("<a>").appendTo(li)
                .attr("class", "context-menu__link")
                .attr("href", "javascript: void(0);")
                .text(action.name)
                .click(function () {
                action.run();
            });
        };
        PopupMenu.prototype.positionMenu = function (mouseX, mouseY) {
            var menu = $("#context-menu");
            menu.css({ "left": mouseX + "px", "top": mouseY + "px" });
        };
        PopupMenu.prototype.setActions = function (actions) {
            this.actions = actions;
            var actionsContainer = $(".context-menu__items").empty();
            for (var i = 0; i < this.actions.length; i++) {
                this.addAction(actionsContainer, this.actions[i]);
            }
        };
        return PopupMenu;
    }());
    return PopupMenu;
});
