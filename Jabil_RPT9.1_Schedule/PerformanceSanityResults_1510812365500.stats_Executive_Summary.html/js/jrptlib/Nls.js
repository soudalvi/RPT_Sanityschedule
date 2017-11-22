define(["require", "exports", "jrptlib/Url"], function (require, exports, Url) {
    "use strict";
    function removeDoubleSingleQuotes(text) {
        return text.replace(/\'\'/g, '\'');
    }
    function unicodeToChar(text) {
        return text.replace(/\\u[\dA-Fa-f]{4}/g, function (match) {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
    }
    function parseProperties(data) {
        var retMap = {
            T: function (key) {
                return key in this ? this[key] : key;
            }
        };
        var lines = data.split(/\r?\n/);
        var currentLine = '';
        $.each(lines, function (i, value) {
            if (!/^\s*(\#|\!|$)/.test(value)) {
                currentLine += value.trim();
                if (/(\\\\)*\\$/.test(currentLine)) {
                    currentLine = currentLine.replace(/\\$/, '');
                }
                else {
                    /^\s*((?:[^\s:=\\]|\\.)+)\s*[:=\s]\s*(.*)$/.test(currentLine);
                    var nkey = RegExp.$1;
                    var nvalue = RegExp.$2;
                    retMap[nkey] = unicodeToChar(removeDoubleSingleQuotes(nvalue));
                    currentLine = '';
                }
            }
        });
        return retMap;
    }
    exports.parseProperties = parseProperties;
    function loadMessages(object_name, callback) {
        var url = new Url(window.location.pathname).removeLastSegment();
        if (url.substr(-4) == "test")
            url = url.substr(0, url.length - 4);
        url = url + "/" + object_name + ".property";
        url = new Url(url).checkForOfflineMode();
        var nurl = new Url(url);
        nurl.get(null, function (data) {
            var map = parseProperties(data);
            callback(map);
        }, "text", function (jqXHR, textStatus, errorThrown) {
            console.log('Unable to retrieve localization resource : ' + this.url + " due to " + errorThrown);
            if (callback)
                callback();
        });
    }
    exports.loadMessages = loadMessages;
    function initializeMessages(object, object_name, callback) {
        var url = new Url(window.location.pathname).removeLastSegment();
        if (url.substr(-4) == "test")
            url = url.substr(0, url.length - 4);
        url = url + "/" + object_name + ".property";
        url = new Url(url).checkForOfflineMode();
        var nurl = new Url(url);
        nurl.get(null, function (data) {
            var myMap = parseProperties(data);
            for (var propertyName in object) {
                if (myMap[propertyName] != null) {
                    object[propertyName] = myMap[propertyName];
                }
                else {
                    object[propertyName] = "[Not localized " + propertyName + "]";
                }
            }
            if (callback)
                callback(object);
        }, "text", function (jqXHR, textStatus, errorThrown) {
            console.log('Unable to retrieve localization resource : ' + this.url + " due to " + errorThrown);
            if (callback)
                callback();
        });
    }
    exports.initializeMessages = initializeMessages;
    function bind(tr_string, args) {
        if (tr_string == undefined) {
            return "Error : undefined translated string";
        }
        var ret = tr_string;
        if (args instanceof Array) {
            for (var i = 0; i < args.length; i++) {
                ret = ret.replace("{" + i + "}", args[i]);
            }
        }
        else
            ret = ret.replace("{0}", args.toString());
        return ret;
    }
    exports.bind = bind;
    function loadJSON(file, callback) {
        var url = new Url(window.location.pathname).removeLastSegment();
        if (url.substr(-4) == "test")
            url = url.substr(0, url.length - 4);
        $.getJSON(url + "/" + file)
            .done(function (data) { return callback(data); })
            .fail(function () { return callback(); });
    }
    exports.loadJSON = loadJSON;
});
