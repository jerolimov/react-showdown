import * as React from 'react';

import MarkdownView from '../..';

export default function App() {
  const markdown = `
<style>
  h1 { color: blue; }
</style>
# Welcome to React Showdown!

![A forest trail in autumn](https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_1280.jpg)

---

<input children='Hello' />

To get started, edit the markdown in \`example/src/App.tsx\`.

| Column 1 | Column 2 |
|----------|----------|
| A1       | B1       |
| A2       | B2       |

<h2>Supports HTML in markdown</h2>

<h2 class="x">Headline with class</h2>

<h2 className="x">Headline with className</h2>

<h2 style="color: red; border: 2px solid red; border-color: blue;">Headline with style</h2>

## Supports Emojis as well :+1:

<InlineComponent />

Hello &Uuml;laute! ;)

**Hello &Uuml;laute! ;)**

<strong>Hello &Uuml;laute! ;)</strong>

|h1|h2|h3|
|:--|:--:|--:|
|*foo*|**bar**|baz|
`;

  return (
    <MarkdownView
      markdown={markdown}
      options={{ tables: true, emoji: true }}
      components={{ InlineComponent }}
    />
  );
};

function InlineComponent() {
  return (
    <span>Inline rendered Component!</span>
  )
}
