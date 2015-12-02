/* global describe, it */

var assert = require('assert');

var React = require('react');
var ReactDOMServer = require('react-dom/server');

var renderToStaticMarkup = ReactDOMServer.renderToStaticMarkup;

var ReactShowdown = require('../lib');
var Converter = ReactShowdown.Converter;

var showdown = require('showdown');
showdown.extensions.twitter = require('showdown-twitter');

var MyCompontent = React.createClass({
	render: function() {
		return React.createElement(this.props.tag, null, this.props.children);
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
			var expectedHtml = '<div><h1 id="hello">Hello</h1>\n\n<p>More content...</p></div>';
			assert.equal(actualHtml, expectedHtml);
		});

		it('should convert markdown with showdown extension to react elements', function() {
			var converter = new Converter({ converter: { extensions: [ 'twitter' ] }});
			var reactElement = converter.convert('Hello @jerolimov');
			var actualHtml = renderToStaticMarkup(reactElement);
			var expectedHtml = '<p>Hello <a href="http://twitter.com/jerolimov">@jerolimov</a></p>';
			assert.equal(actualHtml, expectedHtml);
		});

		it('should keep unknown tags', function() {
			var converter = new Converter();
			var reactElement = converter.convert('# Hello\n\n<MyCompontent tag="strong" />');
			var actualHtml = renderToStaticMarkup(reactElement);
			var expectedHtml = '<div><h1 id="hello">Hello</h1>\n\n<p><mycompontent></mycompontent></p></div>';
			assert.equal(actualHtml, expectedHtml);
		});

		it('should convert markdown with react component tag to react elements without children', function() {
			var converter = new Converter({ components: { 'MyCompontent': MyCompontent }});
			var reactElement = converter.convert('# Hello\n\n<MyCompontent tag="strong" />');
			var actualHtml = renderToStaticMarkup(reactElement);
			var expectedHtml = '<div><h1 id="hello">Hello</h1>\n\n<p><strong></strong></p></div>';
			assert.equal(actualHtml, expectedHtml);
		});

		it('should convert markdown with react component tag to react elements with children', function() {
			var converter = new Converter({ components: { 'MyCompontent': MyCompontent }});
			var reactElement = converter.convert('# Hello\n\n<MyCompontent tag="strong">More Content...</MyCompontent>');
			var actualHtml = renderToStaticMarkup(reactElement);
			var expectedHtml = '<div><h1 id="hello">Hello</h1>\n\n<p><strong>More Content...</strong></p></div>';
			assert.equal(actualHtml, expectedHtml);
		});

		it('should convert markdown with comment', function() {
			var converter = new Converter();
			var reactElement = converter.convert('# Hello\n\n<!-- Comment -->');
			var actualHtml = renderToStaticMarkup(reactElement);
			var expectedHtml = '<div><h1 id="hello">Hello</h1>\n\n</div>';
			assert.equal(actualHtml, expectedHtml);
		});
	});
});
