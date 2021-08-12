import { Command } from "../command";
import { Action, ActionContext } from "./action";
import { parse as parseHtml } from 'parse5';
import { select } from 'xpath';
import { serializeToString as toXml } from 'xmlserializer';
import { DOMParser } from 'xmldom';

export class EvaluateAction extends Action {
    getCommand(): string {
        return Command[Command.Evaluate];
    }

    run(context: ActionContext): Promise<any> {
        if(typeof context.value !== 'object') {
            return Promise.reject(`${this.getCommand()} requires key/values`);
        }
        const xmlDocument = new DOMParser().parseFromString(toXml(parseHtml(context.state[Command[Command.Get]] ?? '')));
        for(const variable of Object.keys(context.value)) {
            context.state[variable] = select(context.value[variable], xmlDocument);
        }
        return Promise.resolve(context.state);
    }
}
