var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented", "model/counters/CounterQuery", "model/counters/WildcardOptions"], function (require, exports, Evented, CounterQuery, WildcardOptions) {
    "use strict";
    function setExists(wildcardSet, wsets) {
        for (var _i = 0, wsets_1 = wsets; _i < wsets_1.length; _i++) {
            var ws = wsets_1[_i];
            if (CounterQuery.isEqualWildcards(ws, wildcardSet))
                return true;
        }
        return false;
    }
    function computeWildcards(counterQueries) {
        if (counterQueries.length == 0)
            return undefined;
        var wildcards = counterQueries[0].getWildcards({});
        for (var i = 1; i < counterQueries.length; i++) {
            if (!CounterQuery.isEqualWildcards(wildcards, counterQueries[i].getWildcards({})))
                return null;
        }
        return wildcards;
    }
    function removeUndefined(map) {
        var ret = {};
        for (var s in map) {
            if (map[s] !== undefined)
                ret[s] = map[s];
        }
        return ret;
    }
    var CounterQuerySet = (function (_super) {
        __extends(CounterQuerySet, _super);
        function CounterQuerySet(counterQueries, wildcardOptions) {
            _super.call(this);
            if (counterQueries === undefined)
                counterQueries = [];
            if (wildcardOptions === undefined)
                wildcardOptions = [];
            this.counterQueries = counterQueries;
            this.units = [];
            for (var i = 0; i < counterQueries.length; i++) {
                counterQueries[i]._setOwner(this, i);
            }
            this.wildcardOptions = [];
            for (var _i = 0, wildcardOptions_1 = wildcardOptions; _i < wildcardOptions_1.length; _i++) {
                var wo = wildcardOptions_1[_i];
                this._addWildcardOptions(wo);
            }
            this._processWildcards();
        }
        CounterQuerySet.prototype.setInstances = function (instances) {
            if (instances != null) {
                instances = removeUndefined(instances);
                if (Object.keys(instances).length == 0)
                    instances = null;
            }
            this.instances = instances;
            this._processWildcards();
        };
        CounterQuerySet.prototype._addUnit = function (unit) {
            for (var i = 0; i < this.units.length; i++) {
                if (unit.same(this.units[i]))
                    return i;
            }
            var ret = this.units.length;
            this.units.push(unit);
            return ret;
        };
        CounterQuerySet.prototype._removeUnit = function (index) {
            this.units.splice(index, 1);
            for (var _i = 0, _a = this.counterQueries; _i < _a.length; _i++) {
                var cq = _a[_i];
                if (cq.unitIndex > index) {
                    cq.unitIndex--;
                }
            }
        };
        CounterQuerySet.prototype.getUnit = function (id) {
            for (var i = 0; i < this.units.length; i++) {
                if (id == this.units[i].id)
                    return i;
            }
            return null;
        };
        CounterQuerySet.prototype.count = function () {
            return this.counterQueries.length;
        };
        CounterQuerySet.prototype.getUnitLabel = function (counterQuery) {
            for (var _i = 0, _a = this.units; _i < _a.length; _i++) {
                var u = _a[_i];
                if (counterQuery.unit.id == u.id)
                    return u.label;
            }
            return null;
        };
        CounterQuerySet.prototype._updateUnits = function (offset, threshold) {
            for (var _i = 0, _a = this.units; _i < _a.length; _i++) {
                var u = _a[_i];
                for (var k = 0; k < u.counterIndices.length; k++) {
                    if (u.counterIndices[k] >= threshold)
                        u.counterIndices[k] += offset;
                }
            }
        };
        CounterQuerySet.prototype._insert = function (index, counterType, componentType, unit_id, nlunit, path, label) {
            if (index > this.counterQueries.length) {
                index = this.counterQueries.length;
            }
            var cq = new CounterQuery(path, counterType, unit_id, label, nlunit, componentType, null);
            cq._setOwner(this, index);
            if (index == this.counterQueries.length) {
                this.counterQueries.push(cq);
            }
            else {
                this._updateUnits(1, index);
                this.counterQueries.splice(index, 0, cq);
            }
            return cq;
        };
        CounterQuerySet.prototype._unitChanged = function (cq) {
            if (cq.unitIndex !== undefined) {
                var unit_1 = this.units[cq.unitIndex];
                unit_1.removeCounterIndex(cq.index);
                if (unit_1.counterIndices.length == 0) {
                    this._removeUnit(cq.unitIndex);
                }
            }
            var unitIndex = this._addUnit(cq._unit());
            cq.unitIndex = unitIndex;
            var unit = this.units[unitIndex];
            cq.unit = unit;
            unit.addCounterIndex(cq.index);
        };
        CounterQuerySet.prototype._remove = function (index) {
            var cq = this.counterQueries[index];
            cq.unit.removeCounterIndex(index);
            if (cq.unit.counterIndices.length == 0) {
                this._removeUnit(cq.unitIndex);
            }
            this._updateUnits(-1, index);
            this.counterQueries.splice(index, 1);
            if (this.rawWildcards === undefined || this.counterQueries.length == 0) {
                this._processWildcards();
            }
            cq._setOwner(null, 0);
        };
        CounterQuerySet.prototype.add = function (counterType, componentType, unit, nlunit, path, label) {
            var cq = this._insert(this.counterQueries.length, counterType, componentType, unit, nlunit, path, label);
            this.emit("counterQueryAdded", cq);
            this._counterQuerySetChanged();
            return cq;
        };
        CounterQuerySet.prototype.insertAfter = function (counterQuery, counterType, componentType, unit, nlunit, path, label) {
            var index = this.counterQueries.indexOf(counterQuery);
            var cq = this._insert(index + 1, counterType, componentType, unit, nlunit, path, label);
            this.emit("counterQueryAdded", cq);
            this._counterQuerySetChanged();
            return cq;
        };
        CounterQuerySet.prototype.modify = function (counterQuery, counterType, componentType, unit, nlunit, path, label) {
            var index = this.counterQueries.indexOf(counterQuery);
            this._remove(index);
            var cq = this._insert(index, counterType, componentType, unit, nlunit, path, label);
            this.emit("counterQueryModified", cq);
            this._counterQuerySetChanged();
            return cq;
        };
        CounterQuerySet.prototype.remove = function (counterQuery) {
            if (!counterQuery)
                return;
            var index = this.counterQueries.indexOf(counterQuery);
            this._remove(index);
            this.emit("counterQueryRemoved", counterQuery);
            this._counterQuerySetChanged();
        };
        CounterQuerySet.prototype.move = function (dir, counterQuery) {
            var index = this.counterQueries.indexOf(counterQuery);
            if (index == -1)
                return;
            var cq = counterQuery;
            if (index + dir >= 0 && index + dir < this.counterQueries.length) {
                this._remove(index);
                cq = this._insert(index + dir, counterQuery.counterType, counterQuery.componentType, counterQuery.counterUnit, counterQuery.counterUnitLabel, counterQuery.path(), counterQuery.counterLabel);
            }
            this.emit("counterQueryMove", { counterQuery: cq, direction: dir });
            this._counterQuerySetChanged();
            return cq;
        };
        CounterQuerySet.prototype.isEmpty = function () {
            return this.counterQueries.length == 0;
        };
        CounterQuerySet.prototype.isAllCumulated = function () {
            var ret = 3;
            for (var _i = 0, _a = this.counterQueries; _i < _a.length; _i++) {
                var cq = _a[_i];
                if (cq.isSpecialComponent())
                    continue;
                if (cq.isCumulated) {
                    if (ret == 3)
                        ret = 1;
                    else if (ret == 0)
                        ret = 2;
                }
                else {
                    if (ret == 3)
                        ret = 0;
                    else if (ret == 1)
                        ret = 2;
                }
                if (ret == 2)
                    break;
            }
            return ret;
        };
        CounterQuerySet.prototype.getWildcards = function (includeProjections, includeContainers) {
            var list = this.wildcardOptions;
            if (!includeContainers)
                list = list.filter(function (wo) { return !wo.isContainer; });
            if (!includeProjections)
                list = list.filter(function (wo) { return wo.instance === undefined; });
            return list.map(function (wo) { return wo.getPath(); });
        };
        CounterQuerySet.prototype.getUrlParameter = function () {
            if (this.isEmpty())
                return "";
            var url;
            for (var i = 0; i < this.counterQueries.length; i++) {
                var cq = this.counterQueries[i];
                if (i == 0)
                    url = "counter=" + cq.path();
                else
                    url += "&counter=" + cq.path();
            }
            return url;
        };
        CounterQuerySet.prototype._counterQuerySetChanged = function () {
            var wfiltersChanged = this._processWildcards();
            this.emit("counterQuerySetChanged", {});
            if (wfiltersChanged) {
                this.emit("wildcardOptionsChanged", {});
                this._notifyFiltersUpdated();
            }
        };
        CounterQuerySet.prototype.setWildcardOptions = function (wildcardOptions) {
            for (var i = this.wildcardOptions.length - 1; i >= 0; i--) {
                this._removeWildcardOptions(i);
            }
            for (var i = 0; i < wildcardOptions.length; i++) {
                this._addWildcardOptions(wildcardOptions[i]);
            }
            this._processWildcards();
        };
        CounterQuerySet.prototype._addWildcardOptions = function (wo) {
            var _this = this;
            this.wildcardOptions.push(wo);
            wo.__cqh = wo.on("filtersChanged", function () { return _this._notifyFiltersUpdated(); });
        };
        CounterQuerySet.prototype._removeWildcardOptions = function (index) {
            this.wildcardOptions[index].__cqh.remove();
            this.wildcardOptions.splice(index, 1);
        };
        CounterQuerySet.prototype._notifyFiltersUpdated = function () {
            this.emit("wildcardFiltersUpdated", {});
        };
        CounterQuerySet.prototype._processWildcards = function () {
            var wildcards = computeWildcards(this.counterQueries);
            this.rawWildcards = wildcards;
            if (wildcards == null || wildcards === undefined) {
                if (this.wildcardOptions.length != 0) {
                    this.wildcardOptions = [];
                    return true;
                }
                return false;
            }
            else {
                var wsets = [];
                for (var i = 0; i < wildcards.length; i++) {
                    var w = wildcards[i];
                    if (w == "ELEMENT" || w == "PR_REQUIREMENT" || w == "PR_SUPP_REQUIREMENT" || w == "PR_TARGET") {
                        wsets.push(wildcards.slice(0, i + 1));
                    }
                    else {
                        wsets.push([wildcards[i]]);
                    }
                }
                var changed = false;
                for (var i = this.wildcardOptions.length - 1; i >= 0; i--) {
                    if (!setExists(this.wildcardOptions[i].wildcards, wsets)) {
                        this._removeWildcardOptions(i);
                        changed = true;
                    }
                }
                for (var _i = 0, wsets_2 = wsets; _i < wsets_2.length; _i++) {
                    var ws = wsets_2[_i];
                    var option = this.getWildcardOptions(ws);
                    if (!option) {
                        this._addWildcardOptions(new WildcardOptions(ws));
                        changed = true;
                    }
                }
                for (var _a = 0, _b = this.wildcardOptions; _a < _b.length; _a++) {
                    var wo = _b[_a];
                    wo.reset();
                }
                for (var _c = 0, _d = this.wildcardOptions; _c < _d.length; _c++) {
                    var wo = _d[_c];
                    var prefix = wo.getParentSegment();
                    if (prefix) {
                        var parent_1 = this.getWildcardOptions(wo.getParentSegment());
                        parent_1.isContainer = true;
                    }
                }
                for (var w in this.instances) {
                    for (var _e = 0, _f = this.wildcardOptions; _e < _f.length; _e++) {
                        var wo = _f[_e];
                        if (w == wo.getLastSegment()) {
                            wo.instance = this.instances[w];
                        }
                    }
                }
                return changed;
            }
        };
        CounterQuerySet.prototype.isCrossWildcard = function () {
            if (this.wildcardOptions.length != 2)
                return false;
            return this.wildcardOptions.every(function (wo) { return wo.wildcards.length == 1; });
        };
        CounterQuerySet.prototype.getWildcardOptions = function (wildcardSet) {
            for (var _i = 0, _a = this.wildcardOptions; _i < _a.length; _i++) {
                var wf = _a[_i];
                if (CounterQuery.isEqualWildcards(wf.wildcards, wildcardSet)) {
                    return wf;
                }
            }
            return null;
        };
        CounterQuerySet.prototype.getFilterAsJson = function () {
            var options = [];
            for (var _i = 0, _a = this.wildcardOptions; _i < _a.length; _i++) {
                var wo = _a[_i];
                var json = wo.toJson();
                if (json)
                    options.push(json);
            }
            if (options.length == 0 && !this.instances)
                return null;
            var ret = {
                type: "QueryOptions"
            };
            if (this.instances)
                ret.instances = this.instances;
            if (options.length > 0)
                ret.wildcardOptions = options;
            return ret;
        };
        CounterQuerySet.loadFromView = function (viewNode) {
            var counterQueries = [];
            viewNode.children("counterQueries").each(function (idx) {
                $(this).children("QueryInfo").each(function (i) {
                    var cqs = CounterQuery.loadFromView($(this));
                    for (var _i = 0, cqs_1 = cqs; _i < cqs_1.length; _i++) {
                        var cq = cqs_1[_i];
                        counterQueries.push(cq);
                    }
                });
            });
            var wildcardOptions = [];
            viewNode.find("wildcardOptions").each(function (idx) {
                $(this).children("WildcardOptions").each(function (i) {
                    wildcardOptions.push(WildcardOptions.loadFromView($(this)));
                });
            });
            return new CounterQuerySet(counterQueries, wildcardOptions);
        };
        return CounterQuerySet;
    }(Evented));
    return CounterQuerySet;
});
