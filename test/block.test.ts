import { Block } from "../src/block";
import { actionFactory } from "../src/actions/action-factory";

describe('block', () => {
    const mockExecutor = jest.fn();

    beforeAll(() => {
        actionFactory.get = jest.fn().mockImplementation((action) => ({
            run: mockExecutor
        }));
    });

    beforeEach(() => {
        (actionFactory.get as any).mockClear();
        mockExecutor.mockClear();
    });

    it('retrieves action for command', async () => {
        const expectedCommand = 'some command';

        const subject = new Block({
            [expectedCommand]: 'value'
        });
        
        await subject.resolve();

        expect((actionFactory.get as any).mock.calls.length).toEqual(1);
        expect((actionFactory.get as any).mock.calls[0][0]).toEqual(expectedCommand);
    });

    it('executes command with value', async () => {
        const expectedValue = 'some value';

        const subject = new Block({
            command: expectedValue
        });
        
        await subject.resolve();

        expect(mockExecutor.mock.calls[0][0].value).toEqual(expectedValue);
    });

    it('executes with default state', async () => {
        const subject = new Block({
            Command: 'value'
        });
        
        await subject.resolve();

        expect(mockExecutor.mock.calls[0][0].state).toEqual({Repeat: 0});
    });

    it('executes with provided state', async () => {
        const expectedState = { a: 123 };
        const subject = new Block({Command: 'value'},
            expectedState);
        
        await subject.resolve();

        const { Repeat, ...stateRemainder } = mockExecutor.mock.calls[0][0].state;
        expect(stateRemainder).toEqual(expectedState);
    });

    it('executes with updated state', async () => {
        const subject = new Block({Command: 'value'},
            {a: 123});
        
        subject.updateState('a', 456);
        await subject.resolve();

        expect(mockExecutor.mock.calls[0][0].state.a).toEqual(456);
    });

    it('executes with reset value for repeat', async () => {
        const subject = new Block({Command: 'value'},
            {Repeat: 37});
        
        await subject.resolve();

        expect(mockExecutor.mock.calls[0][0].state).toEqual({Repeat: 0});
    });

    it('executes with block', async () => {
        const subject = new Block({Command: 'value'});
        
        await subject.resolve();

        expect(mockExecutor.mock.calls[0][0].block).toEqual(subject);
    });

    it('executes commands sequentially', async () => {
        const subject = new Block({
            A: 'first',
            B: 'second',
            C: 'third'
        });
        
        await subject.resolve();

        expect(mockExecutor.mock.calls.length).toEqual(3);
        expect(mockExecutor.mock.calls[0][0].value).toEqual('first');
        expect(mockExecutor.mock.calls[1][0].value).toEqual('second');
        expect(mockExecutor.mock.calls[2][0].value).toEqual('third');
    });

    it('chains state', async () => {
        const firstStateResult = { a: '123', b: '456' };

        const subject = new Block({
            A: 'first',
            B: 'second'
        });

        mockExecutor.mockReturnValueOnce(Promise.resolve(firstStateResult));
        
        await subject.resolve();

        expect(mockExecutor.mock.calls[1][0].state).toStrictEqual(firstStateResult);
    });
});
