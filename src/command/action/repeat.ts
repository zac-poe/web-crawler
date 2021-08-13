import { logger } from "../../logger";
import { Command } from "../command";
import { Action, ActionContext } from "./action";

export class RepeatAction extends Action {
    getCommand(): string {
        return Command[Command.Repeat];
    }

    async run(context: ActionContext): Promise<any> {
        const value = this.interpolate(context.value, context.state);
        if(isNaN(value as any) || Number.parseInt(value) < 1) {
            return Promise.reject(`${this.getCommand()} requires positive whole number, received: ${value}`);
        }
        const current = context.state[this.getCommand()];
        logger.info('%s: %s', await this.getCommand(), current);
        if(current <= Number.parseInt(value)) {
            context.block.updateState(this.getCommand(), current+1);
            return context.block.resolve();
        }
        return super.run(context);
    }
}
