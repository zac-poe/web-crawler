import { ActionFactory } from "../../src/command/action/action-factory";
import { CommandBlock } from "../../src/command/command-block";

jest.mock("../../src/command/action/action-factory");

describe('command block', () => {
    const mockFactory = jest.fn();
    const mockExecutor = jest.fn();

    const injectMocks = () => {
        (ActionFactory as any).mock.instances[0].get = mockFactory;
    }

    beforeAll(() => {
        mockFactory.mockImplementation((action) => ({
            run: mockExecutor
        }))
    });

    beforeEach(() => {
        (ActionFactory as any).mockClear();
        mockFactory.mockClear();
        mockExecutor.mockClear();
    });

    it('retrieves action for command', async () => {
        const expectedCommand = 'some command';

        const subject = new CommandBlock({
            [expectedCommand]: 'value'
        });
        injectMocks();
        
        await subject.resolve();

        expect(mockFactory.mock.calls.length).toEqual(1);
        expect(mockFactory.mock.calls[0][0]).toEqual(expectedCommand);
    });

    it('executes command with value', async () => {
        const expectedValue = 'some value';

        const subject = new CommandBlock({
            command: expectedValue
        });
        injectMocks();
        
        await subject.resolve();

        expect(mockExecutor.mock.calls[0][0].value).toEqual(expectedValue);
    });

    it('executes with default state', async () => {
        const subject = new CommandBlock({
            Command: 'value'
        });
        injectMocks();
        
        await subject.resolve();

        expect(mockExecutor.mock.calls[0][0].state).toEqual({Repeat: 0});
    });

    it('executes with provided state', async () => {
        const expectedState = { a: 123 };

        const subject = new CommandBlock({Command: 'value'},
            expectedState);
        injectMocks();
        
        await subject.resolve();

        const { Repeat, ...stateRemainder } = mockExecutor.mock.calls[0][0].state;
        expect(stateRemainder).toEqual(expectedState);
    });

    it('executes with updated state', async () => {
        const subject = new CommandBlock({Command: 'value'},
            {a: 123});
        injectMocks();
        
        subject.updateState('a', 456);
        await subject.resolve();

        expect(mockExecutor.mock.calls[0][0].state.a).toEqual(456);
    });

    it('executes with reset value for repeat', async () => {
        const subject = new CommandBlock({Command: 'value'},
            {Repeat: 37});
        injectMocks();
        
        await subject.resolve();

        expect(mockExecutor.mock.calls[0][0].state).toEqual({Repeat: 0});
    });

    it('executes with block', async () => {
        const subject = new CommandBlock({Command: 'value'});
        injectMocks();
        
        await subject.resolve();

        expect(mockExecutor.mock.calls[0][0].block).toEqual(subject);
    });

    it('executes commands sequentially', async () => {
        const subject = new CommandBlock({
            A: 'first',
            B: 'second',
            C: 'third'
        });
        injectMocks();
        
        await subject.resolve();

        expect(mockExecutor.mock.calls.length).toEqual(3);
        expect(mockExecutor.mock.calls[0][0].value).toEqual('first');
        expect(mockExecutor.mock.calls[1][0].value).toEqual('second');
        expect(mockExecutor.mock.calls[2][0].value).toEqual('third');
    });

    it('chains state', async () => {
        const firstStateResult = { a: '123', b: '456' };

        const subject = new CommandBlock({
            A: 'first',
            B: 'second'
        });
        injectMocks();

        mockExecutor.mockReturnValueOnce(Promise.resolve(firstStateResult));
        
        await subject.resolve();

        expect(mockExecutor.mock.calls[1][0].state).toStrictEqual(firstStateResult);
    });
});
