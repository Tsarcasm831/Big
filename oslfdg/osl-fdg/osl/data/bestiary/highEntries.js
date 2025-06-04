import { allEntries } from '../bestiaryData.js';

export const highEntries = allEntries.filter(entry => entry.threat === 'high');
