import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

export default class CSVReporter implements Reporter {
  private csvFilePath: string;

  constructor() {
    // Define where the CSV file will be saved
    this.csvFilePath = path.join(process.cwd(), '/src/tests/test-data/testresults.csv');
    
    // Ensure the directory exists before writing the file
    const dir = path.dirname(this.csvFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Updated headers: Description, Test Name, Result
    if (!fs.existsSync(this.csvFilePath)) {
      fs.writeFileSync(this.csvFilePath, 'Description,Test Name,Result\n', 'utf-8');
    }
  }

  // This hook runs automatically every time an individual test finishes
  onTestEnd(test: TestCase, result: TestResult) {
    // 1. Extract the description. If none is provided, default to 'N/A'
    // We clean up commas and newlines so they don't corrupt the CSV structure
    const rawDescription = test.description || 'N/A';
    const description = rawDescription.replace(/,/g, '-').replace(/\n/g, ' ');

    // 2. Clean up the test title
    const testName = test.title.replace(/,/g, '-');
    
    // 3. Normalize the outcome status
    let status = result.status.toUpperCase();
    if (status === 'PASSED') status = 'PASS';
    if (status === 'FAILED') status = 'FAIL';

    // 4. Format the line matching the new header structure: Description,Test Name,Result
    const csvLine = `"${description}","${testName}",${status}\n`;

    // Append the line to the CSV file synchronously
    fs.appendFileSync(this.csvFilePath, csvLine, 'utf-8');
  }
}