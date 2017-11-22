define(["require", "exports", "jrptlib/Nls"], function (require, exports, NLS) {
    "use strict";
    function getLanguage() {
        if ("languages" in navigator) {
            return navigator.languages[0];
        }
        return navigator.userLanguage || navigator.language;
    }
    return {
        load: function (id, require, callback) {
            var lang = getLanguage();
            NLS.loadJSON("libs/d3/locales/" + lang + ".json", function (o) {
                if (o)
                    callback(d3.locale(o));
                else
                    callback({
                        numberFormat: d3.format,
                        timeFormat: d3.time.format
                    });
            });
        }
    };
});
