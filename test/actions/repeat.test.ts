import { RepeatAction } from "../../src/actions/repeat";
import { Command } from "../../src/actions/command";

describe('repeat action', () => {
    it('has repeat command', () => {
        expect(new RepeatAction().getCommand()).toEqual(Command[Command.Repeat]);
    });
});
