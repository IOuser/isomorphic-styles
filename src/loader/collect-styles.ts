const container = new Set();

// tslint:disable-next-line:no-any
export function collectStyles(styles: any[]): void {
    container.add(styles);
}

export function flush(maxSize: number): string {
    let result = '';
    for (const styles of container.values()) {
        for (const style of styles) {
            const [, css] = style;

            if (result.length + css.length > maxSize) {
                container.clear();
                return result;
            }

            result += css + '\n';
        }
    }

    container.clear();
    return result;
}
