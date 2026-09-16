<h1 align="center">🗂️ nx-typescript-tutorial</h1>

<br>

<h3 align="center">A small TypeScript monorepo to learn Nx.<br>Built right before work moved into Nx monorepos</h3>

<p align="center">
  <a href="https://github.com/Petri-Hub/nx-typescript-tutorial/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/Petri-Hub/nx-typescript-tutorial/ci.yml?label=ci&logo=githubactions&logoColor=white" /></a> <img alt="Top language" src="https://img.shields.io/github/languages/top/Petri-Hub/nx-typescript-tutorial" /> <a href="https://github.com/Petri-Hub/nx-typescript-tutorial/commits/main"><img alt="Last commit" src="https://img.shields.io/github/last-commit/Petri-Hub/nx-typescript-tutorial" /></a>
</p>

<br>

## About

> **TL;DR:** three tiny packages with a real dependency chain, so the thing under study is Nx itself: the project graph, the task order and CI. The code in the packages is trivial on purpose.

## Why it exists

At Globals we were moving from one repository per service to Nx monorepos that mix Java and TypeScript services with mobile apps, in a banking platform where things were changing fast. I wanted to understand Nx on something small before doing it on something that mattered, so I built this in a day. Ten days later I made the first commit of the monorepo for the receivables anticipation platform I went on to build and lead.

## The shape

```
@ts-demo/zoo ──▶ @ts-demo/animal ──▶ @ts-demo/util
      │                                   ▲
      └───────────────────────────────────┘
```

`util` formats a message and picks a random item, `animal` uses it to pick a random animal, and `zoo` combines both into a line like `[ZOO] cow says moo!`.

Each package imports the others by their workspace name, never by a relative path into another package's folder:

```ts
// packages/animal/src/lib/animal.ts
import { getRandomItem } from '@ts-demo/util'

export function getRandomAnimal(): Animal {
  return getRandomItem(animals);
}
```

```ts
// packages/zoo/src/lib/zoo.ts
import { getRandomAnimal } from '@ts-demo/animal';
import { formatMessage } from '@ts-demo/util'

export function zoo(): string {
  const result = getRandomAnimal();
  const message = `${result.name} says ${result.sound}!`;
  return formatMessage('ZOO', message);
}
```

## What it covers

**🔗 The graph comes from the imports.** None of the packages lists another in its `package.json`. Nx reads the `import` statements to know that `zoo` depends on `animal` and `util`, and the TypeScript project references follow the same chain.

```jsonc
// packages/zoo/package.json
"dependencies": {
  "tslib": "^2.3.0"
}
```

**🎯 Tasks run in dependency order.** `test` depends on `^build` in `nx.json`, so testing `zoo` builds `util` and `animal` first, without a hand-written build order.

**☁️ CI runs every target across the workspace.** GitHub Actions runs lint, test, build and typecheck for all packages with `nx run-many`, and the workspace is connected to Nx Cloud.

## What's inside

```sh
├── packages
│   ├── animal       # picks a random animal, using util
│   ├── util         # message formatting and random picks
│   └── zoo          # the top of the chain, using animal and util
├── nx.json          # plugins, named inputs and the ^build dependency for tests
└── .github          # CI through nx run-many
```

## Technologies

<table align="center">
  <tr>
    <td align="center" width="96"><img src="https://cdn.simpleicons.org/nx/9198A1" width="48" height="48" alt="Nx" /><br>Nx</td>
    <td align="center" width="96"><img src="https://cdn.simpleicons.org/typescript" width="48" height="48" alt="TypeScript" /><br>TypeScript</td>
    <td align="center" width="96"><img src="https://cdn.simpleicons.org/vite" width="48" height="48" alt="Vite" /><br>Vite</td>
    <td align="center" width="96"><img src="https://cdn.simpleicons.org/vitest" width="48" height="48" alt="Vitest" /><br>Vitest</td>
    <td align="center" width="96"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg" width="48" height="48" alt="GitHub Actions" /><br>GitHub Actions</td>
  </tr>
</table>
