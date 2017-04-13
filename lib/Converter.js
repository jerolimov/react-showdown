/*eslint no-console: 0*/

var React = require('react');
var showdown  = require('showdown');
var htmlparser = require('htmlparser2');

/**
 * Example: new Converter(options).convert(markdown)
 *
 * Options will be pushed forward to the showdown converter:
 * https://github.com/showdownjs/showdown#valid-options
 * Just the `components` option is managed by this converter.
 * It define the component name (tag name) to component React class definition
 * (instance of createClass) mapping.
 */
module.exports = function Converter(options) {
	'use strict';
	var self = this;

	this._converter = new showdown.Converter(options);

	// remove newlines from table tags
	this._converter.listen('tables.after', function(_, text) {
		var result = text;
		var tags = ['table', 'thead', 'tbody', 'tfoot', 'th', 'tr', 'td'];
		tags.forEach(function(tag) {
			result = result
				.replace(new RegExp('\n<' + tag, 'g'), '<' + tag)
				.replace(new RegExp('\n</' + tag, 'g'), '</' + tag);
		});
		return result;
	});

	this._components = {};
	for (var key in (options && options.components || {})) {
		this._components[key.toLowerCase()] = options.components[key];
	}

	// remove the style attribute and apply it after component mount
	function fixStyle(element) {
		if (!element.attribs.style) {
			return;
		}
		var style = element.attribs.style;
		delete element.attribs.style;
		element.attribs.ref = function(c) {
			if (c) {
				c.setAttribute('style', style);
			}
		};
	}

	function fixClassName(element) {
		if (!element.attribs.classname) {
			return;
		}
		element.attribs.className = element.attribs.classname;
		delete element.attribs.classname;
	}

	this._mapElement = function(element) {
		if (element.type === 'tag') {
			fixStyle(element);
			fixClassName(element);

			// this is used to let showdown know whether or not to render md inside of
			// an html element - we want to strip this out before we go to react to
			// avoid unknown prop warnings
			delete element.attribs.markdown;

			var component = this._components[element.name] || element.name;
			return React.createElement(component, element.attribs, this._mapElements(element.children));
		} else if (element.type === 'text') {
			return element.data;
		} else if (element.type === 'comment') {
			// noop
			return null;
		} else {
			console.warn('Warning: Could not map element with type ' + element.type + ' yet.');
			return null;
		}
	};

	this._mapElements = function(elements) {
		var children = React.Children.toArray(elements.map(function(element) {
			return self._mapElement(element);
		}).filter(function(element) {
			return element;
		}));
		return children.length === 0 ? null : children;
	};

	this.convert = function(markdown) {
		var html = this._converter.makeHtml(markdown);
		var root = htmlparser.parseDOM(html);
		var reactElements = this._mapElements(root);
		if (reactElements && reactElements.length === 1) {
			return reactElements[0];
		} else {
			return React.createElement('div', null, reactElements);
		}
	};
};
