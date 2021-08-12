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
        mockCli.mockReturnValue({
            verbose: true
        });
        expect(new CommandLine().isValid).toEqual(false);
    });

    it('is valid when providing file', () => {
        mockCli.mockReturnValue({
            file: 'some file'
        });
        const result = new CommandLine();
        expect(result.isValid).toEqual(true);
        expect(Object.keys(result.arguments)?.length > 0).toBeTruthy();
    });

    it('is invalid when unable to parse options', () => {
        mockCli.mockImplementation(() => { throw new Error() });
        expect(new CommandLine().isValid).toEqual(false);
    });
});
