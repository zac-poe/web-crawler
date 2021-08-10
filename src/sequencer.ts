export class Sequencer {
    private readonly executor: (action: string, value: any, state: any) => Promise<any>;
    private readonly verbose: boolean;

    constructor(executor: (action: string, value: any, state: any) => Promise<any>, verbose: boolean) {
        this.executor = executor;
        this.verbose = verbose;
    }

    async run(commands: any|any[], state={}): Promise<any> {
        return new Promise(resolve => {
            if(this.verbose) {
                console.log('Beginning Sequence');
            }
            resolve(this.chain(Promise.resolve({...state}),
                this.parse(commands)));
        }).then(sequenceState => {
            if(this.verbose) {
                console.log(`Completed Sequence: ${JSON.stringify(sequenceState)}`);
            };
            return Promise.resolve(state);
        });
    }

    private parse(commands: any|any[]): any[] {
        return Array.isArray(commands)
            ? commands.flatMap(c => this.parse(c))
            : Object.keys(commands).map(action => ({
                action: action,
                value: commands[action]
            }));
    }

    private async chain(promise: Promise<any>, actions: any[]): Promise<any> {
        if(actions.length) {
            const action = actions.pop();
            return this.chain(promise.then((state: any) =>
                    this.executor(action.action, action.value, state)),
                actions
            );
        } else {
            return promise;
        }
    }
}
