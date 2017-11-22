var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/prov/GOrnamentProviders"], function (require, exports, GOrnamentProviders_1) {
    "use strict";
    function isColorProvider(provider) {
        return provider && 'color' in provider;
    }
    exports.isColorProvider = isColorProvider;
    function isStrokeProvider(provider) {
        return provider && 'stroke' in provider;
    }
    exports.isStrokeProvider = isStrokeProvider;
    function isShadeProvider(provider) {
        return provider && 'shade' in provider;
    }
    exports.isShadeProvider = isShadeProvider;
    function toColorProvider(provider, dimension, shadeable) {
        var dimProvider = provider.dimension(dimension);
        if (isColorProvider(dimProvider))
            return dimProvider;
        return shadeable ? new ShadeableColorProvider(provider, dimension) : new ColorProvider(provider, dimension);
    }
    exports.toColorProvider = toColorProvider;
    function toStrokeProvider(provider, dimension) {
        var dimProvider = provider.dimension(dimension);
        if (isStrokeProvider(dimProvider))
            return dimProvider;
        return new StrokeProvider();
    }
    exports.toStrokeProvider = toStrokeProvider;
    function toShadeProvider(provider, dimension) {
        var dimProvider = provider.dimension(dimension);
        if (isShadeProvider(dimProvider))
            return dimProvider;
        return new ShadeProvider(provider, dimension);
    }
    exports.toShadeProvider = toShadeProvider;
    function toToneProvider(provider, dimension1, dimension2) {
        var dim1 = provider.ornament(dimension1);
        var dim2 = provider.ornament(dimension2);
        if (isColorProvider(dim1)) {
            if (isShadeProvider(dim2)) {
                return new ToneCombiner1(dim1, dim2);
            }
            else {
                return new ToneAdapter(dim1);
            }
        }
        else if (isColorProvider(dim2)) {
            if (isShadeProvider(dim1)) {
                return new ToneCombiner2(dim2, dim1);
            }
            else {
                return new ToneAdapter2(dim2);
            }
        }
        return new ToneStub();
    }
    exports.toToneProvider = toToneProvider;
    var OrnamentProvider = (function () {
        function OrnamentProvider(provider, dimension) {
            var _this = this;
            this.provider = provider.dimension(dimension);
            provider.on("changed", function (event) {
                if (event.dimensionsChanged[dimension])
                    _this.update();
            });
            this.create();
            this.update();
        }
        return OrnamentProvider;
    }());
    var ColorProvider = (function (_super) {
        __extends(ColorProvider, _super);
        function ColorProvider(provider, dimension) {
            _super.call(this, provider, dimension);
        }
        ColorProvider.prototype.create = function () {
            this.colors = d3.scale.category20();
        };
        ColorProvider.prototype.update = function () {
            this.colors.domain(d3.range(this.provider.size()));
        };
        ColorProvider.prototype.color = function (index) {
            return this.colors(index);
        };
        return ColorProvider;
    }(OrnamentProvider));
    var ShadeableColorProvider = (function (_super) {
        __extends(ShadeableColorProvider, _super);
        function ShadeableColorProvider() {
            _super.apply(this, arguments);
        }
        ShadeableColorProvider.prototype.create = function () {
            this.colors = d3.scale.category10();
        };
        return ShadeableColorProvider;
    }(ColorProvider));
    var STROKES = [
        null,
        "6,2",
        "15,2",
        "15,2,4,2",
        "15,2,4,2,4,2",
        "40,2",
        "40,2,5,2",
        "40,2,5,2,5,2",
    ];
    var StrokeProvider = (function () {
        function StrokeProvider() {
        }
        StrokeProvider.prototype.stroke = function (index) {
            return STROKES[index % STROKES.length];
        };
        return StrokeProvider;
    }());
    var ShadeProvider = (function (_super) {
        __extends(ShadeProvider, _super);
        function ShadeProvider(provider, dimension) {
            _super.call(this, provider, dimension);
        }
        ShadeProvider.prototype.create = function () {
        };
        ShadeProvider.prototype.update = function () {
            this.size = this.provider.size();
        };
        ShadeProvider.prototype.shade = function (color, index) {
            var interpolator = d3.interpolateRgb(color, "#DDDDDD");
            return interpolator(index / this.size);
        };
        return ShadeProvider;
    }(OrnamentProvider));
    var ToneCombiner1 = (function () {
        function ToneCombiner1(colorProvider, shadeProvider) {
            this.colorProvider = colorProvider;
            this.shadeProvider = shadeProvider;
        }
        ToneCombiner1.prototype.color = function (index1, index2) {
            var color = this.colorProvider.color(index1);
            return this.shadeProvider.shade(color, index2);
        };
        return ToneCombiner1;
    }());
    var ToneCombiner2 = (function () {
        function ToneCombiner2(colorProvider, shadeProvider) {
            this.colorProvider = colorProvider;
            this.shadeProvider = shadeProvider;
        }
        ToneCombiner2.prototype.color = function (index1, index2) {
            var color = this.colorProvider.color(index2);
            return this.shadeProvider.shade(color, index1);
        };
        return ToneCombiner2;
    }());
    var ToneAdapter = (function () {
        function ToneAdapter(colorProvider) {
            this.colorProvider = colorProvider;
        }
        ToneAdapter.prototype.color = function (index1, index2) {
            return this.colorProvider.color(index1);
        };
        return ToneAdapter;
    }());
    var ToneAdapter2 = (function () {
        function ToneAdapter2(colorProvider) {
            this.colorProvider = colorProvider;
        }
        ToneAdapter2.prototype.color = function (index1, index2) {
            return this.colorProvider.color(index2);
        };
        return ToneAdapter2;
    }());
    var ToneProvider = (function () {
        function ToneProvider(provider, colorDimension, shadeDimension) {
            var _this = this;
            this.colorDim = provider.dimension(colorDimension);
            this.shadeDim = provider.dimension(shadeDimension);
            provider.on("changed", function (event) {
                if (event.dimensionsChanged[colorDimension] || event.dimensionsChanged[shadeDimension])
                    _this.update();
            });
            this.update();
        }
        ToneProvider.prototype.update = function () {
            this.colors = [];
            var colorSize = this.colorDim.size();
            var shadeSize = this.shadeDim.size();
            var colors = colorSize <= 10 ? d3.scale.category10() : d3.scale.category20();
            colors.domain(d3.range(colorSize));
            for (var i = 0; i < colorSize; i++) {
                var interpolator = d3.interpolateRgb(colors(i), "#EEEEEE");
                var shades = [];
                for (var j = 0; j < shadeSize; j++) {
                    shades[j] = interpolator(j / shadeSize);
                }
                this.colors[i] = shades;
            }
        };
        ToneProvider.prototype.color = function (colorIndex, shadeIndex) {
            return this.colors[colorIndex][shadeIndex];
        };
        return ToneProvider;
    }());
    var ToneStub = (function () {
        function ToneStub() {
            this._color = d3.scale.category10().domain(d3.range(1))(0);
        }
        ToneStub.prototype.color = function (colorIndex, shadeIndex) {
            return this._color;
        };
        return ToneStub;
    }());
    function createOrnament(kind, provider, dimension) {
        switch (kind) {
            case GOrnamentProviders_1.GOrnamentKind.COLOR: return new ColorProvider(provider, dimension);
            case GOrnamentProviders_1.GOrnamentKind.COLOR_SHADEABLE: return new ShadeableColorProvider(provider, dimension);
            case GOrnamentProviders_1.GOrnamentKind.STROKE: return new StrokeProvider();
            case GOrnamentProviders_1.GOrnamentKind.SHADE: return new ShadeProvider(provider, dimension);
            case null: return null;
            default: throw kind;
        }
    }
    var OrnamentMatrix = (function () {
        function OrnamentMatrix(provider, dimensionsKinds) {
            this.ornaments = [];
            for (var i = 0; i < provider.dimensionsCount(); i++) {
                this.ornaments[i] = createOrnament(dimensionsKinds[i], provider, i);
            }
        }
        OrnamentMatrix.prototype.ornament = function (dim) {
            return this.ornaments[dim];
        };
        return OrnamentMatrix;
    }());
    exports.OrnamentMatrix = OrnamentMatrix;
});
