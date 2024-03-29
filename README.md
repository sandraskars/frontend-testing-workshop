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

Det blir også generert noen eksempler på tester i `integration`, og testdata i `fixtures`. Disse kan være nyttige for å ha en mal, men det trenger vi ikke i dag, så da sletter vi dem.

For å kunne kjøre Cypress-testene headless, så kan vi legge til `"test:cypress": cypress run` i package.json. Kjører vi den kommandoen mens serveren vår kjører, `npm run test:cypress`, vil alle testene kjøre, uten at GUI-et i nettleseren åpner seg.

Vi må også legge til en `tsconfig.json`-fil på rotnivå i `cypress`-mappa for å kunne kompilere det som et TS-prosjekt.

## Andre ting:

- For at Cypress skal vite hvor appen vår kjører, setter vi `baseUrl` i `cypress.json`. Vi må også si hvor vi har plugins og support-filer (eksemplene under er shorthands for `<mappenavn>/index.js`):
```
{
    "baseUrl": "http://localhost:3000",
    "pluginsFile": "cypress/plugins",
    "supportFile": "cypress/support"
}
```

- Vi kan bruke dev-serveren vår til å gi en gitt respons på gitte endepunkter, som vi kan bruke i Cypress-testene.
- Vi legger til scriptet `"test:cypress:open": "cypress open --config fileServerFolder=cypress"` under `scripts` i `package.json`, og det bruker vi for å kjøre opp Cypress-brukergrensesnittet i Chrome
- Vi bruker `data-testid="..."` for å kunne selecte elementer (og da er vi uavhengige av f.eks CSS-klasser som kan endre seg)

## Skriv Cypress-tester!
Det ligger allerede noen filer i `cypress/integration` dere skal jobbe med. 
Cypress eksponererer et globalt objekt for oss som heter `cy`. Fra her har vi tilgang til API-et.
- Vi bruker `.visit()` for å besøke ulike sider
- `.get()` for å hente elementer i DOM-en
- `.type()` etter at man har hentet et inputelement for å skrive inn noe
- `.click()` for å klikke på et element du har hentet
- `.url()` for å hente ut URL-en du er på 
- `.should()` for å asserte ulike tilstander

**Først:**

Vi ønsker oss følgende flyt:
- Brukeren besøker `/login`-siden, og da er inputfeltet for e-post allerede i fokus
- Når brukeren skriver inn e-post og passord, og klikker logg inn, så skal man bli redirected til forsiden
 
i `login.spec.ts`:
Test at vi har riktig fokus, og at vi blir redirected ti riktig side etter login

```
describe("Login", () => {
  it("should focus on email input field on render", () => {
    // TODO
  })
```

For neste test-case, bruk `const successUser = {email: "success@mail.com", password: "hemmelig"}`. Det er kun å logge inn med denne brukeren som gir en suksessfull innlogging.
```
  it("should login and be redirected to front page", () => {
    // TODO
  })
})
```

<details>
<summary><b>ℹ️ HINT, sette fokus</b></summary>
  Hent ut riktig element, og bruk `.should('be.focused')`. 
  `useForm` i LoginForm kan ta inn et objekt, der der kan man sette `mode` til mode: `"onBlur"` for å få ønsket oppførsel.
</details>

<details>
<summary><b>ℹ️ HINT, redirecting</b></summary>
Alt chaines. Hent ut element for epost, skriv inn `successUser.email`. Hent element for passord, skriv inn `successUser.password`. Klikk på knappen for å logge inn. Hent ut URL med `.url()`. Assert at man har havnet på rikig url med should("eq", `${Cypress.config().baseUrl}/`)
</details>

<details>
<summary><b>✅️ Fasit</b></summary>
  <code>
  cy.visit("/login")
         .get("[data-testid=email]").should('be.focused')
  </code>
</details>

<details>
<summary><b>✅ Fasit, redirecting</b></summary>
<code>
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
</code>
</details>


