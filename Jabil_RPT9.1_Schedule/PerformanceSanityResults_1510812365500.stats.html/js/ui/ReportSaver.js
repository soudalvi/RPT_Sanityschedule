var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "dojo/request", "jrptlib/Evented", "jrptlib/Nls", "jrptlib/Properties!APPMSG"], function (require, exports, request, Evented, NLS, APPMSG) {
    "use strict";
    var ReportSaver = (function (_super) {
        __extends(ReportSaver, _super);
        function ReportSaver() {
            _super.call(this);
        }
        ReportSaver.prototype.postit = function (url, d) {
            return request.post(url, {
                handleAs: "xml",
                headers: { "Content-Type": "text/xml" },
                data: this.xmlToString(d)
            });
        };
        ReportSaver.prototype.xmlToString = function (xmlData) {
            var xml = "";
            if (typeof (XMLSerializer) !== 'undefined') {
                xml = (new XMLSerializer()).serializeToString(xmlData);
            }
            else if (xmlData.xml) {
                xml = xmlData.xml;
            }
            else {
                throw (APPMSG.XML_Serialization_Not_Supporter);
            }
            return xml;
        };
        ReportSaver.prototype.save = function (reportKind, reportId, data) {
            var _this = this;
            var promise = this.postit("/analytics/reports/" + reportKind + "/" + reportId + ".checked", data);
            promise.response.then(function (response) {
                _this.emit("saved", reportId);
            }, function (error) {
                _app.showErrorMessage(NLS.bind(APPMSG.Error_Saving_Report, error));
                _this.emit("failed", reportId);
            });
        };
        return ReportSaver;
    }(Evented));
    return ReportSaver;
});
