import { Command } from "./command";
import { Action } from "./action";

export class RepeatAction extends Action {
    getCommand(): string {
        return Command[Command.Repeat];
    }

    run(value: any, state: any, verbose: boolean): Promise<any> {
        return super.run(value, state, verbose);
    }
}
