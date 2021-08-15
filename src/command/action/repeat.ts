import { logger } from "../../logger";
import { Command } from "../command";
import { CommandBlock } from "../command-block";
import { Action, ActionContext } from "./action";

export class RepeatAction extends Action {
    getCommand(): string {
        return Command[Command.Repeat];
    }

    run(context: ActionContext): Promise<any> {
        const value = this.interpolate(context.value, context.state);
        if(isNaN(value as any) || Number.parseInt(value) < 1
            || Number.parseFloat(value) != Number.parseInt(value)) {
            return Promise.reject(`${this.getCommand()} requires positive whole number, received: ${value}`);
        }
        const current = context.state[this.getCommand()];
        logger.info('%s: %s', this.getCommand(), current);
        if(current <= Number.parseInt(value)) {
            context.state[this.getCommand()] += 1;
            return new CommandBlock(context.previousCommands, context.state).resolve();
        }
        return Promise.resolve(context.state);
    }
}
