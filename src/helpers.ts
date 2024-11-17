import { AsyncLocalStorage } from "node:async_hooks";

export class ExampleClass {
  private _className = 'ExampleClass';
  static checkInstance(other: any): other is ExampleClass {
    return (other as any).constructor.name === this.name;
  }
}

export const exampleAls = new AsyncLocalStorage();
export function findExampleAls() {
  const ctx = exampleAls.getStore();
  if (!ctx) {
    console.log('unable to find `exampleAls` store');
  } else {
    console.log('found `exampleAls` store!');
  }
}

(globalThis as any).workaroundAls ||= new AsyncLocalStorage();
export const workaroundAls = (globalThis as any).workaroundAls as AsyncLocalStorage<any>;
export function findWorkaroundAls() {
  const ctx = workaroundAls.getStore();
  if (!ctx) {
    console.log('unable to find `exampleAls` store');
  } else {
    console.log('found `exampleAls` store!');
  }
}
