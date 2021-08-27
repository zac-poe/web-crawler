import { Command } from "../command";
import { Action, ActionContext } from "./action";
import axios from 'axios';
import { logger } from '../../logger';
import { Configuration } from '../configuration';

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
        const rejectOnFailure = this.parseBoolean(
            context.state[Configuration[Configuration.ExitOnRequestFailure]]);

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
        }).then(() => this.retry(
                () => this.request(url, method, body, contentType),
                context.state[Configuration[Configuration.RetryRequest]],
                context)
            .catch(failure => {
                const failureMessage = `${failure?.message}: ${url}`;
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

    private request(url: string, method: any, body: any,
        contentType: string): Promise<any> {
        return axios(url, {
            method: method,
            data: body,
            headers: {
                'Content-Type': contentType
            }
        });
    }
}
