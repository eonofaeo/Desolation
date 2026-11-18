# Desolation

The frontend for **Bringing Life in Desolation**, a vlog and journal about life, tech, news, and reviews.

- [Read the journal on GitHub Pages](https://eonofaeo.github.io/Desolation/)
- [Open the creator studio](https://bringing-life-in-desolation.blondefir8.chatgpt.site/admin)

The static frontend reads published stories from the Cloudflare Worker. The studio and drafts live on the backend and require owner access. The cover illustrations in this repository are original generated images.

## Build

```sh
npm ci
npm run check
npm run build
```

GitHub Pages publishes the generated `docs/` directory from `main`. Run the build and commit `docs/` alongside source changes. To build for a different API, set `JOURNAL_BACKEND_ORIGIN` to its HTTPS origin and allow this Pages origin in that API's CORS configuration.
