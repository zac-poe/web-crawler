import { logger } from "../src/logger";

describe('logger', () => {
    const mockConsole = console.info = jest.fn();

    beforeEach(() => {
        mockConsole.mockClear();
        logger.silent = false;
        logger.maxLengthInfo = 500;
    });

    it('logs when not silent', () => {
        const message = 'expected value';

        logger.info(message);

        expect(mockConsole.mock.calls.length).toEqual(1);
        expect(mockConsole.mock.calls[0][0]).toEqual(message);
    });

    it('does nothing when silent', () => {
        logger.silent = true;
        logger.info('some message');

        expect(mockConsole.mock.calls.length).toEqual(0);
    });

    it('error still logs when silent', () => {
        const mockError = console.error = jest.fn();

        logger.silent = true;
        logger.error('some failure');

        expect(mockError.mock.calls.length).toEqual(1);
    });

    it('truncates long info messages', () => {
        const message = 'this is a very, very, very, long message';

        logger.maxLengthInfo = 4;
        logger.info(message);

        expect(mockConsole.mock.calls[0][0]).toEqual('this...');
    });
});
