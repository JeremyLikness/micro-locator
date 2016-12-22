/**
 * @license
 * Copyright Jeremy Likness. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT license that can be
 * found in the LICENSE file at https://github.com/jeremylikness/micro-locator/LICENSE
 */

enum PathType {
    Replace,
    RebaseWithTruncate,
    RebaseWithoutTruncate
}

interface IMap {
    type: PathType;
    replacement: string;
}

interface IResolverTree { [query: string]: IMap; };

export interface Truncate {
    truncate: Function;
};

export interface IConfigureReplace {
    replace: string[];
}

export interface IConfigureRebase {
    rebase: string[];
    truncate?: boolean;
}

export type IConfiguration = (IConfigureRebase | IConfigureReplace)[];

const ResolverTree: IResolverTree = {
    '/' : {
        type: PathType.RebaseWithTruncate,
        replacement: ''
    }
};

interface IReplacementParser {
    (tree: IResolverTree, parts: string[]): string;
}

const ReplacementParser: IReplacementParser = (tree: IResolverTree, parts: string[]) => {
    let key = parts.join('/');
    if (tree[key] && tree[key].type === PathType.Replace) {
        return tree[key].replacement;
    }
    return null;
};

interface IParser {
    (tree: IResolverTree, parts: string[]): string;
}

const Parser: IParser = (tree: IResolverTree, parts: string[]) => {
    let testReplacement = ReplacementParser(tree, parts);
    if (testReplacement) {
        return testReplacement;
    }
    let checkReplacement = [...parts], replacementParts = [...parts];
    let path = [];
    while (checkReplacement.length) {
        let key = checkReplacement.length === 1 ? '/' : checkReplacement.join('/'),
            replacement = tree[key];
        if (replacement && replacement.type !== PathType.Replace) {
            if (replacement.type === PathType.RebaseWithTruncate) {
                return [replacement.replacement, ...path].join('/');
            }
            if (replacement.type === PathType.RebaseWithoutTruncate) {
                if (replacementParts[0] === '') {
                    replacementParts.shift();
                }
                return [replacement.replacement, ...replacementParts].join('/');
            }
        }
        path = [checkReplacement[checkReplacement.length - 1], ...path];
        checkReplacement.pop();
    }
    return parts.join('/');
};

interface IResolver {
    (tree: IResolverTree, signature: string): string;
}

const GlobalResolver: IResolver = (tree: IResolverTree, sig: string) => {

    let pathQuery = sig.split('?');

    let pathSegments = pathQuery[0].split('/');
    let result = Parser(tree, pathSegments);
    if (pathQuery.length === 2) {
        result = [result, pathQuery[1]].join('?');
    }
    return result ? result : '/';
};

const INVALID_CONFIG = 'Invalid configuration.';

export class Locator {

    private tree: IResolverTree = {...ResolverTree};

    public configure(config: IConfiguration) {

        config.forEach(configuration => {
            if (configuration['replace']) {
                let replace = configuration as IConfigureReplace;
                if (!replace.replace || replace.replace.length !== 2) {
                    throw new Error(INVALID_CONFIG);
                }
                this.replace(replace.replace[0], replace.replace[1]);
            }
            else if (configuration['rebase']) {
                let rebase = configuration as IConfigureRebase;
                if (!rebase.rebase || rebase.rebase.length !== 2) {
                    throw new Error (INVALID_CONFIG);
                }
                let truncate = this.rebase(rebase.rebase[0], rebase.rebase[1]);
                if (rebase.truncate === true) {
                    truncate.truncate();
                }
            }
            else {
                throw new Error(INVALID_CONFIG);
            }
        });
    }

    public resolve(signature: string): string {
        return GlobalResolver(this.tree, signature);
    }

    public replace(signature: string, replacement: string) {
        let newTree = {...this.tree};
        newTree[signature] = {
            type: PathType.Replace,
            replacement
        };
        this.tree = newTree;
    }

    public rebase(signature: string, replacement: string): Truncate {
        let repl = replacement.slice(-1) === '/' ?
            replacement.substring(0, replacement.length - 1) : replacement,
            newTree = {...this.tree};
        if (signature === '/') {
            newTree[signature] = {
                type: PathType.RebaseWithoutTruncate,
                replacement: repl
            };
            this.tree = newTree;
            return {
                truncate: () => {
                    throw new Error('Cannot truncate root!');
                }
            };
        }
        newTree[signature] = {
            type: PathType.RebaseWithoutTruncate,
            replacement: repl
        };
        let node = newTree[signature];
        this.tree = newTree;
        return {
            truncate: () => node.type = PathType.RebaseWithTruncate
        };
    }
}