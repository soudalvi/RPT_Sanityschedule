var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Viewer"], function (require, exports, Viewer) {
    "use strict";
    var openedDropDown;
    $(document).on("click", function (e) {
        if (openedDropDown && $(openedDropDown.getContainer()).has(e.target).length == 0) {
            openedDropDown.closeComboList();
        }
    });
    var DropDownList = (function (_super) {
        __extends(DropDownList, _super);
        function DropDownList(container, desc_container) {
            _super.call(this, container);
            this.dcontainer = desc_container;
            this.div_list = null;
            this.selection = null;
            this.isSelectLineChanged = true;
            this.originalText = $(this.getContainer()).text();
            $(this.getContainer()).addClass("dropdown-list");
            this.setEnabled(true);
        }
        DropDownList.prototype.setTextForEmptyList = function (text) {
            this.textForEmptyList = text;
        };
        DropDownList.prototype.setIsSelectLineChanged = function (changed) {
            this.isSelectLineChanged = changed;
        };
        DropDownList.prototype.closeComboList = function () {
            this.list = null;
            $(this.div_list).remove();
            this.div_list = null;
            this.openRequested = false;
            this.opened = false;
            $(this.getContainer()).removeClass("opened");
            this.emit("closed", {});
        };
        DropDownList.prototype.getListViewItem = function (item) {
            var ul_list = this.div_list;
            if (ul_list) {
                return $(ul_list).find("li[idx=\"" + this.list.indexOf(item) + "\"]");
            }
            return null;
        };
        DropDownList.prototype.drawListItem = function (contents, item, idx) {
            var label = this.getLabelProvider().getText(item);
            $("<span>").text(label).addClass("label").appendTo($(contents));
        };
        DropDownList.prototype.drawHeaderList = function (parent) {
        };
        DropDownList.prototype.drawFooterList = function (parent) {
        };
        DropDownList.prototype.openComboList = function () {
            if (this.opened || this.openRequested)
                return;
            if (openedDropDown) {
                openedDropDown.closeComboList();
                openedDropDown = undefined;
            }
            var _this = this;
            if (this.getContentProvider() == null)
                return;
            this.openRequested = true;
            this.getContentProvider().getElements(this.getInput(), function (data) {
                _this.list = data;
                _this.div_list = $("<div>")
                    .addClass("dropdown-listview")
                    .addClass("ui-widget-content")
                    .addClass("ui-front").appendTo($(_this.getContainer()));
                $(_this.getContainer()).addClass("opened");
                openedDropDown = _this;
                $(_this.div_list).position({ my: "left top", at: "left bottom", of: $(_this.getContainer()),
                    collision: "fit" });
                $(_this.div_list).show();
                var header = $("<div>").addClass("header").appendTo(_this.div_list);
                _this.drawHeaderList(header);
                var ul_list = $("<ul>").css("display", "block").appendTo(_this.div_list);
                _this.fillList(ul_list, data);
                var footer = $("<div>").addClass("footer").appendTo(_this.div_list);
                _this.drawFooterList(footer);
                var browserHeight = $(window).height();
                var topOffset = $(ul_list).position().top + $(_this.getContainer()).parent().height();
                var heights = $(footer).height() + $(header).height();
                $(ul_list).css("max-height", (browserHeight - topOffset - heights) + "px");
                _this.opened = true;
                _this.emit("opened", _this.div_list);
                _this.openRequested = false;
            });
        };
        DropDownList.prototype.refreshList = function () {
            if (!this.opened)
                return;
            var _this = this;
            this.getContentProvider().getElements(this.getInput(), function (data) {
                var ul_list = $(_this.div_list).children("ul");
                ul_list.children().empty();
                _this.fillList(ul_list, data);
            });
        };
        DropDownList.prototype.fillList = function (ul_list, data) {
            if (data.length == 0 && this.textForEmptyList) {
                var li = $("<li>")
                    .addClass("dropdown-listitem")
                    .addClass("helpTextForEmptyList")
                    .appendTo($(ul_list));
                var a = $("<a>").attr("role", "button").attr("href", "javascript: void(0);").appendTo($(li));
                $(a).text(this.textForEmptyList);
            }
            else {
                for (var i = 0; i < data.length; i++) {
                    var li = $("<li>").addClass("dropdown-listitem")
                        .attr("idx", i)
                        .appendTo($(ul_list));
                    var a = $("<a>").attr("role", "button").addClass("dropdown-listitem-a")
                        .addClass("btn")
                        .attr("href", "javascript: void(0);")
                        .appendTo($(li));
                    this.drawListItem(a, data[i], i);
                }
                var _this = this;
                $(this.div_list).find('li').each(function (idx) {
                    var li = this;
                    if (_this.getLabelProvider().getDescription) {
                        $(li).hover(function () {
                            var desc = _this.getLabelProvider().getDescription(data[idx]);
                            if (desc && desc != "") {
                                _this.openDescription(li, desc);
                            }
                        }, function () {
                            _this.closeDescription();
                        });
                        $(li).find('.dropdown-listitem-a').focus(function () {
                            var desc = _this.getLabelProvider().getDescription(data[idx]);
                            if (desc && desc != "") {
                                _this.openDescription(li, desc);
                            }
                        });
                        $(li).find('.dropdown-listitem-a').focusout(function () {
                            _this.closeDescription();
                        });
                    }
                    $(li).find('.dropdown-listitem-a').click(function (e) {
                        e.stopPropagation();
                        _this.select(+$(li).attr("idx"));
                    });
                    _this.addDecorations($(li).find('.dropdown-listitem-a'), data[idx]);
                });
            }
        };
        DropDownList.prototype.openDescription = function (item, desc) {
            if (this.dcontainer == null)
                return;
            if (this.div_list == null)
                return;
            var ul = this.div_list;
            var p = ul.offset();
            $(this.dcontainer).attr("style", "display: block; top:" + (p.top + 20) + "px;" + "left:" + (p.left + $(ul).width() + 10) + "px");
            var idx = $(item).attr("idx");
            $(this.dcontainer).text(desc);
        };
        DropDownList.prototype.closeDescription = function () {
            if (this.dcontainer == null)
                return;
            $(this.dcontainer).attr("style", "display: none;");
        };
        DropDownList.prototype.select = function (index) {
            if (this.list != null)
                this.selection = this.list[index];
            this.closeDescription();
            this.closeComboList();
            if (this.isSelectLineChanged)
                this.setText(this.getLabelProvider().getText(this.selection));
            this.emit("selectionChanged", this.selection);
        };
        DropDownList.prototype.getSelection = function () {
            return this.selection;
        };
        DropDownList.prototype.setText = function (msg) {
            var text = msg;
            if (text == null || msg == "") {
                text = this.originalText;
            }
            var wt = $(this.getContainer()).find('.dropdown-list-text');
            if (wt.length > 0)
                $(wt).text(text);
            else
                $(this.getContainer()).text(text);
        };
        DropDownList.prototype.getText = function () {
            var wt = $(this.getContainer()).find('.dropdown-list-text');
            if (wt.length > 0)
                return $(wt).text();
            else
                return $(this.getContainer()).text();
        };
        DropDownList.prototype.addDecorations = function (contents, item) {
            var _this = this;
            if (this.getLabelProvider() && this.getLabelProvider().getDecorations) {
                var decos = this.getLabelProvider().getDecorations(item);
                if (decos) {
                    for (var i = 0; i < decos.length; i++) {
                        var tag = document.createElement("mark");
                        $(tag).text(decos[i]);
                        $(tag).addClass("decoration")
                            .addClass(decos[i])
                            .appendTo($(contents));
                    }
                }
            }
        };
        DropDownList.prototype.setEnabled = function (enabled) {
            var _this = this;
            if (!enabled) {
                $(this.getContainer()).text(this.getText());
                $(this.getContainer()).addClass("dropdown-list-text");
            }
            else {
                if ($(this.getContainer()).find(".dropdown-list-selectline").length == 0) {
                    var text = $(this.getContainer()).text();
                    $(this.getContainer()).text('');
                    var link = $("<a>").attr("href", "javascript:void(0)")
                        .attr("role", "button")
                        .addClass("btn")
                        .addClass("dropdown-list-selectline").click(function (e) {
                        if (!_this.openRequested && !_this.opened) {
                            _this.openComboList();
                        }
                        else {
                            _this.closeComboList();
                        }
                    })
                        .appendTo($(this.getContainer()));
                    $("<span>").addClass("dropdown-list-text").text(text)
                        .appendTo($(link));
                    $("<div>").addClass("dropdown-list-button ui-icon")
                        .appendTo($(link));
                }
            }
        };
        DropDownList.prototype.setVisible = function (visible) {
            var c = $(this.getContainer());
            c = c.add(c.prev());
            if (visible)
                c.show();
            else
                c.hide();
        };
        return DropDownList;
    }(Viewer));
    return DropDownList;
});
