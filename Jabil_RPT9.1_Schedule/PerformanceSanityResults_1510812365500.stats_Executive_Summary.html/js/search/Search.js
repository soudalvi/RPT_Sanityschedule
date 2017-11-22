var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented", "jrptlib/Properties!APPMSG"], function (require, exports, Evented, APPMSG) {
    "use strict";
    var Search = (function (_super) {
        __extends(Search, _super);
        function Search(container, search_manager) {
            _super.call(this);
            this.container = container;
            this.index = search_manager;
            var _this = this;
            this.input = $("<input>")
                .appendTo($(this.container))
                .attr("title", "")
                .attr("type", "search")
                .attr("name", "search_line")
                .addClass("search-input ui-widget ui-widget-content ui-state-default ui-corner-left")
                .autocomplete({
                position: { my: "left top", at: "left bottom", collision: "flip" },
                delay: 0,
                minLength: 0,
                source: $.proxy(this, "_source"),
                select: function (event, ui) {
                    event.preventDefault();
                    _this.select(event, ui);
                }
            });
            $(this.input).autocomplete("instance")._renderMenu = function (ul, item) {
                return _this.renderMenu(ul, item);
            };
            $(this.input).autocomplete("instance")._renderItem = function (ul, item) {
                return _this.renderItem(ul, item);
            };
            $(this.input).tooltip({
                tooltipClass: "ui-state-highlight"
            });
            $(this.input).autocomplete("widget").menu("option", "items", "> :not(.ui-autocomplete-category)");
        }
        Search.prototype.renderItem = function (ul, item) {
            return $("<li>")
                .append("<a>" + item.label + "</a>")
                .appendTo(ul);
        };
        Search.prototype.renderMenu = function (ul, items) {
            var _this = this;
            var currentCategory = "";
            var categories;
            categories = {};
            $.each(items, function (index, item) {
                if (!categories[item.category])
                    categories[item.category] = new Array();
                categories[item.category].push(item);
            });
            for (var category in categories) {
                ul.append("<li class='ui-autocomplete-category'>" + category + "</li>");
                for (var i = 0; i < categories[category].length; i++) {
                    var item = categories[category][i];
                    var li;
                    li = $(_this.input).autocomplete("instance")._renderItemData(ul, item);
                    if (item.category) {
                        li.attr("aria-label", item.category + " : " + item.label);
                    }
                }
            }
        };
        Search.prototype.select = function (event, ui) {
            this.setText("");
            this.index.notifySelectedEntry(ui.item);
        };
        Search.prototype.setText = function (text) {
            $(this.input).val(text);
        };
        Search.prototype.setHelpText = function (help_text) {
            $(this.input).attr("placeholder", help_text);
        };
        Search.prototype.setFocus = function () {
            $(this.input).focus();
        };
        Search.prototype._source = function (request, response) {
            var search_text = $.ui.autocomplete.escapeRegex(request.term);
            if (search_text == "") {
                response([]);
                return;
            }
            var ret = this.index.get(search_text);
            if (!ret || ret.length == 0) {
                var item;
                item = { key: APPMSG.NoSuchSearchResult, category: APPMSG.NoSuchSearchResult, label: "", object: null };
                ret = [item];
            }
            response(ret);
        };
        return Search;
    }(Evented));
    return Search;
});
