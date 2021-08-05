import { CommandLine } from "../src/command-line";
import * as cli from 'command-line-args';

jest.mock('command-line-args');

describe('command line support', () => {
    const mockCli:jest.Mock<any,any> = (cli as any);

    beforeEach(() => {
        mockCli.mockClear();
    })

    it('is invalid when using help', () => {
        mockCli.mockReturnValue({
            help: true
        });
        expect(new CommandLine().isValid).toEqual(false);
    });

    it('is invalid when missing file', () => {
        expect(new CommandLine().isValid).toEqual(false);
    });

    it('is invalid when providing required args', () => {
        mockCli.mockReturnValue({
            file: 'some file'
        });
        const result = new CommandLine();
        expect(result.isValid).toEqual(true);
        expect(Object.keys(result.arguments)?.length > 0).toBeTruthy();
    });
});
