/* global describe, it */

var assert = require('assert');

var React = require('react');
var ReactDOMServer = require('react-dom/server');
var createClass = require('create-react-class');

var renderToStaticMarkup = ReactDOMServer.renderToStaticMarkup;

var Element = require('../lib').Element;

var showdown = require('showdown');
showdown.extensions.twitter = require('showdown-twitter');

var MyComponent = createClass({
	render: function() {
		return React.createElement(this.props.tag, null, this.props.children);
	}
});

describe('Element', function() {
	it('should render simple markdown with markdown tag', function() {
		var reactElement = React.createElement(Element, { markdown: '# Hello' });
		var actualHtml = renderToStaticMarkup(reactElement);
		var expectedHtml = '<h1 id="hello">Hello</h1>';
		assert.equal(actualHtml, expectedHtml);
	});

	it('should render simple markdown with markup tag', function() {
		var reactElement = React.createElement(Element, { markup: '# Hello' });
		var actualHtml = renderToStaticMarkup(reactElement);
		var expectedHtml = '<h1 id="hello">Hello</h1>';
		assert.equal(actualHtml, expectedHtml);
	});

	it('should render little bit more complex markdown', function() {
		var reactElement = React.createElement(Element, { markdown: '# Hello\n\nMore content.' });
		var actualHtml = renderToStaticMarkup(reactElement);
		var expectedHtml = '<div><h1 id="hello">Hello</h1>\n<p>More content.</p></div>';
		assert.equal(actualHtml, expectedHtml);
	});

	it('should render markdown with showdown extension', function() {
		var reactElement = React.createElement(Element, { markdown: 'Hello @jerolimov', extensions: [ 'twitter' ] });
		var actualHtml = renderToStaticMarkup(reactElement);
		var expectedHtml = '<p>Hello <a href="http://twitter.com/jerolimov">@jerolimov</a></p>';
		assert.equal(actualHtml, expectedHtml);
	});

	it('should keep unknown tags', function() {
		var reactElement = React.createElement(Element, { markdown: '# Hello\n\n<MyComponent/>' });
		var actualHtml = renderToStaticMarkup(reactElement);
		var expectedHtml = '<div><h1 id="hello">Hello</h1>\n<p><MyComponent></MyComponent></p></div>';
		assert.equal(actualHtml, expectedHtml);
	});

	it('should render markdown with react component tag without children', function() {
		var reactElement = React.createElement(Element, { markdown: '# Hello\n\n<MyComponent tag="strong" />', components: { 'MyComponent': MyComponent } });
		var actualHtml = renderToStaticMarkup(reactElement);
		var expectedHtml = '<div><h1 id="hello">Hello</h1>\n<p><strong></strong></p></div>';
		assert.equal(actualHtml, expectedHtml);
	});

	it('should render markdown with react component tag with children', function() {
		var reactElement = React.createElement(Element, { markdown: '# Hello\n\n<MyComponent tag="strong">More Content.</MyComponent>', components: { 'MyComponent': MyComponent } });
		var actualHtml = renderToStaticMarkup(reactElement);
		var expectedHtml = '<div><h1 id="hello">Hello</h1>\n<p><strong>More Content.</strong></p></div>';
		assert.equal(actualHtml, expectedHtml);
	});

	it('should render markdown with comment', function() {
		var reactElement = React.createElement(Element, { markdown: '# Hello\n\n<!-- Comment -->' });
		var actualHtml = renderToStaticMarkup(reactElement);
		var expectedHtml = '<div><h1 id="hello">Hello</h1>\n</div>';
		assert.equal(actualHtml, expectedHtml);
	});

	it('should render markdown to table tags', function() {
		var reactElement = React.createElement(Element, { markdown: '|h1|h2|h3|\n|:--|:--:|--:|\n|*foo*|**bar**|baz|', tables: true });
		var actualHtml = renderToStaticMarkup(reactElement);
		var expectedHtml = '<table><thead><tr><th>h1</th><th>h2</th><th>h3</th></tr></thead><tbody><tr><td><em>foo</em></td><td><strong>bar</strong></td><td>baz</td></tr></tbody></table>';
		assert.equal(actualHtml, expectedHtml);
	});
});
