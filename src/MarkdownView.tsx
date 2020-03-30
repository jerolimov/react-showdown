import React, {
  createElement,
  useMemo,
  ClassType,
  FunctionComponent,
  ReactNode,
  ReactElement,
} from 'react';
import {
  Converter,
  ConverterOptions,
  Flavor,
  ShowdownExtension,
} from 'showdown';
import * as htmlparser from 'htmlparser2';
import { Node, Element, DataNode } from 'domhandler';

export interface MarkdownViewProps {
  dangerouslySetInnerHTML?: boolean;
  flavor?: Flavor;
  markdown: string;
  markup?: string;
  options?: ConverterOptions;
  extensions?: ShowdownExtension[];
  components?: Record<
    string,
    ClassType<never, never, never> | FunctionComponent<any>
  >;
}

export default function MarkdownView(props: MarkdownViewProps): ReactElement {
  const {
    dangerouslySetInnerHTML,
    flavor,
    markdown,
    markup,
    options,
    extensions,
    components,
    ...otherProps
  } = props;

  const mapElement = useMemo(
    () =>
      function mapElement(node: Node, index: number): ReactNode {
        if (node.type === 'tag' && node instanceof Element) {
          const elementType = components?.[node.name] || node.name;
          const props: Record<string, any> = { key: index, ...node.attribs };

          // Rename class to className to hide react warning
          if (props.class && !props.className) {
            props.className = props.class;
            delete props.class;
          }

          const children = skipWhitespaceElementsFor.includes(node.name)
            ? node.children.filter(filterWhitespaceElements).map(mapElement)
            : node.children.map(mapElement);
          return createElement(elementType, props, children);
        } else if (node.type === 'text' && node instanceof DataNode) {
          return node.data;
        } else if (node.type === 'comment') {
          return null; // noop
        } else if (node.type === 'style' && node instanceof Element) {
          const props: Record<string, any> = { key: index, ...node.attribs };
          const children = node.children.map(mapElement);
          return createElement('style', props, children);
        } else {
          console.warn(
            `Warning: Could not map element with type "${node.type}".`,
            node
          );
          return null;
        }
      },
    [components]
  );

  if (dangerouslySetInnerHTML && components) {
    console.warn(
      'MarkdownView could not render custom components when dangerouslySetInnerHTML is enabled.'
    );
  }

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

  const html = converter.makeHtml(markdown ?? markup);

  if (dangerouslySetInnerHTML) {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }

  const root = htmlparser.parseDOM(html, {
    // Don't change the case of parsed html tags to match inline components.
    lowerCaseTags: false,
    // Don't change the attribute names so that stuff like `className` works correctly.
    lowerCaseAttributeNames: false,
    // Encode entities automatically, so that &copy; and &uuml; works correctly.
    decodeEntities: true,
  });

  return createElement('div', otherProps, root.map(mapElement));
}

const skipWhitespaceElementsFor = ['table', 'thead', 'tbody', 'tr'];

function filterWhitespaceElements(node: Node) {
  if (node.type === 'text' && node instanceof DataNode) {
    return node.data.trim().length > 0;
  } else {
    return true;
  }
}
