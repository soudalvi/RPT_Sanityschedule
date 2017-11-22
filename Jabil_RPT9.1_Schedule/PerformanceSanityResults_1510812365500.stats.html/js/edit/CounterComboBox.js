var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/CustomComboBox", "model/counters/CounterQuery"], function (require, exports, CustomComboBox, CounterQuery) {
    "use strict";
    var CounterComboBox = (function (_super) {
        __extends(CounterComboBox, _super);
        function CounterComboBox(container, counterDescTree, wildcardsProvider, counterQueryProvider) {
            _super.call(this, container);
            this.setSource(this.counterSource);
            this.setRenderMenu(this.counterRenderMenu);
            this.counterDescTree = counterDescTree;
            this.wildcardsProvider = wildcardsProvider;
            this.getCounterQuery = counterQueryProvider;
            this.makeDroppable();
        }
        CounterComboBox.prototype.counterSource = function (request, response) {
            var tree = this.counterDescTree;
            var filterMatchingRequestTerm = function (str) { return false; };
            var real_all_counters = true;
            if (request.term.length > 0) {
                var res = request.term.split(" ");
                var matchers = [];
                for (var i = 0; i < res.length; i++) {
                    var matcher = new RegExp($.ui.autocomplete.escapeRegex(res[i]), "i");
                    matchers.push(matcher);
                }
                filterMatchingRequestTerm = function (str) {
                    for (var i = 0; i < matchers.length; i++) {
                        if (!matchers[i].test(str)) {
                            return true;
                        }
                    }
                    return false;
                };
                real_all_counters = false;
            }
            var isWildcardFiltered = function (data) { return false; };
            var this_wildcards = this.wildcardsProvider();
            if (this_wildcards != null) {
                real_all_counters = false;
                if (this_wildcards.length == 0) {
                    isWildcardFiltered = function (data) { return CounterQuery.hasWildcards(data.path); };
                }
                else {
                    isWildcardFiltered = function (data) {
                        var counter_wild = CounterQuery.parseWildcards(data.path);
                        return !CounterQuery.isEqualWildcards(counter_wild, this_wildcards);
                    };
                }
            }
            var inspect = function (data) {
                data.allChildrenFiltered = true;
                data.counterFiltered = true;
                if (data.counter.counterType) {
                    var a = isWildcardFiltered(data);
                    var b = filterMatchingRequestTerm(data.counter.allLabel || data.counter.label);
                    data.counterFiltered = a || b;
                }
                if (data.children) {
                    for (var i = 0; i < data.children.length; i++) {
                        var c = data.children[i];
                        inspect(c);
                        if (!c.counterFiltered || !c.allChildrenFiltered)
                            data.allChildrenFiltered = false;
                    }
                }
            };
            for (var i = 0; i < tree.length; i++) {
                inspect(tree[i]);
            }
            var tmp = new Array();
            var count = 0;
            var total = 0;
            var not_added = 0;
            var debug_not_added = real_all_counters && !CounterComboBox.debug_not_added_counters;
            if (debug_not_added) {
                CounterComboBox.debug_not_added_counters = "done";
            }
            var gatherItem = function (data, indent) {
                total++;
                var added = false;
                var actualLabel = data.counter.allLabel ? data.counter.allLabel : data.counter.label;
                if (data.children && !data.allChildrenFiltered) {
                    tmp.push({ label: actualLabel,
                        value: actualLabel,
                        isCategory: true,
                        indent: indent,
                        data: data });
                    count++;
                    added = true;
                }
                if (!added && data.counter.counterType && !data.counterFiltered) {
                    tmp.push({ label: actualLabel,
                        value: actualLabel,
                        isCategory: false,
                        indent: indent,
                        data: data });
                    added = true;
                    count++;
                }
                if (!added && debug_not_added) {
                    not_added++;
                    console.log("COUNTER NOT LISTED: path=" + data.path + "  child ? " + (data.children ? "yes" : "no") + " counterType=" + data.counter.counterType);
                }
                if (data.children) {
                    var id = indent + 1;
                    for (var i = 0; i < data.children.length; i++) {
                        gatherItem(data.children[i], id);
                    }
                }
            };
            for (var i = 0; i < tree.length; i++) {
                gatherItem(tree[i], 0);
            }
            if (debug_not_added && not_added > 0) {
                console.log("MISSING COUNTERS IN LIST: not listed=" + not_added + ", listed=" + count + "/" + total);
            }
            response(tmp);
        };
        CounterComboBox.prototype.counterRenderMenu = function (autocomplete, ul, items) {
            $.each(items, function (index, item) {
                var li = null;
                var d = item.data;
                if (d.counter.counterType && !d.counterFiltered) {
                    li = autocomplete._renderItemData(ul, item);
                    if (item.isCategory) {
                        li.css("font-weight", "bold");
                        li.addClass('no-margin');
                    }
                }
                else if (item.isCategory && !d.allChildrenFiltered) {
                    li = $('<li>').addClass('ui-autocomplete-category').text(item.label);
                    li.addClass('no-margin');
                    li.appendTo($(ul));
                }
                if (li && item.indent) {
                    li.css("margin-left", (16 * item.indent) + "px");
                }
            });
        };
        CounterComboBox.prototype.makeDroppable = function () {
            var input = $(this.getContainer()).find("input");
            var _cbox = this;
            input.droppable({
                tolerance: "touch",
                accept: function (draggable) {
                    var cq2 = draggable.data("counterQuery");
                    var cq3 = _cbox.getCounterQuery ? _cbox.getCounterQuery() : null;
                    if (cq2 && cq3 && cq3.path() == cq2.path())
                        return false;
                    return draggable.attr("id") == "CounterComponentEditForm";
                },
                activeClass: "droppable_area",
                hoverClass: "droppable_area_hover",
                drop: function (event, ui) {
                    var cq = ui.draggable.data("counterQuery");
                    var _cbox_wildcards = _cbox.wildcardsProvider();
                    if (CounterQuery.isEqualWildcards(_cbox_wildcards, cq.wildcards)) {
                        var ncq = cq.duplicate();
                        if (_cbox.onDropCounter(ncq)) {
                            ui.draggable.draggable('option', 'revert', false);
                        }
                    }
                }
            });
        };
        CounterComboBox.prototype.onDropCounter = function (cq) {
            return false;
        };
        CounterComboBox.debug_not_added_counters = undefined;
        return CounterComboBox;
    }(CustomComboBox));
    return CounterComboBox;
});
