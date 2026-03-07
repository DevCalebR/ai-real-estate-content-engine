# Portfolio Validation Report

Validation date: 2026-03-07

## Environment

- Workspace: local Next.js project
- Runtime: Node / npm local environment
- App base URL used for smoke checks and screenshots: `http://localhost:3000`

## Commands Run

### Install

```bash
npm install
```

Outcome:

- Passed
- Dependencies already up to date
- `found 0 vulnerabilities`

### Seed Sample Data

```bash
npm run seed:sample
```

Outcome:

- Passed

### Lint

```bash
npm run lint
```

Outcome:

- Passed with no reported errors

### Typecheck

```bash
npm run typecheck
```

Outcome:

- Passed with no reported errors

### Build

```bash
npm run build
```

Outcome:

- Passed
- Production build completed successfully

## Demo Smoke Checks

### Seed Demo Workspace

```bash
curl -s -X POST http://localhost:3000/api/demo/seed
```

Outcome:

- Passed
- Returned a valid run id: `demo-workspace`

### Main Routes

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/results/demo-workspace
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/results/demo-workspace/print
```

Outcome:

- All returned `200`

### Export Routes

```bash
curl -s -o /dev/null -w '%{http_code}\n' 'http://localhost:3000/api/runs/demo-workspace/export?format=html'
curl -s -o /dev/null -w '%{http_code}\n' 'http://localhost:3000/api/runs/demo-workspace/export?format=json'
```

Outcome:

- Both returned `200`

## Screenshot Asset Generation

The following screenshots were generated from the live local app:

- `docs/portfolio-assets/01-dashboard.png`
- `docs/portfolio-assets/02-generate-form.png`
- `docs/portfolio-assets/03-results-workspace.png`
- `docs/portfolio-assets/04-history.png`
- `docs/portfolio-assets/05-print-report.png`
- `docs/portfolio-assets/06-architecture.png`

## Not Revalidated In This Pass

- A live Google Docs export was not re-executed during this portfolio pass because it writes a real document into the connected Google account.
- No automated `test` script exists in `package.json`, so there is currently no dedicated unit or integration test suite to run.

## Overall Validation Verdict

The project passes the current portfolio validation bar for a local demoable product: install, demo seeding, lint, typecheck, build, core routes, export routes, and screenshot generation all completed successfully.
