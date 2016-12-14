/**
 * @license
 * Copyright Jeremy Likness. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT license that can be
 * found in the LICENSE file at https://github.com/jeremylikness/micro-locator/LICENSE.md
 */
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var MicroServicesLocator;
(function (MicroServicesLocator) {
    var PathType;
    (function (PathType) {
        PathType[PathType["Replace"] = 0] = "Replace";
        PathType[PathType["RebaseWithTruncate"] = 1] = "RebaseWithTruncate";
        PathType[PathType["RebaseWithoutTruncate"] = 2] = "RebaseWithoutTruncate";
    })(PathType || (PathType = {}));
    ;
    ;
    var ResolverTree = {
        "/": {
            type: PathType.RebaseWithTruncate,
            replacement: ""
        }
    };
    var ReplacementParser = function (tree, parts) {
        var key = parts.join("/");
        if (tree[key] && tree[key].type === PathType.Replace) {
            return tree[key].replacement;
        }
        return parts.slice();
    };
    var Parser = function (tree, parts) {
        var checkReplacement = ReplacementParser(tree, parts);
        if (typeof checkReplacement === "string") {
            return checkReplacement;
        }
        var path = [];
        while (checkReplacement.length) {
            var key = checkReplacement.length === 1 ? "/" : checkReplacement.join("/"), replacement = tree[key];
            if (replacement && replacement.type !== PathType.Replace) {
                if (replacement.type === PathType.RebaseWithTruncate) {
                    return [replacement.replacement].concat(path).join("/");
                }
                if (replacement.type === PathType.RebaseWithoutTruncate) {
                    if (parts[0] === "") {
                        parts.shift();
                    }
                    return [replacement.replacement].concat(parts).join("/");
                }
            }
            path = [checkReplacement[checkReplacement.length - 1]].concat(path);
            checkReplacement.pop();
        }
        return parts.join("/");
    };
    var GlobalResolver = function (tree, sig) {
        var pathQuery = sig.split("?");
        var pathSegments = pathQuery[0].split("/");
        var result = Parser(tree, pathSegments);
        if (pathQuery.length === 2) {
            result = [result, pathQuery[1]].join("?");
        }
        return result ? result : "/";
    };
    var INVALID_CONFIG = "Invalid configuration.";
    var Locator = (function () {
        function Locator() {
            this.tree = __assign({}, ResolverTree);
        }
        Locator.prototype.configure = function (config) {
            var _this = this;
            config.forEach(function (configuration) {
                if (configuration["replace"]) {
                    var replace = configuration;
                    if (!replace.replace || replace.replace.length !== 2) {
                        throw new Error(INVALID_CONFIG);
                    }
                    _this.replace(replace.replace[0], replace.replace[1]);
                }
                else if (configuration["rebase"]) {
                    var rebase = configuration;
                    if (!rebase.rebase || rebase.rebase.length !== 2) {
                        throw new Error(INVALID_CONFIG);
                    }
                    var truncate = _this.rebase(rebase.rebase[0], rebase.rebase[1]);
                    if (rebase.truncate === true) {
                        truncate.truncate();
                    }
                }
                else {
                    throw new Error(INVALID_CONFIG);
                }
            });
        };
        Locator.prototype.resolve = function (signature) {
            return GlobalResolver(this.tree, signature);
        };
        Locator.prototype.replace = function (signature, replacement) {
            this.tree[signature] = {
                type: PathType.Replace,
                replacement: replacement
            };
        };
        Locator.prototype.rebase = function (signature, replacement) {
            var repl = replacement.slice(-1) === "/" ?
                replacement.substring(0, replacement.length - 1) : replacement;
            if (signature === "/") {
                this.tree[signature] = {
                    type: PathType.RebaseWithoutTruncate,
                    replacement: repl
                };
                return {
                    truncate: function () {
                        throw new Error("Cannot truncate root!");
                    }
                };
            }
            this.tree[signature] = {
                type: PathType.RebaseWithoutTruncate,
                replacement: repl
            };
            var node = this.tree[signature];
            return {
                truncate: function () { return node.type = PathType.RebaseWithTruncate; }
            };
        };
        return Locator;
    }());
    MicroServicesLocator.Locator = Locator;
})(MicroServicesLocator = exports.MicroServicesLocator || (exports.MicroServicesLocator = {}));
