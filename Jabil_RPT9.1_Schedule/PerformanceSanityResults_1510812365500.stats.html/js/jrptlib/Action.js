define(["require", "exports"], function (require, exports) {
    "use strict";
    var Action = (function () {
        function Action(name, callback) {
            this.name = name;
            this.run = callback;
        }
        return Action;
    }());
    return Action;
});
