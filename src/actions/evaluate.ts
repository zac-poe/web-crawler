import { Command } from "./command";
import { Action } from "./action";

export class EvaluateAction extends Action {
    getCommand(): string {
        return Command[Command.Evaluate];
    }

    run(value: any, state: any, verbose: boolean): Promise<any> {
        return super.run(value, state, verbose);
    }
}
