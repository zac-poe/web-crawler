import * as yaml from 'yaml';
import * as fs from 'fs';

export class FileReader {
    readonly content: any;

    constructor(file: string) {
        let fileContent;
        try {
            fileContent = fs.readFileSync(file, 'utf8');
        } catch(e) {
            throw new Error(`Unable to read file: ${file}`)
        }
        try {
            this.content = yaml.parse(fileContent);
        } catch(e) {
            console.error(e);
            throw new Error('Failed to parse provided YAML -- see above for details');
        }
    }
}