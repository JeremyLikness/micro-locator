/**
 * @license
 * Copyright Jeremy Likness. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT license that can be
 * found in the LICENSE file at https://github.com/jeremylikness/micro-locator/LICENSE
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
var PathType;
(function (PathType) {
    PathType[PathType["Replace"] = 0] = "Replace";
    PathType[PathType["RebaseWithTruncate"] = 1] = "RebaseWithTruncate";
    PathType[PathType["RebaseWithoutTruncate"] = 2] = "RebaseWithoutTruncate";
})(PathType || (PathType = {}));
;
;
var ResolverTree = {
    '/': {
        type: PathType.RebaseWithTruncate,
        replacement: ''
    }
};
var ReplacementParser = function (tree, parts) {
    var key = parts.join('/');
    if (tree[key] && tree[key].type === PathType.Replace) {
        return tree[key].replacement;
    }
    return null;
};
var Parser = function (tree, parts) {
    var testReplacement = ReplacementParser(tree, parts);
    if (testReplacement) {
        return testReplacement;
    }
    var checkReplacement = parts.slice(), replacementParts = parts.slice();
    var path = [];
    while (checkReplacement.length) {
        var key = checkReplacement.length === 1 ? '/' : checkReplacement.join('/'), replacement = tree[key];
        if (replacement && replacement.type !== PathType.Replace) {
            if (replacement.type === PathType.RebaseWithTruncate) {
                return [replacement.replacement].concat(path).join('/');
            }
            if (replacement.type === PathType.RebaseWithoutTruncate) {
                if (replacementParts[0] === '') {
                    replacementParts.shift();
                }
                return [replacement.replacement].concat(replacementParts).join('/');
            }
        }
        path = [checkReplacement[checkReplacement.length - 1]].concat(path);
        checkReplacement.pop();
    }
    return parts.join('/');
};
var GlobalResolver = function (tree, sig) {
    var pathQuery = sig.split('?');
    var pathSegments = pathQuery[0].split('/');
    var result = Parser(tree, pathSegments);
    if (pathQuery.length === 2) {
        result = [result, pathQuery[1]].join('?');
    }
    return result ? result : '/';
};
var INVALID_CONFIG = 'Invalid configuration.';
var Locator = (function () {
    function Locator() {
        this.tree = __assign({}, ResolverTree);
    }
    Locator.prototype.configure = function (config) {
        var _this = this;
        config.forEach(function (configuration) {
            if (configuration['replace']) {
                var replace = configuration;
                if (!replace.replace || replace.replace.length !== 2) {
                    throw new Error(INVALID_CONFIG);
                }
                _this.replace(replace.replace[0], replace.replace[1]);
            }
            else if (configuration['rebase']) {
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
        var newTree = __assign({}, this.tree);
        newTree[signature] = {
            type: PathType.Replace,
            replacement: replacement
        };
        this.tree = newTree;
    };
    Locator.prototype.rebase = function (signature, replacement) {
        var repl = replacement.slice(-1) === '/' ?
            replacement.substring(0, replacement.length - 1) : replacement, newTree = __assign({}, this.tree);
        if (signature === '/') {
            newTree[signature] = {
                type: PathType.RebaseWithoutTruncate,
                replacement: repl
            };
            this.tree = newTree;
            return {
                truncate: function () {
                    throw new Error('Cannot truncate root!');
                }
            };
        }
        newTree[signature] = {
            type: PathType.RebaseWithoutTruncate,
            replacement: repl
        };
        var node = newTree[signature];
        this.tree = newTree;
        return {
            truncate: function () { return node.type = PathType.RebaseWithTruncate; }
        };
    };
    return Locator;
}());
exports.Locator = Locator;
