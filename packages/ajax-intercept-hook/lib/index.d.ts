declare function noop(): void;
export declare class XMLHTTPRequestIntercept {
    private openHook;
    private sendHook;
    private onreadyStateChangeHook;
    private onreadyStateChange4Status200Hook;
    constructor({ openHook, sendHook, onreadyStateChangeHook, onreadyStateChange4Status200Hook }?: {
        openHook?: typeof noop | undefined;
        sendHook?: typeof noop | undefined;
        onreadyStateChangeHook?: typeof noop | undefined;
        onreadyStateChange4Status200Hook?: typeof noop | undefined;
    });
    init(): void;
}
export {};
