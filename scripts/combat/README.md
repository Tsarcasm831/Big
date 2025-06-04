# Combat System with Lord Tsarcasm's House Aesthetic

This combat system has been styled to match the visual theme of Lord Tsarcasm's House. The integration ensures a consistent user experience between the two game components.

## Key Styling Elements

1. **Color Scheme**
   - Primary text color: `#baa88f` (beige)
   - Accent color: `#ff6400` (orange)
   - Background: Dark with transparency `rgba(0, 0, 0, 0.7)`
   - Borders: `#4a3f35` (dark brown)

2. **Typography**
   - Font family: 'Cinzel', serif (matches Lord Tsarcasm's House)
   - Text shadows for atmosphere

3. **UI Elements**
   - Rounded corners with subtle borders
   - Semi-transparent dark backgrounds
   - Orange accents for important elements
   - Consistent hover effects

4. **Lighting**
   - Orange-tinted lighting to match house ambiance
   - Dark fog for depth and atmosphere
   - Point lights to create dramatic lighting

## Files Modified

- `renderer.js`: Enhanced with Lord Tsarcasm's House lighting and atmosphere
- `ui.js`: Updated UI components to match Lord Tsarcasm's style
- `index.js`: Added stylesheet links and font imports
- Added new files:
  - `css/combat.css`: Comprehensive styling for all combat UI elements
  - `css/transitions.js`: Transition effects matching Lord Tsarcasm's House

## Integration Notes

The combat system now adopts the same visual language as Lord Tsarcasm's House, creating a seamless experience when transitioning between the two game modes. The dark, atmospheric styling with orange accents and the Cinzel font creates a consistent experience.

## Usage

The styling is automatically applied when the combat system is initialized. No additional steps are needed to enable the Lord Tsarcasm's House aesthetic.

For custom messages with the Tsarcasm style, use:

```javascript
// In combat code:
import { CombatTransitions } from './css/transitions.js';

const transitions = new CombatTransitions(container);
transitions.showSarcasticMessage("Even your combat skills are disappointingly mediocre.");
```