import { Command } from "../command";
import { Action, ActionContext } from "./action";
import axios from 'axios';
import { logger } from '../../logger';
import { Configuration } from '../command-block';

interface Request {
    Method: string,
    URL: string,
    Body: string
}

export class RequestAction extends Action {
    getCommand(): string {
        return Command[Command.Request];
    }

    run(context: ActionContext): Promise<any> {
        let rejectOnFailure = context.state[Configuration[Configuration.ExitOnRequestFailure]];
        if(typeof rejectOnFailure !== 'boolean') {
            rejectOnFailure = rejectOnFailure !== 0
                && rejectOnFailure !== 'false';
        }

        let url: string,
            method: string='get',
            body: any='',
            contentType = 'text/plain';
        if(typeof context.value === 'object') {
            const request = context.value as Request;
            if(!request.Method || !request.URL) {
                return Promise.reject(`${this.getCommand()} command requires name/value for both Method and URL`);
            }
            url = request.URL;
            method = this.interpolate(request.Method, context.state).toLowerCase();
            if(request.Body) {
                body = this.interpolate(typeof request.Body === 'object'
                        ? JSON.stringify(request.Body) : request.Body,
                    context.state);
                try {
                    body = JSON.parse(body);
                    contentType = 'text/json';
                } catch(e) { /* will remain a string */ }
            }
        } else {
            url = context.value;
        }

        url = this.interpolate(url, context.state);
        if(!url) {
            return Promise.reject(`${this.getCommand()} requires URL to be non-empty`);
        }
    
        return new Promise<void>(resolve => {
            logger.info(`${this.getCommand()}: %s %s`, method, url);
            if(body) {
                logger.info(`  --> %s`, body);
            }
            resolve();
        }).then(() => axios(url, {
                method: method as any,
                data: body,
                headers: {
                    'Content-Type': contentType
                }
            }).catch(failure => {
                const failureMessage = `${failure.message}: ${url}`;
                if(rejectOnFailure) {
                    return Promise.reject(failureMessage);
                } else {
                    logger.warn(failureMessage);
                    return Configuration.ExitOnRequestFailure;
                }
            })
        ).then(result => {
            if(result === Configuration.ExitOnRequestFailure) {
                return context.state;
            }

            let body = result?.data;
            if(typeof body === 'object') {
                body = JSON.stringify(body);
            }
            logger.info(body);
            return this.append(context.state, body);
        });
    }
}
