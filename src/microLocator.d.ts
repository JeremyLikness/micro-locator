declare module MicroServicesLocator {
    
    export interface truncate {
        truncate: Function 
    }

    export class locator {
        resolve: (signature: string) => string;
        replace: (signature: string, replacement: string) => void;
        rebase: (signature: string, replacement: string) => truncate; 
    }
}