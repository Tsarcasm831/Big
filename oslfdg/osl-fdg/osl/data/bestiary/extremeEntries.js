import { allEntries } from '../bestiaryData.js';

export const extremeEntries = allEntries.filter(entry => entry.threat === 'extreme');
