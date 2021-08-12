import { Command } from "../command";
import { Action, ActionContext } from "./action";
import { CommandBlock } from "../command-block";
import { logger } from "../../logger";

export class SequenceAction extends Action {
    getCommand(): string {
        return Command[Command.Sequence];
    }

    run(context: ActionContext): Promise<any> {
        if(!Array.isArray(context.value)) {
            return Promise.reject(`${this.getCommand} requires a list`);
        }
        return this.chain(Promise.resolve(context.state), context.value)
            .then((sequenceResult) => {
                logger.info(`Completed sequence: ${JSON.stringify(sequenceResult)}`);
                return context.state;
            });
    }

    private async chain(promise: Promise<any>, sequence: any[]): Promise<any> {
        const commands = sequence.shift();
        if(commands) {
            return this.chain(promise.then((state: any) =>
                    new CommandBlock(commands).resolve()),
                sequence);
        } else {
            return promise;
        }
    }
}
