import { logger } from './logger';
import { actionFactory } from "./actions/action-factory";
import { Command } from './actions/command';

export class Block {
    private readonly commandSequence: CommandPair[];
    private readonly state: any;

    constructor(commands: any, state: any={}) {
        this.commandSequence = this.parse(commands);
        this.state = {
            ...state,
            [Command[Command.Repeat]]: 0
        };
    }

    async resolve(): Promise<any> {
        return new Promise(resolve => {
            logger.info(`Beginning commands: ${JSON.stringify(this.commandSequence, null, '  ')}`);
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
                actionFactory.get(action.name).run({
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
