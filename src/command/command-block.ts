import { logger } from '../logger';
import { ActionFactory } from "./action/action-factory";
import { Command } from './command';

export class CommandBlock {
    private readonly commandSequence: CommandPair[];
    private readonly state: any;
    private readonly actionFactory: ActionFactory;

    constructor(commands: any, state: any={}) {
        this.commandSequence = this.parse(commands);
        this.state = {
            ...state,
            [Command[Command.Repeat]]: 1
        };
        this.actionFactory = new ActionFactory();
    }

    async resolve(): Promise<any> {
        return new Promise(resolve => {
            logger.info('Processing commands: %s\nwith variables: %s',
                this.commandSequence, this.state);
            resolve(this.chain(Promise.resolve(this.state), this.commandSequence));
        });
    }

    updateState(key: string, value: any): void {
        this.state[key] = value;
    }

    private parse(commands: any): CommandPair[] {
        return Object.keys(commands).map(action => ({
            name: action,
            value: commands[action]
        }));
    }

    private async chain(promise: Promise<any>, actions: CommandPair[]): Promise<any> {
        const action = actions.shift();
        if(action) {
            return this.chain(promise.then((state: any) => 
                this.actionFactory.get(action.name).run({
                    block: this,
                    state: state,
                    value: action.value
                })
            ), actions);
        } else {
            return promise;
        }
    }
}

interface CommandPair {
    name: string,
    value: any
}
