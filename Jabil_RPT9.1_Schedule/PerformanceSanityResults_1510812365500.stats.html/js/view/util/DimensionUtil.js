define(["require", "exports", "view/query/queryUtil", "view/util/GDimensionReducer", "view/util/GMatrixSwapper", "view/util/GConsolidatedUnitProvider", "view/util/UnitSplitter"], function (require, exports, qu, GDimensionReducer_1, GMatrixSwapper_1, GConsolidatedUnitProvider_1, spl) {
    "use strict";
    function isVariableProvider(object) {
        return 'getFixedProvider' in object;
    }
    function reduce(provider, fixedItems) {
        if (!(fixedItems instanceof Array)) {
            fixedItems = qu.sameElementArray(fixedItems, 0);
        }
        return new GDimensionReducer_1.GTabularDimensionReducer(provider, fixedItems);
    }
    exports.reduce = reduce;
    function reduceLine(provider, fixedItems) {
        if (!(fixedItems instanceof Array)) {
            fixedItems = qu.sameElementArray(fixedItems, 0);
        }
        if (isVariableProvider(provider))
            return new GDimensionReducer_1.GVariableLinesDimensionReducer(provider, fixedItems);
        return new GDimensionReducer_1.GLinesDimensionReducer(provider, fixedItems);
    }
    exports.reduceLine = reduceLine;
    function isTrivialSwap(newOrder) {
        for (var i = 0; i < newOrder.length; i++) {
            if (newOrder[i] != i)
                return false;
        }
        return true;
    }
    function swap(provider, newOrder) {
        if (isTrivialSwap(newOrder))
            return provider;
        return new GMatrixSwapper_1.GTabularSwapper(provider, newOrder);
    }
    exports.swap = swap;
    function swapLine(provider, newOrder) {
        if (isTrivialSwap(newOrder))
            return provider;
        if (isVariableProvider(provider))
            return new GMatrixSwapper_1.GVariableLinesSwapper(provider, newOrder);
        return new GMatrixSwapper_1.GLinesSwapper(provider, newOrder);
    }
    exports.swapLine = swapLine;
    function consolidateDimension(provider, dim) {
        return new GConsolidatedUnitProvider_1.GConsolidatedUnitProvider(provider, dim);
    }
    exports.consolidateDimension = consolidateDimension;
    function splitUnit(provider, splitDim) {
        return provider.variableUnit(splitDim) ?
            new spl.TabularDependentUnitSplitter(provider, splitDim) :
            new spl.TabularIndependentUnitSplitter(provider, splitDim);
    }
    exports.splitUnit = splitUnit;
    function splitUnitLine(provider, splitDim) {
        return isVariableProvider(provider) ?
            provider.variableUnit(splitDim) ?
                new spl.VariableLineDependentUnitSplitter(provider, splitDim) :
                new spl.VariableLineIndependentUnitSplitter(provider, splitDim) :
            provider.variableUnit(splitDim) ?
                new spl.LineDependentUnitSplitter(provider, splitDim) :
                new spl.LineIndependentUnitSplitter(provider, splitDim);
    }
    exports.splitUnitLine = splitUnitLine;
});
