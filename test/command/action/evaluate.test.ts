import { ActionContext } from "../../../src/command/action/action";
import { EvaluateAction } from "../../../src/command/action/evaluate";
import { Command } from "../../../src/command/command";

describe('evaluate action', () => {
    const context = (expression: string, state: any={}): ActionContext => ({
        value: expression,
        state: state,
        block: undefined as any
    });

    it('has evaluate command', () => {
        expect(new EvaluateAction().getCommand()).toEqual(Command[Command.Evaluate]);
    });

    it('evaluates xpath against document', () => {
    });

    it('evaluates multiple variables', () => {
    });
});
