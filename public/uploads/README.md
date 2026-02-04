# Uploads Folder

## How to Use

1. **Upload Photos**: Place your photos in the `photos/` subfolder

2. **Reference in Code**: Use the path `/uploads/photos/your-image.jpg` in your components

## Example Usage

```jsx
// In any component
<img src="/uploads/photos/my-photo.jpg" alt="Description" />

// With Next.js Image component
import Image from 'next/image'

<Image 
  src="/uploads/photos/my-photo.jpg" 
  alt="Description"
  width={400}
  height={300}
/>
```

## File Organization

- `photos/` - General photos for the website
- Add more subfolders as needed for different types of assets
