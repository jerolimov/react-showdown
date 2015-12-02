# react-showdown [![Build status][travis-image]][travis-url] [![Test coverage][coveralls-image]][coveralls-url] [![Dependency Status][dependency-image]][dependency-url]

> Render [React](http://facebook.github.io/react/index.html)
> [components](http://facebook.github.io/react/docs/component-specs.html)
> within markdown and markdown as React components!

### Features

* **Render markdown as React components.**
* **Render React components within the markdown!**
* Supports [Showdown extensions](https://github.com/showdownjs/showdown/wiki/extensions), like the
  [Twitter Extension](https://github.com/showdownjs/twitter-extension) and the
  [Youtube Extension](https://github.com/showdownjs/youtube-extension).

### Installation

```bash
npm install --save react-showdown
```

### Use as React component

Really simple markdown example with ES6/JSX:

```jsx
import { Markdown } from 'react-showdown';

render: () => {
    var markdown = '# Hello\n\nMore content...';
    return <Markdown markup={ markdown } />
}
```

Use a React component and use it within the markdown with ES6/JSX:

```jsx
import { Markdown } from 'react-showdown';

const MyComponent extends Component {
	render() {
		return React.createElement(this.props.tag, null, this.props.children);
	}
};

render: () => {
    var markdown = '# Hello\n\n<MyComponent tag="strong">More Content...</MyComponent>';
    return <Markdown markup={ markdown } components={{ MyComponent }} />
}
```

### Use the converter

Really simple markdown example:

```js
var Converter = require('react-showdown').Converter;
var converter = new Converter();

var markdown = '# Hello\n\nMore content...';
var reactElement = converter.convert(markdown);
```

Use a React component and use it within the markdown:

```js
var MyComponent = React.createClass({
	render: function() {
		return React.createElement(this.props.tag, null, this.props.children);
	}
});

var Converter = require('react-showdown').Converter;
var converter = new ReactShowdown.Converter({ components: { 'MyComponent': MyComponent }});

var markdown = '# Hello\n\n<MyComponent tag="strong">More Content...</MyComponent>';
var reactElement = converter.convert(markdown);
```

### Available props / converter options

Converter options will be pushed forward to the showdown converter, please
checkout the [valid options section](https://github.com/showdownjs/showdown#valid-options).

Just the `components` option is managed by this converter.
It define the component name (tag name) to component React class definition
(instance of React.createClass) mapping. See example above.

### Credits

Project is based on the markdown parser [Showdown](https://github.com/showdownjs/showdown) and
the "forgiving" [htmlparser2](https://github.com/fb55/htmlparser2/).

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
