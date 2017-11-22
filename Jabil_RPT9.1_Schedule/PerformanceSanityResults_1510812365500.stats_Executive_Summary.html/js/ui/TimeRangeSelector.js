var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/CheckboxDropDownList", "jrptlib/Properties!APPMSG"], function (require, exports, CheckboxDropDownList, APPMSG) {
    "use strict";
    var TimeRangeSelector = (function (_super) {
        __extends(TimeRangeSelector, _super);
        function TimeRangeSelector(container) {
            var _this = this;
            _super.call(this, container);
            this.session = null;
            this.timeRangeDialog = null;
            this.timeRanges = [];
            this.setAllowUncheckAll(false);
            this.setContentProvider({
                getElements: function (session, handler) {
                    handler(_this.timeRanges);
                }
            });
            this.setCheckStateProvider({
                isChecked: function (timerange) {
                    var select = _this.session.getSelectedTimeRangeIndices();
                    if (select == null || select.length == 0) {
                        return timerange.index != -1;
                    }
                    else {
                        return select.indexOf(timerange.index) != -1;
                    }
                }
            });
            this.setLabelProvider({
                getText: function (timeRange) {
                    if (timeRange.index == -1) {
                        return APPMSG.TimeRangeRun;
                    }
                    else {
                        return timeRange.range.name;
                    }
                }
            });
            this.setText(APPMSG.TimeRangeRun);
            this.setCheckListChangedListener();
            this.on("selectionChanged", function (item) {
                if (!_this.useCheckboxes())
                    _this.selectOne(item);
            });
        }
        TimeRangeSelector.prototype.setReadOnly = function (readOnly) {
            this.readOnly = readOnly;
        };
        TimeRangeSelector.prototype.setCheckListChangedListener = function () {
            var _this = this;
            this.checkListChangedHandler = this.on("checkListChanged", function (checkList) {
                _this.checkListChanged(checkList);
            });
        };
        TimeRangeSelector.prototype.removeCheckListChangedListener = function () {
            this.checkListChangedHandler.remove();
        };
        TimeRangeSelector.prototype.checkListChanged = function (checkList) {
            var _this = this;
            setTimeout(function () {
                var selection = [];
                for (var i = 0; i < checkList.length; i++) {
                    selection.push(checkList[i].index);
                }
                _this.session.setSelectedTimeRangeIndices(selection);
                _this.updateTextTitle();
            }, 20);
        };
        TimeRangeSelector.prototype.useCheckboxes = function () {
            return !this.session.hostsRoot.isCompare()
                && this.session.getSelectedSessions().length == 0;
        };
        TimeRangeSelector.prototype.updateTextTitle = function () {
            var select = this.session.getSelectedTimeRangeIndices();
            if (select == null || select.length == 0) {
                this.setText(APPMSG.AllTimeRanges);
            }
            else if (select.length == 1) {
                if (select[0] == -1)
                    this.setText(APPMSG.TimeRangeRun);
                else
                    this.setText(this.session.timeRanges.get(select[0]).name);
            }
            else {
                this.setText(APPMSG.TRS_InCompareMode);
            }
        };
        TimeRangeSelector.prototype.updateTimeRanges = function () {
            this.timeRanges = [];
            this.timeRanges.push({ name: APPMSG.TimeRangeRun, index: -1, range: null });
            for (var i = 0; i < this.session.timeRanges.list().length; i++) {
                this.timeRanges.push({ name: this.session.timeRanges.get(i).name, index: i,
                    range: this.session.timeRanges.get(i) });
            }
        };
        TimeRangeSelector.prototype.setSession = function (session) {
            var _this = this;
            this.setInput(session);
            this.session = session;
            this.session.on("timeRangesChanged", function () {
                _this.updateTimeRanges();
            });
            this.session.on("selectedTimeRangesChanged", function () {
                _this.updateTextTitle();
            });
            if (this.timeRangeDialog != null) {
                this.timeRangeDialog.setSession(session);
            }
            this.updateTimeRanges();
            this.updateTextTitle();
        };
        TimeRangeSelector.prototype.drawFooterList = function (contents) {
            var _this = this;
            var createButton = function (parent, label, disabled) {
                return $("<button>")
                    .text(label)
                    .appendTo($(parent))
                    .button()
                    .button("option", "disabled", disabled);
            };
            var add = createButton(contents, "+", this.readOnly)
                .click(function () {
                _this.openTimeRangeDialog(function () {
                    _this.timeRangeDialog.add();
                });
            });
            createButton(contents, APPMSG.ManageButton_label, this.readOnly)
                .click(function () {
                _this.openTimeRangeDialog();
            });
            var compareHosts = this.session.hostsRoot.isCompare();
            var compareSessions = this.session.getSelectedSessions().length != 0;
            var selectAll = createButton(contents, APPMSG.SelectAllButton_label, compareHosts || compareSessions || this.timeRanges.length == 1);
            if (compareHosts || compareSessions) {
                selectAll
                    .attr("title", compareHosts ?
                    APPMSG.TimeRangeCompareConflictHosts :
                    APPMSG.TimeRangeCompareConflictSessions);
            }
            else {
                selectAll
                    .attr("title", APPMSG.SelectAllButton_tooltip)
                    .click(function (e) {
                    _this.session.setSelectedTimeRangeIndices([]);
                    _this.updateCheckState();
                });
            }
        };
        TimeRangeSelector.prototype.drawListItem = function (contents, item, idx) {
            var _this = this;
            _super.prototype.drawListItem.call(this, contents, item, idx);
            if (this.useCheckboxes()) {
                var mark = $("<mark>").addClass("select-one decoration")
                    .css("visibility", "hidden")
                    .appendTo($(contents));
                $("<a>").text(APPMSG.TRS_SelectThis)
                    .appendTo($(mark))
                    .click(function (e) {
                    e.preventDefault();
                    _this.selectOne(item);
                });
                $(contents).hover(function () {
                    $(contents).find("mark.select-one").css("visibility", "visible");
                }, function () {
                    $(contents).find("mark.select-one").css("visibility", "hidden");
                });
            }
        };
        TimeRangeSelector.prototype.selectOne = function (item) {
            this.closeComboList();
            this.session.setSelectedTimeRangeIndices([item.index]);
        };
        TimeRangeSelector.prototype.openTimeRangeDialog = function (done) {
            var _this = this;
            if (this.timeRangeDialog != null) {
                this.timeRangeDialog.open();
                if (done)
                    done();
            }
            else {
                require(["dojo/fx", "ui/TimeRangeDialog"], function (fx, TimeRangeDialog) {
                    _this.timeRangeDialog = new TimeRangeDialog();
                    _this.timeRangeDialog.setSession(_this.session);
                    _this.timeRangeDialog.open();
                    if (done)
                        done();
                });
            }
        };
        TimeRangeSelector.prototype.getTimeRangeDialog = function () {
            return this.timeRangeDialog;
        };
        return TimeRangeSelector;
    }(CheckboxDropDownList));
    return TimeRangeSelector;
});
