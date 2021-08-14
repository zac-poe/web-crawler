import { FileReader } from "../src/file-reader";
import fs from 'fs';

jest.mock('fs');

describe('step reader', () => {
    const mockReadFile:jest.Mock<any,any> = (fs.readFileSync as any);

    beforeEach(() => {
        mockReadFile.mockClear();
    })

    it('reads yaml file', async () => {
        const expectedName = 'some name';
        const expectedSteps = [ 'a', 'b', 'c' ];
        mockReadFile.mockReturnValue(`Name: ${expectedName}\nSteps:\n  - ${expectedSteps[0]}\n  - ${expectedSteps[1]}\n  - ${expectedSteps[2]}`);

        const result = await new FileReader('some file').getContent();

        expect(result.Name).toEqual(expectedName);
        expect(result.Steps?.length).toEqual(expectedSteps.length);
        expectedSteps.forEach((s, i) => {
            expect(result.Steps[i]).toEqual(s);
        });
    });
});
