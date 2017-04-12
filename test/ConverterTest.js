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
			var reactElement = converter.convert('# Hello\n\n<MyComponent tag="strong" />');
			var actualHtml = renderToStaticMarkup(reactElement);
			var expectedHtml = '<div><h1 id="hello">Hello</h1>\n<p><mycomponent></mycomponent></p></div>';
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
			var expectedHtml = '<table><thead><tr><th>h1</th><th>h2</th><th>h3</th></tr></thead><tbody><tr><td><em>foo</em></td><td><strong>bar</strong></td><td>baz</td></tr></tbody></table>';
			assert.equal(actualHtml, expectedHtml);
		});

		it('should handle className attribute', function() {
			var converter = new Converter({ components: { 'MyComponent': MyComponent }});
			var reactElement = converter.convert('# Hello\n\n<MyComponent tag="strong" className="foo" />');
			var actualHtml = renderToStaticMarkup(reactElement);
			var expectedHtml = '<div><h1 id="hello">Hello</h1>\n<p><strong class="foo"></strong></p></div>';
			assert.equal(actualHtml, expectedHtml);
		});

	});
});
