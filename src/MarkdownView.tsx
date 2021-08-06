import React, {
  createElement,
  useMemo,
  ClassType,
  FunctionComponent,
  ReactNode,
  ReactElement,
  HTMLAttributes,
} from 'react';
import {
  Converter,
  ConverterOptions,
  Flavor,
  ShowdownExtension,
} from 'showdown';
import * as htmlparser from 'htmlparser2';
import { Node, Element, DataNode } from 'domhandler';

export interface MarkdownViewProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'dangerouslySetInnerHTML'> {
  dangerouslySetInnerHTML?: boolean;
  flavor?: Flavor;
  markdown: string;
  sanitizeHtml?: (html: string) => string;
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
    sanitizeHtml,
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

          // Map style strings to style objects
          if (typeof props.style === 'string') {
            const styles: Record<string, any> = {};
            props.style.split(';').forEach(style => {
              if (style.indexOf(':') !== -1) {
                let [key, value] = style.split(':');
                key = key
                  .trim()
                  .replace(/-([a-z])/g, match => match[1].toUpperCase());
                value = value.trim();
                styles[key] = value;
              }
            });
            props.style = styles;
          }

          const children = skipAnyChildrenFor.includes(node.name)
            ? null
            : skipWhitespaceElementsFor.includes(node.name)
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

  let html = converter.makeHtml(markdown ?? markup);
  if (sanitizeHtml) {
    html = sanitizeHtml(html);
  }

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
    // Fix issue with content after a self closing tag.
    recognizeSelfClosing: true,
  });

  return createElement('div', otherProps, root.map(mapElement));
}

// Match react-dom omittedCloseTags. See also:
// https://github.com/facebook/react/blob/master/packages/react-dom/src/shared/omittedCloseTags.js
const skipAnyChildrenFor = [
  'area',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'param',
  'source',
  'track',
  'wbr',
];

const skipWhitespaceElementsFor = ['table', 'thead', 'tbody', 'tr'];

function filterWhitespaceElements(node: Node) {
  if (node.type === 'text' && node instanceof DataNode) {
    return node.data.trim().length > 0;
  } else {
    return true;
  }
}
