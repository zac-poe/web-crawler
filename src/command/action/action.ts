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
}

export interface ActionContext {
    value: any;
    state: any;
    previousCommands: any[];
}
