import { ActionContext } from "../../../src/command/action/action";
import { CommandsAction } from "../../../src/command/action/commands";
import { Command } from "../../../src/command/command";
import { CommandBlock } from "../../../src/command/command-block";

jest.mock("../../../src/command/command-block");

describe('commands action', () => {
    const mockBlock = jest.fn();

    const context = (items: any[], state: any={}): ActionContext => ({
        value: items,
        state: state,
        previousCommands: []
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

    it('has commands command', () => {
        expect(new CommandsAction().getCommand()).toEqual(Command[Command.Commands]);
    });

    it('fails without a list', async() => {
        await expect(new CommandsAction().run(context('value' as any))).rejects.not.toBeUndefined();
    });

    it('executes commands', async () => {
        const commands = [{
            a: 'value1',
            b: 'value2'
        }, {
            c: 'value3',
            d: 'value4'
        }];

        mockBlock.mockReturnValue(Promise.resolve())

        await new CommandsAction().run(context(commands));

        expect((CommandBlock as any).mock.instances.length).toEqual(1);
        expect((CommandBlock as any).mock.calls[0][0]).toStrictEqual(commands);
        expect(mockBlock.mock.calls.length).toEqual(1);
    });

    it('passes state with reset repeat to commands', async () => {
        const expectedState = { variable: 'some value' };

        mockBlock.mockReturnValue(Promise.resolve())

        await new CommandsAction().run(context([{a:1}, {b:2}], expectedState));

        expect((CommandBlock as any).mock.calls[0][1]).toStrictEqual({
            ...expectedState,
            Repeat: 1
        });
    });

    it('returns original state after commands', async () => {
        const initialState = { a: 'some value' },
            sequenceResultState = { b: 1, c: 2 };

        mockBlock.mockReturnValue(Promise.resolve(sequenceResultState))

        const result = await new CommandsAction().run(context([{command:'val'}],
            initialState));

        expect(result).toStrictEqual(initialState);
    });
});
