import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const raw = JSON.parse(JSON.parse(readFileSync(resolve(root, 'src/tokens/raw/variables.json'), 'utf8')))

const toHex = ({ r, g, b }) =>
  '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0').toUpperCase()).join('')

const scheme = raw['color-schemes']['mode-1']
const primitives = raw['primitives']['mode-1']
const ui = raw['u-i-styles']['mode-1']
const typoDesktop = raw['typography']['desktop']
const typoMobile = raw['typography']['mobile']
const spacingDesktop = raw['spacing-sizing']['desktop']
const spacingMobile = raw['spacing-sizing']['mobile']

const block = `## Kleurenpalet (Figma tokens)
Semantisch:
- \`--color-background\`: ${toHex(scheme['color-scheme-1-background'])}
- \`--color-foreground\`: ${toHex(scheme['color-scheme-1-foreground'])}
- \`--color-text\`: ${toHex(scheme['color-scheme-1-text'])}
- \`--color-border\`: ${toHex(scheme['color-scheme-1-border'])}
- \`--color-accent\`: ${toHex(scheme['color-scheme-1-accent'])}

Primitieven:
- \`--color-white\`: ${toHex(primitives['color-white'])}
- \`--color-neutral-lightest\`: ${toHex(primitives['color-neutral-lightest'])}
- \`--color-neutral-lighter\`: ${toHex(primitives['color-neutral-lighter'])}
- \`--color-neutral-light\`: ${toHex(primitives['color-neutral-light'])}
- \`--color-neutral\`: ${toHex(primitives['color-neutral'])}
- \`--color-neutral-dark\`: ${toHex(primitives['color-neutral-dark'])}
- \`--color-neutral-darker\`: ${toHex(primitives['color-neutral-darker'])}
- \`--color-neutral-darkest\`: ${toHex(primitives['color-neutral-darkest'])}

## Typografie (Figma tokens)
Desktop:
- h1: ${typoDesktop['text-sizes-heading-1']}px · h2: ${typoDesktop['text-sizes-heading-2']}px · h3: ${typoDesktop['text-sizes-heading-3']}px · h4: ${typoDesktop['text-sizes-heading-4']}px · h5: ${typoDesktop['text-sizes-heading-5']}px · h6: ${typoDesktop['text-sizes-heading-6']}px
- text-large: ${typoDesktop['text-sizes-text-large']}px · text-medium: ${typoDesktop['text-sizes-text-medium']}px · text-regular: ${typoDesktop['text-sizes-text-regular']}px · text-small: ${typoDesktop['text-sizes-text-small']}px · text-tiny: ${typoDesktop['text-sizes-text-tiny']}px

Mobiel:
- h1: ${typoMobile['text-sizes-heading-1']}px · h2: ${typoMobile['text-sizes-heading-2']}px · h3: ${typoMobile['text-sizes-heading-3']}px · h4: ${typoMobile['text-sizes-heading-4']}px · h5: ${typoMobile['text-sizes-heading-5']}px · h6: ${typoMobile['text-sizes-heading-6']}px
- text-large: ${typoMobile['text-sizes-text-large']}px · text-medium: ${typoMobile['text-sizes-text-medium']}px · text-regular: ${typoMobile['text-sizes-text-regular']}px · text-small: ${typoMobile['text-sizes-text-small']}px · text-tiny: ${typoMobile['text-sizes-text-tiny']}px

## Spacing & sizing (Figma tokens)
Desktop:
- page-padding: ${spacingDesktop['page-padding-padding-global']}px
- section-tiny: ${spacingDesktop['section-padding-padding-section-tiny']}px · section-small: ${spacingDesktop['section-padding-padding-section-small']}px · section-medium: ${spacingDesktop['section-padding-padding-section-medium']}px · section-large: ${spacingDesktop['section-padding-padding-section-large']}px
- container-small: ${spacingDesktop['container-container-small']}px · container-medium: ${spacingDesktop['container-container-medium']}px · container-large: ${spacingDesktop['container-container-large']}px

Mobiel:
- page-padding: ${spacingMobile['page-padding-padding-global']}px
- section-tiny: ${spacingMobile['section-padding-padding-section-tiny']}px · section-small: ${spacingMobile['section-padding-padding-section-small']}px · section-medium: ${spacingMobile['section-padding-padding-section-medium']}px · section-large: ${spacingMobile['section-padding-padding-section-large']}px

## Border radius (Figma tokens)
- \`--radius-small\`: ${ui['radius-small']}px
- \`--radius-medium\`: ${ui['radius-medium']}px
- \`--radius-large\`: ${ui['radius-large']}px
- \`--radius-extra-large\`: ${ui['radius-extra-large']}px
- \`--radius-rounded\`: ${ui['radius-rounded']}px`

const claudePath = resolve(root, 'CLAUDE.md')
let content = readFileSync(claudePath, 'utf8')

content = content.replace(
  /## Kleurenpalet \(Figma tokens\)[\s\S]*?## Border radius \(Figma tokens\)\n[\s\S]*?(?=\n## |\n*$)/,
  block + '\n'
)

writeFileSync(claudePath, content, 'utf8')
console.log('CLAUDE.md bijgewerkt met tokens uit variables.json')

