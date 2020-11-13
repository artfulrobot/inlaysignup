/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./src/coDownload.scss":
/*!****************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/postcss-loader/src??ref--6-2!./node_modules/sass-loader/dist/cjs.js??ref--6-3!./src/coDownload.scss ***!
  \****************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "body.inlay-download-modal-active {\n  position: fixed;\n  overflow: hidden;\n}\n\n.inlay-download .idl-overlay {\n  z-index: 1000;\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: rgba(255, 255, 255, 0.8);\n  display: none;\n  justify-content: center;\n  align-items: center;\n}\n\n.inlay-download.focussed .idl-overlay {\n  display: flex;\n}\n\n.inlay-download .idl-locator {\n  flex: 0 1 60rem;\n  position: relative;\n  background: #F8F8F5;\n  border-radius: 0;\n  max-height: 90vh;\n  overflow: auto;\n  padding: 2rem;\n}\n\n.inlay-download .idl-close {\n  display: block;\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  position: absolute;\n  margin: 0;\n  padding: 0;\n  top: 1rem;\n  right: 1rem;\n  width: 4rem;\n  font-size: 2rem;\n  line-height: 1;\n  text-align: center;\n  background: white;\n  color: #888;\n  border: none;\n}\n\n.inlay-download .idl-thanks {\n  font-size: 1.6rem;\n  text-align: center;\n}\n\n.inlay-download .idl-progress-container {\n  height: 2px;\n  margin-top: 0.25rem;\n}\n\n.inlay-download .idl-progress-container .idl-progress {\n  height: 2px;\n}\n\n.inlay-download .idl-progress-container.active {\n  background-color: white;\n}\n\n.inlay-download .idl-progress-container.active .idl-progress {\n  background-color: #f25d2a;\n}\n\n.inlay-download label {\n  font-weight: 700;\n  padding: .375rem;\n}\n\n.inlay-download label p {\n  font-size: inherit;\n}\n\n.inlay-download label p:last-child {\n  margin-bottom: 0;\n}\n\n.inlay-download textarea,\n.inlay-download input[type=\"text\"],\n.inlay-download input[type=\"email\"] {\n  padding: .75rem;\n  background-color: #fff;\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  color: #111;\n  border: 1px solid #dcdcdc;\n  width: 100%;\n}\n\n.inlay-download form {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: top;\n  margin: 0 -1rem;\n  padding: 0;\n}\n\n.inlay-download h2 {\n  flex: 0 100%;\n  padding: 0 5rem 0 1rem;\n}\n\n.inlay-download .idl-field {\n  margin-bottom: 1rem;\n  flex: 1 0 45%;\n  min-width: 18rem;\n  padding: 0 1rem;\n}\n\n.inlay-download .idl-field.question, .inlay-download .idl-field.followup {\n  flex: 0 0 100%;\n}\n\n.inlay-download .idl-buttons {\n  flex: 0 0 100%;\n  text-align: center;\n  padding-bottom: 2rem;\n}\n\n.inlay-download a:link, .inlay-download a:visited {\n  color: #f25d2a;\n}\n\n.inlay-download a:hover, .inlay-download a:active {\n  color: #f25d2a;\n  text-decoration: underline;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/*!*************************************************!*\
  !*** ./node_modules/css-loader/lib/css-base.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "./node_modules/style-loader/lib/addStyles.js":
/*!****************************************************!*\
  !*** ./node_modules/style-loader/lib/addStyles.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target, parent) {
  if (parent){
    return parent.querySelector(target);
  }
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target, parent) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target, parent);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ "./node_modules/style-loader/lib/urls.js");

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertAt.before, target);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	if(options.attrs.nonce === undefined) {
		var nonce = getNonce();
		if (nonce) {
			options.attrs.nonce = nonce;
		}
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function getNonce() {
	if (false) {}

	return __webpack_require__.nc;
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = typeof options.transform === 'function'
		 ? options.transform(obj.css) 
		 : options.transform.default(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "./node_modules/style-loader/lib/urls.js":
/*!***********************************************!*\
  !*** ./node_modules/style-loader/lib/urls.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ "./src/coDownload.js":
/*!***************************!*\
  !*** ./src/coDownload.js ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _coDownload_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./coDownload.scss */ "./src/coDownload.scss");
