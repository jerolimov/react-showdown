import {
  // Flavors
  setFlavor,
  getFlavor,

  // Options
  setOption,
  getOption,
  getOptions,
  resetOptions,

  // Extensions
  extension,
  getAllExtensions,
  removeExtension,
  resetExtensions,
  ShowdownExtension,
} from 'showdown';

import MarkdownView from './MarkdownView';

export default MarkdownView;
export const Markdown = MarkdownView;

export { MarkdownViewProps } from './MarkdownView';

export { Flavor, ShowdownExtension } from 'showdown';

const setExtension: (
  name: string,
  ext:
    | (() => ShowdownExtension[] | ShowdownExtension)
    | ShowdownExtension[]
    | ShowdownExtension
) => void = extension;
const getExtension: (name: string) => ShowdownExtension[] = extension;

export const GlobalConfiguration = {
  // Flavors,
  setFlavor,
  getFlavor,

  // Options
  setOption,
  getOption,
  getOptions,
  resetOptions,

  // Extensions
  setExtension,
  getExtension,
  getAllExtensions,
  removeExtension,
  resetExtensions,
};
