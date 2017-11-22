define(["require", "exports"], function (require, exports) {
    "use strict";
    (function (GOrnamentKind) {
        GOrnamentKind[GOrnamentKind["COLOR"] = 0] = "COLOR";
        GOrnamentKind[GOrnamentKind["COLOR_SHADEABLE"] = 1] = "COLOR_SHADEABLE";
        GOrnamentKind[GOrnamentKind["STROKE"] = 2] = "STROKE";
        GOrnamentKind[GOrnamentKind["SHADE"] = 3] = "SHADE";
    })(exports.GOrnamentKind || (exports.GOrnamentKind = {}));
    var GOrnamentKind = exports.GOrnamentKind;
});