const toRgba = ({ r, g, b, a }) =>
  a === 1 ? toHex({ r, g, b }) : `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`

const toRem = px => `${px / 16}rem`

const css = `:root {
  /* Fonts — beheerd via CLAUDE.md */
  --font-heading: 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-sans: 'Plus Jakarta Sans', system-ui, sans-serif;

  /* Semantische kleuren */
  --color-background: ${toRgba(scheme['color-scheme-1-background'])};
  --color-foreground: ${toRgba(scheme['color-scheme-1-foreground'])};
  --color-text: ${toRgba(scheme['color-scheme-1-text'])};
  --color-border: ${toRgba(scheme['color-scheme-1-border'])};
  --color-accent: ${toRgba(scheme['color-scheme-1-accent'])};

  /* Primitieve kleuren */
  --color-white: ${toRgba(primitives['color-white'])};
  --color-neutral-lightest: ${toRgba(primitives['color-neutral-lightest'])};
  --color-neutral-lighter: ${toRgba(primitives['color-neutral-lighter'])};
  --color-neutral-light: ${toRgba(primitives['color-neutral-light'])};
  --color-neutral: ${toRgba(primitives['color-neutral'])};
  --color-neutral-dark: ${toRgba(primitives['color-neutral-dark'])};
  --color-neutral-darker: ${toRgba(primitives['color-neutral-darker'])};
  --color-neutral-darkest: ${toRgba(primitives['color-neutral-darkest'])};

  /* Opaciteit */
  --opacity-white-60: ${toRgba(primitives['opacity-white-60'])};
  --opacity-white-80: ${toRgba(primitives['opacity-white-80'])};
  --opacity-white-8: ${toRgba(primitives['opacity-white-8'])};
  --opacity-neutral-darkest-8: ${toRgba(primitives['opacity-neutral-darkest-8'])};

  /* Typografie — desktop */
  --text-h1: ${toRem(typoDesktop['text-sizes-heading-1'])};
  --text-h2: ${toRem(typoDesktop['text-sizes-heading-2'])};
  --text-h3: ${toRem(typoDesktop['text-sizes-heading-3'])};
  --text-h4: ${toRem(typoDesktop['text-sizes-heading-4'])};
  --text-h5: ${toRem(typoDesktop['text-sizes-heading-5'])};
  --text-h6: ${toRem(typoDesktop['text-sizes-heading-6'])};
  --text-large: ${toRem(typoDesktop['text-sizes-text-large'])};
  --text-medium: ${toRem(typoDesktop['text-sizes-text-medium'])};
  --text-regular: ${toRem(typoDesktop['text-sizes-text-regular'])};
  --text-small: ${toRem(typoDesktop['text-sizes-text-small'])};
  --text-tiny: ${toRem(typoDesktop['text-sizes-text-tiny'])};

  /* Spacing — desktop */
  --page-padding: ${spacingDesktop['page-padding-padding-global']}px;
  --section-tiny: ${spacingDesktop['section-padding-padding-section-tiny']}px;
  --section-small: ${spacingDesktop['section-padding-padding-section-small']}px;
  --section-medium: ${spacingDesktop['section-padding-padding-section-medium']}px;
  --section-large: ${spacingDesktop['section-padding-padding-section-large']}px;
  --container-small: ${spacingDesktop['container-container-small']}px;
  --container-medium: ${spacingDesktop['container-container-medium']}px;
  --container-large: ${spacingDesktop['container-container-large']}px;

  /* Border radius */
  --radius-small: ${ui['radius-small']}px;
  --radius-medium: ${ui['radius-medium']}px;
  --radius-large: ${ui['radius-large']}px;
  --radius-extra-large: ${ui['radius-extra-large']}px;
  --radius-rounded: ${ui['radius-rounded']}px;
}

@media (max-width: 768px) {
  :root {
    /* Typografie — mobiel */
    --text-h1: ${toRem(typoMobile['text-sizes-heading-1'])};
    --text-h2: ${toRem(typoMobile['text-sizes-heading-2'])};
    --text-h3: ${toRem(typoMobile['text-sizes-heading-3'])};
    --text-h4: ${toRem(typoMobile['text-sizes-heading-4'])};
    --text-h5: ${toRem(typoMobile['text-sizes-heading-5'])};
    --text-h6: ${toRem(typoMobile['text-sizes-heading-6'])};
    --text-large: ${toRem(typoMobile['text-sizes-text-large'])};
    --text-medium: ${toRem(typoMobile['text-sizes-text-medium'])};

    /* Spacing — mobiel */
    --page-padding: ${spacingMobile['page-padding-padding-global']}px;
    --section-tiny: ${spacingMobile['section-padding-padding-section-tiny']}px;
    --section-small: ${spacingMobile['section-padding-padding-section-small']}px;
    --section-medium: ${spacingMobile['section-padding-padding-section-medium']}px;
    --section-large: ${spacingMobile['section-padding-padding-section-large']}px;
  }
}
`

const cssPath = resolve(root, 'src/tokens/tokens.css')
writeFileSync(cssPath, css, 'utf8')
console.log('src/tokens/tokens.css gegenereerd')
