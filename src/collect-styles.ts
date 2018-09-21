import { Styles } from './styles-provider';

export type CollectStylesFunction = (...styles: Styles[]) => void;

export const makeCollectStylesFunction = (stylesContainer: Set<string>): CollectStylesFunction => {
    return (...styles: Styles[]) => {
        styles.forEach((s: Styles) => stylesContainer.add(s._getCss()));
    };
};
