import { parse } from "csv-parse";
import fs from "node:fs";
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  // Resolve path relative to current file
  const csvPath = path.resolve(__dirname, '..', 'files', 'tasks.csv');

  const parser = fs.createReadStream(csvPath).pipe(
    parse({
      delimiter: ",",
      skip_empty_lines: true,
      from_line: 2,
    })
  );

  try {
    for await (const line of parser) {
      console.log("Processing line:", line);
      const body = {
        title: line[0],
        description: line[1],
      };

      const response = await fetch('http://localhost:3333/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Failed to create task: ${response.statusText}`);
      }
    
      console.log(`Created task: ${body.title}`);
    }
  } catch (error) {
    console.error("Error reading CSV file:", error);
  }
})();
