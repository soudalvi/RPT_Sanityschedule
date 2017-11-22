/*!
 * ***************************************************************
 * Licensed Materials - Property of IBM
 * PopupMenu.js
 * (c) Copyright IBM Corporation 2016. All Rights Reserved.
 * U.S. Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 * ***************************************************************
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    var Tooltip = (function () {
        function Tooltip(parent, h) {
            this.tooltip = undefined;
            this.svg = parent;
            this.height = h;
        }
        Tooltip.prototype.setHeight = function (h) {
            this.height = h;
        };
        Tooltip.prototype.show = function (tooltipText) {
            this.tooltip = this.svg.append("g")
                .attr("class", "gradient-tooltip");
            var def = this.tooltip.append("defs");
            var gradient = def.append("linearGradient")
                .attr("id", "gradientTooltip")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "0%")
                .attr("y2", "100%");
            gradient.append("stop")
                .attr("offset", "0%")
                .attr("style", "stop-color:#FDFDFD;stop-opacity:1");
            gradient.append("stop")
                .attr("offset", "100%")
                .attr("style", "stop-color:#DFDFDF;stop-opacity:1");
            var rect = this.tooltip.append("rect");
            var text = this.tooltip.append("text")
                .attr("dx", "6px")
                .attr("dy", "1.3em")
                .text(tooltipText);
            var textSize = text.node().getBBox();
            var svgWidth = this.svg.style("width");
            rect.attr("width", textSize.width + 2 * 6)
                .attr("height", textSize.height + 2 * 4);
            this.tooltip.attr("transform", "translate(0, " + this.height + ") translate(0, -" + (textSize.height + 2 * 4) + ")");
            if (textSize.width + 10 > parseInt(svgWidth, 10)) {
                return false;
            }
            return true;
        };
        Tooltip.prototype.hide = function () {
            if (this.tooltip) {
                this.tooltip.remove();
                this.tooltip = undefined;
            }
        };
        return Tooltip;
    }());
    return Tooltip;
});
