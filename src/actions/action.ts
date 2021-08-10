import { Command } from "./command";

export class Action {
    protected interpolate(value: string, state: any) {
        return Object.keys(state).reduce((result, variable) => {
            return result.replace(`{${variable}}`, state[variable]);
        }, value);
    }

    protected append(state: any, value: any) {
        return {
            ...state,
            [this.getCommand()]: value
        };
    }

    run(value: any, state: any, verbose: boolean): Promise<any> {
        return Promise.resolve(state);
    }

    getCommand(): Command {
        throw new Error('Action has no command')
    }
}
