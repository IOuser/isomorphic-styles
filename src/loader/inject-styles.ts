import { isDOMAvailable } from './is-dom-available';

export function injectStyles(styles: any[]): () => void {
    if (!isDOMAvailable()) {
        console.log('dom not available');
        return noop;
    }

    // console.log(moduleId, styles);
    const removeStyles = styles.map(injectStyle);

    return () => removeStyles.forEach((removeStyle: () => void) => removeStyle());
}

function injectStyle(style: any): () => void {
    // TODO: sourceMaps inject by webpack options
    const [moduleId, css, media, sourceMap] = style;

    let cssText = css;
    // skip IE9 and below, see http://caniuse.com/atob-btoa
    if (sourceMap && btoa !== undefined) {
        cssText += `\n/*# sourceMappingURL=data:application/json;base64,${b64EncodeUnicode(
            JSON.stringify(sourceMap),
        )}*/`;
        cssText += `\n/*# sourceURL=${sourceMap.file}?${moduleId}*/`;
    }

    let styleElement = document.getElementById(moduleId);
    if (styleElement === null) {
        styleElement = document.createElement('style');
        styleElement.setAttribute('type', 'text/css');

        styleElement.id = moduleId;
        styleElement.textContent = cssText;

        if (media) {
            styleElement.setAttribute('media', media);
        }

        document.head.appendChild(styleElement);
    } else {
        styleElement.textContent = cssText;
    }

    console.log(cssText, media);
    return () => styleElement !== null && styleElement.remove();
}

// Base64 encoding and decoding - The "Unicode Problem"
// https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
function b64EncodeUnicode(str: string): string {
    return btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_: string, p1: number) =>
            String.fromCharCode(Number(`0x${p1}`)),
        ),
    );
}

function noop(): void {
    //
}
