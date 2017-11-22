define(["require", "exports"], function (require, exports) {
    "use strict";
    var HighContrastSystem = (function () {
        function HighContrastSystem() {
        }
        HighContrastSystem.detect = function (imageurl) {
            var hc = false;
            var hcDetect = $("<div>").attr("id", "jsHighContrastDetect")
                .css({ background: "url(\"" + imageurl + "\")", width: "0px", height: "Opx" })
                .appendTo(document.body);
            if (hcDetect.css("background-image") == "none") {
                hc = true;
            }
            $(hcDetect).remove();
            return hc;
        };
        return HighContrastSystem;
    }());
    return HighContrastSystem;
});
