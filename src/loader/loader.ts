import * as path from 'path';
import { loader } from 'webpack';
import { OptionObject, getOptions, stringifyRequest } from 'loader-utils';

// const validationMap = {
//     type: 'object',
//     properties: {
//         hmr: {
//             type: 'boolean',
//         },
//         sourceMap: {
//             type: 'boolean',
//         },
//         convertToAbsoluteUrls: {
//             type: 'boolean',
//         },
//     },
//     additionalProperties: false,
// };

export = class IsomorphicStylesLoader {
    public static pitch(this: loader.LoaderContext, request: string): string {
        if (this.cacheable) {
            this.cacheable();
        }

        const options = getLoaderOptions(this);

        // TODO: Add validation schema
        // validateOptions(require('./options.json'), options, 'Style Loader')

        console.log('');
        console.log('');
        console.log(options);

        const { autoInject, autoCollect } = options;
        const collectStylesPath = path.join(__dirname, './collect-styles.js');
        const collectStylesRequest = stringifyRequest(this, `!${collectStylesPath}`);
        const injectStylesPath = path.join(__dirname, './inject-styles.js');
        const injectStylesRequest = stringifyRequest(this, `!${injectStylesPath}`);
        const stylesRequest = stringifyRequest(this, `!!${request}`);

        console.log('');
        console.log('');

        return `
            var collectStyles = require(${collectStylesRequest}).collectStyles;
            var injectStyles = require(${injectStylesRequest}).injectStyles;
            var styles = require(${stylesRequest});

            if (typeof styles === 'string') {
                styles = [[module.id, styles, '']];
            }

            module.exports = styles.locals || {};
            module.exports._getStyles = function() { return styles; };
            module.exports._getCss = function() { return styles.toString(); };
            module.exports._injectStyles = function() {
                collectStyles(styles);
                return injectStyles(styles)
            };

            if (${autoInject}) {
                if (${autoCollect}) {
                    collectStyles(styles);
                }

                injectStyles(styles);
            }

            ${getHMR(this, request)}
        `;
    }
};

function getLoaderOptions(ctx: loader.LoaderContext): OptionObject {
    const options = getOptions(ctx);
    options.hmr = options.hmr === undefined ? true : options.hmr;
    options.autoInject = options.autoInject === undefined ? true : Boolean(options.autoInject);
    options.autoCollect = options.autoCollect === undefined ? true : Boolean(options.autoCollect);

    return options;
}

// TODO: Hot Module Replacement support
function getHMR(_ctx: loader.LoaderContext, _request: string): string {
    return '';

    // return `
    //     if (module.hot) {
    //         module.hot.accept(${loaderUtils.stringifyRequest(ctx, `!!${request})}, function() {
    //             var newContent = require(${loaderUtils.stringifyRequest(ctx, `!!${request})});
    //             if (typeof newContent === 'string') {
    //                 newContent = [[module.id, newContent, '']];
    //             }
    //         }
    //     }
    // `

    // var hmr = [
    //     // Hot Module Replacement,
    //     "		var locals = (function(a, b) {",
    //     "			var key, idx = 0;",
    //     "",
    //     "			for(key in a) {",
    //     "				if(!b || a[key] !== b[key]) return false;",
    //     "				idx++;",
    //     "			}",
    //     "",
    //     "			for(key in b) idx--;",
    //     "",
    //     "			return idx === 0;",
    //     "		}(content.locals, newContent.locals));",
    //     "",
    //     // This error is caught and not shown and causes a full reload
    //     "		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');",
    //     "",
    //     "		update(newContent);",
    //     "	});",
    //     "",
    //     // When the module is disposed, remove the <style> tags
    //     "	module.hot.dispose(function() { update(); });",
    //     "}"
    // ].join("\n");
}
