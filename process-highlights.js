#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Process MDX files to replace highlight-start/highlight-end comments with [!code highlight:N] format
 */

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const processedLines = [];
    let i = 0;
    let changesCount = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Check if this line contains highlight-start
      if (line.includes('// highlight-start')) {
        // Find the corresponding highlight-end
        let j = i + 1;
        let foundEnd = false;

        while (j < lines.length) {
          if (lines[j].includes('// highlight-end')) {
            foundEnd = true;
            break;
          }
          j++;
        }

        if (foundEnd) {
          // Calculate the number of lines between start and end (excluding the comment lines)
          const lineCount = j - i - 1;

          // Replace the highlight-start line with the new format
          const newLine = line.replace(
            /\/\/\s*highlight-start.*/,
            `// [!code highlight:${lineCount}]`,
          );
          processedLines.push(newLine);

          // Add all the code lines between start and end
          for (let k = i + 1; k < j; k++) {
            processedLines.push(lines[k]);
          }

          // Skip to after highlight-end
          i = j + 1;
          changesCount++;

          console.log(`  Replaced highlight block with ${lineCount} lines`);
        } else {
          // No matching end found, keep the original line
          processedLines.push(line);
          i++;
        }
      } else {
        processedLines.push(line);
        i++;
      }
    }

    // Only write if there were changes
    if (changesCount > 0) {
      fs.writeFileSync(filePath, processedLines.join('\n'), 'utf8');
      console.log(
        `✓ Processed ${filePath}: ${changesCount} highlight blocks replaced`,
      );
      return changesCount;
    } else {
      console.log(`- No changes needed in ${filePath}`);
      return 0;
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return 0;
  }
}

function findMdxFiles(dir) {
  const files = [];

  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

function main() {
  const fumadocsDir = path.join(__dirname, 'fumadocs', 'content', 'docs');

  if (!fs.existsSync(fumadocsDir)) {
    console.error(`Directory not found: ${fumadocsDir}`);
    process.exit(1);
  }

  console.log(`Processing MDX files in: ${fumadocsDir}`);
  console.log('='.repeat(50));

  const mdxFiles = findMdxFiles(fumadocsDir);
  console.log(`Found ${mdxFiles.length} MDX files`);
  console.log('');

  let totalChanges = 0;
  let filesChanged = 0;

  for (const file of mdxFiles) {
    const changes = processFile(file);
    if (changes > 0) {
      filesChanged++;
      totalChanges += changes;
    }
  }

  console.log('');
  console.log('='.repeat(50));
  console.log(`Summary:`);
  console.log(`  Files processed: ${mdxFiles.length}`);
  console.log(`  Files changed: ${filesChanged}`);
  console.log(`  Total highlight blocks replaced: ${totalChanges}`);
}

if (require.main === module) {
  main();
}

module.exports = { processFile, findMdxFiles };
