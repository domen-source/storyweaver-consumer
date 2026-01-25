# Troubleshooting Guide

If you're seeing the default Next.js page instead of the custom website, follow these steps:

## Step 1: Verify You're in the Correct Directory

```bash
cd /Users/domen/pastel-book-maker
pwd  # Should show: /Users/domen/pastel-book-maker
```

## Step 2: Stop Any Running Dev Servers

Press `Ctrl+C` in any terminal running `npm run dev`

## Step 3: Clear Next.js Cache

```bash
rm -rf .next
```

## Step 4: Verify Files Exist

```bash
# Check main page
cat app/page.tsx

# Check components exist
ls -la components/

# Should show 8 component files
```

## Step 5: Reinstall Dependencies (if needed)

```bash
rm -rf node_modules package-lock.json
npm install --cache /tmp/npm-cache
```

## Step 6: Start Dev Server Fresh

```bash
npm run dev
```

## Step 7: Check for Errors

Look in the terminal for any error messages. Common issues:

- **Module not found**: Check that `components/` directory exists
- **Path alias error**: Verify `tsconfig.json` has `"@/*": ["./*"]`
- **Port already in use**: Try `npm run dev -- -p 3002`

## Step 8: Verify Browser

- Make sure you're going to the correct URL shown in terminal
- Try hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Check browser console for errors (F12)

## What You Should See

When working correctly, you should see:
- Red announcement banner at top
- Hero section with large "LOVE" background text
- Book images and content
- NOT the black Next.js default page

## Still Not Working?

1. Check if there's a `pages/` directory that might be conflicting:
   ```bash
   ls -la | grep pages
   ```
   If it exists, delete it (App Router uses `app/` not `pages/`)

2. Verify the app structure:
   ```bash
   tree app/ -L 2
   ```

3. Check terminal output when running `npm run dev` - there should be no errors

