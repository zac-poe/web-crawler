import { Sequencer } from "../src/sequencer";

describe('sequencer', () => {
    const executor = jest.fn();

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
        const subject = new Sequencer(executor, false);
        
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

    it('executes list sequentially', async () => {
        const subject = new Sequencer(executor, false);
        
        await subject.run([
            {Print: 'first'},
            {Print: 'second'},
            {Print: 'third'}
        ]);

        expect(executor.mock.calls.length).toEqual(3);
        expect(executor.mock.calls[0][1]).toEqual('first');
        expect(executor.mock.calls[1][1]).toEqual('second');
        expect(executor.mock.calls[2][1]).toEqual('third');
    });

    it('chains state', async () => {
        const subject = new Sequencer(executor, false);
        
        await subject.run({
            A: 'first',
            B: 'second'
        });
    });

    it('executes sub sequences', async () => {
        const subject = new Sequencer(executor, false);
        
        await subject.run({
        });
    });

    it('isolates sub sequences state', async () => {
        const subject = new Sequencer(executor, false);
        
        await subject.run({
        });
    });
});
