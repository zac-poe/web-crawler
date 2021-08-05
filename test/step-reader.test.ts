import { StepReader } from "../src/step-reader";
import * as fs from 'fs';

jest.mock('fs');

describe('step reader', () => {
    const mockReadFile:jest.Mock<any,any> = (fs.readFileSync as any);

    beforeEach(() => {
        mockReadFile.mockClear();
    })

    it('reads yaml file', () => {
        const expectedName = 'some name value';
        const expectedSteps = [ 'a', 'b', 'c' ];
        mockReadFile.mockReturnValue(`Name: ${expectedName}\nSteps:\n  - ${expectedSteps[0]}\n  - ${expectedSteps[1]}\n  - ${expectedSteps[2]}`);

        const reader = new StepReader('some file');

        expect(reader.steps.Name).toEqual(expectedName);
        expect(reader.steps.Steps.length).toEqual(expectedSteps.length);
        expectedSteps.forEach((s, i) => {
            expect(reader.steps.Steps[i]).toEqual(s);
        });
    });
});
