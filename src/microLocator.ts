/**
 * @license
 * Copyright Jeremy Likness. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT license that can be
 * found in the LICENSE file at https://github.com/jeremylikness/micro-locator/LICENSE.md 
 */

export module MicroServicesLocator {

    enum PathType {
        Replace,
        RebaseWithTruncate,
        RebaseWithoutTruncate
    }

    interface IMap {
        type: PathType; 
        replacement: string;
    }

    interface IResolverTree { [query: string]: IMap };

    interface truncate { 
        truncate: Function 
    } 

    const ResolverTree: IResolverTree = {
        '/' : {
            type: PathType.RebaseWithTruncate,
            replacement: '' 
        }
    };

    interface IReplacementParser {
        (tree: IResolverTree, parts: string[]): string | string[]; 
    }

    interface IParser {
        (tree: IResolverTree, parts: string[]): string;
    }

    const ReplacementParser: IReplacementParser = (tree: IResolverTree, parts: string[]) => {
        let key = parts.join('/');
        if (tree[key] && tree[key].type === PathType.Replace) {
            return tree[key].replacement;
        }
        return [...parts];
    };

    const Parser: IParser = (tree: IResolverTree, parts: string[]) => {
        let checkReplacement = ReplacementParser(tree, parts);
        if (typeof checkReplacement === 'string') {
            return checkReplacement;
        }
        let path = [];
        while (checkReplacement.length) {
            let key = checkReplacement.length === 1 ? '/' : checkReplacement.join('/'),
                replacement = tree[key];
            if (replacement && replacement.type !== PathType.Replace) {
                if (replacement.type === PathType.RebaseWithTruncate) {
                    return [replacement.replacement, ...path].join('/');
                }
                if (replacement.type === PathType.RebaseWithoutTruncate) {
                    if (parts[0] === '') {
                        parts.shift();
                    }
                    return [replacement.replacement, ...parts].join('/');
                }
            }
            path = [checkReplacement[checkReplacement.length-1], ...path];
            checkReplacement.pop();
        }
        return parts.join('/');
    }

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
    } 

    export class locator {

        private tree: IResolverTree = {...ResolverTree};

        public resolve(signature: string): string {
            return GlobalResolver(this.tree, signature);
        }
        
        public replace(signature: string, replacement: string) {
            this.tree[signature] = {
                type: PathType.Replace,
                replacement
            }
        }

        public rebase(signature: string, replacement: string): truncate {
            let repl = replacement.slice(-1) === '/' ? 
                replacement.substring(0, replacement.length-1) : replacement;
            if (signature === '/') {
                this.tree[signature] = {
                    type: PathType.RebaseWithoutTruncate,
                    replacement: repl
                };
                return {
                    truncate: () => {
                        throw new Error('Cannot truncate root!');
                    }
                };
            }
            this.tree[signature] = {
                type: PathType.RebaseWithoutTruncate, 
                replacement: repl 
            };
            let node = this.tree[signature];
            return {
                truncate: () => node.type = PathType.RebaseWithTruncate
            }
        }
    }
}