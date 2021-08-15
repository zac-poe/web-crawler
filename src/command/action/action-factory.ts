import { logger } from '../../logger';
import { Action } from "./action";
import { GetAction } from "./get";
import { DownloadAction } from './download';
import { PrintAction } from './print';
import { EvaluateAction } from './evaluate';
import { CommandsAction } from "./commands";
import { RepeatAction } from "./repeat";

export class ActionFactory {
    private readonly actions: any = {};

    constructor() {
        //all defined actions
        this.add(new Action());
        this.add(new GetAction());
        this.add(new DownloadAction());
        this.add(new PrintAction());
        this.add(new EvaluateAction());
        this.add(new CommandsAction());
        this.add(new RepeatAction());
    }

    private add(action: Action) {
        this.actions[action.getCommand()] = action;
    }

    get(command: string): Action {
        let action = this.actions[command];
        if(!action) {
            logger.warn('Unknown command: %s', command);
            action = this.actions[undefined as any];
        }
        return action;
    }
}
