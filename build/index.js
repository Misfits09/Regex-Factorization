"use strict";
exports.__esModule = true;
exports.simplifyExistingRegex = exports.regexFromNumberArray = void 0;
var make_tree = function (numbers) {
    var tree = {};
    numbers.forEach(function (nb) {
        nb.toString()
            .split("")
            .reduce(function (parentNode, digit, index) {
            if (parentNode[digit] === undefined) {
                parentNode[digit] = {};
            }
            return parentNode[digit];
        }, tree);
    });
    return tree;
};
var make_regex = function (numbers_tree) {
    var regex = "";
    var makeLogic = function (subtree) {
        if (subtree === {})
            return "";
        else {
            var keys = Object.keys(subtree).map(function (s) { return parseInt(s); });
            keys.sort(function (a, b) { return a - b; });
            return keys
                .map(function (n) { return n.toString(); })
                .map(function (key) {
                var subregex = makeLogic(subtree[key]);
                if (subregex.length === 0)
                    return key;
                else if (!subregex.includes("|"))
                    return "".concat(key).concat(subregex);
                else
                    return "".concat(key, "(").concat(subregex, ")");
            })
                .join("|");
        }
    };
    var notGroupedRegex = makeLogic(numbers_tree);
    return notGroupedRegex.replace(/\((\d\|)+\d\)/g, function (match) {
        var groups = [];
        match
            .substring(1, match.length - 1)
            .split("|")
            .reduce(function (groupIndex, n) {
            var nbr = parseInt(n);
            if (groupIndex === -1) {
                groups.push([nbr]);
                return groupIndex + 1;
            }
            if (groups[groupIndex].includes(nbr - 1)) {
                groups[groupIndex].push(nbr);
                return groupIndex;
            }
            else {
                groups.push([nbr]);
                return groupIndex + 1;
            }
        }, -1);
        return "(".concat(groups
            .map(function (list) {
            return list.length === 1
                ? list[0].toString()
                : "[".concat(list[0], "-").concat(list[list.length - 1], "]");
        })
            .join("|"), ")");
    });
};
/**
 * Creates a regex from an array of numbers
 */
var regexFromNumberArray = function (array) {
    return make_regex(make_tree(array));
};
exports.regexFromNumberArray = regexFromNumberArray;
/**
 * Replace any part of a regex containing ORs with just digits like [a-Z]hello(123|456|32) or a(3|5|6)
 *
 * WARNING The list of numbers must be contained in parenthesis or representing the entire string
 */
var simplifyExistingRegex = function (regex) {
    return regex
        .replace(/^((\d+|(\(\d+\)))\|?)+$/g, function (match) {
        return (0, exports.regexFromNumberArray)(match
            .split("|")
            .map(function (s) { return s.replace(/(^\()|(\)$)/g, ""); })
            .map(function (s) { return parseInt(s); }));
    })
        .replace(/\(((\d+|(\(\d+\)))\|?)+\)/g, function (match) {
        match = match.substring(1, match.length - 1);
        var simplified = (0, exports.regexFromNumberArray)(match
            .split("|")
            .map(function (s) { return s.replace(/(^\()|(\)$)/g, ""); })
            .map(function (s) { return parseInt(s); }));
        return "(".concat(simplified, ")");
    });
};
exports.simplifyExistingRegex = simplifyExistingRegex;
