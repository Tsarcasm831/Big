import { allEntries } from '../bestiaryData.js';

export const lowEntries = allEntries.filter(entry => entry.threat === 'low');
