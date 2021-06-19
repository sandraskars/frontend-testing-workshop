## Legge til Cypress
**Merk**: Stegene i "Legge til Cypress" er allerede gjort i prosjektet, men bare forklarer det her i tilfelle noen vil ha det som referanse til senere.

For å komme i gang med Cypress, må vi først legge det til som en dev-dependency i prosjektet vårt. 
```
npm install --save-dev cypress
```

Vi kan deretter kjøre opp Cypress med `cypress open`, og får da generert opp noen filer for oss:

- `cypress.json`, som bare er et tomt objekt. Her kan man legge til konfigurasjon.
- mappen `cypress`, med en del undermapper:
    - `fixtures`: json-filer vi kan bruke som testdata
    - `integration`: hvor alle testene ligger
    - `plugins`
    - `support`: her ligger Cypress Commands (gjenbrukbare kommandoer)

Det blir da generert opp mange eksempler på tester i `integration`, og testdata i `fixtures`, noe man egentlig bare kan slette. 
For å kunne kjøre Cypress-testene headless, så kan vi legge til `"test:cypress": cypress run` i package.json. Kjører vi den kommandoen, `npm run test:cypress`, vil alle testene kjøre, uten at GUI-et i nettleseren åpner seg.

Vi må også legge til en `tsconfig.json`-fil på rotnivå i `cypress`-mappa for å kunne kompilere det som et TS-prosjekt.

Ellers:

- Noe om baseUrl i cypress.json:
```
{
    "baseUrl": "http://localhost:3000",
    "pluginsFile": "cypress/plugins",
    "supportFile": "cypress/support"
}
```

- Noe om at vi kan bruke dev-serveren vår til å gi en gitt respons på gitte endepunkter, som vi kan bruke i Cypress-testene.
- Legger til "test:cypress:open": "cypress open --config fileServerFolder=cypress" under scripts i `package.json`

## Noe om tester her..
Vi ønsker oss følgende flyt:
- Brukeren besøker `/login`-siden, og da er inputfeltet for e-post allerede i fokus
- Når brukeren skriver inn e-post og passord, og klikker logg inn, så skal man bli redirected til forsiden
 
```
// TODO: Sandra, fjern mode: onBlur fra login-formet.

describe("Login", () => {
  it("should focus on email input field on render", () => {
    // TODO
  })

  it("should login and be redirected to front page", () => {
    // TODO
  })
})

```

<details>
<summary><b>ℹ️ HINT</b></summary>
  cy.visit("/login")
       .get("[data-testid=email]").should('be.focused')
</details>

<details>
<summary><b>ℹ️ HINT</b></summary>
  const successUser = {email: "success@mail.com", password: "hemmelig"}
      cy.visit("/login")
        .get("[data-testid=email]")
        .type(successUser.email)
        .get("[data-testid=password]")
        .type(successUser.password)
        .get("[data-testid=submit]")
        .click()
        .url()
        .should("eq", `${Cypress.config().baseUrl}/`)
</details>



Vi ser allerede her at vi gjenbruker `.get/"[data-testid=X]"` flere ganger, og da er det perfekt å bruke Cypress Commands for å slippe å skrive det hver gang.


<details>
<summary><b>ℹ️ HINT</b></summary>
  Cypress.Commands.add('getBySelector', (selector, ...args) => {
    return cy.get(`[data-testid=${selector}]`, ...args)
  })
</details>


For å få med oss TypeScript på laget for våre custom commands, må vil legge til kommandoen på det globale Cypress Chainable interfacet:
```
// I cypress/support/index.d.ts

/// <reference types="Cypress" />

declare namespace Cypress {
  interface Chainable {
    getBySelector(selector: string): Chainable
  }
}
``` 

## Lage abstraksjoner for "domenet"
Ved å lage abstraksjoner for innholdet på en side tester, så gjør det at – selv om brukergrensesnittet endrer seg – så endrer du kun page-objektet ditt. S

Abstraksjonen vår holder på referanser til elementene på siden vi ønsker å interagere med, samt de typiske operasjonene vi gjør på disse elementene (for eksempel skrive noe tekst i et gitt input-felt).
Dette gir oss økt fleksibilitet, nettopp fordi vi ikke trenger å endre mer enn den **ene** filen som eier abstraksjonen dersom UI-et vårt endrer seg.
I tillegg får vi mindre duplisert kode, og jeg vil påstå at testene er lettere å lese.

