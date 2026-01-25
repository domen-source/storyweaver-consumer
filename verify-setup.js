#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Next.js Setup...\n');

// Check if we're in the right directory
const cwd = process.cwd();
console.log(`Current directory: ${cwd}`);

// Check required files
const requiredFiles = [
  'app/page.tsx',
  'app/layout.tsx',
  'app/globals.css',
  'package.json',
  'next.config.js',
  'tsconfig.json',
];

console.log('\n📁 Checking required files:');
let allFilesExist = true;
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(cwd, file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

// Check components
console.log('\n🧩 Checking components:');
const componentsDir = path.join(cwd, 'components');
if (fs.existsSync(componentsDir)) {
  const components = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));
  console.log(`  ✅ Found ${components.length} components:`);
  components.forEach(comp => console.log(`     - ${comp}`));
} else {
  console.log('  ❌ components/ directory not found!');
  allFilesExist = false;
}

// Check page.tsx content
console.log('\n📄 Checking app/page.tsx content:');
const pagePath = path.join(cwd, 'app/page.tsx');
if (fs.existsSync(pagePath)) {
  const content = fs.readFileSync(pagePath, 'utf8');
  if (content.includes('HeroSection')) {
    console.log('  ✅ page.tsx contains custom components');
  } else {
    console.log('  ❌ page.tsx does not contain custom components');
    console.log('  Content preview:', content.substring(0, 100));
  }
} else {
  console.log('  ❌ app/page.tsx not found!');
}

// Check for conflicting pages directory
console.log('\n🔍 Checking for conflicts:');
const pagesDir = path.join(cwd, 'pages');
if (fs.existsSync(pagesDir)) {
  console.log('  ⚠️  WARNING: pages/ directory exists! This might conflict with app/');
  console.log('     Next.js App Router uses app/, not pages/');
} else {
  console.log('  ✅ No pages/ directory (good for App Router)');
}

console.log('\n' + '='.repeat(50));
if (allFilesExist) {
  console.log('✅ Setup looks correct!');
  console.log('\nNext steps:');
  console.log('1. Make sure you run: cd /Users/domen/pastel-book-maker');
  console.log('2. Clear cache: rm -rf .next');
  console.log('3. Start dev server: npm run dev');
  console.log('4. Open the URL shown in terminal (usually http://localhost:3000)');
} else {
  console.log('❌ Some files are missing. Please check the errors above.');
}
console.log('='.repeat(50));

