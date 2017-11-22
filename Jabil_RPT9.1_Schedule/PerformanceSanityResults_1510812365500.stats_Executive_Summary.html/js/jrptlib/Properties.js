define(["require", "exports", "jrptlib/Nls"], function (require, exports, NLS) {
    "use strict";
    return {
        load: function (id, require, callback) {
            NLS.loadMessages(id, callback);
        }
    };
});
