import React from 'react';
import {
  Converter,
  ConverterOptions,
  Flavor,
  ShowdownExtension,
} from 'showdown';

export interface MarkdownViewProps {
  markdown: string;
  flavor?: Flavor;
  options?: ConverterOptions;
  extensions?: ShowdownExtension[];
}

export default function MarkdownView({
  markdown,
  flavor,
  options,
  extensions,
}: MarkdownViewProps) {
  const converter = new Converter();
  if (flavor) {
    converter.setFlavor(flavor);
  }
  if (options) {
    for (const key in options) {
      if (key === 'extensions' && options.extensions) {
        for (const extension of options.extensions) {
          if (typeof extension === 'string') {
            converter.useExtension(extension);
          } else {
            converter.addExtension(extension);
          }
        }
      }
      converter.setOption(key, options[key]);
    }
  }
  if (extensions) {
    converter.addExtension(extensions);
  }

  const html = converter.makeHtml(markdown);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
