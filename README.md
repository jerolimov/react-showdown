# react-showdown [![Build status][travis-image]][travis-url] [![Test coverage][coveralls-image]][coveralls-url] [![Dependency Status][dependency-image]][dependency-url]

> Converts markdown with showdown to React components

### Features

* Converts markdown to React components
* Supports [Showdown extensions](https://github.com/showdownjs/showdown/wiki/extensions), like the
  [Twitter Extension](https://github.com/showdownjs/twitter-extension) and the
  [Youtube Extension](https://github.com/showdownjs/youtube-extension)
* **Supports React components within the markdown!**

### Installation

```bash
npm install --save react-showdown
```

### Usage

Really simple markdown example:

```js
var ReactShowdown = require('react-showdown');
var converter = new ReactShowdown.Converter();

var content = converter.convert('# Hello\n\nMore content...');
```

Use a React component and use it within the markdown:

```js
var MyCompontent = React.createClass({
	render: function() {
		return React.createElement(this.props.tag, null, this.props.children);
	}
});

var ReactShowdown = require('react-showdown');
var converter = new ReactShowdown.Converter({ components: { 'MyCompontent': MyCompontent }});

var content = converter.convert('# Hello\n\n<MyCompontent tag="strong" />');
```

### Credits

Project is based on the markdown parser [Showdown](https://github.com/showdownjs/showdown) and
html parser [cheerio](https://github.com/cheeriojs/cheerio).

But we should replace it with the underlaying [htmlparser2](https://github.com/fb55/htmlparser2/)..

### Alternatives

* [reactdown](https://github.com/andreypopp/reactdown)
* [react-markdown](https://github.com/rexxars/react-markdown), based on
  [commonmark.js](https://github.com/jgm/commonmark.js)
* [commonmark-react-renderer](https://github.com/rexxars/commonmark-react-renderer), based on
  [commonmark.js](https://github.com/jgm/commonmark.js)

[travis-image]: https://img.shields.io/travis/jerolimov/react-showdown/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/jerolimov/react-showdown
[coveralls-image]: https://img.shields.io/coveralls/jerolimov/react-showdown/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/jerolimov/react-showdown
[dependency-image]: http://img.shields.io/david/jerolimov/react-showdown.svg?style=flat-square
[dependency-url]: https://david-dm.org/jerolimov/react-showdown
