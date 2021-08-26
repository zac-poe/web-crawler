import { Command } from "../command";
import { Action, ActionContext } from "./action";
import axios from 'axios';
import { logger } from '../../logger';
import path from 'path';
import fs from 'fs';
import { Configuration } from "../command-block";

export class DownloadAction extends Action {
    getCommand(): string {
        return Command[Command.Download];
    }

    run(context: ActionContext): Promise<any> {
        const value = this.interpolate(context.value, context.state);
        if(!value) {
            return Promise.reject(`${this.getCommand()} command requires url`);
        }

        let rejectOnFailure = context.state[Configuration[Configuration.ExitOnDownloadFailure]];
        if(typeof rejectOnFailure !== 'boolean') {
            rejectOnFailure = rejectOnFailure === 1
                || rejectOnFailure === 'true';
        }

        return new Promise<void>(resolve => {
            logger.info(`${this.getCommand()}: %s`, value);
            resolve();
        }).then(() => axios.get(value, {responseType: 'stream'})
            .catch(failure => {
                const failureMessage = `${failure.message}: ${value}`;
                if(rejectOnFailure) {
                    return Promise.reject(failureMessage);
                } else {
                    logger.warn(failureMessage);
                    return Configuration.ExitOnDownloadFailure;
                }
            })
        ).then(async response => {
            if(response !== Configuration.ExitOnDownloadFailure) {
                const fileName = path.parse(value).base;
                const fileWriter = fs.createWriteStream(fileName);
                response.data.pipe(fileWriter);
                await new Promise(resolve => {
                    fileWriter.on('finish', resolve);
                });
                logger.info('saved as: %s', fileName);
            }
            return context.state;
        });
    }
}
