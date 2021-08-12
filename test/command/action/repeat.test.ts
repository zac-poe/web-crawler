import { ActionContext } from "../../../src/command/action/action";
import { RepeatAction } from "../../../src/command/action/repeat";
import { Command } from "../../../src/command/command";

describe('repeat action', () => {
    const context = (value: number): ActionContext => ({
        value: value,
        state: {},
        block: undefined as any
    });

    it('has repeat command', () => {
        expect(new RepeatAction().getCommand()).toEqual(Command[Command.Repeat]);
    });
});
