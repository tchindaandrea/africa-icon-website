# Africa ICON Website

A mostly single-page marketing site for **Africa ICON** (African Intercollegiate Conference),
built with plain HTML/CSS/JS — no build step, no dependencies, no templating. Home
(`index.html`) is one scrolling page (Hero, About, Traction, FAQ, Waitlist); Programming and
the Pitch Competition are broken out into their own pages since their content didn't fit
naturally into the scroll.

Since there's no templating system, the header (nav) and footer are duplicated by hand across
every page (`index.html`, `programming.html`, `pitch-competition.html`, `partner.html`, `team.html`). If you edit the nav
links, footer disclaimer, or org logos, update all five files to keep them in sync.

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
(`.hero-date` and the first FAQ answer) to match.

### Traction numbers
The "Early Momentum" section shows **400+ students** and **100+ universities**. Update the
`data-count-to` values on the `.stat-number` elements in `index.html` whenever these change — and
the matching `.stat-chip` numbers at the top of `partner.html`.

### Donations (GoFundMe)
The GoFundMe link (`https://gofund.me/07dfc017f`) appears in the header "Donate" button, the mobile
menu, the Donate section on Home, the CTAs on Programming / Pitch Competition / Partner, and the
footer on every page. If the link changes, search-and-replace it across all `.html` files.

### Partner / sponsor contact form
`partner.html` has a contact form powered by [FormSubmit](https://formsubmit.co) (free, no account).
Submissions go to **partnerships@theafricaicon.com** with **info@theafricaicon.com** CC'd
(hidden `_cc` field). **One-time setup:** the very first submission triggers an activation email to
partnerships@ — click the link in it, or no messages will be delivered. After activating, FormSubmit
also gives you a random alias you can swap into the form's `action` so the raw address isn't in the
page source (optional).

### Photos
Photos are hotlinked from Unsplash (free to use under the Unsplash License, no attribution required)
via `images.unsplash.com/<photo-id>?...`. They're generic city/student imagery, not photos of Africa
ICON. Once you have real event or team photos, swap them in — the hero photos are set with
`style="--hero-img: url(...)"` on each page's hero section.

### Team page
`team.html` shows each team member's photo, role, and school; hovering (or tapping on a phone) slides
up their bio. Headshots live in `assets/team/` as `firstname-lastname.jpg`, cropped to 3:4 portrait at 720×960.
To replace one, save a new 3:4 portrait over the matching file. To add someone,
copy one `<article class="team-card">` block in `team.html` and change the name, role, school, photo,
and bio.

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
index.html                Home — hero, countdown, About, Traction, FAQ, and the waitlist form
programming.html          Programming — session cards with photos, pitch competition teaser
partner.html              Partner With Us — why partner, ways to get involved, contact form (FormSubmit)
team.html                 Meet the Team — photo cards with hover bios
assets/team/              Team headshots
pitch-competition.html    Pitch Competition — For-Profit/Non-Profit/Research funding tracks
css/styles.css            All styling (brand colors as CSS variables at the top)
js/main.js                Countdown, animated stats, mobile nav, waitlist form, scroll-in reveal animations
assets/                   Web-optimized logo/favicon/social-share images
assets/logos/             Original full-resolution Africa ICON logo variation files
assets/org-logos/         HASA, HASS, and Harvard College shield logos
```

The waitlist form and countdown only live on `index.html`. Programming and Pitch Competition
link back to it via `index.html#waitlist` (the "Join the Waitlist" button in the nav, and a CTA
banner near the bottom of each page).
