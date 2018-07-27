declare global {
    // tslint:disable-next-line:variable-name
    const __isBrowser__: boolean;
}

export type IdentFunc = <T>(value: T) => T;

export function withStyles(...styles: Record<string, string>[]): IdentFunc {
    if (__isBrowser__) {
        return <T>(value: T) => value;
    }

    return require('isomorphic-style-loader/lib/withStyles').default(...styles);
}
