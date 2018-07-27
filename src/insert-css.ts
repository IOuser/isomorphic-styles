import { Styles } from './styles-provider';

// Inject <style> tags with specified styles to <head>
export const insertCss = (...styles: Styles[]) => {
    const removeCss = styles.map((style: Styles) => style._insertCss());
    return () => {
        removeCss.forEach((remove: () => void) => remove());
    };
};
