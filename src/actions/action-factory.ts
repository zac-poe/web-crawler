import { Action } from "./action";
import { GetAction } from "./get";
import { DownloadAction } from './download';
import { PrintAction } from './print';
import { EvaluateAction } from './evaluate';
import { RepeatAction } from './repeat';

export class ActionFactory {
    private readonly actions: any = {};
    private readonly isVerbose: boolean;

    constructor(verbose: boolean) {
        this.isVerbose = verbose;

        //all defined actions
        this.add(new Action());
        this.add(new GetAction());
        this.add(new DownloadAction());
        this.add(new PrintAction());
        this.add(new EvaluateAction());
        this.add(new RepeatAction());
    }

    private add(action: Action) {
        this.actions[action.getCommand()] = action;
    }

    get(command: string): Action {
        const action = this.actions[command];
        if(!action) {
            console.warn(`Unknown command: ${command}`);
            return this.actions[undefined as any];
        }
        return action;
    }

    run(action: string, value: any, state: any): Promise<any> {
        return this.get(action).run(value, state, this.isVerbose);
    }
}
