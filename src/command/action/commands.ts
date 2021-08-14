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
        return new Promise<void>(resolve => {
                logger.info("Beginning %s", this.getCommand());
                resolve();
            })
            .then(() => this.chain(Promise.resolve(context.state), context.value))
            .then((result) => {
                logger.info('Completed %s: %s', this.getCommand(), result);
                return context.state;
            });
    }

    private async chain(promise: Promise<any>, sequence: any[]): Promise<any> {
        const commands = sequence.shift();
        if(commands) {
            return this.chain(promise.then((state: any) =>
                    new CommandBlock(commands, state).resolve()),
                sequence);
        } else {
            return promise;
        }
    }
}
