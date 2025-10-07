#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Converts ThemedImage components to standard markdown image syntax
 * @param {string} content - The file content to process
 * @returns {string} - The converted content
 */
function convertThemedImages(content) {
  // Regex to match ThemedImage components with optional p tags
  const themedImageRegex =
    /<p>\s*<ThemedImage\s+alt="([^"]*)"\s+sources=\{\{\s*light:\s*['"`]([^'"`]*)['"`],?\s*dark:\s*['"`]([^'"`]*)['"`],?\s*\}\}\s*\/>\s*<\/p>/g;

  // Also match without p tags
  const themedImageNoPTagRegex =
    /<ThemedImage\s+alt="([^"]*)"\s+sources=\{\{\s*light:\s*['"`]([^'"`]*)['"`],?\s*dark:\s*['"`]([^'"`]*)['"`],?\s*\}\}\s*\/>/g;

  // Convert ThemedImage components with p tags
  let convertedContent = content.replace(
    themedImageRegex,
    (match, altText, lightSource, darkSource) => {
      return `![${altText}](${lightSource})`;
    },
  );

  // Convert ThemedImage components without p tags
  convertedContent = convertedContent.replace(
    themedImageNoPTagRegex,
    (match, altText, lightSource, darkSource) => {
      return `![${altText}](${lightSource})`;
    },
  );

  return convertedContent;
}

/**
 * Process a single file
 * @param {string} filePath - Path to the file to process
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const convertedContent = convertThemedImages(content);

    if (content !== convertedContent) {
      fs.writeFileSync(filePath, convertedContent, 'utf8');
      console.log(`✅ Converted: ${filePath}`);
    } else {
      console.log(`⏭️  No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

/**
 * Recursively process all .mdx files in a directory
 * @param {string} dirPath - Directory path to process
 */
function processDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        processDirectory(fullPath);
      } else if (item.endsWith('.mdx')) {
        processFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`❌ Error processing directory ${dirPath}:`, error.message);
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node convert-themed-images.js <file-or-directory>');
    console.log('Examples:');
    console.log(
      '  node convert-themed-images.js fumadocs/content/blog/2023-10-02-what-is-a-state-machine/index.mdx',
    );
    console.log('  node convert-themed-images.js fumadocs/content/blog/');
    process.exit(1);
  }

  const targetPath = args[0];

  if (!fs.existsSync(targetPath)) {
    console.error(`❌ Path does not exist: ${targetPath}`);
    process.exit(1);
  }

  const stat = fs.statSync(targetPath);

  if (stat.isFile()) {
    if (targetPath.endsWith('.mdx')) {
      processFile(targetPath);
    } else {
      console.error('❌ File must be a .mdx file');
      process.exit(1);
    }
  } else if (stat.isDirectory()) {
    console.log(`🔄 Processing directory: ${targetPath}`);
    processDirectory(targetPath);
  }

  console.log('✨ Conversion complete!');
}

// Run the script
main();
