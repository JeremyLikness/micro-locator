declare module MicroServicesLocator {
    
    export interface truncate {
        truncate: Function 
    }

    export interface IConfigureReplace {
        replace: string[];
    }

    export interface IConfigureRebase {
        rebase: string[];
        truncate?: boolean;
    }

    export type IConfiguration = (IConfigureRebase | IConfigureReplace)[];

    export class locator {
        resolve: (signature: string) => string;
        replace: (signature: string, replacement: string) => void;
        rebase: (signature: string, replacement: string) => truncate; 
        configure: (config: IConfiguration) => void;
    }
}