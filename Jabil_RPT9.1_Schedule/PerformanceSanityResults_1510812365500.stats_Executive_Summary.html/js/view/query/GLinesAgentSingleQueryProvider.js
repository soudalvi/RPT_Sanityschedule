var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/AgentsDimension", "view/query/GLinesAbstractSingleQueryProvider", "view/query/queryUtil"], function (require, exports, AgentsDimension_1, GLinesAbstractSingleQueryProvider_1, qu) {
    "use strict";
    function valuesValue(values, index) {
        return values[index].y;
    }
    ;
    var AgentSingleData = (function (_super) {
        __extends(AgentSingleData, _super);
        function AgentSingleData(queriesCount) {
            _super.call(this, queriesCount);
            this.dims = [0, 1];
            this.countersDimIndex = 0;
        }
        AgentSingleData.prototype.extractPoints = function (values, groupIndex, interval, timeDomain) {
            var ret = new Array(this.queriesCount);
            if (this.queriesCount == 0 || values.length == 0)
                return ret;
            var agentCount = values[0][0].length;
            var bindex = groupIndex * this.queriesCount;
            var _loop_1 = function(i) {
                var vindex = bindex + i;
                var agents = [];
                var _loop_2 = function(j) {
                    agents[j] = qu.toCoordinates(values.map(function (x) { return x[vindex][j]; }), interval, timeDomain);
                };
                for (var j = 0; j < agentCount; j++) {
                    _loop_2(j);
                }
                ret[i] = agents;
            };
            for (var i = 0; i < this.queriesCount; i++) {
                _loop_1(i);
            }
            return ret;
        };
        AgentSingleData.prototype.concatPoints = function (points, added) {
            qu.concatDeepCoordinates(points, added, 2);
        };
        return AgentSingleData;
    }(GLinesAbstractSingleQueryProvider_1.GLinesSingleData));
    var GLinesAgentSingleQueryProvider = (function (_super) {
        __extends(GLinesAgentSingleQueryProvider, _super);
        function GLinesAgentSingleQueryProvider(counterQuerySet, options) {
            _super.call(this, counterQuerySet, options, new AgentSingleData(counterQuerySet.counterQueries.length));
            this.countersDimIndex = 0;
            this.dimensions = [
                this.createCountersDimension(),
                new AgentsDimension_1.AgentsDimension(this, 1)
            ];
        }
        GLinesAgentSingleQueryProvider.prototype.getRequestUrl = function (timeDomain, interval) {
            var url = _super.prototype.getRequestUrl.call(this, timeDomain, interval);
            url += this.dimensions[1].getUrlParameters();
            return url;
        };
        GLinesAgentSingleQueryProvider.prototype.createData = function () {
            return new AgentSingleData(this.counterQueries.length);
        };
        return GLinesAgentSingleQueryProvider;
    }(GLinesAbstractSingleQueryProvider_1.GLinesAbstractSingleQueryProvider));
    exports.GLinesAgentSingleQueryProvider = GLinesAgentSingleQueryProvider;
});
