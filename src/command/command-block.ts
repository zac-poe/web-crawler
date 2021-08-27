import { logger } from '../logger';
import { ActionFactory } from "./action/action-factory";
import { Command } from './command';
import { Configuration } from './configuration';

export class CommandBlock {
    private readonly remainingCommands: CommandValue[];
    private readonly previousCommands: any[];
    private readonly state: any;
    private readonly actionFactory: ActionFactory;

    constructor(commands: any|any[], state: any={}) {
        this.remainingCommands = (Array.isArray(commands) ? commands : [commands])
            .flatMap(c => Object.keys(c).map(action => ({
                name: action,
                value: c[action]
            })));
        this.state = {
            [Command[Command.Repeat]]: 1,
            [Configuration[Configuration.ExitOnRequestFailure]]: true,
            [Configuration[Configuration.ExitOnDownloadFailure]]: false,
            [Configuration[Configuration.RetryRequest]]: 0,
            [Configuration[Configuration.RetryDelayMs]]: 1000,
            ...state
        };
        this.actionFactory = new ActionFactory();
        this.previousCommands = [];
    }

    resolve(): Promise<any> {
        return new Promise(resolve => {
            logger.info('Processing commands: %s\nwith variables: %s',
                this.remainingCommands, this.state);
            resolve(this.chain(Promise.resolve(this.state),
                this.remainingCommands));
        });
    }

    private chain(promise: Promise<any>, actions: CommandValue[]): Promise<any> {
        const action = actions.shift();
        if(action) {
            return this.chain(promise.then((state: any) => {
                this.previousCommands.push({[action.name]: action.value});
                return this.actionFactory.get(action.name).run({
                    state: state,
                    value: action.value,
                    previousCommands: [...this.previousCommands]
                });
            }), actions);
        } else {
            return promise;
        }
    }
}

interface CommandValue {
    name: string,
    value: any
}
