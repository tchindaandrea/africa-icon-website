# Africa ICON Website

A single-page marketing site for **Africa ICON** (African Intercollegiate Conference),
built with plain HTML/CSS/JS — no build step, no dependencies.

## Running locally

Just open `index.html` in a browser, or serve it locally:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Launch status

Everything below is done and live:
- **Waitlist form** is connected to Mailchimp (`https://theafricaicon.us20.list-manage.com/...`) —
  signups land in your Audience and you can email them anytime from Mailchimp's Campaigns tab.
  See "Mailchimp maintenance" below for how edits there affect the site.
- **Logos**: HASA, HASS, and the correct Harvard College shield are all in place
  (`assets/org-logos/`), used in the footer. The Harvard *University* seal files found on this
  machine (`Harvard-Logo.png`, `Font-Harvard-Logo.png`) were intentionally **not** used anywhere,
  since only the Harvard College mark is authorized.
- **Copy**: all FAQ answers, mission statement, and About section cards are finalized (no more
  placeholder text).
- **Domain**: canonical URL and social preview meta tags point to `theafricaicon.com`.

### Mailchimp maintenance
The form URL is tied to your Mailchimp **account** and **audience**, not to the form's design —
so routine edits in Mailchimp (colors, text, adding/removing merge fields) don't require touching
the site. You'd only need to update the URL in `js/main.js` (`MAILCHIMP_URL`) and `index.html`
(the form's `action`) if you delete this audience and create a new one.

**Optional — track University in Mailchimp:** by default only name and email sync. To sync
university too, add a custom text field in Mailchimp under **Audience > Settings > Audience
fields**, then set its merge tag (e.g. `MMERGE3`) as `MAILCHIMP_UNIVERSITY_MERGE_TAG` in
`js/main.js`.

### Worth double-checking before you announce a date publicly
The countdown targets **February 26, 2027, 9:00 AM** (local time of the visitor), set in
`js/main.js`:

```js
const AFRICA_ICON_START = new Date("2027-02-26T09:00:00");
```

Update the time if you get a firmer start time, and update the visible date text in `index.html`
(`.hero-date` and the FAQ) to match.

### Traction numbers
The "Early Momentum" section shows **200+ students** and **100+ universities**. Update the
`data-count-to` values on the `.stat-number` elements in `index.html` whenever these change.

## Deploying
This is a fully static site — any static host works:
- **Netlify / Vercel**: drag-and-drop the folder, or connect a Git repo.
- **GitHub Pages**: push to a repo and enable Pages on the `main` branch.

No build step is required.

### Custom domain
The site is meant to live at **theafricaicon.com** (already used in the canonical URL and social
preview meta tags in `index.html`). Point that domain at whichever host you deploy to — each of
the hosts above has a "custom domain" setting in its dashboard that gives you the DNS records
(usually a CNAME or A record) to add at your domain registrar.

## File structure
```
index.html          Page markup
css/styles.css       All styling (brand colors as CSS variables at the top)
js/main.js           Countdown, animated stats, mobile nav, waitlist form, scroll-in reveal animations
assets/              Web-optimized logo/favicon/social-share images
assets/logos/        Original full-resolution Africa ICON logo variation files
assets/org-logos/    HASA, HASS, and Harvard College shield logos
```
