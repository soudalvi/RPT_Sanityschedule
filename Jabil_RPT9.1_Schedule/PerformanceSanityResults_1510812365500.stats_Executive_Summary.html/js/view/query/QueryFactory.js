var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/GLastSingleQueryProvider", "view/query/GLastWildcardQueryProvider", "view/query/GLastDoubleWildcardQueryProvider", "view/query/GRangeSingleQueryProvider", "view/query/GRangeWildcardQueryProvider", "view/query/GRangeDoubleWildcardQueryProvider", "view/query/GAgentSingleQueryProvider", "view/query/GAgentWildcardQueryProvider", "view/query/GAgentDoubleWildcardQueryProvider", "view/query/GCompareLastSingleQueryProvider", "view/query/GCompareLastWildcardQueryProvider", "view/query/GLinesSingleQueryProvider", "view/query/GLinesWildcardQueryProvider", "view/query/GLinesAgentSingleQueryProvider", "view/query/GLinesAgentWildcardQueryProvider", "view/query/GLinesCompareSingleQueryProvider", "view/query/GLinesCompareWildcardQueryProvider", "view/GBars", "view/GPie", "view/GTable", "view/GLines", "view/util/DimensionUtil", "view/util/SeriesOptions", "jrptlib/Properties!APPMSG"], function (require, exports, GLastSingleQueryProvider_1, GLastWildcardQueryProvider_1, GLastDoubleWildcardQueryProvider_1, GRangeSingleQueryProvider_1, GRangeWildcardQueryProvider_1, GRangeDoubleWildcardQueryProvider_1, GAgentSingleQueryProvider_1, GAgentWildcardQueryProvider_1, GAgentDoubleWildcardQueryProvider_1, GCompareLastSingleQueryProvider_1, GCompareLastWildcardQueryProvider_1, GLinesSingleQueryProvider_1, GLinesWildcardQueryProvider_1, GLinesAgentSingleQueryProvider_1, GLinesAgentWildcardQueryProvider_1, GLinesCompareSingleQueryProvider_1, GLinesCompareWildcardQueryProvider_1, GBars_1, GPie_1, GTable_1, GLines_1, du, SeriesOptions_1, APPMSG) {
    "use strict";
    function allSessions(session) {
        var sessions = [];
        sessions.push(session);
        sessions = sessions.concat(session.getSelectedSessions());
        return sessions;
    }
    function singularDim(name, lines, counterProvider) {
        switch (name) {
            case "counter": return APPMSG.DimCounter;
            case "compare": return lines ? APPMSG.DimLineCompare : APPMSG.DimCompare;
            default: {
                var wildcardDesc = counterProvider.resolveWildcard(name.split("/"));
                return wildcardDesc ? wildcardDesc.label : name;
            }
        }
    }
    function pluralDim(name, lines, counterProvider) {
        switch (name) {
            case "counter": return APPMSG.DimCounters;
            case "compare": return lines ? APPMSG.DimLineCompares : APPMSG.DimCompares;
            default: {
                var wildcardDesc = counterProvider.resolveWildcard(name.split("/"));
                return wildcardDesc ? wildcardDesc.pluralLabel : name;
            }
        }
    }
    function getTranslateDim(kind) {
        switch (kind) {
            case LabelKind.SINGULAR: return singularDim;
            case LabelKind.PLURAL: return pluralDim;
            default: throw kind;
        }
    }
    (function (LabelKind) {
        LabelKind[LabelKind["SINGULAR"] = 0] = "SINGULAR";
        LabelKind[LabelKind["PLURAL"] = 1] = "PLURAL";
    })(exports.LabelKind || (exports.LabelKind = {}));
    var LabelKind = exports.LabelKind;
    var QueryFactory = (function () {
        function QueryFactory(cqSet) {
            if (cqSet.isEmpty())
                throw APPMSG.EmptyView;
        }
        QueryFactory.prototype.dispose = function () {
            if (this.queryProvider) {
                this.queryProvider.setOff();
                this.queryProvider.dispose();
            }
        };
        QueryFactory.prototype.getQueryProvider = function () {
            return this.queryProvider;
        };
        QueryFactory.prototype.getViewProvider = function () {
            if (this.viewProvider)
                return this.viewProvider;
            return this.queryProvider;
        };
        QueryFactory.prototype.getAcceptableDimensions = function (counterProvider, labelKind) {
            var _this = this;
            var translate = getTranslateDim(labelKind);
            return this.acceptableDimIds.map(function (id) {
                return {
                    value: id,
                    label: translate(id, _this instanceof LineQueryFactory, counterProvider)
                };
            });
        };
        QueryFactory.prototype.getSeriesOptions = function (options) {
            var ret = new SeriesOptions_1.SeriesOptions(this.getSeries());
            ret.applyOptions(options, this.dimIds, this.acceptableDimIds);
            return ret;
        };
        return QueryFactory;
    }());
    exports.QueryFactory = QueryFactory;
    var MatrixQueryFactory = (function (_super) {
        __extends(MatrixQueryFactory, _super);
        function MatrixQueryFactory(cqSet, session, viewKind) {
            _super.call(this, cqSet);
            var wildcards = cqSet.getWildcards();
            var timeRanges = session.getSelectedTimeRanges();
            var sessionSet = session.getSelectedSessions();
            var multiCounters = cqSet.count() > 1;
            if (wildcards === null) {
                throw APPMSG.InvalidCounters;
            }
            else if (wildcards.length == 0) {
                this.acceptableDimIds = ["counter", "compare"].concat(cqSet.getWildcards(true));
                this.options = {
                    bars: function (options) {
                        options.set("primary", "counter", false);
                        options.set("secondary", "compare", true);
                    },
                    pie: function (options) {
                        options.set("arc", "counter", multiCounters);
                        options.set("donut", "compare", true);
                    },
                    table: function (options) {
                        options.set("row", "counter", false);
                        options.set("column", "compare", false);
                    }
                };
                if (timeRanges.length != 1) {
                    this.queryProvider = new GRangeSingleQueryProvider_1.GRangeSingleQueryProvider(cqSet);
                    this.dimIds = ["counter", "compare"];
                }
                else {
                    var bounds = session.getTimeRangeSampleBounds(timeRanges[0]);
                    if (session.hostsRoot.isCompare()) {
                        this.queryProvider = new GAgentSingleQueryProvider_1.GAgentSingleQueryProvider(cqSet, bounds);
                        this.dimIds = ["counter", "compare"];
                    }
                    else if (sessionSet.length > 0) {
                        this.queryProvider = new GCompareLastSingleQueryProvider_1.GCompareLastSingleQueryProvider(cqSet, allSessions(session), bounds);
                        this.dimIds = ["counter", "compare"];
                    }
                    else {
                        this.queryProvider = new GLastSingleQueryProvider_1.GLastSingleQueryProvider(cqSet, bounds);
                        this.dimIds = ["counter"];
                    }
                }
            }
            else if (cqSet.isCrossWildcard()) {
                this.acceptableDimIds = cqSet.getWildcards(true);
                if (multiCounters) {
                    this.acceptableDimIds.push("counter");
                    this.options = {
                        bars: function (options) {
                            options.set("primary", wildcards[0], false);
                            options.set("secondary", "counter", true);
                            options.set("stack", wildcards[1], true);
                        },
                        pie: function (options) {
                        },
                        table: function (options) {
                            options.set("row", wildcards[0], false);
                            options.set("column", wildcards[1], false);
                            options.set("rowGroup", "counter", true);
                        }
                    };
                }
                else {
                    if (viewKind != 2)
                        this.acceptableDimIds.push("compare");
                    this.options = {
                        bars: function (options) {
                            options.set("primary", wildcards[0], false);
                            options.set("secondary", wildcards[1], true);
                            options.set("stack", "compare", true);
                        },
                        pie: function (options) {
                            options.set("arc", wildcards[0], true);
                            options.set("donut", wildcards[1], true);
                        },
                        table: function (options) {
                            options.set("row", wildcards[0], false);
                            options.set("column", "compare", false);
                            options.set("rowGroup", wildcards[1], false);
                        }
                    };
                }
                if (timeRanges.length != 1) {
                    if (multiCounters) {
                        throw APPMSG.TooMuchDimensions;
                    }
                    else {
                        if (viewKind == 2) {
                            throw APPMSG.TooMuchDimensions;
                        }
                        else {
                            this.queryProvider = new GRangeDoubleWildcardQueryProvider_1.GRangeDoubleWildcardQueryProvider(cqSet);
                            this.viewProvider = du.reduce(this.queryProvider, 1);
                            this.dimIds = [wildcards[0], wildcards[1], "compare"];
                        }
                    }
                }
                else {
                    var bounds = session.getTimeRangeSampleBounds(timeRanges[0]);
                    if (session.hostsRoot.isCompare()) {
                        if (multiCounters) {
                            throw APPMSG.TooMuchDimensions;
                        }
                        else {
                            if (viewKind == 2) {
                                throw APPMSG.TooMuchDimensions;
                            }
                            else {
                                this.queryProvider = new GAgentDoubleWildcardQueryProvider_1.GAgentDoubleWildcardQueryProvider(cqSet);
                                this.viewProvider = du.reduce(this.queryProvider, 1);
                                this.dimIds = [wildcards[0], wildcards[1], "compare"];
                            }
                        }
                    }
                    else if (sessionSet.length > 0) {
                        throw APPMSG.TooMuchDimensions;
                    }
                    else {
                        if (multiCounters) {
                            if (viewKind == 2) {
                                throw APPMSG.TooMuchDimensions;
                            }
                            else {
                                this.queryProvider = new GLastDoubleWildcardQueryProvider_1.GLastDoubleWildcardQueryProvider(cqSet, bounds);
                                this.dimIds = [wildcards[0], wildcards[1], "counter"];
                            }
                        }
                        else {
                            this.queryProvider = new GLastDoubleWildcardQueryProvider_1.GLastDoubleWildcardQueryProvider(cqSet, bounds);
                            this.viewProvider = du.reduce(this.queryProvider, 1);
                            this.dimIds = [wildcards[0], wildcards[1]];
                        }
                    }
                }
            }
            else if (wildcards.length >= 1) {
                this.acceptableDimIds = cqSet.getWildcards(true);
                if (multiCounters) {
                    if (viewKind != 2)
                        this.acceptableDimIds.push("compare");
                    this.acceptableDimIds.push("counter");
                    this.options = {
                        bars: function (options) {
                            options.set("primary", wildcards[0], false);
                            options.set("secondary", "counter", true);
                            options.set("stack", "compare", true);
                        },
                        pie: function (options) {
                            options.set("arc", wildcards[0], true);
                            options.set("donut", "counter", true);
                        },
                        table: function (options) {
                            options.set("row", wildcards[0], false);
                            options.set("column", "compare", false);
                            options.set("rowGroup", "counter", true);
                        }
                    };
                }
                else {
                    this.acceptableDimIds.push("compare");
                    this.options = {
                        bars: function (options) {
                            options.set("primary", wildcards[0], false);
                            options.set("secondary", "compare", true);
                        },
                        pie: function (options) {
                            options.set("arc", wildcards[0], true);
                            options.set("donut", "compare", true);
                        },
                        table: function (options) {
                            options.set("row", wildcards[0], false);
                            options.set("column", "compare", false);
                        }
                    };
                }
                if (timeRanges.length != 1) {
                    if (multiCounters) {
                        if (viewKind == 2) {
                            throw APPMSG.TooMuchDimensions;
                        }
                        else {
                            this.queryProvider = new GRangeWildcardQueryProvider_1.GRangeWildcardQueryProvider(cqSet);
                            this.dimIds = [wildcards[0], "compare", "counter"];
                        }
                    }
                    else {
                        this.queryProvider = new GRangeWildcardQueryProvider_1.GRangeWildcardQueryProvider(cqSet);
                        this.viewProvider = du.reduce(this.queryProvider, 1);
                        this.dimIds = [wildcards[0], "compare"];
                    }
                }
                else {
                    var bounds = session.getTimeRangeSampleBounds(timeRanges[0]);
                    if (session.hostsRoot.isCompare()) {
                        if (multiCounters) {
                            if (viewKind == 2) {
                                throw APPMSG.TooMuchDimensions;
                            }
                            else {
                                this.queryProvider = new GAgentWildcardQueryProvider_1.GAgentWildcardQueryProvider(cqSet, bounds);
                                this.dimIds = [wildcards[0], "compare", "counter"];
                            }
                        }
                        else {
                            this.queryProvider = new GAgentWildcardQueryProvider_1.GAgentWildcardQueryProvider(cqSet, bounds);
                            this.viewProvider = du.reduce(this.queryProvider, 1);
                            this.dimIds = [wildcards[0], "compare"];
                        }
                    }
                    else if (sessionSet.length > 0) {
                        if (multiCounters) {
                            if (viewKind == 2) {
                                throw APPMSG.TooMuchDimensions;
                            }
                            else {
                                this.queryProvider = new GCompareLastWildcardQueryProvider_1.GCompareLastWildcardQueryProvider(cqSet, allSessions(session), bounds);
                                this.dimIds = [wildcards[0], "compare", "counter"];
                            }
                        }
                        else {
                            this.queryProvider = new GCompareLastWildcardQueryProvider_1.GCompareLastWildcardQueryProvider(cqSet, allSessions(session), bounds);
                            this.viewProvider = du.reduce(this.queryProvider, 1);
                            this.dimIds = [wildcards[0], "compare"];
                        }
                    }
                    else {
                        this.queryProvider = new GLastWildcardQueryProvider_1.GLastWildcardQueryProvider(cqSet, bounds);
                        if (multiCounters) {
                            this.dimIds = [wildcards[0], "counter"];
                        }
                        else {
                            this.viewProvider = du.reduce(this.queryProvider, 1);
                            this.dimIds = [wildcards[0]];
                        }
                    }
                }
            }
            else {
                throw APPMSG.TooMuchWildcards;
            }
            if (this.queryProvider) {
                this.queryProvider.setSession(session);
                this.queryProvider.setOn();
            }
        }
        MatrixQueryFactory.prototype.scalePer = function (dimId) {
            if (!dimId)
                return;
            var dimIndex = this.dimIds.indexOf(dimId);
            if (dimIndex == -1) {
                if (this.acceptableDimIds.indexOf(dimId) == -1)
                    throw "Dimension " + dimId + " not defined";
                return;
            }
            this.viewProvider = du.splitUnit(this.getViewProvider(), dimIndex);
        };
        return MatrixQueryFactory;
    }(QueryFactory));
    exports.MatrixQueryFactory = MatrixQueryFactory;
    var BarsQueryFactory = (function (_super) {
        __extends(BarsQueryFactory, _super);
        function BarsQueryFactory(cqSet, session) {
            _super.call(this, cqSet, session, 1);
        }
        BarsQueryFactory.prototype.getSeries = function () {
            return GBars_1.BarSeries;
        };
        BarsQueryFactory.prototype.getDefaultOptions = function () {
            var options = new SeriesOptions_1.SeriesOptionsModel();
            this.options.bars(options);
            return options;
        };
        return BarsQueryFactory;
    }(MatrixQueryFactory));
    exports.BarsQueryFactory = BarsQueryFactory;
    var PieQueryFactory = (function (_super) {
        __extends(PieQueryFactory, _super);
        function PieQueryFactory(cqSet, session) {
            _super.call(this, cqSet, session, 2);
        }
        PieQueryFactory.prototype.getSeries = function () {
            return GPie_1.PieSeries;
        };
        PieQueryFactory.prototype.getDefaultOptions = function () {
            var options = new SeriesOptions_1.SeriesOptionsModel();
            this.options.pie(options);
            return options;
        };
        return PieQueryFactory;
    }(MatrixQueryFactory));
    exports.PieQueryFactory = PieQueryFactory;
    var TableQueryFactory = (function (_super) {
        __extends(TableQueryFactory, _super);
        function TableQueryFactory(cqSet, session) {
            _super.call(this, cqSet, session, 0);
        }
        TableQueryFactory.prototype.getSeries = function () {
            return GTable_1.TableSeries;
        };
        TableQueryFactory.prototype.getDefaultOptions = function () {
            var options = new SeriesOptions_1.SeriesOptionsModel();
            this.options.table(options);
            return options;
        };
        return TableQueryFactory;
    }(MatrixQueryFactory));
    exports.TableQueryFactory = TableQueryFactory;
    var LineQueryFactory = (function (_super) {
        __extends(LineQueryFactory, _super);
        function LineQueryFactory(cqSet, session, options) {
            _super.call(this, cqSet);
            var wildcards = cqSet.getWildcards();
            var timeRanges = session.getSelectedTimeRanges();
            var sessionSet = session.getSelectedSessions();
            var multiCounters = cqSet.count() > 1;
            if (wildcards === null) {
                throw APPMSG.InvalidCounters;
            }
            else if (wildcards.length == 0) {
                this.acceptableDimIds = ["counter", "compare"].concat(cqSet.getWildcards(true));
                if (multiCounters) {
                    this.options = {
                        lines: function (options) {
                            options.set("primary", "counter", true);
                            options.set("secondary", "compare", true);
                        }
                    };
                }
                else {
                    this.options = {
                        lines: function (options) {
                            options.set("primary", "compare", true);
                            options.set("secondary", "counter", false);
                        }
                    };
                }
                if (session.hostsRoot.isCompare()) {
                    this.queryProvider = new GLinesAgentSingleQueryProvider_1.GLinesAgentSingleQueryProvider(cqSet, options);
                    this.dimIds = ["counter", "compare"];
                }
                else if (sessionSet.length > 0) {
                    this.queryProvider = new GLinesCompareSingleQueryProvider_1.GLinesCompareSingleQueryProvider(cqSet, allSessions(session), options);
                    this.dimIds = ["counter", "compare"];
                }
                else {
                    this.queryProvider = new GLinesSingleQueryProvider_1.GLinesSingleQueryProvider(cqSet, options);
                    this.dimIds = ["counter"];
                }
            }
            else if (cqSet.isCrossWildcard()) {
                throw APPMSG.TooMuchDimensions;
            }
            else {
                this.acceptableDimIds = cqSet.getWildcards(true);
                if (multiCounters) {
                    this.acceptableDimIds.push("counter");
                    this.options = {
                        lines: function (options) {
                            options.set("primary", wildcards[0], true);
                            options.set("secondary", "counter", true);
                        }
                    };
                }
                else {
                    this.acceptableDimIds.push("compare");
                    this.options = {
                        lines: function (options) {
                            options.set("primary", wildcards[0], true);
                            options.set("secondary", "compare", true);
                        }
                    };
                }
                if (session.hostsRoot.isCompare()) {
                    if (multiCounters) {
                        throw APPMSG.TooMuchWildcardsComp;
                    }
                    else {
                        this.queryProvider = new GLinesAgentWildcardQueryProvider_1.GLinesAgentWildcardQueryProvider(cqSet, options);
                        this.viewProvider = du.reduceLine(this.queryProvider, 1);
                        this.dimIds = [wildcards[0], "compare"];
                    }
                }
                else if (sessionSet.length > 0) {
                    if (multiCounters) {
                        throw APPMSG.TooMuchWildcardsComp;
                    }
                    else {
                        this.queryProvider = new GLinesCompareWildcardQueryProvider_1.GLinesCompareWildcardQueryProvider(cqSet, allSessions(session), options);
                        this.dimIds = [wildcards[0], "compare"];
                    }
                }
                else {
                    this.queryProvider = new GLinesWildcardQueryProvider_1.GLinesWildcardQueryProvider(cqSet, options);
                    this.viewProvider = du.reduceLine(this.queryProvider, 1);
                    this.dimIds = [wildcards[0]];
                }
            }
            if (this.queryProvider) {
                this.queryProvider.setSession(session);
                this.queryProvider.setOn();
            }
        }
        LineQueryFactory.prototype.getDefaultOptions = function () {
            var options = new SeriesOptions_1.SeriesOptionsModel();
            this.options.lines(options);
            return options;
        };
        LineQueryFactory.prototype.getSeries = function () {
            return GLines_1.LineSeries;
        };
        LineQueryFactory.prototype.scalePer = function (dimId) {
            if (!dimId)
                return;
            var dimIndex = this.dimIds.indexOf(dimId);
            if (dimIndex == -1) {
                return;
            }
            this.viewProvider = du.splitUnitLine(this.getViewProvider(), dimIndex);
        };
        return LineQueryFactory;
    }(QueryFactory));
    exports.LineQueryFactory = LineQueryFactory;
});
