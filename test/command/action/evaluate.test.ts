import { EvaluateAction } from "../../../src/command/action/evaluate";
import { Command } from "../../../src/command/command";

describe('evaluate action', () => {
    it('has evaluate command', () => {
        expect(new EvaluateAction().getCommand()).toEqual(Command[Command.Evaluate]);
    });
});
