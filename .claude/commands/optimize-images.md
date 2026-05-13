# Afbeeldingen optimaliseren

Voer de volgende stappen uit om alle afbeeldingen te optimaliseren en SEO te verbeteren.

## 1. Comprimeer alle afbeeldingen

Voer het optimalisatiescript uit:

```bash
npm run optimize-images
```

Dit script comprimeerd alle `.jpg`, `.jpeg`, `.png` en `.webp` bestanden in `src/assets/` recursief met:
- JPEG/JPG: mozjpeg encoder, kwaliteit 80
- PNG: compressieniveau 9
- WebP: kwaliteit 80

Het script slaat bestanden alleen op als het resultaat kleiner is dan het origineel.

## 2. Controleer alt-tekst op alle afbeeldingen

Zoek alle `<img>` elementen in de React componenten:

```bash
grep -rn "<img" src/components/ src/App.jsx
```

Zorg dat elk `<img>` element een beschrijvende `alt` attribuut heeft:
- Logo: korte beschrijving zoals `"RP logo"`
- Portretfoto: volledige naam van de persoon
- Projectafbeeldingen: naam/titel van het project
- Decoratieve afbeeldingen: `alt=""` (leeg, zodat screenreaders ze overslaan)

## 3. Controleer SEO meta tags in index.html

Zorg dat `index.html` de volgende tags bevat:

- `<title>` — unieke, beschrijvende paginatitel (max 60 tekens)
- `<meta name="description">` — samenvatting van de pagina (max 155 tekens)
- `<meta name="robots" content="index, follow">` — voor indexering
- Open Graph tags: `og:title`, `og:description`, `og:type`, `og:url`, `og:image`
- Twitter Card tags: `twitter:card`, `twitter:title`, `twitter:description`
- `<link rel="canonical">` — canonieke URL
- JSON-LD structured data voor Person schema

## 4. Voeg nieuwe afbeeldingen toe

Bij het toevoegen van nieuwe afbeeldingen aan `src/assets/`:
1. Voeg de afbeelding toe
2. Voer `npm run optimize-images` uit
3. Controleer of de afbeelding een beschrijvende `alt` tekst heeft in de JSX
4. Commit beide (origineel wordt overschreven door geoptimaliseerde versie)

De GitHub Actions workflow optimaliseert automatisch alle afbeeldingen vóór de build, zodat de productiesite altijd geoptimaliseerde afbeeldingen serveert.
