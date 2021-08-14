import { logger } from '../logger';
import { ActionFactory } from "./action/action-factory";
import { Command } from './command';

export class CommandBlock {
    private readonly commandSequence: CommandValue[];
    private readonly previousCommands: CommandValue[][];
    private readonly state: any;
    private readonly actionFactory: ActionFactory;

    constructor(commands: any|any[], state: any={}) {
        this.commandSequence = this.parse(Array.isArray(commands)
            ? commands : [commands]);
        this.state = {
            ...state,
            [Command[Command.Repeat]]: 1
        };
        this.actionFactory = new ActionFactory();
        this.previousCommands = [];
    }

    resolve(): Promise<any> {
        return this.resolveCommands(this.commandSequence);
    }

    private resolveCommands(commands: CommandValue[]): Promise<any> {
        return new Promise(resolve => {
            logger.info('Processing commands: %s\nwith variables: %s',
                commands, this.state);
        this.previousCommands.unshift([]);
            resolve(this.chain(Promise.resolve(this.state), commands));
        }).then((result) => {
            this.previousCommands.pop();
            return result;
        });
    }

    private parse(commandsList: any[]): CommandValue[] {
        return commandsList.flatMap(commands => 
            Object.keys(commands).map(action => ({
                name: action,
                value: commands[action]
            }))
        );
    }

    private resolvePrevious(): Promise<any> {
        this.state[Command[Command.Repeat]] += 1;
        return this.resolveCommands(this.previousCommands[0]);
    }

    private chain(promise: Promise<any>, actions: CommandValue[]): Promise<any> {
        const action = actions.shift();
        if(action) {
            return this.chain(promise.then((state: any) => 
                this.actionFactory.get(action.name).run({
                    state: state,
                    value: action.value,
                    repeat: () => this.resolvePrevious()
                }).then(result => {
                    this.previousCommands[0].push(action);
                    return result;
                })
            ), actions);
        } else {
            return promise;
        }
    }
}

interface CommandValue {
    name: string,
    value: any
}
