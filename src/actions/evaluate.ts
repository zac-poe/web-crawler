import { Command } from "./command";
import { Action, ActionContext } from "./action";

export class EvaluateAction extends Action {
    getCommand(): string {
        return Command[Command.Evaluate];
    }

    run(context: ActionContext): Promise<any> {
        return super.run(context);
    }
}
