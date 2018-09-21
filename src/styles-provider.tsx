import * as React from 'react';
import * as PropTypes from 'prop-types';

import { insertCss } from './insert-css';

export type Styles = Record<string, string> & {
    _getCss: () => string;
    _insertCss: () => () => void;
};

export type StylesProviderProps = {
    onInsertCss?: (...styles: Styles[]) => void;
};

export type StylesProviderContext = {
    insertCss: (...styles: Styles[]) => void;
};

export class StylesProvider extends React.Component<StylesProviderProps> {
    public static childContextTypes: PropTypes.ValidationMap<object> = {
        insertCss: PropTypes.func,
    };

    public getChildContext(): StylesProviderContext {
        return {
            insertCss: this.props.onInsertCss || insertCss,
        };
    }

    public render(): JSX.Element {
        return React.Children.only(this.props.children);
    }
}
