import { logger } from "../src/logger";

describe('logger', () => {
    const mockConsole = console.info = jest.fn();

    beforeEach(() => {
        mockConsole.mockClear();
        logger.silent = false;
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
});
