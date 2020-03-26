import React from 'react';
import { Converter, ConverterOptions } from 'showdown';

export interface MarkdownViewProps {
  markdown: string;
  options?: ConverterOptions;
}

export default function MarkdownView({ markdown, options }: MarkdownViewProps) {
  options = {
    simplifiedAutoLink: true,
    strikethrough: true,
    tables: true,
    ...options,
  };

  const html = new Converter(options).makeHtml(markdown || '');

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
