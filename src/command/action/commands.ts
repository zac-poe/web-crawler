import { Command } from "../command";
import { Action, ActionContext } from "./action";
import { CommandBlock } from "../command-block";
import { logger } from "../../logger";

export class CommandsAction extends Action {
    getCommand(): string {
        return Command[Command.Commands];
    }

    run(context: ActionContext): Promise<any> {
        if(!Array.isArray(context.value)) {
            return Promise.reject(`${this.getCommand()} requires a list`);
        }
        return new CommandBlock(context.value, context.state).resolve()
            .then(() => {
                logger.info('Completed %s, restoring state: %s',
                    this.getCommand(), context.state);
                return context.state;
            });
    }
}
