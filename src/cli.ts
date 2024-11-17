import path, { dirname } from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import { setupViteServer } from "./vite-server";
import { exampleAls, ExampleClass, workaroundAls } from './helpers';

const __dirname = dirname(fileURLToPath(import.meta.url));

const fileToLoadPath = path.resolve(__dirname, '../files-to-load/example1.ts');

const { viteRunner } = await setupViteServer({
  workspaceRootPath: '',
  hotReloadHandler: async () => { 
    console.log('reload!');
  },
  enableWatch: false,
});


exampleAls.enterWith({});
workaroundAls.enterWith({});
const loadedFile = await viteRunner.executeFile(fileToLoadPath);


console.log('\n-- instanceof checks now broken -- ')
console.log(`class instance loaded from file is a ${loadedFile.classInstance.constructor.name}`)
console.log(`loadedFile.classInstance instanceof ExampleClass =`, loadedFile.classInstance instanceof ExampleClass);
console.log(`can use a workaround to check`, ExampleClass.checkInstance(loadedFile.classInstance));

process.exit(0);