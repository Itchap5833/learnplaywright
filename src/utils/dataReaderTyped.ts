import path from 'path'
import { readCSV } from '../utils/csvReader';
import { readExcel } from '../utils/excelReader';
import fs from 'fs';

export function readData<T = any>(filePath: string, sheetName?: string): T[] {

    const ext = path.extname(filePath).toLocaleLowerCase();

    switch (ext) {

        case ".csv":
            console.log(".. I am reading CSV..");
            return readCSV(filePath) as unknown as T[];

        case ".xlsx":
            console.log(".. I am reading EXCEL..");
            return readExcel(filePath, sheetName || 'Sheet1') as unknown as T[];

        case ".json":
            console.log(".. I am reading JSON..");
            const JSONData = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(JSONData) as T[];

        default:
            throw new Error(`Unsupported file type - ${ext}`);
    }
}
