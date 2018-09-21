import * as React from 'react';
import { renderToString } from 'react-dom/server';

import { StylesProvider } from './styles-provider';
import { makeCollectStylesFunction } from './collect-styles';

export type RenderResult = {
    styles: string;
    markup: string;
};

export function render(children: React.ReactNode): RenderResult {
    const criticalCssStyles = new Set();
    const collectStyles = makeCollectStylesFunction(criticalCssStyles);

    const markup = renderToString(<StylesProvider onInsertCss={collectStyles}>{children}</StylesProvider>);
    const styles = getStylesString(criticalCssStyles);

    return {
        markup,
        styles,
    };
}

function getStylesString(stylesSet: Set<string>): string {
    return Array.from(stylesSet.values())
        .join('\n')
        .trim();
}
