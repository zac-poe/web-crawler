import { Sequencer } from "../src/crawler";

describe('sequencer', () => {
    const executor = jest.fn();

    beforeEach(() => {
        executor.mockClear();
    });

    it('executes command', async () => {
        const expectedCommand = 'some command';

        const subject = new Sequencer(executor, false);
        
        await subject.run({
            [expectedCommand]: 'value'
        });

        expect(executor.mock.calls[0][0]).toEqual(expectedCommand);
    });

    it('executes with default state', async () => {
        const subject = new Sequencer(executor, false);
        
        await subject.run({
            Command: 'value'
        });

        expect(executor.mock.calls[0][2]).toEqual({});
    });

    it('executes commands sequentially', async () => {
        const subject = new Sequencer(executor, true);
        
        await subject.run({
            A: 'first',
            B: 'second',
            C: 'third'
        });

        expect(executor.mock.calls.length).toEqual(3);
        expect(executor.mock.calls[0][1]).toEqual('first');
        expect(executor.mock.calls[1][1]).toEqual('second');
        expect(executor.mock.calls[2][1]).toEqual('third');
    });

    it('chains state', async () => {
        const firstStateResult = { a: '123', b: '456' };

        const subject = new Sequencer(executor, false);

        executor.mockReturnValueOnce(Promise.resolve(firstStateResult));
        
        await subject.run({
            A: 'first',
            B: 'second'
        });

        expect(executor.mock.calls[1][2]).toStrictEqual(firstStateResult);
    });

    it('executes sequences', async () => {
        const subject = new Sequencer(executor, true);
        
        await subject.run({
        });
    });

    it('executes sub sequences', async () => {
        const subject = new Sequencer(executor, true);
        
        await subject.run({
        });
    });

    it('isolates sequences state', async () => {
        const subject = new Sequencer(executor, false);
        
        await subject.run({
        });
    });
});
