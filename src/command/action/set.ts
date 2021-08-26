import { Command } from "../command";
import { Action, ActionContext } from "./action";
import { logger } from "../../logger";

export class SetAction extends Action {
    getCommand(): string {
        return Command[Command.Set];
    }

    run(context: ActionContext): Promise<any> {
        if(typeof context.value !== 'object') {
            return Promise.reject(`${this.getCommand()} requires key/values`);
        }

        for(const variable of Object.keys(context.value)) {
            context.state[variable] = this.interpolate(context.value[variable], context.state);
            logger.info('%s: %s', variable, context.state[variable]);
        }

        return Promise.resolve(context.state);
    }
}
