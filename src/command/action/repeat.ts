import { Command } from "../command";
import { Action, ActionContext } from "./action";

export class RepeatAction extends Action {
    getCommand(): string {
        return Command[Command.Repeat];
    }

    run(context: ActionContext): Promise<any> {
        if(!Number.isInteger(context.value) || Number.parseInt(context.value) < 1) {
            return Promise.reject(`${this.getCommand} requires positive whole number`);
        }
        const current = context.state[this.getCommand()];
        if(current < Number.parseInt(context.value)) {
            context.block.updateState(this.getCommand(), current+1);
            return context.block.resolve();
        }
        return super.run(context);
    }
}
