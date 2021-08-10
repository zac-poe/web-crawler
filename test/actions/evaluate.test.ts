import { EvaluateAction } from "../../src/actions/evaluate";
import { Command } from "../../src/actions/command";

describe('evaluate action', () => {
    it('has evaluate command', () => {
        expect(new EvaluateAction().getCommand()).toEqual(Command[Command.Evaluate]);
    });
});
