# Vietato Scopare - Requisiti UI/UX (stato corrente)

## 1) Visione prodotto
- La piattaforma e una bacheca dating curatoriale, non una dating app a scorrimento infinito.
- I profili mostrati sono fissi e selezionati manualmente.
- Obiettivo UX: ridurre la frenesia e riportare al centro persone e relazioni.

## 2) Struttura pagina
- Header pagina con logo + citazione.
- Stack verticale di profili (un profilo sotto l'altro).
- Ogni profilo e composto da due blocchi principali:
  - `collage` foto (sinistra su desktop, in alto su mobile).
  - contenuto testuale (destra su desktop, sotto su mobile).

Relazioni:
- Il componente profilo dipende da dati profilo condivisi (`profiles-data.js`).
- Layout e comportamento del collage dipendono dal breakpoint (desktop vs mobile).

## 3) Sistema griglia e container (desktop)
- Container principale:
  - larghezza massima `1032px`.
  - centrato orizzontalmente.
- Griglia profilo:
  - 12 colonne da `64px`.
  - gap colonna `24px`.
  - split 6/6:
    - collage: colonne 1-6.
    - testo: colonne 7-12.

Relazioni:
- Le dimensioni delle polaroid desktop si adattano alla larghezza reale della colonna collage.

## 4) Componente Collage (desktop)
- Colonna collage con altezza fissa `800px`.
- Polaroid desktop:
  - `polaroid1` grande.
  - `polaroid2`, `polaroid3`, `polaroid4` piccole.
- Cornice polaroid:
  - padding bianco `6px`.
  - grande: `400/388` (cornice/foto interna) al massimo.
  - piccole: max `240/228`, con minimo richiesto `220px`.
- Layering richiesto (dal meno in primo piano al piu in primo piano):
  - `polaroid1 -> polaroid2 -> polaroid4 -> polaroid3`.
- Posizionamento:
  - grande sullo sfondo.
  - piccole sovrapposte progressivamente.
  - prima piccola parte circa dal quarto inferiore della grande.
- Distribuzione responsive orizzontale:
  - le piccole si allontanano dal centro quando c'e piu spazio.
  - si avvicinano quando c'e meno spazio.
- Variazione casuale leggera per profilo:
  - piccoli offset posizione.
  - inclinazione casuale.

Relazioni:
- Il collage usa jitter/tilt generati in `main.js`.
- Il layering visuale e legato sia al CSS (`z-index`) sia allo stato hover desktop.

## 5) Componente Collage (mobile)
- Breakpoint mobile: `max-width: 720px`.
- In mobile il collage diventa un carosello orizzontale scrollabile.
- Le polaroid vanno a tutta larghezza viewport (bleed), non restano confinate nel container testo.
- Tutte le polaroid mobile hanno stessa dimensione:
  - larghezza `340px`.
  - foto interna `328px` (padding cornice `6px` per lato).
- Comportamento carosello:
  - snap al centro.
  - sovrapposizione leggera tra card.
  - card attiva centrata e raddrizzata.
  - card non attive inclinate casualmente (range circa `-10deg` / `+10deg`) e dietro.

Relazioni:
- Il comportamento attiva/non attiva dipende da JS (`updateActivePolaroid`).
- Il calcolo card attiva dipende dalla posizione di scroll del contenitore collage.

## 6) Componente Testo Profilo
- Header profilo definito come:
  - nome (`h2`) + badge meta (eta + luogo).
- Regola tipografica:
  - tutti i testi profilo a `16px`, salvo header profilo (nome + badge) che resta dedicato.
- Blocchi contenuto:
  - bio.
  - highlights.
  - sezione "looking for".
  - domanda finale.
  - CTA risposta.

Relazioni:
- I contenuti testuali sono renderizzati dai dati in `profiles-data.js`.

## 7) Logo/Header
- Logo caricato da asset locale:
  - `./assets/logo-vietato-scopare.svg`.
- Preload immagine logo attivo.
- Dimensioni intrinseche del logo dichiarate in HTML per stabilizzare il layout al load.
- Gestione rapporto d'aspetto corretta (no schiacciamento verticale).

Relazioni:
- Il preload del logo riduce layout shift nell'header, influenzando la stabilita visiva della pagina.

## 8) Dati e rendering
- Dati profili separati dalla logica:
  - `profiles-data.js` contiene `window.curatedProfiles`.
  - `main.js` contiene rendering/comportamenti.
- Ordine script:
  - prima dati, poi logica.
- Ogni card profilo e renderizzata dinamicamente dal dataset.

Relazioni:
- `main.js` dipende dalla presenza di `window.curatedProfiles`.
- Il collage dipende da classi CSS assegnate in fase di rendering.

## 9) Interazioni desktop
- Hover su polaroid (desktop, pointer fine):
  - card si raddrizza.
  - card si ingrandisce mantenendo centro fisso.
  - card va in primissimo piano.

Relazioni:
- Hover desktop convive con jitter base; lo stato hover ha priorita visiva.

## 10) Vincoli tecnici principali
- Nessuna dipendenza framework: stack HTML/CSS/JS vanilla.
- Requisiti responsive distinti per desktop/mobile.
- Evitare regressioni di overflow orizzontale pagina mantenendo il bleed controllato del carosello mobile.

---

## 11) Checklist QA (verifica rapida)

### 11.1 Visione e struttura
- [ ] La pagina mostra una bacheca profili curatoriale (nessun feed infinito).
- [ ] I profili sono in stack verticale (uno sotto l'altro).
- [ ] Ogni profilo contiene collage foto + contenuto testuale.

### 11.2 Grid e container desktop
- [ ] Il container principale non supera `1032px`.
- [ ] La griglia desktop usa 12 colonne da `64px` con gap `24px`.
- [ ] Il profilo e diviso 6/6: collage a sinistra, testo a destra.

### 11.3 Collage desktop
- [ ] Altezza colonna collage desktop: `800px`.
- [ ] Polaroid grande e piccole si ridimensionano con la colonna.
- [ ] Le polaroid piccole non scendono sotto `220px`.
- [ ] Layering corretto: `polaroid1 -> polaroid2 -> polaroid4 -> polaroid3`.
- [ ] Le polaroid piccole restano sovrapposte e distribuite verticalmente.
- [ ] La distribuzione orizzontale e responsive (piu spazio = piu distanza dal centro).

### 11.4 Interazioni desktop
- [ ] Hover su polaroid: card raddrizzata.
- [ ] Hover su polaroid: card ingrandita mantenendo centro fisso.
- [ ] Hover su polaroid: card in primissimo piano.

### 11.5 Collage mobile
- [ ] Breakpoint mobile attivo a `max-width: 720px`.
- [ ] Il collage mobile e un carosello orizzontale scrollabile.
- [ ] Le polaroid mobile hanno tutte larghezza `340px`.
- [ ] Le card sono leggermente sovrapposte.
- [ ] Lo snap e centrato.
- [ ] La card attiva e raddrizzata e in primo piano.
- [ ] Le card non attive sono inclinate casualmente tra `-10deg` e `+10deg`.
- [ ] Il carosello puo uscire dal container e arrivare ai bordi laterali viewport.
- [ ] Nessun clipping visibile in alto/basso delle card inclinate.
- [ ] Nessuno scroll orizzontale indesiderato dell'intera pagina.

### 11.6 Tipografia
- [ ] Header profilo = nome + badge eta/luogo.
- [ ] Tutti i testi del profilo (escluso header profilo) sono a `16px`.
- [ ] Le dimensioni testo non sono legate a `vw`/`clamp` responsive.

### 11.7 Logo e stabilita layout
- [ ] Logo caricato da `./assets/logo-vietato-scopare.svg`.
- [ ] Preload logo presente in `<head>`.
- [ ] `width`/`height` intrinseci del logo impostati in HTML.
- [ ] Nessun layout shift evidente del logo al caricamento.

### 11.8 Dati e rendering
- [ ] I dati profilo sono in `profiles-data.js`.
- [ ] `main.js` contiene solo logica/render/interazioni.
- [ ] `index.html` carica prima `profiles-data.js`, poi `main.js`.

---

## 12) Known Issues / Rischi aperti
- Mobile Chrome: possibili differenze residue di rendering su overflow/safe-area tra device Android e iOS.
- Carosello mobile con sovrapposizione: il calcolo card attiva e robusto, ma va validato su device molto piccoli o con zoom browser attivo.
- Rotazioni casuali: per design sono non deterministiche a ogni reload; se serve coerenza editoriale per profilo va introdotto seed stabile.
- Hover desktop: su alcuni touch laptop il comportamento puo variare in base al tipo di pointer esposto dal browser.

## 13) Decision Log (storico sintetico)
- `D-001`: Bacheca profili verticali (non tab selettive). Motivazione: esperienza curatoriale e meno frenetica.
- `D-002`: Dati separati dalla logica (`profiles-data.js` + `main.js`). Motivazione: manutenibilita e chiarezza.
- `D-003`: Grid desktop 12 colonne (`64px`) con gap `24px`, container max `1032px`. Motivazione: allineamento al sistema layout richiesto.
- `D-004`: Desktop collage con layering controllato e jitter leggero. Motivazione: look editoriale meno rigido.
- `D-005`: Mobile collage in carosello orizzontale con snap centrato e card attiva raddrizzata. Motivazione: leggibilita e focus visivo sul frame corrente.
- `D-006`: Tutti i testi profilo a `16px` (eccetto header profilo). Motivazione: coerenza tipografica e riduzione rumore visivo.
- `D-007`: Logo locale da `/assets` con preload e dimensioni intrinseche dichiarate. Motivazione: riduzione layout shift e controllo asset.
- `D-008`: Polaroid mobile con dimensione uniforme (`340px`). Motivazione: semplificazione percettiva e migliori performance rispetto a scaling dinamico attiva/non attiva.
