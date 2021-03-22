import React from 'react';
import TestRenderer from 'react-test-renderer';

import MarkdownView, { MarkdownViewProps, GlobalConfiguration } from './';

afterEach(() => {
  GlobalConfiguration.resetExtensions();
  GlobalConfiguration.resetOptions();
});

describe('MarkdownView images test', () => {
  const renderInnerHTML = (props: MarkdownViewProps) => {
    const testRenderer = TestRenderer.create(
      <MarkdownView dangerouslySetInnerHTML {...props} />
    );
    const renderedProps = (testRenderer.toJSON() as TestRenderer.ReactTestRendererJSON)
      .props;
    return renderedProps.dangerouslySetInnerHTML.__html;
  };

  it('renders HTML correctly', () => {
    const markdown =
      '![A forest trail in autumn](https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_1280.jpg)';
    const html = renderInnerHTML({ markdown });
    expect(html).toEqual(
      '<p><img src="https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_1280.jpg" alt="A forest trail in autumn" /></p>'
    );
  });

  it('renders React elements', () => {
    const markdown =
      '![A forest trail in autumn](https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_1280.jpg)';
    const testRenderer = TestRenderer.create(
      <MarkdownView markdown={markdown} />
    );
    const testInstance = testRenderer.root;
    const img = testInstance.findByType('img');
    expect(img.props.alt).toEqual('A forest trail in autumn');
    expect(img.props.src).toEqual(
      'https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_1280.jpg'
    );
  });
});
