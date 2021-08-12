import { Command } from "../command";
import { Action, ActionContext } from "./action";

export class DownloadAction extends Action {
    getCommand(): string {
        return Command[Command.Download];
    }

    run(context: ActionContext): Promise<any> {
        return super.run(context);
    }
}
