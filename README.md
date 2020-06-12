# react-showdown [![Build status][travis-image]][travis-url] [![Test coverage][coveralls-image]][coveralls-url] [![Dependency Status][dependency-image]][dependency-url]

> Render [React](http://facebook.github.io/react/index.html)
> [components](http://facebook.github.io/react/docs/component-specs.html)
> within markdown and markdown as React components!

## Features

* **Render markdown as React components.**
* **Render React components within the markdown!**
* Full TypeScript Support.
* Fully tested.
* Supports all [Showdown extensions](https://github.com/showdownjs/showdown/wiki/extensions), like the
  [Twitter Extension](https://github.com/showdownjs/twitter-extension) and the
  [Youtube Extension](https://github.com/showdownjs/youtube-extension).
* New in 2.0: Supports Showdown Flavors!
* New in 2.1:
  * Fixes [#54](https://github.com/jerolimov/react-showdown/issues/54): Missing content after a self-closing component. This was fixed by setting the default value of showdown config `recognizeSelfClosing` to `true`. Thanks [@n1ru4l](https://github.com/n1ru4l)
  * New feature: add new optional `sanitizeHtml` prop for sanitizing html before it was rendered. Thanks [@n1ru4l](https://github.com/n1ru4l) aswell.

## Installation

```bash
npm install --save react-showdown
```

or

```bash
yarn add react-showdown
```

## Use as React component

Example with ES6/JSX:

```jsx
import React from 'react';
import MarkdownView from 'react-showdown';

export default function App() {
  const markdown = `
# Welcome to React Showdown :+1:

To get started, edit the markdown in \`example/src/App.tsx\`.

| Column 1 | Column 2 |
|----------|----------|
| A1       | B1       |
| A2       | B2       |
`;

  return (
    <MarkdownView
      markdown={markdown}
      options={{ tables: true, emoji: true }}
    />
  );
};
```

Use a React component and use it within the markdown with ES6 / TypeScript:

```jsx
import MarkdownView from 'react-showdown';

function CustomComponent({ name }: { name: string }) {
  return <span>Hello {name}!</span>;
}

const markdown = `
# A custom component:

<CustomComponent name="world" />`;

<MarkdownView markdown={markdown} components={{ CustomComponent }} />
```

## Available props

* markdown, string, required
* flavor, Flavor, optional
* options, ConverterOptions, optional
* extensions, showdown extensions, optional
* components, components, optional 

Converter options will be pushed forward to the showdown converter, please
checkout the [valid options section](https://github.com/showdownjs/showdown#valid-options).

## Credits

Project is based on the markdown parser [Showdown](https://github.com/showdownjs/showdown) and
the html parser [htmlparser2](https://github.com/fb55/htmlparser2/).

## Alternatives

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
