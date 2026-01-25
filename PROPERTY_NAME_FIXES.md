# ✅ Property Name Mismatches - Fixed

## Problem

The API returns data with different property names than what the code expected:
- API returns: `preview_image_url` (NOT `cover_image_url`)
- API returns: `detail_images` (NOT `preview_images`)
- API returns: `template_data.pages[].character_roles` (NOT `template_data.characters`)

## Changes Applied

### 1. ✅ Fixed Cover Image Property

**File:** `/app/books/[code]/page.tsx`

**Before:**
```tsx
src={book.cover_image_url}
```

**After:**
```tsx
src={book.preview_image_url}
```

### 2. ✅ Fixed Preview Images Carousel

**File:** `/app/books/[code]/page.tsx`

**Before:**
```tsx
{book.preview_images && book.preview_images.length > 0 && (
  {book.preview_images.slice(0, 4).map((img, i) => (
```

**After:**
```tsx
{book.detail_images && book.detail_images.length > 0 && (
  {book.detail_images.slice(0, 4).map((img, i) => (
```

### 3. ✅ Fixed Character Upload Fields

**File:** `/app/books/[code]/page.tsx`

**Before:**
```tsx
{book.template_data.characters.map((character) => {
  // Used character.name, character.display_name
})}
```

**After:**
```tsx
{(() => {
  // Extract unique character roles from pages
  const roles = [...new Set(
    book.template_data.pages.flatMap(p => p.character_roles || [])
  )]
  
  return roles.map((role) => {
    const displayName = role.charAt(0).toUpperCase() + role.slice(1)
    // Uses role directly (e.g., "parent", "child")
  })
})()}
```

### 4. ✅ Fixed `allPhotosUploaded()` Function

**File:** `/app/books/[code]/page.tsx`

**Before:**
```tsx
const allPhotosUploaded = () => {
  if (!book) return false
  return book.template_data.characters.every(char =>
    uploadedPhotos[char.name]?.uploaded
  )
}
```

**After:**
```tsx
const allPhotosUploaded = () => {
  if (!book) return false
  const roles = [...new Set(
    book.template_data.pages.flatMap(p => p.character_roles || [])
  )]
  return roles.every(role => uploadedPhotos[role]?.uploaded)
}
```

### 5. ✅ Fixed `allNamesEntered()` Function

**File:** `/app/books/[code]/page.tsx`

**Before:**
```tsx
const allNamesEntered = () => {
  if (!book) return false
  return book.template_data.characters.every(char =>
    characterNames[char.name] && characterNames[char.name].trim().length > 0
  )
}
```

**After:**
```tsx
const allNamesEntered = () => {
  if (!book) return false
  const roles = [...new Set(
    book.template_data.pages.flatMap(p => p.character_roles || [])
  )]
  return roles.every(role =>
    characterNames[role] && characterNames[role].trim().length > 0
  )
}
```

### 6. ✅ Updated TypeScript Interface

**File:** `/lib/api.ts`

**Updated `Book` interface:**
```typescript
export interface Book {
  // ... other fields
  preview_image_url: string  // Changed from cover_image_url
  detail_images: string[]    // Changed from preview_images
  template_data: {
    characters: Array<{...}>  // May be empty
    pages: Array<{
      character_roles?: string[]  // e.g., ["parent", "child"]
      [key: string]: any
    }>
  }
}
```

### 7. ✅ Enhanced Debug Logging

**File:** `/app/books/[code]/page.tsx`

Added logging for:
- `preview_image_url`
- `detail_images`
- Character roles extracted from pages

## API Data Structure

### Actual API Response

```json
{
  "book": {
    "id": "803259c2-4c82-4ee7-8404-51ce8cdfb819",
    "publication_code": "BOOK_1769178064160",
    "title": "Tamara testing",
    "preview_image_url": "https://...",  // ✅ Main cover image
    "detail_images": ["https://...", "https://..."],  // ✅ Preview images
    "template_data": {
      "characters": [],  // ❌ Empty array
      "pages": [
        {
          "character_roles": ["parent", "child"]  // ✅ Use this instead
        }
      ]
    }
  }
}
```

## How Character Roles Work

1. **Extract roles from pages:**
   ```tsx
   const roles = [...new Set(
     book.template_data.pages.flatMap(p => p.character_roles || [])
   )]
   // Result: ["parent", "child"]
   ```

2. **Create display names:**
   ```tsx
   const displayName = role.charAt(0).toUpperCase() + role.slice(1)
   // "parent" → "Parent"
   // "child" → "Child"
   ```

3. **Use role as key:**
   - `uploadedPhotos[role]` (e.g., `uploadedPhotos["parent"]`)
   - `characterNames[role]` (e.g., `characterNames["parent"]`)

## Files Modified

1. ✅ `/app/books/[code]/page.tsx`
   - Fixed cover image property
   - Fixed preview images carousel
   - Replaced character mapping with role extraction
   - Fixed validation functions

2. ✅ `/lib/api.ts`
   - Updated `Book` interface to match API

## Testing

After these fixes, the page should:
- ✅ Display cover image from `preview_image_url`
- ✅ Show carousel from `detail_images` array
- ✅ Create upload fields for "parent" and "child" roles
- ✅ Add name inputs for each character role
- ✅ Validate that all roles have photos and names

## Note

The `FavouritesSection.tsx` component still uses `cover_image_url`. If the list API also returns `preview_image_url`, that component may need updating as well. Check the actual API response for the books list endpoint.

---

**Status:** ✅ All fixes applied
**Linter Errors:** ✅ None

