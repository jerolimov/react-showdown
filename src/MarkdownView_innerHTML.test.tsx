import React from 'react';
import TestRenderer from 'react-test-renderer';

import MarkdownView, {
  MarkdownViewProps,
  GlobalConfiguration,
  ShowdownExtension,
} from './';

afterEach(() => {
  GlobalConfiguration.resetExtensions();
  GlobalConfiguration.resetOptions();
});

describe('MarkdownView', () => {
  const renderInnerHTML = (props: MarkdownViewProps) => {
    const testRenderer = TestRenderer.create(
      <MarkdownView dangerouslySetInnerHTML {...props} />
    );
    const html = (testRenderer.toJSON()! as TestRenderer.ReactTestRendererJSON)
      .props.dangerouslySetInnerHTML.__html;
    return html;
  };

  it('render markdown', () => {
    const markdown = '# Headline level 1!\n\nAnother paragraph.\n\n';
    const html = renderInnerHTML({ markdown });
    expect(html).toMatch('<h1 id="headlinelevel1">Headline level 1!</h1>');
    expect(html).toMatch('<p>Another paragraph.</p>');
  });

  it('render markdown table', () => {
    const markdown = `
| Column 1 | Column 2 |
|----------|----------|
| A1       | B1       |
| A2       | B2       |
`;
    const html = renderInnerHTML({ markdown, options: { tables: true } });
    expect(html).toMatch('<th>Column 1</th>');
    expect(html).toMatch('<th>Column 2</th>');
    expect(html).toMatch('<td>A1</td>');
    expect(html).toMatch('<td>B1</td>');
    expect(html).toMatch('<td>A2</td>');
    expect(html).toMatch('<td>B2</td>');
  });

  it('render markdown table with flavor github', () => {
    const markdown = `
| Column 1 | Column 2 |
|----------|----------|
| A1       | B1       |
| A2       | B2       |
`;
    const html = renderInnerHTML({ flavor: 'github', markdown });
    expect(html).toMatch('<th id="column_1">Column 1</th>');
    expect(html).toMatch('<th id="column_2">Column 2</th>');
    expect(html).toMatch('<td>A1</td>');
    expect(html).toMatch('<td>B1</td>');
    expect(html).toMatch('<td>A2</td>');
    expect(html).toMatch('<td>B2</td>');
  });

  it('render markdown table with flavor original', () => {
    const markdown = `
| Column 1 | Column 2 |
|----------|----------|
| A1       | B1       |
| A2       | B2       |
`;
    const html = renderInnerHTML({ flavor: 'original', markdown });
    expect(html).toMatch('| Column 1 | Column 2 |');
    expect(html).toMatch('|----------|----------|');
    expect(html).toMatch('| A1       | B1       |');
    expect(html).toMatch('| A2       | B2       |');
  });

  it('render html as it was parsed', () => {
    const markdown = '<h1>Title</h1>';
    const html = renderInnerHTML({ markdown });
    expect(html).toMatch('<h1>Title</h1>');
  });

  it('render html class name', () => {
    const markdown = '<h1 class="red">A red title</h1>';
    const html = renderInnerHTML({ markdown });
    expect(html).toMatch('<h1 class="red">A red title</h1>');
  });

  it('render html style', () => {
    const markdown = '<h1 style="color: red;">A red title</h1>';
    const html = renderInnerHTML({ markdown });
    expect(html).toMatch('<h1 style="color: red;">A red title</h1>');
  });

  it('render text emojies', () => {
    const markdown = ':showdown: :+1:';
    const html = renderInnerHTML({ markdown, options: { emoji: true } });
    expect(html).not.toMatch(':showdown:');
    expect(html).not.toMatch(':+1:');
    expect(html).toMatch(/<span.*>S<\/span>/);
    expect(html).toMatch('👍');
  });

  it('render custom output extension (via global name)', () => {
    // Register global extension
    GlobalConfiguration.setExtension('big', {
      type: 'output',
      regex: new RegExp(`<h1(.*)>`, 'g'),
      replace: `<h1 class="big" $1>`,
    });

    const markdown = '# Example headline';
    const html = renderInnerHTML({
      markdown,
      options: { extensions: ['big'] },
    });
    expect(html).toMatch(
      '<h1 class="big"  id="exampleheadline">Example headline</h1>'
    );
  });

  it('render custom output extension (via options)', () => {
    const extension: ShowdownExtension = {
      type: 'output',
      regex: new RegExp(`<h1(.*)>`, 'g'),
      replace: `<h1 class="big" $1>`,
    };

    const markdown = '# Example headline';
    const html = renderInnerHTML({
      markdown,
      options: { extensions: [extension] },
    });
    expect(html).toMatch(
      '<h1 class="big"  id="exampleheadline">Example headline</h1>'
    );
  });

  it('render custom output extension (via prop)', () => {
    const extension: ShowdownExtension = {
      type: 'output',
      regex: new RegExp(`<h1(.*)>`, 'g'),
      replace: `<h1 class="big" $1>`,
    };

    const markdown = '# Example headline';
    const html = renderInnerHTML({ markdown, extensions: [extension] });
    expect(html).toMatch(
      '<h1 class="big"  id="exampleheadline">Example headline</h1>'
    );
  });

  it('render custom language extension (via global name)', () => {
    // Register global extension
    GlobalConfiguration.setExtension('autocorrect', {
      type: 'lang',
      regex: /Markdown/,
      replace: 'Showdown',
    });

    const markdown = 'Markdown ftw!';
    const html = renderInnerHTML({
      markdown,
      options: { extensions: ['autocorrect'] },
    });
    expect(html).toMatch('Showdown ftw!');
  });

  it('render custom language extension (via options)', () => {
    const extension: ShowdownExtension = {
      type: 'lang',
      regex: /Markdown/,
      replace: 'Showdown',
    };

    const markdown = 'Markdown ftw!';
    const html = renderInnerHTML({
      markdown,
      options: { extensions: [extension] },
    });
    expect(html).toMatch('Showdown ftw!');
  });

  it('render custom language extension (via prop)', () => {
    const extension: ShowdownExtension = {
      type: 'lang',
      regex: /Markdown/,
      replace: 'Showdown',
    };

    const markdown = 'Markdown ftw!';
    const html = renderInnerHTML({ markdown, extensions: [extension] });
    expect(html).toMatch('Showdown ftw!');
  });
});
