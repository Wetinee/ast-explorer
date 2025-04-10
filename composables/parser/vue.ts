import {
  ConstantTypes,
  ElementTypes,
  Namespaces,
  NodeTypes,
} from '@vue/compiler-dom'
import { vueTemplate } from './template'
import type { LanguageOption, Parser } from './index'
import type * as VueVaporCompiler from '@vue-vapor/compiler-vapor'
import type * as Vue3Dom from '@vue/compiler-dom'
import type * as Vue3Sfc from '@vue/compiler-sfc'
// @unocss-include

const vue3Sfc: Parser<typeof Vue3Sfc, Vue3Sfc.SFCParseOptions> = {
  id: 'vue3-sfc',
  label: '@vue/compiler-sfc',
  icon: 'i-vscode-icons:file-type-vue',
  link: 'https://github.com/vuejs/core/tree/main/packages/compiler-sfc#api',
  editorLanguage: 'vue',
  options: {
    configurable: true,
    defaultValue: {},
    editorLanguage: 'json',
  },
  pkgName: '@vue/compiler-sfc',
  getModuleUrl: (pkg) =>
    getJsdelivrUrl(pkg, `/dist/compiler-sfc.esm-browser.js`),
  async version() {
    return (await this).version
  },
  parse(code, options) {
    return this.parse(code, { ...options })
  },
}

const vue3SfcCompiled: Parser<
  typeof Vue3Sfc,
  { parse?: Vue3Sfc.SFCParseOptions; compile: Vue3Sfc.SFCScriptCompileOptions }
> = {
  ...vue3Sfc,
  id: 'vue3-script-setup',
  label: '@vue/compiler-sfc (script setup)',
  editorLanguage: 'vue',
  options: {
    configurable: true,
    defaultValue: {
      parse: {},
      compile: {
        id: 'foo.vue',
      },
    },
    editorLanguage: 'json',
  },
  parse(code, options) {
    const result = { ...this.parse(code, { ...options.parse }) }
    result.descriptor = { ...result.descriptor }
    result.descriptor.scriptSetup = this.compileScript(result.descriptor, {
      ...options.compile,
    })
    return result
  },
}

const vue3DomParse: Parser<typeof Vue3Dom, Vue3Dom.ParserOptions> = {
  id: 'vue3-dom-parse',
  label: '@vue/compiler-dom (parse)',
  icon: 'i-vscode-icons:file-type-vue',
  link: 'https://github.com/vuejs/core/tree/main/packages/compiler-dom',
  editorLanguage: 'html',
  options: {
    configurable: true,
    defaultValue: 'return {}',
    defaultValueType: 'javascript',
    editorLanguage: 'javascript',
  },
  pkgName: '@vue/compiler-dom',
  getModuleUrl: (pkg) =>
    getJsdelivrUrl(pkg, `/dist/compiler-dom.esm-browser.js`),
  version: (pkg) => fetchVersion(pkg),
  parse(code, options) {
    return this.parse(code, { ...options })
  },
  nodeTitle(node) {
    const type = node?.type
    if (typeof type === 'number') return NodeTypes[type]
  },
  valueHint(key, value) {
    if (typeof value !== 'number') return
    switch (key) {
      case 'ns':
        return `Namespaces.${Namespaces[value]}`
      case 'type':
        return `NodeTypes.${NodeTypes[value]}`
      case 'constType':
        return `ConstantTypes.${ConstantTypes[value]}`
      case 'tagType':
        return `ElementTypes.${ElementTypes[value]}`
    }
  },
  getNodeLocation: genGetNodeLocation('locOffset'),
}

const vue3DomCompile: Parser<typeof Vue3Dom, Vue3Dom.CompilerOptions> = {
  ...vue3DomParse,
  id: 'vue3-dom-compile',
  label: '@vue/compiler-dom (compile)',
  parse(code, options) {
    return this.compile(code, {
      nodeTransforms: [...this.DOMNodeTransforms],
      ...options,
    }).ast
  },
}

const vueVapor: Parser<
  typeof VueVaporCompiler,
  VueVaporCompiler.CompilerOptions
> = {
  id: 'vue-vapor',
  label: '@vue-vapor/compiler-vapor',
  icon: 'i-vscode-icons:file-type-vue',
  link: 'https://github.com/vuejs/vue-vapor',
  editorLanguage: 'html',
  options: {
    configurable: true,
    defaultValue: 'return {}',
    defaultValueType: 'javascript',
    editorLanguage: 'javascript',
  },
  pkgName: '@vue-vapor/compiler-vapor',
  getModuleUrl: (pkg, version) =>
    `https://next.esm.sh/pr/vuejs/vue-vapor/@vue/compiler-vapor@${version || 'main'}`,
  version: async (pkg, version) => {
    if (version) return version
    const { url } = await fetch(
      'https://pkg.pr.new/vuejs/vue-vapor/@vue/compiler-vapor@main',
    )
    return url.split('@').pop()!
  },
  parse(code, options) {
    return this.compile(code, { ...options }).ast
  },
}

export const vue: LanguageOption = {
  label: 'Vue',
  icon: 'i-vscode-icons:file-type-vue',
  parsers: [vue3Sfc, vue3SfcCompiled, vue3DomParse, vue3DomCompile, vueVapor],
  codeTemplate: vueTemplate,
}
