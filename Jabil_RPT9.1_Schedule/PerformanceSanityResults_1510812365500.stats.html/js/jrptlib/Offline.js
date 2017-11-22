define(["require", "exports", "jrptlib/Url"], function (require, exports, Url) {
    "use strict";
    var Offline = (function () {
        function Offline(activated) {
            this.activated = activated;
        }
        Offline.prototype.isActivated = function () {
            return this.activated;
        };
        return Offline;
    }());
    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
        return null;
    }
    return {
        load: function (id, require, callback) {
            if (window.location.protocol == "file:" || window._forceofflinemode) {
                var offline_path = getUrlParameter('offline');
                Url.setOffline(offline_path ? offline_path : "requests_map.js", function () {
                    callback(new Offline(true));
                });
            }
            else {
                callback(new Offline(false));
            }
        }
    };
});
