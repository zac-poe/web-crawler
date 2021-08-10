export class Action {
    protected interpolate(value: string, state: any) {
        return Object.keys(state).reduce((result, variable) => {
            return result.replaceAll(`{${variable}}`, state[variable]);
        }, value);
    }

    protected append(state: any, value: any) {
        state[this.getCommand()] = value;
        return state;
    }

    run(value: any, state: any, verbose: boolean): Promise<any> {
        return Promise.resolve(state);
    }

    getCommand(): string {
        return undefined as any;
    }
}
