# Card Feature - Database Changes

## Overview
This document outlines the database schema changes needed to implement the Card feature alongside the existing Board feature.

## Tables Modified

### 1. `boards` table - New Columns

| Column Name | Type | Default | Description |
|------------|------|---------|-------------|
| `envelope_font` | TEXT | 'Inter' | Font used for envelope text (From/To) |
| `envelope_color` | TEXT | '#F5E6D3' | Background color of the envelope |
| `card_theme_id` | UUID | NULL | References `lottie_animations.id` - Lottie animation theme for the card |
| `texture_id` | UUID | NULL | References `textures.id` - Texture/background pattern for the card |

### 2. Existing Fields Used for Cards

| Field Name | Purpose in Card |
|-----------|-----------------|
| `recipient_message` | The message content written on the card |
| `body_font` | Font used for the card message |
| `effect_data` | Card opening animation/effect (same as boards) |
| `recipients` | Array of recipients (To:) |
| `created_by` | Creator of the card (From:) |
| `title` | Card title displayed on the envelope |
| `format_type` | 'card' or 'board' - distinguishes between card and board |

## New Tables

### 3. `textures` table (New)

```sql
CREATE TABLE textures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,        -- Path to texture image
  thumbnail_path TEXT,             -- Optional thumbnail
  category TEXT,                   -- e.g., 'paper', 'fabric', 'vintage', 'modern'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose**: Store card background textures/patterns

**Initial Seed Data**:
- Plain White (paper)
- Cream Paper (paper)
- Vintage Paper (vintage)
- Linen Fabric (fabric)
- Watercolor (modern)
- Kraft Paper (paper)
- Floral Pattern (modern)
- Gold Foil (modern)

## Relationships

```
boards
  ├── texture_id → textures(id)
  ├── card_theme_id → lottie_animations(id)
  └── effect_data → effects (existing)
```

## Card Flow

### Envelope View
- **From**: `boards.created_by` (user who created the card)
- **To**: `boards.recipients` array
- **Title**: `boards.title` (displayed in center)
- **Envelope Color**: `boards.envelope_color`
- **Envelope Font**: `boards.envelope_font`
- **Stamp**: Cardora logo + name (hardcoded in UI)

### Card View
- **Message**: `boards.recipient_message`
- **Font**: `boards.body_font`
- **Theme**: `lottie_animations` referenced by `boards.card_theme_id`
- **Texture**: `textures` referenced by `boards.texture_id`
- **Effect**: `boards.effect_data` (same as boards)

## Migration Steps

1. Run the migration: `add_card_features.sql`
2. Create texture image files in `/public/textures/` directory
3. Update TypeScript types to include new fields
4. Build envelope UI component
5. Build card UI component
6. Update board creation flow to handle card type

## Next Steps for Implementation

1. **Database**: Apply migration
2. **Assets**: Create/add texture image files
3. **Types**: Update TypeScript interfaces
4. **UI Components**:
   - EnvelopeView component
   - CardView component
   - TextureSelectionPanel component
   - ThemeSelectionPanel component
5. **Pages**: Update create page to handle card format