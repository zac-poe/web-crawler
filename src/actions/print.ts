import { Command } from "./command";
import { Action, ActionContext } from "./action";

export class PrintAction extends Action {
    getCommand(): string {
        return Command[Command.Print];
    }

    run(context: ActionContext): Promise<any> {
        process.stdout.write(`${this.interpolate(context.value, context.state)}\n`);
        return super.run(context);
    }
}
