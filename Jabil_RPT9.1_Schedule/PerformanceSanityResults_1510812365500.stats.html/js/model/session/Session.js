var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "dojo/json", "dojo/request", "view/query/GRequestProvider", "model/session/TimeRanges", "model/session/TimeRange", "model/session/HostList", "model/session/SessionSet"], function (require, exports, json, request, GRequestProvider, TimeRanges, TimeRange, HostList, SessionSet) {
    "use strict";
    function sameIndices(i1, i2) {
        if (i1.length != i2.length)
            return false;
        for (var i = 0; i < i1.length; i++) {
            if (i1[i] != i2[i])
                return false;
        }
        return true;
    }
    function sortNumber(a, b) {
        return a - b;
    }
    var Session = (function (_super) {
        __extends(Session, _super);
        function Session(path, hasSet) {
            _super.call(this);
            this.userSettingsRetrieved = false;
            this.sessionPath = path.replace(/\+/g, " ");
            this.selectedTimeRangeIndices = [-1];
            this.sessionSet = hasSet ? new SessionSet(this, [], [], false) : undefined;
            this.hostsRoot = new HostList(this);
            this.update(false);
        }
        Session.prototype.getBaseRequestUrl = function () {
            return "/analytics/sessions" + this.sessionPath;
        };
        Session.prototype.getRequestUrl = function () {
            var ret = this.getBaseRequestUrl();
            if (!this.userSettingsRetrieved)
                ret += "?userId=default";
            return ret;
        };
        Session.prototype.getPostData = function () {
            return null;
        };
        Session.prototype.setData = function (response, notify) {
            this.data = response;
            var timeranges = response.timeRanges;
            this.updateTimeRangesFromServer(timeranges.list, notify);
            this.hostsRoot.updateHosts(response);
            if (response.userSettings) {
                this.hostsRoot.updateSettings(response.userSettings);
                this.updateTimeRangeSelectionFromServer(response.userSettings);
                this.userSettingsRetrieved = true;
            }
            this.hasRtb = response.hasRtb == true;
        };
        Session.prototype.modelAvailable = function () {
            return this.getDataPromise();
        };
        Session.prototype.getLabel = function () {
            if (this.data.label)
                return this.data.label;
            return this.getTestName();
        };
        Session.prototype.getTestName = function () {
            return this.data.testName;
        };
        Session.prototype.getTestPath = function () {
            return this.data.testPath;
        };
        Session.prototype.getDate = function () {
            return new Date(this.data.startTime);
        };
        Session.prototype.getStartTime = function () {
            return this.data.startTime;
        };
        Session.prototype.getRunRangeInSamples = function () {
            var range = this.data.timeRanges.run;
            if (!range)
                return [];
            var interval = this.getSampleInterval();
            var start = Math.floor(range.startTime / interval);
            if (!range.duration)
                return [start];
            var end = Math.ceil((range.startTime + range.duration) / interval);
            return [start, end];
        };
        Session.prototype.isSchedule = function () {
            return this.data.testType == "com.ibm.rational.test.common.schedule.Schedule";
        };
        Session.prototype.getFeatures = function () {
            return this.data.features;
        };
        Session.prototype.getSampleInterval = function () {
            return this.data.timeReference.interval;
        };
        Session.prototype.isLive = function () {
            return this.data.isLive;
        };
        Session.prototype.updateTimeRangesFromServer = function (timeRanges, notify) {
            var now = [];
            for (var _i = 0, timeRanges_1 = timeRanges; _i < timeRanges_1.length; _i++) {
                var tr = timeRanges_1[_i];
                now.push(TimeRange.fromJson(tr));
            }
            this._setTimeRanges(new TimeRanges(now, false), notify, false);
        };
        Session.prototype.updateTimeRangeSelectionFromServer = function (settings) {
            var selection = settings.timeRanges !== undefined ? settings.timeRanges : [-1];
            if (!sameIndices(selection, this.selectedTimeRangeIndices)) {
                this.selectedTimeRangeIndices = selection;
                this.emit("selectedTimeRangesChanged", {});
            }
        };
        Session.prototype._setTimeRanges = function (timeRanges, notify, post) {
            var old = this.timeRanges;
            this.timeRanges = timeRanges;
            var timeRangesChanged = !old || !old.isSame(this.timeRanges);
            if (!timeRangesChanged)
                return;
            var oldSelectedIndices = this.selectedTimeRangeIndices;
            var selectionChanged = false;
            if (old) {
                if (oldSelectedIndices.length == 0) {
                    selectionChanged = true;
                }
                else {
                    var oldSelection = old.gets(oldSelectedIndices);
                    this.selectedTimeRangeIndices = this.timeRanges.findSameTimeRanges(oldSelection, false);
                    if (this.selectedTimeRangeIndices == null) {
                        this.selectedTimeRangeIndices = [-1];
                    }
                    selectionChanged = !sameIndices(this.selectedTimeRangeIndices, oldSelectedIndices);
                }
                this.emit("timeRangesChanged", {});
                if (selectionChanged)
                    this.emit("selectedTimeRangesChanged", {});
            }
            if (post) {
                this.postTimeRanges();
                if (selectionChanged)
                    this.postSelectedTimeRanges();
            }
        };
        Session.prototype.setTimeRanges = function (timeRanges) {
            this._setTimeRanges(timeRanges, true, true);
        };
        Session.prototype.copyTimeRanges = function () {
            return new TimeRanges(this.timeRanges.list(), true);
        };
        Session.prototype.selectTimeRange = function (index, select) {
            if (this.selectedTimeRangeIndices.indexOf(index) == -1) {
                this.selectedTimeRangeIndices.push(index);
                this.selectedTimeRangeIndices.sort(sortNumber);
                this.postSelectedTimeRanges();
                this.emit("selectedTimeRangesChanged", {});
            }
        };
        Session.prototype.setSelectedTimeRangeIndices = function (indices) {
            indices.sort(sortNumber);
            if (sameIndices(indices, this.selectedTimeRangeIndices))
                return;
            this.selectedTimeRangeIndices = indices;
            this.postSelectedTimeRanges();
            this.emit("selectedTimeRangesChanged", {});
        };
        Session.prototype.getSelectedTimeRangeIndices = function () {
            return this.selectedTimeRangeIndices;
        };
        Session.prototype.getSelectedTimeRanges = function () {
            if (this.selectedTimeRangeIndices.length == 0)
                return this.timeRanges.list();
            return this.timeRanges.gets(this.selectedTimeRangeIndices);
        };
        Session.prototype.getTimeRangeSampleBounds = function (timeRange) {
            if (!timeRange)
                return null;
            return timeRange.getSampleBounds(this);
        };
        Session.prototype.postTimeRanges = function () {
            var data = {
                type: "TimeRanges",
                list: this.timeRanges.list()
            };
            request.post(this.getBaseRequestUrl() + "/timeranges", {
                data: json.stringify(data),
                headers: { "Content-Type": "application/json; charset=utf-8" }
            });
        };
        Session.prototype.postSelectedTimeRanges = function () {
            this.postUserSettings({
                timeRanges: this.selectedTimeRangeIndices
            });
        };
        Session.prototype.postUserSettings = function (settings) {
            request.post(this.getBaseRequestUrl() + "/settings?userId=default", {
                data: json.stringify(settings),
                headers: { "Content-Type": "application/json; charset=utf-8" }
            });
        };
        Session.prototype.displayRTB = function (counterPath, instancesProjections) {
            var postData = { type: "QueryOptions", instances: instancesProjections };
            var trIndex = this.selectedTimeRangeIndices.length == 1 ? this.selectedTimeRangeIndices[0] : -1;
            request.post(this.getBaseRequestUrl() + "/rtb?counter=" + counterPath + "&timeRange=" + trIndex, {
                data: json.stringify(postData),
                headers: { "Content-Type": "application/json; charset=utf-8" }
            });
        };
        Session.prototype.copySessionSet = function () {
            return new SessionSet(this, this.sessionSet.list(), this.sessionSet.selection(), true);
        };
        Session.prototype.setSessionSet = function (sessionSet) {
            this.sessionSet.setSessions(sessionSet.list());
        };
        Session.prototype.getSelectedSessions = function () {
            return this.sessionSet ? this.sessionSet.selection() : [];
        };
        Session.prototype.getUserComment = function () {
            return this.data.userComment;
        };
        Session.prototype.setUserComment = function (comment) {
            this.data.userComment = comment;
            this.postSessionAttributes({ userComment: comment });
        };
        Session.prototype.getTags = function () {
            return this.data.tags;
        };
        Session.prototype.setTags = function (tags) {
            this.data.tags = tags;
            this.postSessionAttributes({ tags: tags });
        };
        Session.prototype.postSessionAttributes = function (settings) {
            request.post(this.getBaseRequestUrl(), {
                data: json.stringify(settings),
                headers: { "Content-Type": "application/json; charset=utf-8" }
            });
        };
        return Session;
    }(GRequestProvider));
    return Session;
});
