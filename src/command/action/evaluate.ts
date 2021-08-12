import { Command } from "../command";
import { Action, ActionContext } from "./action";
import { parse as parseHtml } from 'parse5';
import { select } from 'xpath';
import { serializeToString as toXml } from 'xmlserializer';
import { DOMParser } from 'xmldom';
import { logger } from "../../logger";

export class EvaluateAction extends Action {
    getCommand(): string {
        return Command[Command.Evaluate];
    }

    run(context: ActionContext): Promise<any> {
        if(typeof context.value !== 'object') {
            return Promise.reject(`${this.getCommand()} requires key/values`);
        }

        const xmlBody = toXml(parseHtml(context.state[Command[Command.Get]] ?? ''))
            .replaceAll(/xmlns(?:[^"']+['"]){2}/g, '');
        logger.info(`Evaluating variables against: ${xmlBody}`);
        const xmlDocument = new DOMParser().parseFromString(xmlBody);

        for(const variable of Object.keys(context.value)) {
            context.state[variable] = select(this.interpolate(context.value[variable],
                        context.state), xmlDocument)
                    .map((result: any) => result.hasOwnProperty('value') ? result.value : result)
                    .join('');
            logger.info(`${variable}: ${context.state[variable]}`);
        }

        return Promise.resolve(context.state);
    }
}
