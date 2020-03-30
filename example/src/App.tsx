import * as React from 'react';

import MarkdownView from '../..';

export default function App() {
  const markdown = `
<style>
  h1 { color: blue; }
</style>
# Welcome to React Showdown!

To get started, edit the markdown in \`example/src/App.tsx\`.

| Column 1 | Column 2 |
|----------|----------|
| A1       | B1       |
| A2       | B2       |

<h2>Supports HTML in markdown</h2>

<h2 class="x">Headline with class</h2>

<h2 className="x">Headline with className</h2>

## Supports Emojis as well :+1:

<InlineComponent />

Hello &Uuml;laute! ;)

**Hello &Uuml;laute! ;)**

<strong>Hello &Uuml;laute! ;)</strong>

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
