# Poke the Austin

A desktop-only Phaser webgame where the player tries to poke a 16-bit Austin boss with the mouse cursor while dodging sword swings and fireballs.

## Project Layout

- `apps/web`: Vite + Phaser browser game.
- `packages/game-core`: shared TypeScript difficulty config, combat helpers, and public game types.
- `apps/web/public/assets`: stable asset slots for sprites, effects, backgrounds, items, and optional audio.

## Local Development

```sh
pnpm install
pnpm dev
```

The dev server runs the web app from `apps/web`. Gameplay is intentionally blocked for coarse-pointer or small-viewport devices.

## Checks

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm --filter @poke-the-austin/web test:e2e
```

## Assets

The game reads `apps/web/public/assets/assets.json`. Keep the manifest keys stable and update the file paths after moving final sprite files into place.

Use `apps/web/public/assets/assets.example.json` as the contract for final art and audio slots:

- boss idle, move, attack, hurt, defeated
- cursor normal, hurt, defeated
- sword slash, fireball, hit, explosion
- optional pointer item, arena background, and audio effects

The scaffold includes simple SVG placeholders so the game can run before final assets are added.

## Docker

```sh
docker build -t poke-the-austin .
docker run --rm -p 8080:80 poke-the-austin
```

Then open `http://localhost:8080` on a desktop browser.

## CI

GitHub Actions runs linting, typechecking, unit tests, production build, and a Docker build smoke check on pull requests and pushes to `main`.
