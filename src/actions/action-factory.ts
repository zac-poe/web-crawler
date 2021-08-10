import { Action } from "./action";
import { Command } from "./command";
import { GetAction } from "./get";

export class ActionFactory {
    private readonly actions: any = {};
    private readonly isVerbose: boolean;

    constructor(verbose: boolean) {
        this.isVerbose = verbose;

        //all defined actions
        this.add(new GetAction());
    }

    private add(action: Action) {
        this.actions[Command[action.getCommand()]] = action;
    }

    get(command: string): Action {
        const action = this.actions[command];
        if(!action) {
            console.warn(`Unknown command: ${command}`);
            return new Action();
        }
        return action;
    }

    run(action: string, value: any, state: any): Promise<any> {
        return this.get(action).run(value, state, this.isVerbose);
    }
}
