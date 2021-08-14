import { ActionContext } from "../../../src/command/action/action";
import { CommandsAction } from "../../../src/command/action/commands";
import { Command } from "../../../src/command/command";
import { CommandBlock } from "../../../src/command/command-block";

jest.mock("../../../src/command/command-block");

describe('commands action', () => {
    const context = (items: any[], state: any={}): ActionContext => ({
        value: items,
        state: state,
        block: undefined as any
    });

    beforeEach(() => {
        (CommandBlock as any).mockClear();
    })

    it('has commands command', () => {
        expect(new CommandsAction().getCommand()).toEqual(Command[Command.Commands]);
    });

    it('fails without a list', async() => {
        await expect(new CommandsAction().run(context('value' as any))).rejects.not.toBeUndefined();
    });

    it('executes commands', async () => {
        const sequence1 = {
            a: 'value1',
            b: 'value2'
        }, sequence2 = {
            c: 'value3',
            d: 'value4'
        };

        await new CommandsAction().run(context([sequence1, sequence2]));

        expect((CommandBlock as any).mock.instances.length).toEqual(2);
        expect((CommandBlock as any).mock.calls[0][0]).toStrictEqual(sequence1);
        expect((CommandBlock as any).mock.calls[1][0]).toStrictEqual(sequence2);
    });

    it('passes state between commands items', async () => {
        const expectedState = { variable: 'some value' };

        (CommandBlock as any).mockReturnValueOnce({
            resolve: () => Promise.resolve(expectedState)
        });

        await new CommandsAction().run(context([{a:1}, {b:2}]));

        expect((CommandBlock as any).mock.instances.length).toEqual(2);
        expect((CommandBlock as any).mock.calls[1][1]).toStrictEqual(expectedState);
    });

    it('returns original state after commands', async () => {
        const initialState = { a: 'some value' },
            sequenceResultState = { b: 1, c: 2 };

        (CommandBlock as any).mockReturnValueOnce({
            resolve: () => Promise.resolve(sequenceResultState)
        });

        const result = await new CommandsAction().run(context([{command:'val'}],
            initialState));

        expect(result).toStrictEqual(initialState);
    });
});
