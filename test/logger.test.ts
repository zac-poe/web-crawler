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

    it('formats objects', () => {
        logger.info({a:123});

        expect(mockConsole.mock.calls[0][0]).toEqual('{\n'
            + '  "a": 123\n'
            + '}');
    });

    it('formats object arguments', () => {
        logger.info('value: %s', {a:'result'});

        expect(mockConsole.mock.calls[0][1]).toEqual('{\n'
            + '  "a": "result"\n'
            + '}');
    });

    it('formats list arguments', () => {
        logger.info('value: %s', ['a','b','c']);

        expect(mockConsole.mock.calls[0][1]).toEqual('[\n'
            + '  "a",\n'
            + '  "b",\n'
            + '  "c"\n'
            + ']');
    });

    it('formats undefined arguments', () => {
        logger.info('a', undefined);

        expect(mockConsole.mock.calls[0][1]).toEqual('undefined');
    });

    it('formats null arguments', () => {
        logger.info('a', null);

        expect(mockConsole.mock.calls[0][1]).toEqual('null');
    });

    it('truncates arguments', () => {
        logger.maxLengthInfo = 10;
        logger.info('value: %s', 'a really long option');

        expect(mockConsole.mock.calls[0][1]).toEqual('a really l...');
    });

    it('truncates formatted object arguments', () => {
        logger.maxLengthInfo = 10;
        logger.info('value: %s', {name: 'this is a way too long value to print'});

        expect(mockConsole.mock.calls[0][1]).toEqual('{\n'
            + '  "name": "this is a ..."\n'
            + '}');
    });
});
