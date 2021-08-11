import { PrintAction } from "../../src/actions/print";
import { Command } from "../../src/actions/command";

describe('print action', () => {
    const context = (value: any, state: any={}) => ({
        value: value,
        state: state,
        block: (undefined as any)
    });

    it('has print command', () => {
        expect(new PrintAction().getCommand()).toEqual(Command[Command.Print]);
    });

    it('returns original state', async () => {
        const expectedState = { a: '123', b: 456 };

        const result = await new PrintAction().run(context(undefined, expectedState));

        expect(result).toEqual(expectedState);
    });

    it('interpolates value', async () => {
        const value = 'some value', state = { a: 123 };
        const target = new PrintAction();

        (target as any).interpolate = jest.fn();

        await target.run(context(value, state));

        expect((target as any).interpolate.mock.calls.length).toEqual(1);
        expect((target as any).interpolate.mock.calls[0][0]).toEqual(value);
        expect((target as any).interpolate.mock.calls[0][1]).toEqual(state);
    });
});
