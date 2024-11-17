// vite server will rewrite this module to the correct location in the dist folder
import { ExampleClass, exampleAls, workaroundAls } from 'this-lib';

// local copy of `ExampleClass` is now different than that in the code run in the lib
export const classInstance = new ExampleClass();

console.log('\n-- ALS is now broken, because there are multiple copies')

// ALS is now broken, because this `exampleAls` is not the same as the one that was initialized
const exampleAlsStore = exampleAls.getStore();
if (!exampleAlsStore) {
  console.log('unable to find `exampleAls` store');
} else {
  console.log('found `exampleAls` store!');
}

// we can use a workaround by attaching the als instance to globalThis and checking for it before initializing a new one
const workaroundAlsStore = workaroundAls.getStore();
if (!workaroundAlsStore) {
  console.log('unable to find `workaroundAls` store');
} else {
  console.log('found `workaroundAls` store!');
}