Se eksempel på en abstraksjon av innholdet på innlogginssiden på `cypress/integragtion/pages/LoginPage.ts` (og bytt ut/ta i bruk metodene i denne klassen i `login.spec.ts`) 

## Med Cypress ka vi enkelt benytte oss av browser-APIer
Sørg for at det er satt et felt som holder på token i `localStorage` etter at vi har fått en success etter innlogging.


<details>
<summary><b>ℹ️ HINT</b></summary>
cy.url()
      .should('eq', `${Cypress.config().baseUrl}/`)
      .window()
      .its("localStorage.token")
      .should("eq", "token1234")
</details>


## Tester for validering og feilhåndtering
Vi ønsker å verifisere at passordfeltet viser en feilmelding dersom man prøver å skrive inn et passord som er kortere enn 8 tegn.
 
```
it("should show validation error if password is less than 8 characters", () => {
    // TODO (og ta i bruk LoginPage-klassen vi så på i sted)
})
```

Videre vil vi at det skal vises en feilmelding som sier "Tjenesten er utilgjengelig, prøv på nytt" dersom vi får respons med status 500 status fra serveren.

```
it("should show error message if we get a 500 error response", () => {
    // TODO (og ta i bruk LoginPage-klassen vi så på i sted)
})
```

<details>
<summary><b>ℹ️ HINT</b></summary>
Bruk `cy.intercept` for å stub-e et nettverkskall.
[Cypress Intercept](https://docs.cypress.io/api/commands/intercept) 

Husk at du kan hente `baseUrl`-en fra config-en vår via `Cypress.config()`.
</details>

it("should show error message if we get a 500 error response", () => {
    loginPage.visit();

    const error = "Tjenesten er utilgjengelig, prøv på nytt"

    cy.intercept('POST', `${Cypress.config().baseUrl}/login`, {
      statusCode: 500,
      body: {
        message: error
      }
    });

    loginPage
      .typeEmail(successUser.email)
      .typePassword(successUser.password)
      .clickLoginButton()
      .getError()
      .should("be.visible")
      .and("have.text", error)

<details>
<summary><b>ℹ️ HINT</b></summary>
loginPage.visit()
      .typeEmail(successUser.email)
      .getPasswordInput()
      .type("123")
      .blur()

    loginPage.getError()
      .should("be.visible")
      .and("have.text", "Passordet må være minst 8 tegn")
</details>


## Tester for tilgjengelighet
 Biblioteket `cypress-axe` lar oss bruke `axe-core` sammen med Cypress. (`axe-core`)[https://github.com/dequelabs/axe-core] lar oss automatisere accessibility testing, og det sier vi ikke nei takk til!
 
 I `login.spec.ts`-filen vår skal vi nå teste om vi bryter noen prinsipper for universell utforming på `LoginPage`-en vår.
 
 Vi må først sørge for at Cypress har besøkt riktig side vi vil teste, og deretter kan vi injecte axe runtime-en slik at `axe-core` kan få gjøre jobben sin.
 Deretter, når vi vet at vi har axe tilgjengelig, kan vi kjøre kommandoen `checkA11y` for å kjøre axe på nettsiden (den defaulter til hele siden, men vi kan også konfigurere den til å sjekke enkeltelementer).
 
 ```
 it("Has no detectable a11y violations", () => {
   // TODO
});
```

Etter at du har skrevet testen, kjør opp Cypress igjen (eller gå tilbake til brukergrensesnittet om det allerede kjører).
Hadde vi noen feil? I så fall, fiks opp i dette!

<details>
<summary><b>ℹ️ HINT</b></summary>
Sjekk nettleserkonsollen.
</details>

### Kodeanalyse med eslint-plugin-jsx-a11y
For å ta i bruk denne ESlint-pluginen må vi:
- Installere `eslint-plugin-jsx-a11y`
- Legge til `plugin:jsx-a11y/recommended` i `extends` i `.eslintrc.json`
- Legge til `jsx-a11y` i `plugins` i `.eslintrc.json`

Hvis du nå har konfigurert ESLint riktig, vil du umiddelbart få tilbakemeldinger på om du bryter f 

## Noe om Jest og unit-tester her, eller?
Legger til `jsDom` i jest.config.js for å kunne..
