define(["require", "exports", "jrptlib/Nls", "dojo/Deferred", "dojo/_base/lang"], function (require, exports, Nls, Deferred, lang) {
    "use strict";
    var ExtensionSystem = (function () {
        function ExtensionSystem() {
            var _this = this;
            var url = '/analytics/web/extensions.property';
            this.promise = new Deferred();
            $.get(url, null, function (data) {
                _this.nlsMap = Nls.parseProperties(data);
                _this.promise.resolve();
            });
        }
        ExtensionSystem.prototype.getExtensions = function (point_id, handler) {
            this.promise.then(lang.hitch(this, function () {
                var _this = this;
                $.ajax({
                    url: '/analytics/web/extensions.xml',
                    dataType: 'xml',
                    success: function (data) {
                        var features = $(data).find("extensions")[0];
                        $(features).find("extension[point=\"" + point_id + "\"]").each(function (index) {
                            $(this).children().each(function () {
                                this.handler = handler;
                                var href = $(this).attr("css");
                                if (href && href != "") {
                                    var cssLink = $("<link rel='stylesheet' type='text/css' href='" + href + "'>");
                                    $("head").append(cssLink);
                                }
                                var nl_expr = new RegExp("\\w\\w+", "");
                                var t2 = nl_expr.exec($(this).attr("label"));
                                var tlabel = $(this).attr("label");
                                var tlabel = tlabel.substring(1, tlabel.length);
                                if (_this.nlsMap && _this.nlsMap[tlabel] != null)
                                    $(this).attr("label", _this.nlsMap[tlabel]);
                                else
                                    $(this).attr("label", tlabel.replace(t2[0], "[Not localized " + tlabel + "]"));
                                this.handler(index);
                            });
                        });
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        handler(0, errorThrown);
                    }
                });
            }));
        };
        return ExtensionSystem;
    }());
    return ExtensionSystem;
});
