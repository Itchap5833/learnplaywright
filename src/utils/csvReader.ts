import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export type LoginData = {
    username: string;
    password: string;
    expected: string;
    run: string;
}

export function readCSV(filePath: string): LoginData[]{
    const resolvedPath = path.isAbsolute(filePath)
        ? filePath
        : path.resolve(filePath);

    console.log(`readCSV resolved path: ${resolvedPath}`);

    const fileContent = fs.readFileSync(resolvedPath);

    const records = parse(fileContent,{
        columns:true,
        skip_empty_lines: true
    });
    return records;
}