**Dere ser kanskje allerede at vi gjenbruker `.get/"[data-testid=X]"` flere ganger, og da er det perfekt å bruke Cypress Commands for å slippe å skrive det hver gang.**
 
Sjekk ut filen `command.js`. Der ligger det en custom command som dere kan ta i bruk alle steder dere har brukt  `.get/"[data-testid=X]"`. 


* *Merk:**
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
Ved å lage abstraksjoner for innholdet på en side tester, så gjør det at – selv om brukergrensesnittet endrer seg – så endrer du kun page-objektet ditt.

Abstraksjonen vår holder på referanser til elementene på siden vi ønsker å interagere med, samt de typiske operasjonene vi gjør på disse elementene (for eksempel skrive noe tekst i et gitt input-felt).
Dette gir oss økt fleksibilitet, nettopp fordi vi ikke trenger å endre mer enn den **ene** filen som eier abstraksjonen dersom UI-et vårt endrer seg.
I tillegg får vi mindre duplisert kode, og jeg vil påstå at testene er lettere å lese.

Se eksempel på en abstraksjon av innholdet på innlogginssiden på `cypress/integragtion/pages/LoginPage.ts` (og bytt ut/ta i bruk metodene i denne klassen i `login.spec.ts`) 

## Med Cypress ka vi enkelt benytte oss av browser-APIer
Sørg for at det er satt et felt som holder på token i `localStorage` etter at vi har fått en success etter innloggging.
Vi kan bruke `.window()` når vi chainer kommandoer i Cypress, og videre chaine på en uthenting av en verdi i localStorage med `.its("localStorage.token")`.
Deretter kan vi for testens skyld bruke en `.should("eq", "token1234")` som er det vi får fra endepunktet, men i teorien ville det kanskje vært nok å sjekket at det ble lagret en streng i `token-feltet`.

