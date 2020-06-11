import React from 'react';
import TestRenderer from 'react-test-renderer';

import MarkdownView, { GlobalConfiguration } from './';

afterEach(() => {
  GlobalConfiguration.resetExtensions();
  GlobalConfiguration.resetOptions();
});

describe('MarkdownView', () => {
  it('render markdown with React elements', () => {
    const markdown = '# Title!\n\nA paragraph.\n\n';
    const testRenderer = TestRenderer.create(
      <MarkdownView markdown={markdown} />
    );
    const testInstance = testRenderer.root;
    expect(testInstance.findByType('h1').props.id).toEqual('title');
    expect(testInstance.findByType('h1').children).toEqual(['Title!']);
    expect(testInstance.findByType('p').children).toEqual(['A paragraph.']);
  });

  it('render markdown table', () => {
    const markdown = `
| Column 1 | Column 2 |
|----------|----------|
| A1       | B1       |
| A2       | B2       |
    `;
    const testRenderer = TestRenderer.create(
      <MarkdownView markdown={markdown} options={{ tables: true }} />
    );
    const testInstance = testRenderer.root;
    expect(testInstance.findAllByType('table')).toHaveLength(1);
    expect(testInstance.findAllByType('tr')).toHaveLength(3);
    expect(testInstance.findAllByType('th')).toHaveLength(2);
    expect(testInstance.findAllByType('td')).toHaveLength(4);
    expect(testInstance.findAllByType('th').map(th => th.children)).toEqual([
      ['Column 1'],
      ['Column 2'],
    ]);
    expect(testInstance.findAllByType('td').map(th => th.children)).toEqual([
      ['A1'],
      ['B1'],
      ['A2'],
      ['B2'],
    ]);
  });

  it('render markdown table with flavor github', () => {
    const markdown = `
| Column 1 | Column 2 |
|----------|----------|
| A1       | B1       |
| A2       | B2       |
    `;
    const testRenderer = TestRenderer.create(
      <MarkdownView flavor="github" markdown={markdown} />
    );
    const testInstance = testRenderer.root;
    expect(testInstance.findAllByType('table')).toHaveLength(1);
    expect(testInstance.findAllByType('tr')).toHaveLength(3);
    expect(testInstance.findAllByType('th')).toHaveLength(2);
    expect(testInstance.findAllByType('td')).toHaveLength(4);
    expect(testInstance.findAllByType('th').map(th => th.children)).toEqual([
      ['Column 1'],
      ['Column 2'],
    ]);
    expect(testInstance.findAllByType('td').map(th => th.children)).toEqual([
      ['A1'],
      ['B1'],
      ['A2'],
      ['B2'],
    ]);
  });

  it('render markdown table with flavor original', () => {
    const markdown = `
| Column 1 | Column 2 |
|----------|----------|
| A1       | B1       |
| A2       | B2       |
`;
    const testRenderer = TestRenderer.create(
      <MarkdownView flavor="original" markdown={markdown} />
    );
    const testInstance = testRenderer.root;
    expect(testInstance.findAllByType('table')).toHaveLength(0);
    expect(testInstance.findAllByType('p')).toHaveLength(1);
    expect(testInstance.findByType('p').children).toEqual([markdown.trim()]);
  });

  it('render html as it was parsed', () => {
    const markdown = '<h1>Title</h1>';
    const testRenderer = TestRenderer.create(
      <MarkdownView markdown={markdown} />
    );
    const testInstance = testRenderer.root;
    expect(testInstance.findByType('h1').children).toEqual(['Title']);
  });

  it('render html class name', () => {
    const markdown = '<h1 class="red">A red title</h1>';
    const testRenderer = TestRenderer.create(
      <MarkdownView markdown={markdown} />
    );
    const testInstance = testRenderer.root;
    expect(testInstance.findByType('h1').props).toEqual({
      className: 'red',
      children: ['A red title'],
    });
  });

  it('render html className name', () => {
    const markdown = '<h1 className="red">A red title</h1>';
    const testRenderer = TestRenderer.create(
      <MarkdownView markdown={markdown} />
    );
    const testInstance = testRenderer.root;
    expect(testInstance.findByType('h1').props).toEqual({
      className: 'red',
      children: ['A red title'],
    });
  });

  it('render html style', () => {
    const markdown = '<h1 style="color: red;">A red title</h1>';
    const testRenderer = TestRenderer.create(
      <MarkdownView markdown={markdown} />
    );
    const testInstance = testRenderer.root;
    expect(testInstance.findByType('h1').props).toEqual({
      style: { color: 'red' },
      children: ['A red title'],
    });
  });

  it('render text emojies', () => {
    const markdown = ':showdown: :+1:';
    const testRenderer = TestRenderer.create(
      <MarkdownView markdown={markdown} options={{ emoji: true }} />
    );
    const testInstance = testRenderer.root;
    // TODO: expect(testInstance.findAllByProps({ children: 'S' })).toHaveLength(1);
    expect(testInstance.findByType('p').children).toContain(' 👍');
  });

  /*
  it('render custom output extension (via global name)', () => {
    // Register global extension
    GlobalConfiguration.setExtension('big', {
      type: 'output',
      regex: new RegExp(`<h1(.*)>`, 'g'),
      replace: `<h1 class="big" $1>`,
    });

    const markdown = '# Example headline';
    const html = renderHTML({ markdown, options: { extensions: ['big'] } });
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
    const html = renderHTML({ markdown, options: { extensions: [extension] } });
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
    const html = renderHTML({ markdown, extensions: [extension] });
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
    const html = renderHTML({
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
    const html = renderHTML({ markdown, options: { extensions: [extension] } });
    expect(html).toMatch('Showdown ftw!');
  });

  it('render custom language extension (via prop)', () => {
    const extension: ShowdownExtension = {
      type: 'lang',
      regex: /Markdown/,
      replace: 'Showdown',
    };

    const markdown = 'Markdown ftw!';
    const html = renderHTML({ markdown, extensions: [extension] });
    expect(html).toMatch('Showdown ftw!');
  });
  */

  it('render custom component without prop', () => {
    function CustomComponent() {
      return <span>Hello world!</span>;
    }
    const markdown = `
# Title

<CustomComponent />
`;
    const testRenderer = TestRenderer.create(
      <MarkdownView markdown={markdown} components={{ CustomComponent }} />
    );
    const testInstance = testRenderer.root;
    expect(testInstance.findByType('h1').children).toEqual(['Title']);
    expect(testInstance.findByType('span').children).toEqual(['Hello world!']);
  });

  it('render custom component', () => {
    function CustomComponent({ name }: { name: string }) {
      return <span>Hello {name}!</span>;
    }
    const markdown = `
# Title

<CustomComponent name="world" />
  `;
    const testRenderer = TestRenderer.create(
      <MarkdownView markdown={markdown} components={{ CustomComponent }} />
    );
    const testInstance = testRenderer.root;
    expect(testInstance.findByType('h1').children).toEqual(['Title']);
    expect(testInstance.findByType('span').children).toEqual([
      'Hello ',
      'world',
      '!',
    ]);
  });

  it('does render multiple components on the same line', () => {
    function CustomComponent({ name }: { name: string }) {
      return <span>Hello {name}!</span>;
    }
    const markdown = `<CustomComponent name="world" /> <span>More content</span>`;
    const testRenderer = TestRenderer.create(
      <MarkdownView markdown={markdown} components={{ CustomComponent }} />
    );
    const testInstance = testRenderer.root;
    expect(testInstance.findAllByType('span')[0].children).toEqual([
      'Hello ',
      'world',
      '!',
    ]);
    expect(testInstance.findAllByType('span')[1].children).toEqual([
      'More content',
    ]);
  });
});
