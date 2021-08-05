import * as yaml from 'yaml';
import * as fs from 'fs';

export class StepReader {
    readonly steps: any;

    constructor(fileName: string) {
        this.steps = yaml.parse(fs.readFileSync(fileName, 'utf8'))
    }
}
