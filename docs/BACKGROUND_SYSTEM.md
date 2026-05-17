# Background System Architecture

## Overview

The background system provides three types of backgrounds for boards:
1. **SOLID** - Solid color backgrounds
2. **PATTERN** - Repeating pattern/texture images
3. **ANIMATION** - Lottie animations

## Database Schema

### Tables

#### 1. `patterns` Table
Stores pattern/texture images that can be used as backgrounds.

```sql
- id: UUID (PK)
- name: VARCHAR(255)
- file_path: TEXT
- thumbnail_url: TEXT (optional)
- category: VARCHAR(100) (e.g., 'geometric', 'nature', 'abstract')
- is_active: BOOLEAN
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 2. `backgrounds` Table
Central table that defines all background configurations.

```sql
- id: UUID (PK)
- type: ENUM('SOLID', 'PATTERN', 'ANIMATION')
- color: VARCHAR(7) (for SOLID type, e.g., '#ffffff')
- pattern_id: UUID (FK to patterns, for PATTERN type)
- lottie_animation_id: UUID (FK to lottie_animations, for ANIMATION type)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**Constraints:**
- SOLID type: Must have `color`, must NOT have `pattern_id` or `lottie_animation_id`
- PATTERN type: Must have `pattern_id`, must NOT have `color` or `lottie_animation_id`
- ANIMATION type: Must have `lottie_animation_id`, must NOT have `color` or `pattern_id`

#### 3. `boards` Table (Updated)
```sql
- background_id: UUID (FK to backgrounds)
```

## How It Works

### Creating Backgrounds

#### Solid Color
```typescript
import { createSolidBackground } from '@/lib/backgrounds';

const { data, error } = await createSolidBackground('#2CB1A6');
```

#### Pattern
```typescript
import { createPatternBackground } from '@/lib/backgrounds';

const { data, error } = await createPatternBackground(patternId);
```

#### Animation
```typescript
import { createAnimationBackground } from '@/lib/backgrounds';

const { data, error } = await createAnimationBackground(lottieAnimationId);
```

### Using Backgrounds in Boards

When creating/updating a board:
```typescript
import { updateBoard } from '@/lib/boards';

await updateBoard(boardId, {
  background_id: backgroundId
});
```

### Rendering Backgrounds

#### For SOLID and PATTERN:
```typescript
import { getBackgroundCssValue } from '@/lib/backgrounds';

const cssValue = getBackgroundCssValue(background);

// For SOLID: returns '#2CB1A6'
// For PATTERN: returns 'url(/patterns/dots.svg)'

<div style={{ background: cssValue }} />
```

#### For ANIMATION:
```typescript
// Check if background is animation type
if (background.type === 'ANIMATION' && background.lottie_animation) {
  // Use Lottie component with background.lottie_animation
  <Lottie animationData={...} />
}
```

## Migration Steps

### 1. Run Migration
```bash
psql -d your_database -f supabase/migrations/create_backgrounds_system.sql
```

### 2. Seed Default Data
```bash
psql -d your_database -f supabase/seed_default_backgrounds.sql
```

### 3. Add Pattern Images
Upload pattern SVG/PNG files to `/public/patterns/`:
- dots.svg
- stripes.svg
- confetti.svg
- hearts.svg
- stars.svg
- floral.svg
- geometric.svg
- waves.svg

### 4. Update Existing Boards (Optional)
Migrate existing boards to use new background system:

```sql
-- Example: Set all boards to white background
UPDATE boards
SET background_id = (SELECT id FROM backgrounds WHERE type = 'SOLID' AND color = '#FFFFFF' LIMIT 1)
WHERE background_id IS NULL;
```

## UI Components Needed

### 1. Background Selection Panel
Should display three tabs:
- **Solid Colors** - Color grid picker
- **Patterns** - Pattern thumbnails grid
- **Animations** - Lottie animation preview grid (existing BackgroundSelectionPanel)

### 2. Background Preview
Display current background in the editor with type badge

## Benefits of This Architecture

✅ **Separation of Concerns** - Each background type has its own logic
✅ **Extensibility** - Easy to add new background types (e.g., VIDEO, GRADIENT)
✅ **Reusability** - Backgrounds can be shared across multiple boards
✅ **Type Safety** - Database constraints ensure data integrity
✅ **Performance** - Can cache and optimize each background type differently

## Future Enhancements

- Add `gradient` type for linear/radial gradients
- Add `video` type for video backgrounds
- Add user-uploaded custom patterns
- Add background preview/thumbnail generation
- Add background categories/tags for better organization