NB: I en virkelig app bør du være forsiktig med å lagre tokens som dette i `localStorage` eller `sessionStorage`. Det kan utsette deg for XSS-angrep om du ikke tar visse forhåndsregler først. Les f.eks. [denne artikkelen](https://stackoverflow.com/questions/44133536/is-it-safe-to-store-a-jwt-in-localstorage-with-reactjs), eller kortvarianten i form av [denne kommentaren på StackOverflow](https://stackoverflow.com/a/44209185)._


<details>
<summary><b>✅ FASIT</b></summary>
<code>
cy.url()
      .should('eq', `${Cypress.config().baseUrl}/`)
      .window()
      .its("localStorage.token")
      .should("eq", "token1234")
</code>
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
<summary><b>ℹ️ Hint, 500 status</b></summary>
Bruk `cy.intercept` for å stub-e et nettverkskall, kan lese om det her: https://docs.cypress.io/api/commands/intercept) 

Husk at du kan hente `baseUrl`-en fra config-en vår via `Cypress.config()`.
</details>


<details>
<summary><b>ℹ️ Hint, sjekke at validering fungerer</b></summary>
For å sjekke at et tekstfelt er synlig, kan man chaine på en `.should("be.visible"), og man kan også verifisere teksten ved å bruke `.and("have.text", "...")`
</details>

<details>
<summary><b>✅ Fasit for å vise feilmelding ved 500</b></summary>
<code>
it("should show error message if we get a 500 error response", () => {
    loginPage.visit();
        const error = "Tjenesten er utilgjengelig, prøv på nytt";
    
        cy.intercept("POST", `${Cypress.config().baseUrl}/login`, {
          statusCode: 500,
          body: {
            message: error,
          },
        });
    
        loginPage
          .typeEmail(successUser.email)
          .typePassword(successUser.password)
          .clickLoginButton()
          .getError()
          .should("be.visible")
          .and("have.text", error);
})
</code>
</details>

<details>
<summary><b>✅ Fasit for å vise valideringsfeil</b></summary>
<code>
it("should show validation error if password is less than 8 characters", () => {
loginPage
      .visit()
      .typeEmail(successUser.email)
      .getPasswordInput()
      .type("123")
      .blur();

    loginPage
      .getError()
      .should("be.visible")
      .and("have.text", "Passordet må være minst 8 tegn");
});
</code>
</details>

## Tester for nettverkskall`
I `landing-page.spec.ts` så ønsker vi:
- Vi ønsker å teste at listen av planter vi får (ligger i `fixtures`) er like lang som JSON-dataen i `fixtures` dersom nettverkskallet går OK.
- Vi ønsker også at vi skal få en feilmelding dersom nettverkskallet ikke går bra.
- Vi ønsker at spinneren ksal vises før nettverkskall er ferdig
- Vi ønsker at resultatene matcher søket vårt

Så, løs følgende tester:
```
describe("Landing page", () => {

  it("If plants are fetched successfully, should show list", () => {

  });

  it("If an error happens during plant request, an error message should be shown", () => {

  });

  it("Should show a spinner when fetching plants", () => {

  });

  it("Should show plants that matches the search only", () => {

  });
});
```

Merk, dere kan bruke intercept for å stubbe nettverkskall:
```
cy.intercept(
      { method: "GET", url: "/plants" },
      { fixture: "plants.json" },
    ).as("plants");
```
Når vi her lagrer responsen som `plants`, kan vi senere kjøre en `cy.wait("@plants") for å vente på et requestet skal fullføre.


<details>
<summary><b>✅ Fasit for tester om nettverkskall</b></summary>
<code>
it("If plants are fetched successfully, should show list", () => {
    cy.intercept(
      { method: "GET", url: "/plants" },
      { fixture: "plants.json" },
    ).as("plants");

    cy.visit("/");
    cy.wait("@plants");

    // Check that number of plant-cards equal number of entries in plants.json
    cy.getBySelector("plant-card").should("have.length", 5);
  });

  it("If an error happens during plant request, an error message should be shown", () => {
    cy.intercept(
      {
        method: "GET",
        url: "/plants",
      },
      {
        statusCode: 500,
        body: {
          message: "Dette klarte vi ikke :/",
        },
      },
    ).as("plants");

    cy.visit("/");
    cy.wait("@plants");

    cy.getBySelector("error").contains("Dette klarte vi ikke :/");
  });

  it("Should show a spinner when fetching plants", () => {
    cy.intercept(
      { method: "GET", url: "/plants" },
      { fixture: "plants.json", delay: 1000 },
    ).as("plants");

    cy.visit("/");
    cy.getBySelector("spinner").should("exist");
    cy.wait("@plants");
    cy.getBySelector("spinner").should("not.exist");
  });

  it("Should show plants that matches the search only", () => {
    cy.intercept(
      { method: "GET", url: "/plants" },
      { fixture: "plants.json" },
    ).as("plants");

    cy.visit("/");
    cy.wait("@plants");

    cy.getBySelector("search-input").type("monstera");
    cy.getBySelector("plant-card").should("have.length", 1);
    cy.getBySelector("search-input").clear();
    cy.getBySelector("search-input").type("ra");
    cy.getBySelector("plant-card").should("have.length", 2);
  });
 
</code>
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
<summary><b>ℹ️ Hint</b></summary>
Sjekk nettleserkonsollen.
</details>

<details>
<summary><b>✅️ Fasit </b></summary>
<code>
it("Has no detectable a11y violations on load", () => {
    cy.visit("/");
    cy.injectAxe();
    cy.checkA11y();
  });
  </code>
</details>


### Kodeanalyse med eslint-plugin-jsx-a11y
For å ta i bruk denne ESlint-pluginen må vi:
- Installere `eslint-plugin-jsx-a11y`
- Legge til `plugin:jsx-a11y/recommended` i `extends` i `.eslintrc.json`
- Legge til `jsx-a11y` i `plugins` i `.eslintrc.json`

Hvis du nå har konfigurert ESLint riktig, vil du umiddelbart få tilbakemeldinger på om du bryter med universell utforming.
**Merk:** Ser du nå at ESLint plukker for feil som ikke Cypress-testene ikke gjorde?
