define(["require", "exports", "jrptlib/FormatLocale!", "jrptlib/Properties!APPMSG"], function (require, exports, format, APPMSG) {
    "use strict";
    function leafExtent(matrix, filters, getters) {
        var ret = null;
        function aggrVal(val) {
            if (val != null) {
                if (!ret) {
                    ret = [val, val];
                }
                else {
                    if (ret[0] > val)
                        ret[0] = val;
                    if (ret[1] < val)
                        ret[1] = val;
                }
            }
        }
        var n = matrix.length;
        var getter = getters[0];
        var filter = filters[0];
        if (filter) {
            var fn = filter.length;
            for (var i = 0; i < fn; i++) {
                aggrVal(getter(matrix[filter[i]]));
            }
        }
        else {
            for (var i = 0; i < n; i++) {
                aggrVal(getter(matrix[i]));
            }
        }
        return ret;
    }
    function nonLeafExtent(matrix, subdim, filters, getters) {
        var ret = null;
        function aggrArr(arr) {
            var extent = _extent(arr, subdim, filters, getters);
            if (extent != null) {
                if (!ret) {
                    ret = extent;
                }
                else {
                    if (ret[0] > extent[0])
                        ret[0] = extent[0];
                    if (ret[1] < extent[1])
                        ret[1] = extent[1];
                }
            }
        }
        var n = matrix.length;
        var getter = getters[subdim];
        var filter = filters[subdim];
        if (filter) {
            var fn = filter.length;
            for (var i = 0; i < fn; i++) {
                aggrArr(getter(matrix[filter[i]]));
            }
        }
        else {
            for (var i = 0; i < n; i++) {
                aggrArr(getter(matrix[i]));
            }
        }
        return ret;
    }
    function _extent(matrix, dim, filters, getters) {
        if (!matrix)
            return null;
        if (dim == 0)
            return [matrix, matrix];
        if (dim == 1) {
            return leafExtent(matrix, filters, getters);
        }
        else {
            return nonLeafExtent(matrix, dim - 1, filters, getters);
        }
    }
    function identity(element) {
        return element;
    }
    function normalizeGetters(getters, size) {
        if (getters === undefined) {
            getters = new Array(size);
        }
        for (var i = 0; i < size; i++) {
            if (getters[i] === undefined)
                getters[i] = identity;
        }
        return getters;
    }
    function extent(matrix, dim, filters, getters) {
        return _extent(matrix, dim, filters, normalizeGetters(getters, dim));
    }
    exports.extent = extent;
    function normalize(bounds, unit) {
        if (bounds == null)
            return unit.defaultRange();
        var required = unit.requiredRange();
        if (bounds[0] > required[0])
            bounds[0] = required[0];
        if (bounds[1] < required[1])
            bounds[1] = required[1];
        return bounds;
    }
    function uextent(unit, matrix, dim, filters, getters) {
        return normalize(_extent(matrix, dim, filters, normalizeGetters(getters, dim)), unit);
    }
    exports.uextent = uextent;
    function _sextent(matrix, dim, summedDim, filters, getters) {
        if (summedDim == dim - 1) {
            return _extent(_sumMatrix(matrix, dim - 1, filters, getters), dim - 1, sameElementArray(dim, undefined), normalizeGetters(undefined, summedDim));
        }
        var sumGetter = function (element) {
            var array = getters[summedDim + 1](element);
            return _sumMatrix(array, summedDim, filters, getters);
        };
        var sgetters = getters.slice();
        sgetters.splice(summedDim, 1);
        for (var i = 0; i < summedDim; i++)
            sgetters[i] = identity;
        sgetters[summedDim] = sumGetter;
        var sfilters = filters.slice();
        sfilters.splice(summedDim, 1);
        for (var i = 0; i < summedDim; i++)
            sfilters[i] = undefined;
        return _extent(matrix, dim - 1, sfilters, sgetters);
    }
    function sextent(matrix, dim, summedDim, filters, getters) {
        return _sextent(matrix, dim, summedDim, filters, normalizeGetters(getters, dim));
    }
    exports.sextent = sextent;
    function usextent(unit, matrix, dim, summedDim, filters, getters) {
        return normalize(_sextent(matrix, dim, summedDim, filters, normalizeGetters(getters, dim)), unit);
    }
    exports.usextent = usextent;
    function _addArray(to, from, filter, getter) {
        if (!to)
            to = [];
        if (!from)
            return to;
        if (filter) {
            for (var i = 0; i < filter.length; i++) {
                var val = getter(from[filter[i]]);
                if (!to[i])
                    to[i] = val;
                else
                    to[i] += val;
            }
        }
        else {
            for (var i = 0; i < from.length; i++) {
                var val = getter(from[i]);
                if (!to[i])
                    to[i] = val;
                else
                    to[i] += val;
            }
        }
        return to;
    }
    function addArray(to, from, filter, getter) {
        if (!getter)
            getter = identity;
        return _addArray(to, from, filter, getter);
    }
    exports.addArray = addArray;
    function _addMatrix(to, from, dim, filters, getters) {
        var getter = getters[dim];
        var filter = filters[dim];
        if (dim == 0)
            return _addArray(to, from, filter, getter);
        if (!to)
            to = [];
        if (!from)
            return to;
        if (filter) {
            for (var i = 0; i < filter.length; i++) {
                to[i] = _addMatrix(to[i], getter(from[filter[i]]), dim - 1, filters, getters);
            }
        }
        else {
            for (var i = 0; i < from.length; i++) {
                to[i] = _addMatrix(to[i], getter(from[i]), dim - 1, filters, getters);
            }
        }
        return to;
    }
    function addMatrix(to, from, dim, filters, getters) {
        return _addMatrix(to, from, dim, filters, normalizeGetters(getters, dim + 1));
    }
    exports.addMatrix = addMatrix;
    function n(n) {
        return n != null ? n : 0;
    }
    function _sumMatrix(matrix, dim, filters, getters) {
        if (!matrix)
            return matrix;
        var getter = getters[dim];
        var filter = filters[dim];
        if (dim == 0) {
            var total = 0;
            if (filter) {
                for (var i = 0; i < filter.length; i++) {
                    total += n(getter(matrix[filter[i]]));
                }
            }
            else {
                for (var i = 0; i < matrix.length; i++) {
                    total += n(getter(matrix[i]));
                }
            }
            return total;
        }
        else {
            var ret = void 0;
            if (filter) {
                for (var i = 0; i < filter.length; i++) {
                    ret = _addMatrix(ret, getter(matrix[filter[i]]), dim - 1, filters, getters);
                }
            }
            else {
                for (var i = 0; i < matrix.length; i++) {
                    ret = _addMatrix(ret, getter(matrix[i]), dim - 1, filters, getters);
                }
            }
            return ret;
        }
    }
    function sumMatrix(matrix, dim, filters, getters) {
        return _sumMatrix(matrix, dim, filters, normalizeGetters(getters, dim + 1));
    }
    exports.sumMatrix = sumMatrix;
    function values(group) {
        if (group.counters !== undefined)
            return group.counters;
        return [];
    }
    exports.values = values;
    function instances(group) {
        if (group.groups !== undefined)
            return group.groups[0].instances;
        return [];
    }
    exports.instances = instances;
    function fillInstances(instances, prefix, ret) {
        if (instances.length == 0)
            return;
        if (instances[0].counters !== undefined) {
            for (var i = 0; i < instances.length; i++) {
                var inst = instances[i];
                var names = prefix.slice(0);
                names.push(inst.name);
                ret.push({
                    name: names,
                    counters: inst.counters
                });
            }
        }
        else if (instances[0].groups !== undefined) {
            for (var i = 0; i < instances.length; i++) {
                var inst = instances[i];
                var names = prefix.slice(0);
                names.push(inst.name);
                fillInstances(inst.groups[0].instances, names, ret);
            }
        }
    }
    function leafToQualified(x) {
        return x.map(function (d) {
            return { name: [d.name], counters: d.counters };
        });
    }
    function flattenInstances(instances) {
        if (instances.length == 0)
            return [];
        if (instances[0].counters !== undefined) {
            return leafToQualified(instances);
        }
        else if (instances[0].groups !== undefined) {
            var ret = new Array();
            for (var i = 0; i < instances.length; i++) {
                var inst = instances[i];
                var name_1 = [inst.name];
                fillInstances(inst.groups[0].instances, name_1, ret);
            }
            return ret;
        }
        throw instances;
    }
    exports.flattenInstances = flattenInstances;
    function fillContentInstances(instances, prefix, ret) {
        if (instances.length == 0)
            return;
        if (instances[0].index !== undefined) {
            for (var i = 0; i < instances.length; i++) {
                var inst = instances[i];
                var names = prefix.slice(0);
                names.push(inst.name);
                ret.push({
                    name: names,
                    index: inst.index
                });
            }
        }
        else {
            for (var i = 0; i < instances.length; i++) {
                var inst = instances[i];
                var names = prefix.slice(0);
                names.push(inst.name);
                fillContentInstances(inst.groups[0].instances, names, ret);
            }
        }
    }
    function contentLeafToQualified(x) {
        return x.map(function (d) {
            return { name: [d.name], index: d.index };
        });
    }
    function flattenContentInstances(instances) {
        if (instances.length == 0)
            return [];
        if (instances[0].index !== undefined) {
            return contentLeafToQualified(instances);
        }
        else {
            var ret = new Array();
            for (var i = 0; i < instances.length; i++) {
                var inst = instances[i];
                var name = [inst.name];
                fillContentInstances(inst.groups[0].instances, name, ret);
            }
            return ret;
        }
    }
    exports.flattenContentInstances = flattenContentInstances;
    function toCoordinates(values, interval, timeDomain) {
        var from = timeDomain[0];
        var to = timeDomain[1];
        var ret = [];
        var len = to - from;
        if (values.length < len)
            len = values.length;
        var serie = false;
        var lastValue = null;
        for (var i = 0, vx = from, j = -1; i < len; i++, vx += interval) {
            var val = values[i];
            if (val == null)
                continue;
            if (lastValue !== val) {
                serie = false;
                ++j;
            }
            else {
                if (!serie) {
                    serie = true;
                    ++j;
                }
            }
            lastValue = val;
            ret[j] = { x: vx, y: val };
        }
        return ret;
    }
    exports.toCoordinates = toCoordinates;
    function concatCoordinates(values, addedValues) {
        if (addedValues.length == 0)
            return;
        var vlen = values.length;
        var firstAddedX = addedValues[0].x;
        var startAt = vlen;
        for (var i = vlen - 1; i >= 0; i--) {
            if (values[i].x >= firstAddedX) {
                startAt = i;
            }
            else {
                break;
            }
        }
        var newLen = startAt + addedValues.length;
        for (var j = startAt; j < newLen; j++) {
            values[j] = addedValues[j - startAt];
        }
    }
    exports.concatCoordinates = concatCoordinates;
    function concatDeepCoordinates(values, addedValues, dim) {
        if (dim == 0) {
            concatCoordinates(values, addedValues);
        }
        else {
            for (var i = 0; i < addedValues.length; i++) {
                var subv = values[i];
                var subav = addedValues[i];
                if (subv) {
                    if (subav)
                        concatDeepCoordinates(subv, subav, dim - 1);
                }
                else {
                    values[i] = subav;
                }
            }
        }
    }
    exports.concatDeepCoordinates = concatDeepCoordinates;
    function pointValue(point) {
        return point.y;
    }
    exports.pointValue = pointValue;
    function arrayEquals(array1, array2) {
        return (array1.length == array2.length && array1.every(function (element, index) {
            return element === array2[index];
        }));
    }
    exports.arrayEquals = arrayEquals;
    function arrayIndexOf(array2d, arrayElement) {
        for (var i = 0; i < array2d.length; i++) {
            if (this.arrayEquals(array2d[i], arrayElement)) {
                return i;
            }
        }
        return -1;
    }
    exports.arrayIndexOf = arrayIndexOf;
    function sameElementArray(size, element) {
        var ret = new Array(size);
        for (var i = 0; i < size; i++) {
            ret[i] = element;
        }
        return ret;
    }
    exports.sameElementArray = sameElementArray;
    function sameElementArrayF(size, element) {
        var ret = new Array(size);
        for (var i = 0; i < size; i++) {
            ret[i] = element();
        }
        return ret;
    }
    exports.sameElementArrayF = sameElementArrayF;
    function textColor(backgroundColor) {
        var bc = d3.hcl(backgroundColor);
        return bc.l > 68 ? null : "white";
    }
    exports.textColor = textColor;
    function textLength(text) {
        try {
            return text.getComputedTextLength();
        }
        catch (e) {
            return 0;
        }
    }
    exports.textLength = textLength;
    function valueScale(factor, domain) {
        return {
            unit: factor.unit,
            scale: d3.scale.linear().domain(domain.map(factor.translate)),
            tickFormat: factor.display ? factor.display : null,
            detailFormat: factor.display ? factor.display : format.numberFormat(".3r")
        };
    }
    exports.valueScale = valueScale;
    function timeScale(base, domain) {
        var abs = function (sec) {
            return new Date(sec * 1000 + base);
        };
        return {
            unit: "",
            scale: d3.time.scale().domain(domain.map(abs)),
            tickFormat: format.timeFormat.multi([
                [APPMSG.ScaleMs, function (d) { return d.getMilliseconds(); }],
                [APPMSG.ScaleSecs, function (d) { return d.getSeconds(); }],
                [APPMSG.ScaleMins, function (d) { return d.getMinutes(); }],
                [APPMSG.ScaleHours, function (d) { return d.getHours(); }],
                [APPMSG.ScaleWeekDays, function (d) { return d.getDay() && d.getDate() != 1; }],
                [APPMSG.ScaleMonthDays, function (d) { return d.getDate() != 1; }],
                [APPMSG.ScaleMonths, function (d) { return d.getMonth(); }],
                [APPMSG.ScaleYears, function (d) { return true; }]
            ]),
            detailFormat: format.timeFormat("%c")
        };
    }
    exports.timeScale = timeScale;
});
