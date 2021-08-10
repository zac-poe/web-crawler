import { Command } from "./command";
import { Action } from "./action";

export class PrintAction extends Action {
    getCommand(): string {
        return Command[Command.Print];
    }

    run(value: any, state: any, verbose: boolean): Promise<any> {
        return super.run(value, state, verbose);
    }
}
