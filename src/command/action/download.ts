import { Command } from "../command";
import { Action, ActionContext } from "./action";
import axios from 'axios';
import { logger } from '../../logger';
import path from 'path';
import fs from 'fs';

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
        }).then(() => axios.get(value, {responseType: 'stream'})
            .catch(failure => {
                return Promise.reject(`${failure.message}: ${value}`);
            })
        ).then(async response => {
            const fileName = path.parse(value).base;
            const fileWriter = fs.createWriteStream(fileName);
            response.data.pipe(fileWriter);
            await new Promise(resolve => {
                fileWriter.on('finish', resolve);
            });
            logger.info('saved as: %s', fileName);
            return context.state;
        });
    }
}
