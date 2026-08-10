# Wob Knaap

Persoonlijke site voor artikelen, columns en notities. De site bevat een lokaal contentbeheer en heeft geen database of apart CMS-account nodig.

## Online site

De publieke versie wordt na elke wijziging op `main` automatisch gebouwd en gepubliceerd met GitHub Pages. Alleen Start, Artikelen, Notities en Over mij gaan online. `/beheer` is bewust niet aanwezig in de publieke build.

Zonder eigen domein is het adres:

`https://wobknaap.github.io/Site/`

## Lokaal starten

Benodigd:

- Node.js 22 of nieuwer
- npm

Open de projectmap in Cursor of een terminal en voer uit:

```bash
npm install
npm run dev
```

Open daarna:

- Site: `http://localhost:5173`
- Contentbeheer: `http://localhost:5173/beheer`

Gebruik het beheer alleen lokaal. Conceptartikelen en redactienotities horen niet in de publieke contentversie.

## Content beheren

Alle content staat in `app/content-data.json`.

1. Open `/beheer`.
2. Klik op `Contentbestand openen`.
3. Selecteer `app/content-data.json` uit deze projectmap.
4. Pas artikelen of notities aan.
5. Klik op `Opslaan`.

De lokale site ververst na het opslaan automatisch. Als de browser geen directe bestandstoegang ondersteunt, downloadt het beheer een nieuw `content-data.json`. Vervang dan handmatig het bestand in de map `app`.

Het beheer bewaart een tijdelijke werksessie in de browser. Dit voorkomt dat tekst verdwijnt als je de pagina per ongeluk ververst. De projectversie verandert pas wanneer je het JSON-bestand opslaat.

## Artikelstatussen

- `Concept`: alleen zichtbaar in het beheer.
- `Online op eigen site`: krijgt een eigen artikelpagina.
- `Externe publicatie`: verschijnt in het archief en verwijst naar de bronlink.

De Cursor-items `Expeditie Roermond` en `Het label dat afschrikt` staan al in het beheer. De exacte links ontbreken nog. Zodra je die invult, verschijnen ze in het openbare archief.

De volgende DAW-publicaties staan als herschrijfconcept klaar, inclusief bronlink:

- De incognito-knop: de geheime superpower van LLM's
- Van typen naar denken: hoe praat jij straks met AI?
- Worden we werkloos door AI? De O-ringparadox en de toekomst van werk

## Artikelen schrijven

De artikeltekst ondersteunt Markdown. Bijvoorbeeld:

```markdown
## Tussenkop

Een gewone alinea met een [link](https://example.com).

> Een citaat of kernpassage.

- Eerste punt
- Tweede punt
```

Afbeeldingen plaats je in `public/images`. Vul in het beheer vervolgens bijvoorbeeld `/images/mijn-afbeelding.webp` in bij `Afbeelding`.

## Belangrijke bestanden

- `app/content-data.json`: artikelen en notities
- `app/beheer`: het contentbeheer
- `app/globals.css`: vormgeving
- `public/images`: afbeeldingen

## Productiecontrole

```bash
npm run build
```

De GitHub Pages-versie lokaal bouwen:

```bash
npm run build:pages
```

De meegeleverde productiecontrole gebruikt Bash. Op Windows werkt dit via WSL of Git Bash. Voor lokaal schrijven en vormgeven is alleen `npm run dev` nodig.
