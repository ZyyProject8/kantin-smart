import { promises as fs } from 'fs';
import * as path from 'path';

async function replaceInFile(filePath: string) {
  let content = await fs.readFile(filePath, 'utf-8');
  let originalContent = content;

  // Replace standard names
  content = content.replace(/Kantin Pintar/g, 'Smart Kantin');
  content = content.replace(/KantinPintar/g, 'SmartKantin');

  // Replace specific logo structure
  content = content.replace(/Kantin<span className="text-primary">Pintar<\/span>/g, 'Smart<span className="text-primary">Kantin</span>');

  if (content !== originalContent) {
    await fs.writeFile(filePath, content, 'utf-8');
    console.log(`Updated: ${filePath}`);
  }
}

async function walkDir(dir: string) {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = await fs.stat(fullPath);
    if (stat.isDirectory()) {
      await walkDir(fullPath);
    } else if (stat.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
      await replaceInFile(fullPath);
    }
  }
}

walkDir(path.join(process.cwd(), 'src')).then(() => console.log('Done!')).catch(console.error);
