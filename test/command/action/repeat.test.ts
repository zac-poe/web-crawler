import { ActionContext } from "../../../src/command/action/action";
import { RepeatAction } from "../../../src/command/action/repeat";
import { Command } from "../../../src/command/command";

describe('repeat action', () => {
    const mockBlock = {
        updateState: jest.fn(),
        resolve: jest.fn()
    };

    const context = (value: number, state: any={}): ActionContext => ({
        value: value,
        state: {Repeat:1, ...state},
        block: mockBlock as any
    });

    beforeEach(() => {
        mockBlock.updateState.mockClear();
        mockBlock.resolve.mockClear();
    });

    it('has repeat command', () => {
        expect(new RepeatAction().getCommand()).toEqual(Command[Command.Repeat]);
    });

    it('get fails without number', async () => {
        const subject = new RepeatAction();

        await expect(subject.run(context('abc' as any))).rejects.not.toBeUndefined();
    });

    it('get fails without whole number', async () => {
        const subject = new RepeatAction();

        await expect(subject.run(context(1.2))).rejects.not.toBeUndefined();
    });

    it('get fails without positive number', async () => {
        const subject = new RepeatAction();

        await expect(subject.run(context(-1))).rejects.not.toBeUndefined();
        await expect(subject.run(context(0))).rejects.not.toBeUndefined();
    });

    it('repeats block', async () => {
        const subject = new RepeatAction();

        await subject.run(context(1));

        expect(mockBlock.updateState.mock.calls.length).toEqual(1);
        expect(mockBlock.updateState.mock.calls[0][0]).toEqual('Repeat');
        expect(mockBlock.updateState.mock.calls[0][1]).toEqual(2);
        expect(mockBlock.resolve.mock.calls.length).toEqual(1);
    });

    it('returns state when no repetition is required', async () => {
        const state = { a: '123', Repeat: 6 };

        const subject = new RepeatAction();

        const result = await subject.run(context(5, state));

        expect(mockBlock.updateState.mock.calls.length).toEqual(0);
        expect(mockBlock.resolve.mock.calls.length).toEqual(0);
        expect(result).toStrictEqual(state);
    });

    it('repeats interpolated value', async () => {
        const value = 3
        const state = {
            variable: value
        };

        await new RepeatAction().run(context('<variable>' as any, state));

        expect(mockBlock.resolve.mock.calls.length).toEqual(1);
    });

    it('stops repeating using interpolated value', async () => {
        const value = 3
        const state = {
            variable: value,
            Repeat: 123
        };

        await new RepeatAction().run(context('<variable>' as any, state));

        expect(mockBlock.resolve.mock.calls.length).toEqual(0);
    });
});
