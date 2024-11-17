import { HmrContext, Plugin, createServer } from 'vite';
import { ViteNodeRunner } from 'vite-node/client';
import { ViteNodeServer } from 'vite-node/server';

export async function setupViteServer(opts: {
  workspaceRootPath: string,
  hotReloadHandler: (ctx: HmrContext) => Promise<void>,
  enableWatch: boolean
}) {
  const customPlugin: Plugin = {
    name: 'custom-config-loader-plugin',

    // THIS IS IMPORTANT - it forces our dmno code to be "externalized" rather than bundled
    // otherwise we end up not loading the same code here in this file as within the config files
    // meaning we have 2 copies of classes and `instanceof` stops working
    enforce: 'pre', // Run before the builtin 'vite:resolve' of Vite
    async resolveId(source, importer, options) {
      // console.log('PLUGIN RESOLVE!', source, importer, options);

      if (source === 'this-lib') {
        // const resolution = await this.resolve(source, importer, options);
        // console.log('dmno resolution', resolution);
        // if (!resolution) return;

        return {
          // pointing at dist/index is hard-coded...
          // we could extract the main entry point from the resolution instead?
          id: `${opts.workspaceRootPath}/dist/index.js`,
          // id: currentDmnoPath,
          external: 'absolute',
        };
      }
    },

    async handleHotUpdate(ctx) {
      // ignore updates to the generated type files
      if (ctx.file.includes('/.dmno/.typegen/')) return;

      // ignore files outside of the .dmno folder(s)?
      // generally, we shouldn't be reloading the config when the user's app code is updated
      // maybe there are exceptions (package.json? something else?)
      if (!ctx.file.includes('/.dmno/')) return;

      // console.log('hot reload in vite plugin', ctx);

      // clear updated modules out of the cache
      ctx.modules.forEach((m) => {
        if (m.id) viteRunner.moduleCache.deleteByModuleId(m.id);
      });

      await opts.hotReloadHandler(ctx);
    },
  };

  // create vite server
  const server = await createServer({
    root: opts.workspaceRootPath,
    appType: 'custom',
    clearScreen: false,
    logLevel: 'warn',
    plugins: [
      customPlugin,
    ],
    configFile: false,
  });

  // required for plugins
  await server.pluginContainer.buildStart({});

  // create vite-node server
  const node = new ViteNodeServer(server, {
    debug: {
      // dumpModules: true,
    },
  });


  // create vite-node runner
  const viteRunner = new ViteNodeRunner({
    debug: true,
    root: server.config.root,
    base: server.config.base,
    // when having the server and runner in a different context
    // you will need to handle the communication between them and pass to this function
    async fetchModule(id) {
      // console.log('fetch module', id);
      return node.fetchModule(id);
    },
    async resolveId(id, importer) {
      // console.log('resolve id', id, importer);
      return node.resolveId(id, importer);
    },
  });

  return { viteRunner, viteServer: server };
}
