import React from 'react';
import TestRenderer from 'react-test-renderer';

import MarkdownView, { MarkdownViewProps } from './MarkdownView';

describe('MarkdownView', () => {
  const renderHTML = (props: MarkdownViewProps) => {
    const testRenderer = TestRenderer.create(<MarkdownView {...props} />);
    const html = testRenderer.toJSON()!.props.dangerouslySetInnerHTML.__html;
    return html;
  };

  it('renders simple markdown', () => {
    const markdown = '# Headline level 1!\n\nAnother paragraph.\n\n';
    const html = renderHTML({ markdown });
    expect(html).toMatch('<h1 id="headlinelevel1">Headline level 1!</h1>');
    expect(html).toMatch('<p>Another paragraph.</p>');
  });

  it('renders markdown table', () => {
    const markdown = `
| Column 1 | Column 2 |
|----------|----------|
| A1       | B1       |
| A2       | B2       |
`;
    const html = renderHTML({ markdown });
    expect(html).toMatch('<th>Column 1</th>');
    expect(html).toMatch('<th>Column 2</th>');
    expect(html).toMatch('<td>A1</td>');
    expect(html).toMatch('<td>B1</td>');
    expect(html).toMatch('<td>A2</td>');
    expect(html).toMatch('<td>B2</td>');
  });
});
