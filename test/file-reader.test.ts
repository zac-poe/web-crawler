import { FileReader } from "../src/file-reader";
import * as fs from 'fs';

jest.mock('fs');

describe('step reader', () => {
    const mockReadFile:jest.Mock<any,any> = (fs.readFileSync as any);

    beforeEach(() => {
        mockReadFile.mockClear();
    })

    it('reads yaml file', () => {
        const expectedName = 'some name';
        const expectedSteps = [ 'a', 'b', 'c' ];
        mockReadFile.mockReturnValue(`Name: ${expectedName}\nSteps:\n  - ${expectedSteps[0]}\n  - ${expectedSteps[1]}\n  - ${expectedSteps[2]}`);

        const reader = new FileReader('some file');

        expect(reader.content.Name).toEqual(expectedName);
        expect(reader.content.Steps.length).toEqual(expectedSteps.length);
        expectedSteps.forEach((s, i) => {
            expect(reader.content.Steps[i]).toEqual(s);
        });
    });
});
