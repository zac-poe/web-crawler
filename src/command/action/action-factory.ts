import { logger } from '../../logger';
import { Action } from "./action";
import { RequestAction } from "./request";
import { DownloadAction } from './download';
import { PrintAction } from './print';
import { EvaluateAction } from './evaluate';
import { CommandsAction } from "./commands";
import { RepeatAction } from "./repeat";
import { SetAction } from './set';

export class ActionFactory {
    private readonly actions: any = {};

    constructor() {
        //all defined actions
        this.add(new Action());
        this.add(new RequestAction());
        this.add(new DownloadAction());
        this.add(new PrintAction());
        this.add(new EvaluateAction());
        this.add(new CommandsAction());
        this.add(new RepeatAction());
        this.add(new SetAction());
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
