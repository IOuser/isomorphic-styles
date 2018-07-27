export function isDOMAvailable(): boolean {
    return window !== undefined && window.document !== undefined && window.document.createElement !== undefined;
}
