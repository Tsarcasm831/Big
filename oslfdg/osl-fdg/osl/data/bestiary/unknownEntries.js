import { allEntries } from '../bestiaryData.js';

export const unknownEntries = allEntries.filter(entry => entry.threat === 'unknown');