/* harmony import */ var _coDownload_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_coDownload_scss__WEBPACK_IMPORTED_MODULE_0__);
// Inlaydownload app


(function () {
  if (!window.inlayCoDownloadInit) {
    // This is the first time this *type* of Inlay has been encountered.
    // We need to define anything global here.

    /**
     * The inlay object has the following properties:
     * - initData object of data served along with the bundle script.
     * - publicID string for the inlay instance on the server. Nb. you may have
     *   multiple instances of that instance(!) on a web page.
     * - script   DOM node of the script tag that has caused us to be loaded,
     *            e.g. useful for positioning our UI after it, or extracting
     *            locally specified data- attributes.
     * - request(fetchParams)
     *            method providing fetch() wrapper for all Inlay-related
     *            requests. The URL is fixed, so you only provide the params
     *            object.
     */
    window.inlayCoDownloadInit = function (inlay) {
      // Only do this once per inlay instance.
      if (inlay.booted) {
        return;
      }

      inlay.booted = true;
      var uniquePrefix = 'i' + inlay.publicID;
      var isActive = false;
      var report = {
        title: '',
        id: 0
      };

      function getFormData(token) {
        var d = {
          email: nodes.emailInput.value,
          first_name: nodes.firstNameInput.value,
          last_name: nodes.lastNameInput.value,
          organisation: nodes.organisation.value,
          location: window.location.href,
          reportTitle: report.title,
          questionResponse: nodes.questionResponse.value,
          followup: nodes.followup.value
        };

        if (token) {
          d.token = token;
        }

        return d;
      }

      var handleInputInterraction = function handleInputInterraction(i, d) {
        if (!isActive) {
          // First time we're moving to active.
          report.title = d.dataset.downloadTitle;
          report.id = d.dataset.downloadId;
          nodes.title.textContent = 'Download: ' + d.dataset.downloadTitle;
          downloadAppDiv.classList.remove('at-rest');
          downloadAppDiv.classList.add('focussed');
          document.body.classList.add('inlay-download-modal-active'); // Move our main DOM container.

          document.body.appendChild(downloadAppDiv);
          isActive = true;
          setTimeout(function () {
            return nodes.firstNameInput.focus();
          }, 1);
        }

        if (i) {
          // Maintain a .invalid class on the parent container.
          i.classList.remove('pre-interaction');

          if (i.validity.valid) {
            i.parentNode.classList.remove('invalid');
          } else {
            i.parentNode.classList.add('invalid');
          }
        }
      };

      var reset = function reset() {
        isActive = false;
        downloadAppDiv.classList.add('at-rest');
        downloadAppDiv.classList.remove('focussed');
        document.body.classList.remove('inlay-download-modal-active');
        allInputs.forEach(function (i) {
          i.value = '';
          i.classList.add('pre-interaction');
          i.parentNode.classList.remove('invalid');
          i.reset && i.reset();
        });
        nodes.form.style.display = '';
        nodes.thanks.style.display = 'none';
        nodes.submitButtonText.textContent = inlay.initData.buttonText;
        nodes.submitButton.disabled = false;
      }; // We need to add button after each <noscript data-inlay-id={ourID}>


      [].forEach.call(document.querySelectorAll("noscript[data-inlay-id=\"".concat(inlay.publicID, "\"]")), function (el, index, array) {
        if (el.inlayProcessed) {
          return;
        }

        el.inlayProcessed = 1;
        var btn = document.createElement('a');
        btn.setAttribute('href', '#'); // Copy classes from noscript tag to enable local styling.
        // Provide defaults.

        btn.className = el.className || 'button button--orange';
        btn.addEventListener('click', function (e) {
          handleInputInterraction(null, el);
        });
        btn.innerHTML = 'Download<svg class="icon"><use xlink:href="#icon--button"></use></svg>';
        el.insertAdjacentElement('afterend', btn);
      }); // Here we create the download form and put it on the page.

      var downloadAppDiv = document.createElement('div'); // We append 'i' to the inlayID because classes can't start with a number.

      downloadAppDiv.classList.add('inlay-download', 'i' + inlay.publicID, 'at-rest');
      downloadAppDiv.innerHTML = "\n      <div class=\"idl-overlay\">\n        <div class=\"idl-locator\">\n          <button class=\"idl-close\" title=\"Close this form\">\xD7</button>\n          <form action='#' >\n            <h2 class=\"idl-title\"></h2>\n            <div class=\"idl-field first_name\">\n              <label for=\"".concat(uniquePrefix, "-fn\">First name<sup class=\"red\" title=\"required\">*</sup></label>\n              <input\n                id=\"").concat(uniquePrefix, "-fn\"\n                name=\"first_name\"\n                type=\"text\"\n                required\n                />\n            </div>\n\n            <div class=\"idl-field last_name\">\n              <label for=\"").concat(uniquePrefix, "-ln\">Last name<sup class=\"red\" title=\"required\">*</sup></label>\n              <input\n                id=\"").concat(uniquePrefix, "-fn\"\n                name=\"last_name\"\n                type=\"text\"\n                required\n                />\n            </div>\n\n            <div class=\"idl-field email\">\n              <label for=\"").concat(uniquePrefix, "-e1\">Email<sup class=\"red\" title=\"required\">*</sup></label>\n              <input\n                id=\"").concat(uniquePrefix, "-e1\"\n                name=\"email\"\n                type=\"email\"\n                placeholder=\"youremail@example.org\"\n                required\n                />\n            </div>\n\n            <div class=\"idl-field email\">\n              <label for=\"").concat(uniquePrefix, "-e2\">Email again to confirm<sup class=\"red\" title=\"required\">*</sup></label>\n              <input\n                id=\"").concat(uniquePrefix, "-e1\"\n                name=\"email2\"\n                type=\"email\"\n                required\n                />\n            </div>\n\n            <div class=\"idl-field organisation\">\n              <label for=\"").concat(uniquePrefix, "-o\">Organisation</label>\n              <input\n                id=\"").concat(uniquePrefix, "-o\"\n                name=\"organisation\"\n                type=\"text\"\n                placeholder=\"\"\n                />\n            </div>\n\n            <div class=\"idl-field question\">\n              <label for=\"").concat(uniquePrefix, "-q\"><span></span><sup class=\"red\" title=\"required\">*</sup></label>\n              <textarea\n                rows=6 cols=60\n                id=\"").concat(uniquePrefix, "-q\"\n                name=\"question\"\n                required\n                ></textarea>\n            </div>\n\n            <div class=\"idl-field followup\">\n              <label for=\"").concat(uniquePrefix, "-fu\"><span></span><sup class=\"red\" title=\"required\">*</sup></label>\n              <select id=\"").concat(uniquePrefix, "-fu\" required name=\"followup\" >\n                <option value=\"\">--Please select--</option>\n                <option value=\"Yes\">Yes</option>\n                <option value=\"No\">No</option>\n              </select>\n            </div>\n\n\n            <div class=\"idl-buttons\">\n              <div class=\"idl-smallprint\" ></div>\n              <button class=\"idl-submit button button--orange\" type=\"submit\" >\n                <span>Download</span>\n                <svg class=\"icon\"><use xlink:href=\"#icon--button\"></use></svg>\n              </button>\n              <div class=\"idl-progress-container\"><div class=\"idl-progress\"></div></div>\n            </div>\n          </form>\n          <div class=\"idl-thanks\">\n            <div class=\"text\">Thank you.</div>\n            <p>Your download should begin automatically after a few seconds. If not use this\n              <a>direct download link</a></p>\n          </div>\n        </div>\n      </div>\n      ");
      var nodes = {
        overlay: downloadAppDiv.firstElementChild,
        emailInput: downloadAppDiv.querySelector('input[name="email"]'),
        title: downloadAppDiv.querySelector('.idl-title'),
        email2Input: downloadAppDiv.querySelector('input[name="email2"]'),
        firstNameInput: downloadAppDiv.querySelector('input[name="first_name"]'),
        lastNameInput: downloadAppDiv.querySelector('input[name="last_name"]'),
        orgInput: downloadAppDiv.querySelector('input[name="organisation"]'),
        submitButton: downloadAppDiv.querySelector('button.idl-submit'),
        submitButtonText: downloadAppDiv.querySelector('button.idl-submit span'),
        closeButton: downloadAppDiv.querySelector('button.idl-close'),
        smallprint: downloadAppDiv.querySelector('.idl-smallprint'),
        thanks: downloadAppDiv.querySelector('.idl-thanks'),
        thanksText: downloadAppDiv.querySelector('.idl-thanks .text'),
        downloadLink: downloadAppDiv.querySelector('.idl-thanks a'),
        progress: downloadAppDiv.querySelector('.idl-progress'),
        form: downloadAppDiv.querySelector('form'),
        organisation: downloadAppDiv.querySelector('.organisation'),
        questionLabel: downloadAppDiv.querySelector('.question label span'),
        questionResponse: downloadAppDiv.querySelector('.question textarea'),
        followupLabel: downloadAppDiv.querySelector('.followup label span'),
        followup: downloadAppDiv.querySelector('.followup select')
      }; // Set up the thanks and hide it.

      nodes.thanksText.innerHTML = inlay.initData.webThanksHTML;
      nodes.thanks.style.display = 'none'; // Set button text

      nodes.submitButtonText.textContent = inlay.initData.buttonText; // Set up other texts

      nodes.smallprint.innerHTML = inlay.initData.smallprintHTML;
      nodes.questionLabel.textContent = inlay.initData.questionText;
      nodes.followupLabel.textContent = inlay.initData.followupText;
      var allInputs = ['emailInput', 'firstNameInput', 'lastNameInput', 'email2Input', 'organisation'].map(function (i) {
        return nodes[i];
      }); // Provide ways to close the overlay.

      nodes.overlay.addEventListener('click', function (e) {
        if (this === e.target) reset();
      });
      nodes.thanks.addEventListener('click', reset);
      nodes.closeButton.addEventListener('click', reset); // Initial state: don't show validation errors.

      allInputs.forEach(function (i) {
        // Inputs have a .pre-interaction class until they've been interacted
        // with, or the form has been submitted.
        i.classList.add('pre-interaction');
        i.addEventListener('input', function (e) {
          return handleInputInterraction(i);
        });
        i.addEventListener('focus', function (e) {
          return handleInputInterraction(i);
        });
      }); // Submit button clicked (form may be valid or not)
      // Remove the pre-interaction classes from all inputs when submit pressed.

      nodes.submitButton.addEventListener('click', function (e) {
        console.log('buttonclick');
        allInputs.forEach(function (i) {
          return handleInputInterraction;
        }); // Invalidate if emails don't match.

        if (nodes.email2Input.value !== nodes.emailInput.value) {
          alert("Please check your email; the two don't match"); // Prevent form submission.

          e.preventDefault();
          return;
        }
      });
      var progress = {
        doneBefore: 0,
        jobTotal: 100,
        expectedTime: null,
        percent: 0,
        start: null
      };

      function animateTimer(t) {
        if (!progress.start) {
          progress.start = t;
        }

        var linear = Math.min(1, (t - progress.start) / progress.expectedTime);
        var easeout = 1 - (1 - linear) * (1 - linear) * (1 - linear);
        progress.percent = progress.doneBefore + easeout * (progress.percentDoneAtEndOfJob - progress.doneBefore);
        nodes.progress.style.width = progress.percent + '%';

        if (progress.running && linear < 1) {
          window.requestAnimationFrame(animateTimer);
        } else {
          progress.running = false;
        }
      }

      function startTimer(expectedTime, percentDoneAtEndOfJob, reset) {
        expectedTime = expectedTime * 1000;

        if (reset) {
          progress = {
            doneBefore: 0,
            percentDoneAtEndOfJob: percentDoneAtEndOfJob,
            expectedTime: expectedTime,
            percent: 0,
            start: null,
            running: false
          }; // Start animation.

          nodes.progress.parentNode.classList.add('active');
        } else {
          // Adding a job.
          progress.doneBefore = progress.percent;
          progress.start = null;
          progress.expectedTime = expectedTime;
          progress.percentDoneAtEndOfJob = percentDoneAtEndOfJob;
        }

        if (!progress.running) {
          // Start animation.
          progress.running = true;
          window.requestAnimationFrame(animateTimer);
        }
      }

      window.cancelTimer = function cancelTimer() {
        progress.start = null;
        progress.running = false;
        nodes.progress.parentNode.classList.remove('active');
      };

      nodes.form.addEventListener('submit', function (e) {
        console.log('submitted and valid');
        e.preventDefault(); // todo validation in case browser validation is not supported.

        nodes.submitButton.disabled = true;
        nodes.submitButton.textContent = 'Just a mo...'; // Expect it to take 2s to do first 20%

        startTimer(2, 20, 1);

        function cancelSubmission() {
          nodes.submitButton.disabled = false;
          nodes.submitButtonText.textContent = inlay.initData.buttonText;
          cancelTimer();
        }

        inlay.request({
          method: 'post',
          body: getFormData()
        }).then(function (r) {
          if (!r) {
            return;
          } else if (r.error) {
            alert("Sorry, there was a problem with the form: " + r.error);
            cancelSubmission();
          } else if (r.token) {
            console.log("Token received, waiting 5s"); // Expect it to take 6s to get to 80% though we'll be done in 5.

            startTimer(6, 80);
            setTimeout(function () {
              console.log("Sending 2nd request, with token"); // Expect it to take 2s to get to 100%

              startTimer(2, 100);
              inlay.request({
                method: 'post',
                body: getFormData(r.token)
              }).then(function (r) {
                if (r.success) {
                  cancelTimer();
                  nodes.form.style.display = 'none';
                  nodes.thanks.style.display = ''; // Redirect browser to the download page.

                  nodes.downloadLink.setAttribute('href', '/download/' + report.id);
                  window.location = '/download/' + report.id;
                } else {
                  alert("Sorry, there was a problem with the form: " + (r.error || 'unknown error'));
                  cancelSubmission();
                  return;
                }
              });
            }, 5000);
          }
        })["catch"](function (e) {
          console.error("coDownload catch", e);
          cancelSubmission();
        });
      }); // Add to page.

      inlay.script.insertAdjacentElement('afterend', downloadAppDiv);
    };
  }
})();

/***/ }),

/***/ "./src/coDownload.scss":
/*!*****************************!*\
  !*** ./src/coDownload.scss ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../node_modules/css-loader!../node_modules/postcss-loader/src??ref--6-2!../node_modules/sass-loader/dist/cjs.js??ref--6-3!./coDownload.scss */ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./src/coDownload.scss");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ 3:
/*!*********************************!*\
  !*** multi ./src/coDownload.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /var/www/records.climateoutreach.org.uk/sites/all/modules/coin/civicrm/extensions/inlaysignup/src/coDownload.js */"./src/coDownload.js");


/***/ })

/******/ });