# v5.nevcan.com

nevcan.com from 2016 to 2022, the diving instructor years, kept online as an archive at
**[v5.nevcan.com](https://v5.nevcan.com)**. Search engines are asked not to index it.

The same design lived through two builds: a static jQuery one-pager (2016–2018) and a Vue 2
rebuild (2019–2022). Both share this repository's history, one commit per change.

| Tag | Version | Online at |
| --- | --- | --- |
| `2016.01` | First version of the static site | [/2016.01/](https://v5.nevcan.com/2016.01/) |
| `2016.03` | Locations and course details updated | [/2016.03/](https://v5.nevcan.com/2016.03/) |
| `2017.06` | Files moved under `assets/`, five-language switcher | [/2017.06/](https://v5.nevcan.com/2017.06/) |
| `2018.03` | Last static version, with the COURSES section | [/2018.03/](https://v5.nevcan.com/2018.03/) |
| `2022.06` | Last Vue version, with the freediving records | [/](https://v5.nevcan.com/) |

The site's first design appeared in August 2015 at nevcan.com/dalgic, which lives on in
[v4.nevcan.com](https://github.com/nevcan-com/v4.nevcan.com).

## Where the files come from

- **2016–2018 (static):** restored from the Wayback Machine. Each commit is one capture of
  the home page and carries its capture date; its message links to the capture and lists any
  file that was never archived.
- **2018–2022 (Vue):** the original source code and commit history.

## How it is published

[`.github/workflows/pages.yml`](.github/workflows/pages.yml) runs on every push to `main` and
every new tag:

1. builds the Vue site (Node 14, webpack 3) into `dist/`
2. copies each static tag into `dist/<tag>/`, then anything in `fixes/<tag>/` on top of it
3. runs [`scripts/archive.mjs`](scripts/archive.mjs), which adds `noindex`, writes a
   `robots.txt` that disallows everything, removes the trackers, makes the dead contact
   form show a note instead of sending, loads external files over https, points the
   static versions' root-relative paths (`/assets/...`) into their folder, replaces the
   Google map (its keyless API is gone) with a greyscale embed and shows a saved copy of
   the RateYourDive badge

The tagged commits stay exactly as the sites were; the archive changes exist only in the
published copy. To fix a static version later, for example with an image recovered from an
old backup, add the file under `fixes/<tag>/` at the same path and push to `main`.

## Running the Vue site locally

Needs Node 14 (it does not build on newer versions).

```bash
npm ci
npm run dev     # http://localhost:8080
npm run build   # into dist/
```
