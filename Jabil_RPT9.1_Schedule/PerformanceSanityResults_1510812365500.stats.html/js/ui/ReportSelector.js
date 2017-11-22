var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Url", "jrptlib/DropDownList", "jrptlib/Nls", "jrptlib/Properties!APPMSG", "jrptlib/Offline!"], function (require, exports, Url, DropDownList, NLS, APPMSG, Offline) {
    "use strict";
    var ReportSelector = (function (_super) {
        __extends(ReportSelector, _super);
        function ReportSelector(container, desc_container) {
            _super.call(this, container, desc_container);
            ReportSelector.features["com.ibm.rational.test.lt.feature.http"] = APPMSG.httpFeature;
            ReportSelector.features["com.ibm.rational.test.lt.feature.lt"] = APPMSG.allFeature;
            ReportSelector.features["com.ibm.rational.test.lt.feature.socket"] = APPMSG.socketFeature;
            ReportSelector.features["com.ibm.rational.test.lt.feature.sdksamples.socket"] = APPMSG.socketExampleFeature;
            ReportSelector.features["com.ibm.rational.test.rtw.se"] = APPMSG.seleniumFeature;
            ReportSelector.features["com.ibm.rational.test.lt.feature.sap"] = APPMSG.sapFeature;
            ReportSelector.features["com.ibm.rational.test.lt.feature.citrix"] = APPMSG.citrixFeature;
            ReportSelector.features["com.ibm.rational.test.lt.feature.tn3270"] = APPMSG.tn3270Feature;
            ReportSelector.features["com.ibm.rational.test.lt.feature.mobileweb"] = APPMSG.mobileFeature;
            ReportSelector.features["com.ibm.rational.test.lt.ws.feature"] = APPMSG.soaFeature;
            ReportSelector.features["com.ibm.rational.test.rtw.rft"] = APPMSG.rftFeature;
            ReportSelector.features["Others"] = APPMSG.otherFeature;
            this.setText(APPMSG.Select_Report_label);
            this.session = null;
            var _this = this;
            this.setContentProvider({
                getElements: function (object, handler) {
                    _this.retrieveReportList(handler);
                }
            });
            this.setLabelProvider({
                getText: function (object) {
                    return $(object).attr("label");
                },
                getDescription: function (object) {
                    return $(object).attr("description");
                },
                getDecorations: function (object) {
                    var fids = $(object).children("features").children("item");
                    var skipCore = fids.length > 1;
                    var ret = [];
                    fids.each(function (index) {
                        var fid = $(this).text();
                        if (skipCore && fid == "com.ibm.rational.test.lt.feature.lt")
                            return;
                        var text = ReportSelector.features[fid];
                        if (!text) {
                            text = APPMSG.UnkownFeature;
                        }
                        ret.push(text);
                    });
                    return ret;
                }
            });
            this.on("selectionChanged", function (selection) {
                _this.current = selection;
            });
        }
        ReportSelector.prototype.setReportKind = function (reportKind) {
            this.reportKind = reportKind;
        };
        ReportSelector.prototype.setShowAllReports = function (all) {
            this.showAllReports = all;
        };
        ReportSelector.prototype.getUrl = function () {
            if (this.session && !this.showAllReports) {
                return this.session.getBaseRequestUrl() + "/reports/" + this.reportKind;
            }
            var url = "/analytics/reports/" + this.reportKind;
            if (this.session) {
                var features = this.session.getFeatures();
                for (var i = 0; i < features.length; i++) {
                    url += (i == 0) ? "?" : "&";
                    url += "feature=" + features[i];
                }
            }
            return url;
        };
        ReportSelector.prototype.retrieveReportList = function (terminated) {
            var _this = this;
            var nurl = new Url(this.getUrl());
            nurl.get(null, function (data) {
                _this.list = [];
                _this.editedReport = [];
                var xml_node = $('ReportRegistry', data);
                xml_node.find('Report').each(function () {
                    _this.list.push($(this));
                    if ($(this).attr("isUser") === "true") {
                        _this.editedReport.push($(this)[0]);
                    }
                    ;
                });
                if (_this.list.length == 0) {
                    var report = document.createElement("Report");
                    $(report).attr("id", ReportSelector.EMPTY_REPORT_ID)
                        .attr("label", APPMSG.EmptyReportLabel)
                        .attr("isDefault", "true")
                        .attr("isUser", "false")
                        .attr("hasUnresolvedCounters", "false");
                    _this.list.push($(report));
                }
                if (terminated) {
                    terminated(_this.list);
                }
            }, "xml", function (jqXHR, textStatus, errorThrown) {
                _app.showErrorMessage(NLS.bind(APPMSG.UnableToRetrieveReportList, [nurl, errorThrown]));
            });
        };
        ReportSelector.prototype.setText = function (msg) {
            var text = msg;
            if (text == null || msg == "") {
                text = APPMSG.Select_Report_label;
            }
            _super.prototype.setText.call(this, text);
        };
        ReportSelector.prototype.selectDefaultReport = function (session) {
            var _this = this;
            this.session = session;
            this.retrieveReportList(function () {
                if (_this.list && _this.list.length > 0) {
                    _this.select(0);
                }
            });
        };
        ReportSelector.prototype.setSession = function (session) {
            this.session = session;
        };
        ReportSelector.prototype.setSelectionById = function (reportId) {
            var _this = this;
            this.retrieveReportList(function () {
                if (_this.list && _this.list.length > 0) {
                    for (var i = 0; i < _this.list.length; i++) {
                        if (_this.list[i].attr("id") === reportId) {
                            _this.select(i);
                            return;
                        }
                    }
                    _this.select(0);
                }
            });
        };
        ReportSelector.prototype.drawFooterList = function (contents) {
            if (Offline.isActivated())
                return;
            if (this.editedReport.length == 0)
                return;
            var _this = this;
            var createButton = function (parent, label) {
                return $("<button>")
                    .text(label)
                    .appendTo($(parent))
                    .button();
            };
            createButton(contents, APPMSG.ManageButton_label)
                .click(function () {
                _this.openReportManagerDialog();
            });
        };
        ReportSelector.prototype.openReportManagerDialog = function () {
            if (this.reportManagerDialog != null) {
                this._openReportManagerDialog();
            }
            else {
                var _this_1 = this;
                require(["dojo/fx", "ui/ReportManagerDialog"], function (fx, ReportManagerDialog) {
                    _this_1.reportManagerDialog = new ReportManagerDialog();
                    _this_1.reportManagerDialog.on("removed", function (report_id) {
                        if (_this_1.current && $(_this_1.current).attr("id") === report_id) {
                            _this_1.retrieveReportList(function () {
                                if (_this_1.list.length > 0) {
                                    _this_1.select(0);
                                }
                            });
                        }
                    });
                    _this_1._openReportManagerDialog();
                });
            }
        };
        ReportSelector.prototype._openReportManagerDialog = function () {
            this.reportManagerDialog.setReports(this.reportKind, this.editedReport);
            this.reportManagerDialog.open();
        };
        ReportSelector.features = {
            "com.ibm.rational.test.lt.feature.http": "",
            "com.ibm.rational.test.lt.feature.lt": "",
            "com.ibm.rational.test.lt.feature.socket": "",
            "com.ibm.rational.test.lt.feature.sdksamples.socket": "",
            "com.ibm.rational.test.rtw.se": "",
            "com.ibm.rational.test.lt.feature.sap": "",
            "com.ibm.rational.test.lt.feature.citrix": "",
            "com.ibm.rational.test.lt.feature.tn3270": "",
            "com.ibm.rational.test.lt.feature.mobileweb": "",
            "com.ibm.rational.test.lt.ws.feature": "",
            "com.ibm.rational.test.rtw.rft": "",
            "Others": ""
        };
        ReportSelector.EMPTY_REPORT_ID = "com.ibm.rational.test.lt.empty_report_id";
        return ReportSelector;
    }(DropDownList));
    return ReportSelector;
});
