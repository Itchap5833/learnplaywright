import { test as base, expect as baseExpect } from '@playwright/test';
import path from 'path';

export const authFile = path.join(process.cwd(), '.auth', 'user.json');
export const standardUserAuthFile = path.join(process.cwd(), '.auth', 'standard_user.json');
export const problemUserAuthFile = path.join(process.cwd(), '.auth', 'problem_user.json');

export const test = base.extend({
  storageState: authFile,
});

export const expect = baseExpect;
