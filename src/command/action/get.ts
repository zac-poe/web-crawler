import { Command } from "../command";
import { Action, ActionContext } from "./action";
import axios from 'axios';
import { logger } from '../../logger';

export class GetAction extends Action {
    getCommand(): string {
        return Command[Command.Get];
    }

    run(context: ActionContext): Promise<any> {
        const value = this.interpolate(context.value, context.state);
        if(!value) {
            return Promise.reject(`${this.getCommand()} command requires url`);
        }
        
        return new Promise<void>(resolve => {
            logger.info(`${this.getCommand()}: %s`, value);
            resolve();
        }).then(() => axios.get(value)).then(result => {
            let body = result?.data;
            if(typeof body === 'object') {
                body = JSON.stringify(body);
            }
            logger.info(body);
            return this.append(context.state, body);
        });
    }
}
