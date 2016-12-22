export interface Truncate {
    truncate: Function;
}
export interface IConfigureReplace {
    replace: string[];
}
export interface IConfigureRebase {
    rebase: string[];
    truncate?: boolean;
}
export declare type IConfiguration = (IConfigureRebase | IConfigureReplace)[];
export declare class Locator {
    private tree;
    configure(config: IConfiguration): void;
    resolve(signature: string): string;
    replace(signature: string, replacement: string): void;
    rebase(signature: string, replacement: string): Truncate;
}
