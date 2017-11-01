/* global describe, it */

var assert = require('assert');

var React = require('react');
var ReactDOMServer = require('react-dom/server');
var createClass = require('create-react-class');

var renderToStaticMarkup = ReactDOMServer.renderToStaticMarkup;

var Converter = require('../lib').Converter;

var showdown = require('showdown');
showdown.extensions.twitter = require('showdown-twitter');

var MyComponent = createClass({
	render: function() {
		var props = Object.assign({}, this.props);
		delete props.tag;
		delete props.children;
		return React.createElement(this.props.tag, props, this.props.children);
	}
});

var ThComponent = createClass({
	render: function() {
		return React.createElement('th', this.props);
	}
});

describe('Converter', function() {
	describe('Object', function() {
		it('should be a function', function() {
			assert.equal('function', typeof Converter);
		});

		it('should support new without options', function() {
			assert.equal('object', typeof new Converter());
		});

		it('should support new with options', function() {
			assert.equal('object', typeof new Converter({}));
		});
	});

	describe('convert', function() {
		it('should be a function', function() {
			var converter = new Converter();
			assert.equal('function', typeof converter.convert);
		});

		it('should convert simple markdown to a react element', function() {
			var converter = new Converter();
			var reactElement = converter.convert('# Hello');
			var actualHtml = renderToStaticMarkup(reactElement);
			var expectedHtml = '<h1 id="hello">Hello</h1>';
			assert.equal(actualHtml, expectedHtml);
		});

		it('should convert little bit more complex markdown to react elements', function() {
			var converter = new Converter();
			var reactElement = converter.convert('# Hello\n\nMore content...');
			var actualHtml = renderToStaticMarkup(reactElement);
			var expectedHtml = '<div><h1 id="hello">Hello</h1>\n<p>More content...</p></div>';
			assert.equal(actualHtml, expectedHtml);
		});

		it('should convert markdown with showdown extension to react elements', function() {
			var converter = new Converter({ extensions: [ 'twitter' ] });
			var reactElement = converter.convert('Hello @jerolimov');
			var actualHtml = renderToStaticMarkup(reactElement);
			var expectedHtml = '<p>Hello <a href="http://twitter.com/jerolimov">@jerolimov</a></p>';
			assert.equal(actualHtml, expectedHtml);
		});

		it('should keep unknown tags', function() {
			var converter = new Converter();
			var reactElement = converter.convert('# Hello\n\n<MyComponent />');
			var actualHtml = renderToStaticMarkup(reactElement);
			var expectedHtml = '<div><h1 id="hello">Hello</h1>\n<p><MyComponent></MyComponent></p></div>';
			assert.equal(actualHtml, expectedHtml);
		});

		it('should convert markdown with react component tag to react elements without children', function() {
			var converter = new Converter({ components: { 'MyComponent': MyComponent }});
			var reactElement = converter.convert('# Hello\n\n<MyComponent tag="strong" />');
			var actualHtml = renderToStaticMarkup(reactElement);
			var expectedHtml = '<div><h1 id="hello">Hello</h1>\n<p><strong></strong></p></div>';
			assert.equal(actualHtml, expectedHtml);
		});

		it('should convert markdown with react component tag to react elements with children', function() {
			var converter = new Converter({ components: { 'MyComponent': MyComponent }});
			var reactElement = converter.convert('# Hello\n\n<MyComponent tag="strong">More Content...</MyComponent>');
			var actualHtml = renderToStaticMarkup(reactElement);
			var expectedHtml = '<div><h1 id="hello">Hello</h1>\n<p><strong>More Content...</strong></p></div>';
			assert.equal(actualHtml, expectedHtml);
		});

		it('should convert markdown with comment', function() {
			var converter = new Converter();
			var reactElement = converter.convert('# Hello\n\n<!-- Comment -->');
			var actualHtml = renderToStaticMarkup(reactElement);
			var expectedHtml = '<div><h1 id="hello">Hello</h1>\n</div>';
			assert.equal(actualHtml, expectedHtml);
		});

		it('should convert markdown to table tags', function() {
			var converter = new Converter({ tables: true });
			var reactElement = converter.convert('|h1|h2|h3|\n|:--|:--:|--:|\n|*foo*|**bar**|baz|');
			var actualHtml = renderToStaticMarkup(reactElement);
			var expectedHtml = '<table><thead><tr><th style="text-align:left;">h1</th><th style="text-align:center;">h2</th><th style="text-align:right;">h3</th></tr></thead><tbody><tr><td style="text-align:left;"><em>foo</em></td><td style="text-align:center;"><strong>bar</strong></td><td style="text-align:right;">baz</td></tr></tbody></table>';
			assert.equal(actualHtml, expectedHtml);
		});

		it('should handle mixed case attributes', function() {
			var converter = new Converter({ components: { 'MyComponent': MyComponent }});
			var reactElement = converter.convert('# Hello\n\n<MyComponent tag="strong" className="foo" />');
			var actualHtml = renderToStaticMarkup(reactElement);
			var expectedHtml = '<div><h1 id="hello">Hello</h1>\n<p><strong class="foo"></strong></p></div>';
			assert.equal(actualHtml, expectedHtml);
		});

		it('should strip the markdown prop', function() {
			var converter = new Converter({ components: { 'MyComponent': MyComponent }});
			var reactElement = converter.convert('<MyComponent markdown="1" tag="strong"/>');
			assert.deepEqual(reactElement.props.children[0].props, { tag: 'strong', children: null });
		});

		it('should handle class attributes of inline html', function() {
			var converter = new Converter({ components: { 'MyComponent': MyComponent }});
			var reactElement = converter.convert('<span class="foo">text</span><MyComponent markdown="1" tag="strong"/>');
			var actualHtml = renderToStaticMarkup(reactElement);
			var expectedHtml = '<p><span class="foo">text</span><strong></strong></p>';
			assert.equal(actualHtml, expectedHtml);
		});

		it('should render custom components with style attribute', function() {
			var converter = new Converter({ components: { th: ThComponent }, tables: true });
			var reactElement = converter.convert('| a | b |\n|:--|---|\n| 1 | 2 |');
			var actualHtml = renderToStaticMarkup(reactElement);
			var expectedHtml = '<table><thead><tr><th style="text-align:left;">a</th><th>b</th></tr></thead><tbody><tr><td style="text-align:left;">1</td><td>2</td></tr></tbody></table>';
			assert.equal(actualHtml, expectedHtml);
		});
	});
});
