import { logger } from '../../logger';
import { Configuration } from '../configuration';

export class Action {
    protected interpolate(value: string, state: any) {
        if(!value?.length) {
            return `${value}`;
        }
        return Object.keys(state).reduce((result, variable) => {
            return result.replaceAll(`<${variable}>`, state[variable]);
        }, value);
    }

    protected append(state: any, value: any) {
        state[this.getCommand()] = value;
        return state;
    }

    run(context: ActionContext): Promise<any> {
        return Promise.resolve(context.state);
    }

    getCommand(): string {
        return undefined as any;
    }

    protected parseBoolean(value: any): boolean {
        let result = value;
        if(typeof result !== 'boolean') {
            result = result === 1 || result === 'true';
        }
        return result;
    }

    protected retry(behavior: () => Promise<any>,
        retries: number, context: ActionContext): Promise<any> {
        return behavior().catch(async reason => {
            return retries > 0
                ? await new Promise(resolve => {
                    setTimeout(resolve,
                        context.state[Configuration[Configuration.RetryDelayMs]]);
                }).then(() => {
                        const remaining = retries-1;
                        logger.info('Failure encountered, retrying up to %s more times...',
                            remaining);
                        return this.retry(behavior, remaining, context);
                    })
                : Promise.reject(reason);
        });
    }
}

export interface ActionContext {
    value: any;
    state: any;
    previousCommands: any[];
}
