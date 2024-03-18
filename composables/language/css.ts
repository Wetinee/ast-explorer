import type * as CssTree from 'css-tree'
import type { LanguageOption, Parser } from '.'
import type * as Postcss from 'postcss'

// @unocss-include

const cssTree: Parser<typeof CssTree, CssTree.ParseOptions> = {
  id: 'csstree',
  label: 'csstree',
  icon: 'i-vscode-icons:file-type-css',
  editorLanguage: 'css',
  options: {
    configurable: true,
    defaultValue: {
      positions: true,
    },
    editorLanguage: 'json',
    defaultValueType: 'json5',
  },
  init: () =>
    // @ts-expect-error
    import('https://cdn.jsdelivr.net/npm/css-tree/dist/csstree.esm.js'),
  async version() {
    // @ts-expect-error missing property
    return `css-tree@${(await this).version}`
  },
  parse(code, options) {
    return this.parse(code, { ...options })
  },
  getAstLocation: getAstLocation.bind(null, 'cssTree'),
}

const postcss: Parser<typeof Postcss, Postcss.ProcessOptions> = {
  id: 'postcss',
  label: 'postcss',
  icon: 'i-vscode-icons:file-type-postcss',
  editorLanguage: 'css',
  options: {
    configurable: true,
    defaultValue: {},
    editorLanguage: 'json',
    defaultValueType: 'json5',
  },
  // @ts-expect-error
  init: () => import('https://esm.sh/postcss'),
  version: () =>
    fetch('https://esm.sh/postcss/package.json')
      .then((res) => res.json())
      .then((pkg) => `postcss@${pkg.version}`),
  parse(code, options) {
    return this.parse(code, { ...options })
  },
}

export const css: LanguageOption = {
  label: 'CSS',
  icon: 'i-vscode-icons:file-type-css',
  parsers: [cssTree, postcss],
}
