import { allEntries } from '../bestiaryData.js';

export const mediumEntries = allEntries.filter(entry => entry.threat === 'medium');
