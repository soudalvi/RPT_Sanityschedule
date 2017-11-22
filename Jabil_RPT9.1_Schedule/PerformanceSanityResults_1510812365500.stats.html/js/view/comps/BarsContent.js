define(["require", "exports", "view/query/queryUtil", "view/util/OrnamentProviders"], function (require, exports, qu, OrnamentProviders_1) {
    "use strict";
    function translateX(val) {
        return "translate(" + val + ")";
    }
    var BarsContent = (function () {
        function BarsContent(provider, ornaments, seriesAxis, valuesAxis, showValues) {
            this.provider = provider;
            this.seriesAxis = seriesAxis;
            this.valuesAxis = valuesAxis;
            this.toneProvider = OrnamentProviders_1.toToneProvider(ornaments, 1, 2);
            this.showValues = showValues;
        }
        BarsContent.prototype.renderContents = function (parent, width, height) {
            this.height = height;
            this.parent = parent;
            this.createGroups(this.parent, this.primaryFunctions(), false);
        };
        BarsContent.prototype.processChange = function (event) {
            this.update({
                xAffected: event.dimensionsChanged[0] || event.dimensionsChanged[1],
                yAffected: event.dataChanged || event.domainChanged || event.dimensionsChanged[2],
                dimsAffected: event.dimensionsChanged,
                majorChange: event.majorChange
            });
        };
        BarsContent.prototype.update = function (update) {
            var _this = this;
            var primaryGroups = this.updateGroups(this.parent, this.primaryFunctions(), update);
            primaryGroups.each(function (item0, index0) {
                var group0 = d3.select(this);
                var f = _this.secondaryFunctions(index0);
                var secondaryGroups = _this.updateGroups(group0, f, update);
                if (update.xAffected || update.yAffected) {
                    secondaryGroups.each(function (item1, index1) {
                        var group1 = d3.select(this);
                        _this.updateBars(group1, update, index0, index1);
                    });
                }
            });
            if (this.valueIndices) {
                this._showValue(this.valueIndices);
            }
        };
        BarsContent.prototype.primaryFunctions = function () {
            var seriesAxis = this.seriesAxis;
            var _this = this;
            return {
                dim: 0,
                clazz: "primary-group",
                groupX: function (item0, index0) {
                    return translateX(seriesAxis.xScale(index0));
                },
                middle: function (item0, index0) {
                    return translateX(seriesAxis.xScale(index0) + seriesAxis.xScale.rangeBand() / 2);
                },
                createChild: function (group0, index0, animate) {
                    _this.createGroups(group0, _this.secondaryFunctions(index0), animate);
                }
            };
        };
        BarsContent.prototype.secondaryFunctions = function (index0) {
            var seriesAxis = this.seriesAxis;
            var _this = this;
            return {
                dim: 1,
                clazz: "secondary-group",
                groupX: function (item1, index1) {
                    return translateX(seriesAxis.innerXScale(index1));
                },
                middle: function (item1, index1) {
                    return translateX(seriesAxis.innerXScale(index1) + seriesAxis.innerXScale.rangeBand() / 2);
                },
                createChild: function (group1, index1, animate) {
                    _this.createBars(group1, index0, index1, animate);
                }
            };
        };
        BarsContent.prototype.createGroups = function (parent, f, animate) {
            var p = this.provider.dimension(f.dim);
            var groups = parent.selectAll("." + f.clazz)
                .data(p.items(), p.key())
                .enter().append("g")
                .classed(f.clazz, true)
                .attr("transform", animate ? null : f.groupX)
                .each(function (item, index) {
                var group = d3.select(this);
                f.createChild(group, index, animate);
            });
        };
        BarsContent.prototype.updateGroups = function (parent, f, update) {
            var p = this.provider.dimension(f.dim);
            var groups = parent.selectAll("." + f.clazz)
                .data(p.items(), p.key());
            if (update.xAffected) {
                if (update.dimsAffected[f.dim]) {
                    groups.exit()
                        .remove();
                    var newGroups = groups.enter().append("g")
                        .classed(f.clazz, true);
                    if (update.majorChange) {
                        groups.attr("transform", f.groupX);
                    }
                    else {
                        newGroups
                            .attr("transform", f.middle);
                        groups.transition()
                            .attr("transform", f.groupX);
                    }
                    var _this = this;
                    newGroups.each(function (item, index) {
                        var group = d3.select(this);
                        f.createChild(group, index, !update.majorChange);
                    });
                }
                else {
                    var g = update.majorChange ? groups : groups.transition();
                    g.attr("transform", f.groupX);
                }
            }
            return groups;
        };
        BarsContent.prototype.barFunctions = function (index0, index1) {
            var _this = this;
            var scaledY = function (val, index2) {
                if (!val)
                    val = 0;
                var unitIndex = _this.provider.dataUnit([index0, index1, index2]);
                return _this.valuesAxis.scales[unitIndex](val);
            };
            var layers = [];
            var p2 = this.provider.dimension(2);
            var base = p2.size() > 0 ? scaledY(0, 0) : 0;
            var toneProvider = this.toneProvider;
            var provider = this.provider;
            var text = function (item2, index2) {
                var idx = [index0, index1, index2];
                return provider.dataText(provider.data(idx), idx);
            };
            var showAbove = p2.size() == 1;
            var barHeight = function (item2, index2) {
                return layers[index2].height;
            };
            var barWidth = this.seriesAxis.innerXScale.rangeBand();
            var textColor = function (item2, index2) {
                return qu.textColor(toneProvider.color(index1, index2));
            };
            var poffset = base, noffset = base;
            for (var i = 0; i < p2.size(); i++) {
                var value = this.provider.data([index0, index1, i]);
                var height = scaledY(0, i) - scaledY(value, i);
                var negative = height < 0;
                if (negative)
                    height = -height;
                var small = height < 4;
                if (small)
                    height = 4;
                layers[i] = {
                    y: negative ? noffset : (poffset -= height),
                    height: height,
                    small: small
                };
                if (negative)
                    noffset += height;
            }
            return {
                barY: function (item2, index2) {
                    return layers[index2].y;
                },
                barHeight: barHeight,
                barFill: function (item2, index2) {
                    if (layers[index2].small)
                        return "none";
                    return toneProvider.color(index1, index2);
                },
                barStroke: function (item2, index2) {
                    if (!layers[index2].small)
                        return null;
                    return toneProvider.color(index1, index2);
                },
                barWidth: barWidth,
                base: base,
                textColor: function (item2, index2) {
                    return qu.textColor(toneProvider.color(index1, index2));
                },
                textRelAttributes: function (txt) {
                    txt.attr("dy", showAbove ? "-0.3em" : "1.2em")
                        .attr("fill", showAbove ? null : textColor);
                },
                textApply: function (txt) {
                    txt.text(text)
                        .style("display", "default")
                        .style("display", function (item2, index2) {
                        if (!showAbove && barHeight(item2, index2) < 14)
                            return "none";
                        var tw = qu.textLength(this);
                        return tw <= barWidth - 2 ? "default" : "none";
                    });
                },
                showAbove: showAbove
            };
        };
        BarsContent.prototype.createBars = function (group, index0, index1, animate) {
            var p2 = this.provider.dimension(2);
            var f = this.barFunctions(index0, index1);
            var bars = group.selectAll(".bar")
                .data(p2.items(), p2.key());
            bars.enter().append("rect")
                .classed("bar", true)
                .attr("width", animate ? 0 : f.barWidth)
                .attr("y", f.barY)
                .attr("height", f.barHeight)
                .style("fill", f.barFill)
                .style("stroke", f.barStroke);
            if (this.showValues) {
                this.createValues(group, f);
            }
        };
        BarsContent.prototype.createValues = function (group, f) {
            var p2 = this.provider.dimension(2);
            var texts = group.selectAll(".value")
                .data(p2.items(), p2.key());
            texts.enter().append("text")
                .classed("value", true)
                .attr("x", f.barWidth / 2)
                .attr("y", f.barY)
                .call(f.textRelAttributes)
                .call(f.textApply);
        };
        BarsContent.prototype.updateBars = function (group, update, index0, index1) {
            var p2 = this.provider.dimension(2);
            var f = this.barFunctions(index0, index1);
            var bars = group.selectAll(".bar")
                .data(p2.items(), p2.key());
            if (update.majorChange) {
                if (update.dimsAffected[2]) {
                    bars.exit().remove();
                    bars.enter().append("rect")
                        .classed("bar", true)
                        .attr("y", f.barY)
                        .attr("height", f.barHeight)
                        .attr("width", f.barWidth);
                }
                bars
                    .style("fill", f.barFill)
                    .style("stroke", f.barStroke);
                if (update.xAffected || update.yAffected) {
                    if (update.yAffected) {
                        bars.attr("y", f.barY)
                            .attr("height", f.barHeight);
                    }
                    if (update.xAffected) {
                        bars.attr("width", f.barWidth);
                    }
                }
            }
            else {
                if (update.dimsAffected[2]) {
                    var neighbourOldY = function (item, index) {
                        var _bars = bars[0];
                        for (var i = index + 1; i < _bars.length; i++) {
                            var other = d3.select(_bars[i]);
                            if (other.attr("y")) {
                                return (+other.attr("y")) + (+other.attr("height"));
                            }
                        }
                        for (var i = index - 1; i >= 0; i--) {
                            var other = d3.select(_bars[i]);
                            if (other.attr("y")) {
                                return +other.attr("y");
                            }
                        }
                        return f.base;
                    };
                    bars.exit()
                        .remove();
                    bars.enter().append("rect")
                        .classed("bar", true)
                        .attr("y", neighbourOldY)
                        .attr("height", 0)
                        .attr("width", f.barWidth);
                }
                bars
                    .style("fill", f.barFill)
                    .style("stroke", f.barStroke);
                if (update.xAffected || update.yAffected) {
                    var trans = bars.transition();
                    if (update.yAffected) {
                        trans
                            .attr("y", f.barY)
                            .attr("height", f.barHeight);
                    }
                    if (update.xAffected) {
                        trans.attr("width", f.barWidth);
                    }
                }
            }
            if (this.showValues) {
                this.updateValues(group, update, f);
            }
        };
        BarsContent.prototype.updateValues = function (group, update, f) {
            var p2 = this.provider.dimension(2);
            var texts = group.selectAll(".value")
                .data(p2.items(), p2.key());
            if (update.majorChange) {
                if (update.dimsAffected[2]) {
                    texts.exit().remove();
                    texts.enter().append("text")
                        .classed("value", true)
                        .attr("x", f.barWidth / 2)
                        .attr("y", f.barY);
                    texts.call(f.textRelAttributes);
                }
                texts.call(f.textApply);
                if (update.yAffected) {
                    texts.attr("y", f.barY);
                }
                if (update.xAffected) {
                    texts.attr("x", f.barWidth / 2);
                }
            }
            else {
                if (update.dimsAffected[2]) {
                    texts.exit().remove();
                    texts.enter().append("text")
                        .classed("value", true)
                        .attr("x", f.barWidth / 2)
                        .attr("y", f.barY);
                    texts.call(f.textRelAttributes);
                }
                texts.call(f.textApply);
                if (update.xAffected || update.yAffected) {
                    var ttrans = texts.transition();
                    if (update.yAffected) {
                        ttrans.attr("y", f.barY);
                    }
                    if (update.xAffected) {
                        ttrans.attr("x", f.barWidth / 2);
                    }
                }
            }
        };
        BarsContent.prototype.tertiaryIndex = function (y, index0, index1) {
            var size = this.provider.dimension(2).size();
            if (size == 1)
                return 0;
            var f = this.barFunctions(index0, index1);
            for (var i = 0; i < size; i++) {
                var y0 = f.barY(null, i);
                var y1 = y0 + f.barHeight(null, i);
                if (y >= y0 && y < y1)
                    return i;
            }
            return -1;
        };
        BarsContent.prototype.showValue = function (indices) {
            if (this.valueIndices && qu.arrayEquals(this.valueIndices, indices))
                return this.valueText != null;
            return this._showValue(indices);
        };
        BarsContent.prototype._showValue = function (indices) {
            this.hideValue();
            this.valueIndices = indices;
            var p2 = this.provider.dimension(2);
            var showAbove = p2.size() == 1;
            var f = this.barFunctions(indices[0], indices[1]);
            if (!showAbove && f.barHeight(null, indices[2]) < 14)
                return false;
            var x = this.seriesAxis.position(indices[0], indices[1]);
            var val = this.provider.data(indices);
            var text = this.parent.append("text")
                .attr("class", "value")
                .text(this.provider.dataText(val, indices));
            var tw = qu.textLength(text.node());
            if (tw > this.seriesAxis.innerXScale.rangeBand() - 2) {
                text.remove();
                return false;
            }
            var textColor = qu.textColor(this.toneProvider.color(indices[1], indices[2]));
            text.attr("x", x)
                .attr("y", f.barY(null, indices[2]))
                .attr("dy", showAbove ? "-0.3em" : "1.2em")
                .attr("fill", showAbove ? null : textColor);
            this.valueText = text;
            return true;
        };
        BarsContent.prototype.hideValue = function () {
            if (this.valueIndices) {
                this.valueIndices = undefined;
                if (this.valueText) {
                    this.valueText.remove();
                    this.valueText = undefined;
                }
            }
        };
        BarsContent.prototype.setSize = function (width, height, smooth) {
            this.height = height;
            this.update({
                xAffected: true,
                yAffected: true,
                dimsAffected: [],
                majorChange: !smooth
            });
        };
        return BarsContent;
    }());
    return BarsContent;
});
