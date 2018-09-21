import * as path from 'path';
import { loader } from 'webpack';
import { OptionObject, getOptions, stringifyRequest } from 'loader-utils';

export = class IsomorphicStylesLoader {
    public static pitch(this: loader.LoaderContext, request: string): string {
        if (this.cacheable) {
            this.cacheable();
        }

        const options = getLoaderOptions(this);

        // TODO: Add validation schema
        // validateOptions(require('./options.json'), options, 'Style Loader')

        // console.log('');
        // console.log('');
        // console.log(options);

        const { autoInject, autoCollect } = options;
        const collectStylesPath = path.join(__dirname, './collect-styles.js');
        const collectStylesRequest = stringifyRequest(this, `!${collectStylesPath}`);
        const injectStylesPath = path.join(__dirname, './inject-styles.js');
        const injectStylesRequest = stringifyRequest(this, `!${injectStylesPath}`);
        const stylesRequest = stringifyRequest(this, `!!${request}`);

        // console.log('');
        // console.log('');

        return `
            const collectStyles = require(${collectStylesRequest}).collectStyles;
            const injectStyles = require(${injectStylesRequest}).injectStyles;
            const styles = require(${stylesRequest});

            if (typeof styles === 'string') {
                styles = [[module.id, styles, '']];
            }

            const utils = {
                _getStyles: _ => styles,
                _getCss: _ => styles.toString(),
                _injectStyles: _ => injectStyles(styles),
            };
            const locals = Object.assign({}, styles.locals || {}, utils)

            const localsProxy = new Proxy({}, {
                get(_target, prop, _receiver) {
                    if (Object.keys(utils).indexOf(prop) === -1 && prop !== '__esModule') {
                        // console.log('get class name', prop, 'in', module.id)
                        collectStyles(styles, module.id);
                    }

                    if (locals[prop]) {
                        return locals[prop];
                    }
                }
            });

            module.exports = localsProxy;

            // TODO: Investigate this case
            /*
            if (${autoInject}) {
                if (${autoCollect}) {
                    collectStyles(styles);
                }

                injectStyles(styles);
            }
            */

            ${getHMR(this, request)}
        `;
    }
};

function getLoaderOptions(ctx: loader.LoaderContext): OptionObject {
    let options = getOptions(ctx);
    if (options === null) {
        options = {};
    }

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
