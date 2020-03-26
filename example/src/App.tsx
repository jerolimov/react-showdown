import * as React from 'react';

import MarkdownView from '../..';

export default function App() {
  const markdown = `
# Welcome to React Showdown!

To get started, edit the markdown in \`example/src/App.tsx\`.

| Column 1 | Column 2 |
|----------|----------|
| A1       | B1       |
| A2       | B2       |
`;

  return (
    <div>
      <MarkdownView markdown={markdown} />
    </div>
  );
};
