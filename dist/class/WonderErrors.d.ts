export declare class WonderError extends Error {
    code: string;
    message: string;
    stack: string;
    name: string;
    constructor(message: string, code: string);
    toString(): string;
    toJSON(): {
        code: string;
        message: string;
        name: string;
        stack: string;
    };
}
//# sourceMappingURL=WonderErrors.d.ts.map