// Seznam ročníků a témat.
import { R6 } from './r6.js';

export const ROCNIKY = [R6];
export const najdiTema = id => { for (const r of ROCNIKY) for (const t of r.temata) if (t.id === id) return t; return null; };
export const NAZVY_UROVNI = ['Základy', 'Procvičování', 'Jedničkář'];
