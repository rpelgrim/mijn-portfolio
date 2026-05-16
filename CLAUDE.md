# Mijn Portfolio Project

## Stack
- React + Vite
- Plain CSS (geen Tailwind)

## Stijl
- Minimalistisch, clean, editorial

## Fonts (CSS variabelen)
- `--font-heading`: 'Plus Jakarta Sans', system-ui, sans-serif — voor headings en buttons
- `--font-sans`: 'Plus Jakarta Sans', system-ui, sans-serif — voor tagline en paragraafteksten

Google Fonts import (in index.html):
```
Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800
```

## Kleurenpalet (Figma tokens)
Semantisch:
- `--color-background`: #FFFFFF
- `--color-foreground`: #FFFFFF
- `--color-text`: #000000
- `--color-border`: #000000
- `--color-accent`: #4C43E8

Primitieven:
- `--color-white`: #FFFFFF
- `--color-neutral-lightest`: #EEEEEE
- `--color-neutral-lighter`: #CCCCCC
- `--color-neutral-light`: #AAAAAA
- `--color-neutral`: #666666
- `--color-neutral-dark`: #444444
- `--color-neutral-darker`: #222222
- `--color-neutral-darkest`: #000000

## Typografie (Figma tokens)
Desktop:
- h1: 56px · h2: 48px · h3: 40px · h4: 32px · h5: 24px · h6: 20px
- text-large: 20px · text-medium: 18px · text-regular: 16px · text-small: 14px · text-tiny: 12px

Mobiel:
- h1: 40px · h2: 36px · h3: 32px · h4: 24px · h5: 20px · h6: 18px
- text-large: 18px · text-medium: 16px · text-regular: 16px · text-small: 14px · text-tiny: 12px

## Spacing & sizing (Figma tokens)
Desktop:
- page-padding: 64px
- section-tiny: 32px · section-small: 48px · section-medium: 80px · section-large: 112px
- container-small: 768px · container-medium: 1024px · container-large: 1280px

Mobiel:
- page-padding: 20px
- section-tiny: 32px · section-small: 32px · section-medium: 48px · section-large: 64px

## Border radius (Figma tokens)
- `--radius-small`: 8px
- `--radius-medium`: 16px
- `--radius-large`: 24px
- `--radius-extra-large`: 32px
- `--radius-rounded`: 1000px

## Icons
Gebruik altijd **Google Material Symbols Outlined** voor iconen. Nooit een andere icon library.

Gebruik in JSX:
```jsx
<span className="material-symbols-outlined">icon_naam</span>
```

Stijl aanpassen via CSS (font-variation-settings):
```css
.material-symbols-outlined {
  font-size: 24px;         /* grootte */
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}
```

Google Fonts import (in index.html, variabele font — laadt alle iconen):
```
Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200
```

Iconen zoeken: fonts.google.com/icons

## Gedeelde componenten

### ArrowLink
Gebruik `<ArrowLink>` voor **alle tekstlinks** door de hele website — nooit een losse `<a>` stylen voor links.

```jsx
import ArrowLink from './components/ArrowLink'

<ArrowLink href="#cases">Continue reading</ArrowLink>
```

- Toont een 8px outlined circle links van de tekst, altijd 8px gap
- Hover: circle groeit naar 40px; pijl vliegt van links naar binnen met opacity en ease (0.2s delay zodat de circle eerst uitgroeit); tekst schuift 4px naar rechts
- Dark mode: link én tekst zijn volledig wit (`var(--color-white)`)
- Reveal-animaties (fade-up etc.) op een wrapper-div zetten, niet op de component zelf

## Regels
- Schrijf altijd Nederlandse comments
- Gebruik functionele React componenten
- Geen externe animatielibraries
- Gebruik altijd de Figma tokens hierboven, geen hardcoded waardes
- Gebruik altijd Material Symbols Outlined voor iconen (zie ## Icons)
- Gebruik altijd `<ArrowLink>` voor tekstlinks, nooit losse `<a>` elementen stylen