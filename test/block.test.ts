import { Block } from "../src/block";

describe('block', () => {
    const executor = jest.fn();

    beforeEach(() => {
        executor.mockClear();
    });

    it('executes command', async () => {
        const expectedCommand = 'some command';

        const subject = new Block({
            [expectedCommand]: 'value'
        });
        
        await subject.resolve();

        expect(executor.mock.calls[0][0]).toEqual(expectedCommand);
    });

    it('executes with default state', async () => {
        const subject = new Block({
            Command: 'value'
        });
        
        await subject.resolve();

        expect(executor.mock.calls[0][2]).toEqual({});
    });

    it('executes commands sequentially', async () => {
        const subject = new Block({
            A: 'first',
            B: 'second',
            C: 'third'
        });
        
        await subject.resolve();

        expect(executor.mock.calls.length).toEqual(3);
        expect(executor.mock.calls[0][1]).toEqual('first');
        expect(executor.mock.calls[1][1]).toEqual('second');
        expect(executor.mock.calls[2][1]).toEqual('third');
    });

    it('chains state', async () => {
        const firstStateResult = { a: '123', b: '456' };

        const subject = new Block({
            A: 'first',
            B: 'second'
        });

        executor.mockReturnValueOnce(Promise.resolve(firstStateResult));
        
        await subject.resolve();

        expect(executor.mock.calls[1][2]).toStrictEqual(firstStateResult);
    });

    it('delegates to action for run', async () => {
        const expectedValue = 'some value',
            expectedState = { someState: 'other value' };

        const mockAction = actionFactory.get(undefined as any) as any;

        await actionFactory.run(undefined as any, expectedValue, expectedState);

        expect(mockAction.run.mock.calls.length).toEqual(1);
        expect(mockAction.run.mock.calls[0][0]).toEqual(expectedValue);
        expect(mockAction.run.mock.calls[0][1]).toStrictEqual(expectedState);
    });
});
