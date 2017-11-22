var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented"], function (require, exports, Evented) {
    "use strict";
    var SearchSystem = (function (_super) {
        __extends(SearchSystem, _super);
        function SearchSystem() {
            _super.call(this);
            this.entries = {};
        }
        SearchSystem.prototype.add = function (key, entry) {
            entry.key = key;
            this.entries[key] = entry;
        };
        SearchSystem.prototype.remove = function (entry_key) {
            delete this.entries[entry_key];
        };
        SearchSystem.prototype.get = function (search_string) {
            var matcher = RegExp(this.replaceLatinsDiacritics(search_string), "i");
            var tmp = new Array();
            for (var key in this.entries) {
                if (matcher.test(this.replaceLatinsDiacritics(this.entries[key].label))) {
                    tmp.push(this.entries[key]);
                }
            }
            return tmp;
        };
        SearchSystem.prototype.clear = function () {
            this.entries = {};
        };
        SearchSystem.prototype.notifySelectedEntry = function (entry) {
            this.emit("selectionChanged", entry);
        };
        SearchSystem.prototype.replaceLatinsDiacritics = function (str) {
            var fr_table = [
                ['a', /[\u00AA\u00E0\u00E1\u00E2\u00E3\u00E4\u00E5]/g],
                ['A', /[\u00C0\u00C1\u00C2\u00C3\u00C4\u00C5]/g],
                ['ae', /[\u00E6]/g],
                ['Ae', /[\u00C6]/g],
                ['c', /[\u00E7]/g],
                ['C', /[\u00C7]/g],
                ['d', /[\u00F0]/g],
                ['D', /[\u00D0]/g],
                ['e', /[\u00E8\u00E9\u00EA\u00EB]/g],
                ['E', /[\u00C8\u00C9\u00CA\u00CB\u1EBA]/g],
                ['i', /[\u00EC\u00ED\u00EE\u00EF]/g],
                ['I', /[\u00CC\u00CD\u00CE\u00CF]/g],
                ['n', /[\u00F1]/g],
                ['N', /[\u00D1\u1E44]/g],
                ['o', /[\u00BA\u00F2\u00F3\u00F4\u00F5\u00F6\u00F8]/g],
                ['O', /[\u00D2\u00D3\u00D4\u00D5\u00D6\u00D8]/g],
                ['Oe', /[\u0152]/g],
                ['oe', /[\u0153]/g],
                ['ss', /[\u00DF]/g],
                ['T', /[\u1E6C]/g],
                ['Th', /[\u00DE]/g],
                ['th', /[\u00FE]/g],
                ['u', /[\u00F9\u00FA\u00FB\u00FC\u1EE7]/g],
                ['U', /[\u00D9\u00DA\u00DB\u00DC]/g],
                ['W', /[\u1E84]/g],
                ['X', /[\u1E8C]/g],
                ['y', /[\u00FD\u00FF]/g],
                ['Y', /[\u00DD\u0178]/g],
            ];
            var others_table = [
                ['A', /[\u0100\u0102\u0104\u01CD\u01FA\u0200\u0202\u023A\u1E00\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6]/g],
                ['a', /[\u0101\u0103\u0105\u01CE\u01FB\u0201\u0203\u1E01\u1E9A\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7]/g],
                ['Ae', /[\u01FC]/g],
                ['ae', /[\u01FD]/g],
                ['B', /[\u1E02\u1E04\u1E06]/g],
                ['b', /[\u1E03\u1E05\u1E07]/g],
                ['C', /[\u0106\u0108\u010A\u010C\u023B\u1E08]/g],
                ['c', /[\u0107\u0109\u010B\u010D\u023C\u1E09]/g],
                ['D', /[\u010E\u0110\u1E0A\u1E0C\u1E0E\u1E10\u1E12]/g],
                ['d', /[\u010F\u0111\u1E0B\u1E0D\u1E0F\u1E11\u1E13]/g],
                ['DZ', /[\u01C4\u01F1]/g],
                ['DZ', /[\u01C5\u01F2]/g],
                ['dz', /[\u01C6\u01F3]/g],
                ['E', /[\u0112\u0114\u0116\u0118\u011A\u0204\u0206\u0228\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6]/g],
                ['e', /[\u0113\u0115\u0117\u0119\u011B\u0205\u0207\u0229\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7]/g],
                ['f', /[\u0192\u1E1F]/g],
                ['F', /[\u1E1E]/g],
                ['G', /[\u011C\u011E\u0120\u0122\u01F4\u1E20]/g],
                ['g', /[\u011D\u011F\u0121\u0123\u01F5\u1E21]/g],
                ['H', /[\u0124\u0126\u1E22\u1E24\u1E26\u1E28\u1E2A]/g],
                ['h', /[\u0125\u0127\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E96]/g],
                ['I', /[\u0128\u012A\u012C\u012E\u0130\u01CF\u0208\u020A\u1E2C\u1E2E\u1EC8\u1ECA]/g],
                ['i', /[\u0129\u012B\u012D\u012F\u0131\u01D0\u0209\u020B\u1E2D\u1E2F\u1EC9\u1ECB]/g],
                ['IJ', /[\u0132]/g],
                ['ij', /[\u0133]/g],
                ['J', /[\u0134]/g],
                ['j', /[\u0135]/g],
                ['K', /[\u0136\u1E30\u1E32\u1E34]/g],
                ['k', /[\u0137\u1E31\u1E33\u1E35]/g],
                ['L', /[\u0139\u013B\u013D\u013F\u0141\u023D\u1E36\u1E38\u1E3A\u1E3C]/g],
                ['l', /[\u013A\u013C\u013E\u0140\u0142\u1E37\u1E39\u1E3B\u1E3D]/g],
                ['LJ', /[\u01C7]/g],
                ['Lj', /[\u01C8]/g],
                ['lj', /[\u01C9]/g],
                ['M', /[\u1E3E\u1E40\u1E42]/g],
                ['m', /[\u1E3F\u1E41\u1E43]/g],
                ['N', /[\u0143\u0145\u0147\u01F8\u1E44\u1E46\u1E48\u1E4A]/g],
                ['n', /[\u0144\u0146\u0148\u01F9\u1E45\u1E47\u1E49\u1E4B]/g],
                ['NJ', /[\u01CA]/g],
                ['Nj', /[\u01CB]/g],
                ['nj', /[\u01CC]/g],
                ['O', /[\u014C\u014E\u0150\u01A0\u01D1\u01FE\u020C\u020E\u022A\u022C\u022E\u0230\u1E4C\u1E4E\u1E50\u1E52\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2]/g],
                ['o', /[\u014D\u014F\u0151\u01A1\u01D2\u01FF\u020D\u020F\u022B\u022D\u022F\u0231\u1E4D\u1E4F\u1E51\u1E53\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3]/g],
                ['P', /[\u1E54\u1E56]/g],
                ['p', /[\u1E55\u1E57]/g],
                ['R', /[\u0154\u0156\u0158\u0210\u0212\u1E58\u1E5A\u1E5C\u1E5E]/g],
                ['r', /[\u0155\u0157\u0159\u0211\u0213\u1E59\u1E5B\u1E5D\u1E5F]/g],
                ['S', /[\u015A\u015C\u015E\u0160\u0218\u1E60\u1E62\u1E64\u1E66\u1E68]/g],
                ['s', /[\u015B\u015D\u015F\u0161\u017F\u0219\u023F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E9B]/g],
                ['SS', /[\u1E9E]/g],
                ['T', /[\u0162\u0164\u0166\u021A\u023E\u1E6A\u1E6C\u1E6E\u1E70]/g],
                ['t', /[\u0163\u0165\u0167\u021B\u1E6B\u1E6D\u1E6F\u1E71\u1E97]/g],
                ['U', /[\u0168\u016A\u016C\u016E\u0170\u0172\u01AF\u01D3\u01D5\u01D7\u01D9\u01DB\u0214\u0216\u1E72\u1E74\u1E76\u1E78\u1E7A\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0]/g],
                ['u', /[\u0169\u016B\u016D\u016F\u0171\u0173\u01B0\u01D4\u01D6\u01D8\u01DA\u01DC\u0215\u0217\u1E73\u1E75\u1E77\u1E79\u1E7B\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1]/g],
                ['V', /[\u1E7C\u1E7E]/g],
                ['v', /[\u1E7D\u1E7F]/g],
                ['W', /[\u0174\u1E80\u1E82\u1E84\u1E86\u1E88]/g],
                ['w', /[\u0175\u1E81\u1E83\u1E85\u1E87\u1E89\u1E98]/g],
                ['X', /[\u1E8A\u1E8C]/g],
                ['x', /[\u1E8B\u1E8D]/g],
                ['Y', /[\u0176\u0232\u1E8E\u1EF2\u1EF4\u1EF6\u1EF8]/g],
                ['y', /[\u0177\u0233\u1E8F\u1E99\u1EF3\u1EF5\u1EF7\u1EF9]/g],
                ['Z', /[\u0179\u017B\u017D\u1E90\u1E92\u1E94]/g],
                ['z', /[\u017A\u017C\u017E\u0240\u1E91\u1E93\u1E95]/g]
            ];
            str = str.replace(/[\u0300-\u036F\u1DC0-\u1DFF\uFE20-\uFE23\u0640-\u065E]/g, '');
            for (var i = 0; i < fr_table.length; i++) {
                str = str.replace(fr_table[i][1], fr_table[i][0]);
            }
            var car_etendus = /[\u0100-\u1EFE]/g;
            if (car_etendus.test(str)) {
                for (var i = 0; i < others_table.length; i++) {
                    str = str.replace(others_table[i][1], others_table[i][0]);
                }
            }
            return str;
        };
        return SearchSystem;
    }(Evented));
    return SearchSystem;
});
