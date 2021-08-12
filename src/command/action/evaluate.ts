import { Command } from "../command";
import { Action, ActionContext } from "./action";
import { DOMParser } from 'xmldom';
import { select } from 'xpath';
import { logger } from "../../logger";
import { decode } from 'he';

export class EvaluateAction extends Action {
    getCommand(): string {
        return Command[Command.Evaluate];
    }

    run(context: ActionContext): Promise<any> {
        if(typeof context.value !== 'object') {
            return Promise.reject(`${this.getCommand()} requires key/values`);
        }

        const xmlParser = new DOMParser({errorHandler: {warning: undefined}});
        const xmlDocument = xmlParser.parseFromString(context.state[Command[Command.Get]] ?? '');

        for(const variable of Object.keys(context.value)) {
            const expression = this.interpolate(context.value[variable], context.state);
            logger.info('Evaluating: %s', expression);
            let xmlResult = '';
            try {
                xmlResult = select(expression, xmlDocument)
                    .map((result: any) => result.hasOwnProperty('value') ? result.value : result)
                    .filter((result: any) => !result.toString().match(/^\s*$/))
                    .join('');
            } catch(e) {
                logger.warn(e);
            }
            context.state[variable] = decode(decode(xmlResult)); //decode xml, then html
            logger.info('%s: %s', variable, context.state[variable]);
        }

        return Promise.resolve(context.state);
    }
}
