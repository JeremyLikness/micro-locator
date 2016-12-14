/**
 * @license
 * Copyright Jeremy Likness. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT license that can be
 * found in the LICENSE file at https://github.com/jeremylikness/micro-locator/LICENSE.md
 */
export declare namespace MicroServicesLocator {
    interface Truncate {
        truncate: Function;
    }
    interface IConfigureReplace {
        replace: string[];
    }
    interface IConfigureRebase {
        rebase: string[];
        truncate?: boolean;
    }
    type IConfiguration = (IConfigureRebase | IConfigureReplace)[];
    class Locator {
        private tree;
        configure(config: IConfiguration): void;
        resolve(signature: string): string;
        replace(signature: string, replacement: string): void;
        rebase(signature: string, replacement: string): Truncate;
    }
}
