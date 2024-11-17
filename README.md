# vite-node-dupe-load
minimal reproduction of issue around vite-node and re-loading a new copy of the current module

## setup
- `pnpm install`

## reproduction steps:
- run `pnpm build`
- run `pnpm test`
- you will see messages showing the issue

---

Imagine a setup like so
- `mylib` has a cli that runs and uses vite-node to load some config files written in typescript and do something with the result
- those config files import helpers from `mylib`
- other plugins (ex: `mylib/plugin-x`) which could be used in those config files may also import those helpers from `mylib`

The problem is that the copy of `mylib` in the CLI process is not the same as the copy that vite-node loads while processing the config file.

This breaks things like `instanceof`, `ALS`, symbols, because there are 2 copies of everything.

While there are workarounds, its all awkward, and feels very error prone. I'd love to make these things just work, perhpas by injectiong already loaded modules (the current copy of mylib in the cli process) into the vite module cache somehow?

One other possible solution is that the config file could be wrapped in a function and the current process could inject its own copy of my lib, but we would still have issues with other dependencies that were importing `mylib`.
