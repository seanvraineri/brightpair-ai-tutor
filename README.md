# Supabase CLI

[![Coverage Status](https://coveralls.io/repos/github/supabase/cli/badge.svg?branch=main)](https://coveralls.io/github/supabase/cli?branch=main) [![Bitbucket Pipelines](https://img.shields.io/bitbucket/pipelines/supabase-cli/setup-cli/master?style=flat-square&label=Bitbucket%20Canary)](https://bitbucket.org/supabase-cli/setup-cli/pipelines) [![Gitlab Pipeline Status](https://img.shields.io/gitlab/pipeline-status/sweatybridge%2Fsetup-cli?label=Gitlab%20Canary)
](https://gitlab.com/sweatybridge/setup-cli/-/pipelines)

[Supabase](https://supabase.io) is an open source Firebase alternative. We're building the features of Firebase using enterprise-grade open source tools.

This repository contains all the functionality for Supabase CLI.

- [x] Running Supabase locally
- [x] Managing database migrations
- [x] Creating and deploying Supabase Functions
- [x] Generating types directly from your database schema
- [x] Making authenticated HTTP requests to [Management API](https://supabase.com/docs/reference/api/introduction)

## Getting started

### Install the CLI

Available via [NPM](https://www.npmjs.com) as dev dependency. To install:

```bash
npm i supabase --save-dev
```

To install the beta release channel:

```bash
npm i supabase@beta --save-dev
```

When installing with yarn 4, you need to disable experimental fetch with the following nodejs config.

```
NODE_OPTIONS=--no-experimental-fetch yarn add supabase
```

> **Note**
For Bun versions below v1.0.17, you must add `supabase` as a [trusted dependency](https://bun.sh/guides/install/trusted) before running `bun add -D supabase`.

<details>
  <summary><b>macOS</b></summary>

  Available via [Homebrew](https://brew.sh). To install:

  ```sh
  brew install supabase/tap/supabase
  ```

  To install the beta release channel:
  
  ```sh
  brew install supabase/tap/supabase-beta
  brew link --overwrite supabase-beta
  ```
  
  To upgrade:

  ```sh
  brew upgrade supabase
  ```
</details>

<details>
  <summary><b>Windows</b></summary>

  Available via [Scoop](https://scoop.sh). To install:

  ```powershell
  scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
  scoop install supabase
  ```

  To upgrade:

  ```powershell
  scoop update supabase
  ```
</details>

<details>
  <summary><b>Linux</b></summary>

  Available via [Homebrew](https://brew.sh) and Linux packages.

  #### via Homebrew

  To install:

  ```sh
  brew install supabase/tap/supabase
  ```

  To upgrade:

  ```sh
  brew upgrade supabase
  ```

  #### via Linux packages

  Linux packages are provided in [Releases](https://github.com/supabase/cli/releases). To install, download the `.apk`/`.deb`/`.rpm`/`.pkg.tar.zst` file depending on your package manager and run the respective commands.

  ```sh
  sudo apk add --allow-untrusted <...>.apk
  ```

  ```sh
  sudo dpkg -i <...>.deb
  ```

  ```sh
  sudo rpm -i <...>.rpm
  ```

  ```sh
  sudo pacman -U <...>.pkg.tar.zst
  ```
</details>

<details>
  <summary><b>Other Platforms</b></summary>

  You can also install the CLI via [go modules](https://go.dev/ref/mod#go-install) without the help of package managers.

  ```sh
  go install github.com/supabase/cli@latest
  ```

  Add a symlink to the binary in `$PATH` for easier access:

  ```sh
  ln -s "$(go env GOPATH)/bin/cli" /usr/bin/supabase
  ```

  This works on other non-standard Linux distros.
</details>

<details>
  <summary><b>Community Maintained Packages</b></summary>

  Available via [pkgx](https://pkgx.sh/). Package script [here](https://github.com/pkgxdev/pantry/blob/main/projects/supabase.com/cli/package.yml).
  To install in your working directory:

  ```bash
  pkgx install supabase
  ```

  Available via [Nixpkgs](https://nixos.org/). Package script [here](https://github.com/NixOS/nixpkgs/blob/master/pkgs/development/tools/supabase-cli/default.nix).
</details>

### Run the CLI

```bash
supabase bootstrap
```

Or using npx:

```bash
npx supabase bootstrap
```

The bootstrap command will guide you through the process of setting up a Supabase project using one of the [starter](https://github.com/supabase-community/supabase-samples/blob/main/samples.json) templates.

## Docs

Command & config reference can be found [here](https://supabase.com/docs/reference/cli/about).

## Breaking changes

We follow semantic versioning for changes that directly impact CLI commands, flags, and configurations.

However, due to dependencies on other service images, we cannot guarantee that schema migrations, seed.sql, and generated types will always work for the same CLI major version. If you need such guarantees, we encourage you to pin a specific version of CLI in package.json.

## Developing

To run from source:

```sh
# Go >= 1.22
go run . help
```

# BrightPair AI Tutor

A personalized AI-powered tutoring platform powered by React, TypeScript and Supabase.

---

## Quick-start

### 1. Clone & install

```bash
# Using pnpm (recommended) or npm / yarn
pnpm install
```

### 2. Environment variables

Copy `.env.example` → `.env.local` and fill in your project credentials:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Database

If you only use the cloud database:

```bash
supabase link --project-ref <your-project-ref>
supabase db push            # runs ./supabase/migrations/*
```

For full local workflow you'll need Docker and can run `supabase start` instead.

### 4. Run the app

```bash
pnpm dev      # vite dev server on http://localhost:5173 (or 8083 if you changed it)
```

### 5. Type checking & linting

```bash
pnpm lint      # eslint + prettier
pnpm typecheck # tsc --noEmit
```

---

## Project structure (apps only)

```
src/
  pages/           route based views
  components/      shared UI + feature components
  routes/          React-Router bundled route groups
  services/        thin API / Supabase callers
supabase/
  migrations/      SQL change scripts (RLS policies etc.)
```

---

## Current readiness score

We're tracking progress across 5 pillars: Data, Auth, UX, Tests, DevOps.

| Pillar | Status |
| ------ | ------ |
| Data layer & migrations | 70 % (core tables & RLS scripted; remaining: replace all mock fetches) |
| Auth / role gates        | 80 % (role-based routing finished; signup flow TBD) |
| UI / UX                  | 75 % (layout alignment fixed; responsive + a11y pass pending) |
| Testing                  | 20 % (typecheck ok, tests not written) |
| DevOps / docs            | 60 % (README updated, CI + monitoring todo) |

**Overall completion ≈ 62 %.**

Next milestone: wire live Supabase queries (students, assignments, messages) and push remaining migrations.

---

## Features

- **AI Tutor Chat**: Engage with an AI tutor for personalized learning assistance
- **Curriculum Lessons**: Access lessons from the mathematics curriculum
- **Custom Lessons**: Create your own lessons from notes or uploaded documents
- **Flashcards & Quizzes**: Generate study materials tailored to specific topics
- **Progress Tracking**: Monitor learning progress across different skills

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Database, Auth, Storage, Edge Functions)
- **AI**: OpenAI GPT models

## Architecture

The application follows a hybrid architecture:

1. **Edge Functions** (Production): Serverless functions hosted on Supabase that handle AI interactions securely
2. **Direct API** (Development): Direct calls to OpenAI API for easier development

## Environment Setup

### Required Environment Variables

Create a `.env` file with these variables:

```
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_OPENAI_API_URL=https://api.openai.com/v1

# Application Configuration
VITE_USE_EDGE_FUNCTIONS=true
VITE_USE_MOCK_DATA=false
VITE_SAVE_LESSONS=true
```

### Development Environment

For development, use:

```
VITE_USE_EDGE_FUNCTIONS=false
VITE_USE_MOCK_DATA=true
```

## Installation & Local Development

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/brightpair-ai-tutor.git
   cd brightpair-ai-tutor
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Database Schema

The application requires the following tables in Supabase:

- `profiles`: User profiles with learning preferences
- `lessons`: Stores all lesson data including custom lessons
- `skills`: Curriculum-based skills and topics
- `student_skills`: Tracks student mastery of skills
- `chat_logs`: History of AI tutor conversations

## Supabase Edge Functions

Deploy the Edge Functions to Supabase:

1. Navigate to the functions directory:
   ```
   cd supabase/functions
   ```

2. Deploy each function:
   ```
   supabase functions deploy ai-tutor
   supabase functions deploy generate-flashcards
   supabase functions deploy extract-pdf-text
   ```

## Production Deployment

1. Build the application:
   ```
   npm run build
   ```

2. Deploy to your hosting platform:
   - Vercel: `vercel deploy`
   - Netlify: `netlify deploy`
   - Static hosting: Upload the `dist` directory

## Scaling Considerations

For scaling the application to handle more users:

1. **Caching**: Implement caching for commonly requested lessons and responses
2. **Rate Limiting**: Configure rate limits for AI API calls
3. **Optimistic UI**: Implement optimistic updates for better UX during API calls
4. **Database Indexes**: Ensure proper indexes on frequently queried fields
5. **Edge Function Optimization**: Optimize Edge Functions for better cold-start performance
6. **CDN**: Use a CDN for static assets and consider edge caching for API responses

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For inquiries, please contact support@brightpair.com
