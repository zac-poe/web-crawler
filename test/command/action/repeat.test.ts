import { ActionContext } from "../../../src/command/action/action";
import { RepeatAction } from "../../../src/command/action/repeat";
import { Command } from "../../../src/command/command";
import { CommandBlock } from "../../../src/command/command-block";

jest.mock("../../../src/command/command-block");

describe('repeat action', () => {
    const mockBlock = jest.fn();

    const context = (value: number, previous: any[]=[], state: any={}): ActionContext => ({
        value: value,
        state: {Repeat:1, ...state},
        previousCommands: previous
    });

    beforeAll(() => {
        (CommandBlock as any).mockImplementation(() => ({
            resolve: mockBlock
        }));
    });

    beforeEach(() => {
        (CommandBlock as any).mockClear();
        mockBlock.mockClear();
    })

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

    it('runs new block and returns result', async () => {
        const commands = [{a:1}, {b:2}];
        const expectedResult = 'some result';

        const subject = new RepeatAction();
        mockBlock.mockReturnValue(Promise.resolve(expectedResult))

        const result = await subject.run(context(1, commands));

        expect((CommandBlock as any).mock.instances.length).toEqual(1);
        expect((CommandBlock as any).mock.calls[0][0]).toStrictEqual(commands);
        expect((CommandBlock as any).mock.calls[0][1].Repeat).toEqual(2);
        expect(mockBlock.mock.calls.length).toEqual(1);
        expect(result).toEqual(expectedResult);
    });

    it('returns state when no repetition is required', async () => {
        const state = { a: '123', Repeat: 6 };

        const subject = new RepeatAction();

        const result = await subject.run(context(5, [{a:1}], state));

        expect((CommandBlock as any).mock.instances.length).toEqual(0);
        expect(mockBlock.mock.calls.length).toEqual(0);
        expect(result).toStrictEqual(state);
    });

    it('repeats interpolated value', async () => {
        const value = 3
        const state = {
            variable: value
        };

        mockBlock.mockReturnValue(Promise.resolve())

        await new RepeatAction().run(context('<variable>' as any, [1], state));

        expect(mockBlock.mock.calls.length).toEqual(1);
    });

    it('stops repeating using interpolated value', async () => {
        const value = 3
        const state = {
            variable: value,
            Repeat: 123
        };

        await new RepeatAction().run(context('<variable>' as any, [1], state));

        expect(mockBlock.mock.calls.length).toEqual(0);
    });
});
