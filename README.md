# Wob Knaap

Persoonlijke site voor artikelen, columns en notities. De openbare site wordt statisch gebouwd en bevat geen database, accountsysteem of openbaar contentbeheer.

## Online site

GitHub Pages publiceert na iedere wijziging op `main` alleen deze onderdelen:

- Start
- Artikelen
- Notities
- Over mij

Het uiteindelijke adres is `https://wobknaap.github.io/Site/`.

## Veiligheidsopzet

- `/beheer` wordt nooit in de GitHub Pages-build opgenomen.
- Een Next.js-productiebouw geeft op `/beheer` altijd een 404.
- `app/content-data.json` mag alleen openbare artikelen en openbare notities bevatten.
- Concepten, redactienotities, lokale JSON-bestanden en geheime configuratie worden door Git genegeerd.
- De workflow controleert de repository voor iedere publicatie op conceptstatussen, redactienotities, privébestanden en herkenbare geheimen.
- De openbare HTML gebruikt geen JavaScript en heeft een strikte Content Security Policy.

## Lokaal starten

Benodigd:

- Node.js 22 of nieuwer
- npm

```bash
npm install
npm run dev
```

Open daarna:

- Site: `http://localhost:3000`
- Lokaal contentbeheer: `http://localhost:3000/beheer`

Het beheer werkt alleen tijdens `npm run dev`.

## Openbare content beheren

De openbare content staat in `app/content-data.json`. Een artikel kan alleen gepubliceerd worden wanneer:

- de status `published` is;
- titel, omschrijving en artikeltekst zijn ingevuld;
- `editorialNote` leeg is;
- een eventueel afbeeldingspad onder `/images/` valt.

Controleer de inhoud met:

```bash
npm run validate:public
```

## Concepten lokaal bewaren

Bewaar concepten bijvoorbeeld in `private/content-data.json` of in een bestand dat eindigt op `.private.json` of `.local.json`. Deze bestanden worden niet door Git meegenomen.

Open zo'n bestand via het lokale contentbeheer. Kopieer pas een afgerond artikel naar `app/content-data.json` wanneer het gepubliceerd mag worden.

## GitHub Pages-versie bouwen

```bash
npm run build:pages
```

De statische bestanden komen in `docs/`. Deze map is gegenereerd en wordt niet in Git bewaard; GitHub Actions bouwt hem opnieuw bij publicatie.
