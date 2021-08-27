import * as yaml from 'yaml';
import * as fs from 'fs';
import { logger } from './logger';

export class FileReader {
    private readonly file: string;

    constructor(file: string) {
        this.file = file;
    }

    getContent(): Promise<any> {
        let fileContent;
        try {
            fileContent = fs.readFileSync(this.file, 'utf8');
        } catch(e) {
            return Promise.reject(`Unable to read file: ${this.file}`);
        }
        try {
            return Promise.resolve(yaml.parse(fileContent));
        } catch(e) {
            logger.error(e?.message);
            return Promise.reject('Failed to parse provided YAML -- see above for details');
        }
    }
}
