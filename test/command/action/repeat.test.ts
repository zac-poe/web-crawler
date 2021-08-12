import { RepeatAction } from "../../../src/command/action/repeat";
import { Command } from "../../../src/command/command";

describe('repeat action', () => {
    it('has repeat command', () => {
        expect(new RepeatAction().getCommand()).toEqual(Command[Command.Repeat]);
    });
});
