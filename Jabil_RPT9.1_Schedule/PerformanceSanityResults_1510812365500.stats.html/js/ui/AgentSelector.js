var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "model/session/Host", "model/session/HostGroup", "model/session/CategoryValue", "view/query/queryUtil", "jrptlib/CheckboxDropDownList", "jrptlib/Properties!APPMSG"], function (require, exports, Host, HostGroup, CategoryValue, qu, CheckboxDropDownList, APPMSG) {
    "use strict";
    var groups = [
        {
            id: "host",
            label: APPMSG.Hosts,
            grouping: [],
            getTitle: function (hostList) {
                var host = hostList.hasOneEnabledHost();
                if (host)
                    return host.getName();
                if (hostList.isAllHostsEnabled())
                    return APPMSG.HostsAll;
                return APPMSG.Hosts;
            },
            getCompareTitle: function () {
                return APPMSG.HostsCompare;
            },
            enableAll: function (hostList) {
                hostList.enableAllHosts();
            }
        },
        {
            id: "geo",
            label: APPMSG.Geos,
            grouping: ["geo"],
            getTitle: function (hostList) {
                if (hostList.getGrouping().length == 1) {
                    var group = hostList.getGrouping()[0];
                    var v = hostList.getCategory(group).hasOneEnabledValue();
                    if (v)
                        return v.getValue();
                }
                if (hostList.isAllCategoryValuesEnabled())
                    return APPMSG.GeosAll;
                return APPMSG.Geos;
            },
            getCompareTitle: function () {
                return APPMSG.GeosCompare;
            },
            enableAll: function (hostList) {
                hostList.enableAllValues(this.grouping);
            }
        }
    ];
    var AgentSelector = (function (_super) {
        __extends(AgentSelector, _super);
        function AgentSelector(container) {
            var _this = this;
            _super.call(this, container);
            this.session = null;
            this.setAllowUncheckAll(false);
            this.setContentProvider({
                getElements: function (session, handler) {
                    var hostsRoot = _this.session.hostsRoot;
                    var elements;
                    var grouping = hostsRoot.getGrouping();
                    if (grouping.length == 0) {
                        elements = hostsRoot.getHosts();
                    }
                    else {
                        elements = [];
                        var cats = hostsRoot.getCategories();
                        for (var _i = 0, grouping_1 = grouping; _i < grouping_1.length; _i++) {
                            var catid = grouping_1[_i];
                            var cat = hostsRoot.getCategory(catid);
                            if (!cat || !cat.hasValues())
                                continue;
                            var vals = cat.getValues();
                            for (var j = 0; j < vals.length; j++) {
                                elements.push(vals[j]);
                            }
                        }
                    }
                    handler(elements);
                }
            });
            this.setCheckStateProvider({
                isChecked: function (object) {
                    if (object instanceof CategoryValue)
                        return object.isEnabled();
                    else if (object instanceof Host) {
                        return object.isEnabled();
                    }
                }
            });
            this.setLabelProvider({
                getText: function (object) {
                    if (object instanceof CategoryValue)
                        return object.getValue();
                    else if (object instanceof Host) {
                        return object.getName();
                    }
                    return "";
                }
            });
            this.setText(this.getTitle());
            this.setCheckListChangedListener();
        }
        AgentSelector.prototype.setCheckListChangedListener = function () {
            var _this = this;
            this.checkListChangedHandler = this.on("checked", function (selection) {
                _this.checkListChanged(selection.item, selection.selection);
            });
        };
        AgentSelector.prototype.removeCheckListChangedListener = function () {
            this.checkListChangedHandler.remove();
        };
        AgentSelector.prototype.checkListChanged = function (item, checked) {
            var _this = this;
            setTimeout(function () {
                _this.removeCheckListChangedListener();
                item.setEnabled(checked);
                _this.setCheckListChangedListener();
            }, 20);
        };
        AgentSelector.prototype.getGrouping = function () {
            var hostList = this.session.hostsRoot;
            for (var _i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
                var g = groups_1[_i];
                if (qu.arrayEquals(hostList.getGrouping(), g.grouping))
                    return g;
            }
            return null;
        };
        AgentSelector.prototype.getTitle = function () {
            if (!this.session)
                return APPMSG.Hosts;
            var hostList = this.session.hostsRoot;
            var grouping = this.getGrouping();
            if (hostList.isCompare()) {
                return grouping.getCompareTitle(hostList);
            }
            else {
                return grouping.getTitle(hostList);
            }
        };
        AgentSelector.prototype.setSession = function (session) {
            var _this = this;
            if (this.sessionHandlers) {
                this.sessionHandlers.forEach(function (h) { return h.remove(); });
                this.sessionHandlers = null;
            }
            this.setInput(session);
            this.session = session;
            var schedule = this.session.isSchedule();
            this.setVisible(schedule);
            if (schedule) {
                this.sessionHandlers = [
                    session.on("hosts", function (details) {
                        _this.refreshList();
                        if (details.groupsChanged || details.hostsChanged || details.compareChanged) {
                            _this.setText(_this.getTitle());
                        }
                    }),
                ];
                this.setText(this.getTitle());
            }
        };
        AgentSelector.prototype.drawListItem = function (contents, item, idx) {
            _super.prototype.drawListItem.call(this, contents, item, idx);
            if (item instanceof HostGroup) {
                contents.addClass("hostGroup");
            }
            else if (item instanceof Host) {
                contents.addClass("host");
                var address = item.getAddress();
                if (address)
                    contents.attr("title", address);
            }
        };
        AgentSelector.prototype.drawHeaderList = function (contents) {
            if (!this.session.hostsRoot.hasCategories())
                return;
            var form = $("<form>")
                .addClass("host-grouping")
                .appendTo($(contents));
            var selector = this;
            for (var i = 0; i < groups.length; i++) {
                var g = groups[i];
                var handler = function (g) {
                    return function (e) {
                        e.stopPropagation();
                        if ($(this).prop("checked")) {
                            selector.session.hostsRoot.setGrouping(g.grouping);
                        }
                    };
                };
                $("<input id=\"hostgrouping" + i + "\" name=\"hostgrouping\" value=\"" + g.id + "\" type=\"radio\">")
                    .appendTo($(form))
                    .prop("checked", qu.arrayEquals(this.session.hostsRoot.getGrouping(), g.grouping))
                    .click(handler(g));
                $("<label>")
                    .attr("for", "hostgrouping" + i)
                    .text(g.label)
                    .appendTo($(form));
            }
            $(form).buttonset();
        };
        AgentSelector.prototype.drawFooterList = function (contents) {
            var _this = this;
            var selector = this;
            $(contents).addClass("host-compare");
            $("<span>")
                .text(APPMSG.Compare)
                .appendTo($(contents));
            var label = $("<label>")
                .addClass("switch")
                .appendTo($(contents));
            var checkbox = $("<input id=\"checkbox_compare\" type=\"checkbox\">")
                .addClass("switch-input")
                .appendTo($(label))
                .prop("checked", this.session.hostsRoot.isCompare());
            var span = $("<span>")
                .addClass("switch-label")
                .attr("data-on", APPMSG.On)
                .attr("data-off", APPMSG.Off)
                .appendTo($(label));
            var length = Math.max(APPMSG.On.length, APPMSG.Off.length);
            if (length >= 14)
                span.addClass("megashrink");
            else if (length >= 11)
                span.addClass("shrink");
            $("<span>")
                .addClass("switch-handle")
                .appendTo($(label));
            var compareTimeRanges = this.session.getSelectedTimeRangeIndices().length != 1;
            var compareSessions = this.session.getSelectedSessions().length != 0;
            if (compareTimeRanges || compareSessions) {
                checkbox.attr("disabled", "disabled");
                label.attr("title", compareTimeRanges ? APPMSG.HostsCompareConflictTimeRanges : APPMSG.HostsCompareConflictSessions);
            }
            else {
                checkbox.click(function (e) {
                    e.stopPropagation();
                    var select = $(this).prop("checked");
                    selector.session.hostsRoot.setCompare(select);
                });
            }
            var createButton = function (parent, label) {
                return $("<button>")
                    .text(label)
                    .appendTo($(parent))
                    .button();
            };
            createButton(contents, APPMSG.SelectAllButton_label)
                .click(function (e) {
                _this.removeCheckListChangedListener();
                _this.getGrouping().enableAll(_this.session.hostsRoot);
                _this.setCheckListChangedListener();
            });
        };
        return AgentSelector;
    }(CheckboxDropDownList));
    return AgentSelector;
});
