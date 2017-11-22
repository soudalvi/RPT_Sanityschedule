var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/AgentsDimension", "view/query/GLinesAbstractWildcardQueryProvider", "view/query/queryUtil"], function (require, exports, AgentsDimension_1, GLinesAbstractWildcardQueryProvider_1, qu) {
    "use strict";
    ;
    var AgentWildcardData = (function (_super) {
        __extends(AgentWildcardData, _super);
        function AgentWildcardData(queriesCount) {
            _super.call(this, queriesCount);
            this.dims = [0, 2, 1];
            this.countersDimIndex = 2;
        }
        AgentWildcardData.prototype.extractPoints = function (instances, values, interval, timeDomain, instanceNames) {
            var ret = [];
            for (var _i = 0, instances_1 = instances; _i < instances_1.length; _i++) {
                var instance = instances_1[_i];
                var instanceIndex = qu.arrayIndexOf(instanceNames, instance.name);
                var vindex = instance.index * this.queriesCount;
                var instanceValues = [];
                var _loop_1 = function(i) {
                    var bindex = vindex + i;
                    var counterValues = values.map(function (v) { return v[bindex]; });
                    if (counterValues && counterValues.length > 0) {
                        var agents = [];
                        var count = counterValues[0].length;
                        var _loop_2 = function(j) {
                            agents[j] = qu.toCoordinates(counterValues.map(function (x) { return x[j]; }), interval, timeDomain);
                        };
                        for (var j = 0; j < count; j++) {
                            _loop_2(j);
                        }
                        instanceValues[i] = agents;
                    }
                };
                for (var i = 0; i < this.queriesCount; i++) {
                    _loop_1(i);
                }
                ret[instanceIndex] = instanceValues;
            }
            return ret;
        };
        AgentWildcardData.prototype.concatPoints = function (to, from) {
            qu.concatDeepCoordinates(to, from, 2);
        };
        return AgentWildcardData;
    }(GLinesAbstractWildcardQueryProvider_1.GLinesWildcardData));
    var GLinesAgentWildcardQueryProvider = (function (_super) {
        __extends(GLinesAgentWildcardQueryProvider, _super);
        function GLinesAgentWildcardQueryProvider(counterQuerySet, options) {
            _super.call(this, counterQuerySet, options, new AgentWildcardData(counterQuerySet.counterQueries.length));
            this.countersDimIndex = 2;
            this.instancesDimIndex = 0;
            this.dimensions = [
                this.instances,
                new AgentsDimension_1.AgentsDimension(this, 1),
                this.createCountersDimension()
            ];
        }
        GLinesAgentWildcardQueryProvider.prototype.getRequestUrl = function (timeDomain, interval) {
            var url = _super.prototype.getRequestUrl.call(this, timeDomain, interval);
            url += this.dimensions[1].getUrlParameters();
            return url;
        };
        GLinesAgentWildcardQueryProvider.prototype.createData = function () {
            return new AgentWildcardData(this.counterQueries.length);
        };
        return GLinesAgentWildcardQueryProvider;
    }(GLinesAbstractWildcardQueryProvider_1.GLinesAbstractWildcardQueryProvider));
    exports.GLinesAgentWildcardQueryProvider = GLinesAgentWildcardQueryProvider;
});
