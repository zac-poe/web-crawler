import { Command } from "../command";
import { Action, ActionContext } from "./action";
import axios from 'axios';
import js_file_download from 'js-file-download';
import { logger } from '../../logger';
import path from 'path';

export class DownloadAction extends Action {
    getCommand(): string {
        return Command[Command.Download];
    }

    run(context: ActionContext): Promise<any> {
        const value = this.interpolate(context.value, context.state);
        if(!value) {
            return Promise.reject(`${this.getCommand()} command requires url`);
        }

        return new Promise<void>(resolve => {
            logger.info(`${this.getCommand()}: %s`, value);
            resolve();
        }).then(() => axios.get(value, {
            responseType: 'blob'
        })).then(response => {
            const fileName = path.parse(value).base;
            js_file_download(response.data, fileName);
            logger.info('saved as: %s', fileName);
            return context.state;
        });
    }
}
