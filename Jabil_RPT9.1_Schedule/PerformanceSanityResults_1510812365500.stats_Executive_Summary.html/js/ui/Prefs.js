define(["require", "exports", "jrptlib/Url"], function (require, exports, Url) {
    "use strict";
    return {
        load: function (id, require, callback) {
            var url = new Url("/analytics/prefs");
            url.request_get({
                handleAs: "json",
                headers: { "Accept": "application/json" }
            }).then(function (data) {
                callback(data);
            }, function (error) {
                console.log("Unable to retrieve preferences: " + error);
                callback(null);
            });
        }
    };
});
