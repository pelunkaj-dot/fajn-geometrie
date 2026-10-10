// Seznam ročníků a témat.
import { R6 } from './r6.js';
import { R7 } from './r7.js';
import { R8 } from './r8.js';

export const ROCNIKY = [R6, R7, R8];
export const najdiTema = id => { for (const r of ROCNIKY) for (const t of r.temata) if (t.id === id) return t; return null; };
export const NAZVY_UROVNI = ['Základy', 'Procvičování', 'Jedničkář'];
