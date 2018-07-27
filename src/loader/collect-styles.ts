const container = new Set();

export function collectStyles(styles: any[]): void {
    console.log('collect', styles);

    container.add(styles);
}

export function flush(): string {
    let result = '';
    for (const styles of container.values()) {
        for (const style of styles) {
            const [, css] = style;
            result += css;
        }
    }

    container.clear();
    return result;
}

(window as any).flush = flush;
