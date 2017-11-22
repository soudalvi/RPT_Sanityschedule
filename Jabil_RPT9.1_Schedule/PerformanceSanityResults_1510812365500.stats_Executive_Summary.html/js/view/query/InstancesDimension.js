var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/util/Dimension", "view/query/queryUtil"], function (require, exports, Dimension_1, qu) {
    "use strict";
    function short(str) {
        var length = 200;
        if (str.length < length)
            return str;
        return str.substring(0, length);
    }
    function instanceDisplay(segments) {
        return short(segments.join(" - "));
    }
    var AbstractInstancesDimension = (function (_super) {
        __extends(AbstractInstancesDimension, _super);
        function AbstractInstancesDimension() {
            _super.call(this);
            this.instances = [];
        }
        AbstractInstancesDimension.prototype.name = function () {
            return "Instances";
        };
        AbstractInstancesDimension.prototype.size = function () {
            return this.instances.length;
        };
        AbstractInstancesDimension.prototype.items = function () {
            return this.instances;
        };
        AbstractInstancesDimension.prototype.clear = function () {
            this.instances = [];
        };
        return AbstractInstancesDimension;
    }(Dimension_1.Dimension));
    var InstancesDimension = (function (_super) {
        __extends(InstancesDimension, _super);
        function InstancesDimension() {
            _super.apply(this, arguments);
        }
        InstancesDimension.prototype.key = function () {
            return function (instance) {
                return instance.join("/");
            };
        };
        InstancesDimension.prototype.label = function (item, index) {
            return instanceDisplay(item);
        };
        InstancesDimension.prototype.feedValues = function (instances, update) {
            var size = instances.length;
            function instanceDefined(qname) {
                for (var _i = 0, instances_1 = instances; _i < instances_1.length; _i++) {
                    var inst = instances_1[_i];
                    if (qu.arrayEquals(inst.name, qname))
                        return true;
                }
                return false;
            }
            var instancesChanged = false;
            if (update.instanceRemoved) {
                for (var i = this.instances.length - 1; i >= 0; i--) {
                    if (!instanceDefined(this.instances[i])) {
                        this.instances.splice(i, 1);
                        update.instanceRemoved(i);
                        instancesChanged = true;
                    }
                }
            }
            for (var i = 0; i < size; i++) {
                var instance = instances[i];
                var index = qu.arrayIndexOf(this.instances, instance.name);
                if (index == -1) {
                    instancesChanged = true;
                    var index_1 = this.instances.length;
                    this.instances.push(instance.name);
                    update.instanceAdded(instance, index_1);
                }
                else {
                    update.instanceModified(index, instance);
                }
            }
            return instancesChanged;
        };
        return InstancesDimension;
    }(AbstractInstancesDimension));
    exports.InstancesDimension = InstancesDimension;
    var FlatInstancesDimension = (function (_super) {
        __extends(FlatInstancesDimension, _super);
        function FlatInstancesDimension() {
            _super.apply(this, arguments);
        }
        FlatInstancesDimension.prototype.key = function () {
            return function (instance) {
                return instance;
            };
        };
        FlatInstancesDimension.prototype.label = function (item, index) {
            return short(item);
        };
        FlatInstancesDimension.prototype.feedValues = function (instances, update) {
            var size = instances.length;
            function instanceDefined(name) {
                for (var _i = 0, instances_2 = instances; _i < instances_2.length; _i++) {
                    var inst = instances_2[_i];
                    if (inst.name == name)
                        return true;
                }
                return false;
            }
            var instancesChanged = false;
            if (update.instanceRemoved) {
                for (var i = this.instances.length - 1; i >= 0; i--) {
                    if (!instanceDefined(this.instances[i])) {
                        this.instances.splice(i, 1);
                        update.instanceRemoved(i);
                        instancesChanged = true;
                    }
                }
            }
            for (var i = 0; i < size; i++) {
                var instance = instances[i];
                var index = this.instances.indexOf(instance.name);
                if (index == -1) {
                    instancesChanged = true;
                    var index_2 = this.instances.length;
                    this.instances.push(instance.name);
                    update.instanceAdded(instance, index_2);
                }
                else {
                    update.instanceModified(index, instance);
                }
            }
            return instancesChanged;
        };
        FlatInstancesDimension.prototype.feedTwoLevelValues = function (instances, nestedDimension, update) {
            var overallChange = [false, false];
            function feedSubValues(instance0Index, folderInstance) {
                var changed = nestedDimension.feedValues(folderInstance.groups[0].instances, {
                    instanceAdded: function (instance, instanceIndex) {
                        update.instanceAdded(1, instance, instanceIndex);
                        update.valueModified([instance0Index, instanceIndex], instance);
                    },
                    instanceModified: function (instanceIndex, instance) {
                        update.valueModified([instance0Index, instanceIndex], instance);
                    }
                });
                if (changed)
                    overallChange[1] = true;
            }
            overallChange[0] = this.feedValues(instances, {
                instanceRemoved: function (instanceIndex) {
                    update.instanceRemoved(0, instanceIndex);
                },
                instanceAdded: function (instance, instanceIndex) {
                    update.instanceAdded(0, instance, instanceIndex);
                    feedSubValues(instanceIndex, instance);
                },
                instanceModified: function (instanceIndex, instance) {
                    feedSubValues(instanceIndex, instance);
                }
            });
            return overallChange;
        };
        return FlatInstancesDimension;
    }(AbstractInstancesDimension));
    exports.FlatInstancesDimension = FlatInstancesDimension;
});
