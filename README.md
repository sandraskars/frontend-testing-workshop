## Oppgave 1: Legge til Cypress
For å komme i gang med Cypress, må vi først legge det til som en dev-dependency i prosjektet vårt:
```
npm install --save-dev cypress
```

Vi kan deretter kjøre opp Cypress med `cypress open`, og får da generert opp noen filer for oss:

- `cypress.json`, som bare er et tomt objekt
- mappen `cypress`, med en del undermapper:
    - `fixtures`: json-filer vi kan bruke som testdata
    - `integration`: hvor alle testene ligger
    - `plugins`
    - `support`

Selve disse testeksemplene i `integration` og testdataen i `fixtures` vil vi slette. Men, for å først bare vise at vi kan kjøre testene headless, så kan vi legge til `"test:cypress": cypress run` i package.json. Kjører vi den kommandoen vil alle testene kjøre, uten at GUI-et åpner seg.
