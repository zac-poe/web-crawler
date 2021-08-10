import { Command } from "./command";
import { Action } from "./action";

export class DownloadAction extends Action {
    getCommand(): string {
        return Command[Command.Download];
    }

    run(value: any, state: any, verbose: boolean): Promise<any> {
        return super.run(value, state, verbose);
    }
}
