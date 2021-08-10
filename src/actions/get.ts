import { Command } from "./command";
import { Action } from "./action";
import axios from 'axios';

export class GetAction extends Action {
    getCommand(): string {
        return Command[Command.Get];
    }

    run(value: any, state: any, verbose: boolean): Promise<any> {
        value = this.interpolate(value, state);
        if(!value) {
            return Promise.reject(`${this.getCommand()} command requires url`);
        }
        return axios.get(value).then(result => {
            if(verbose) {
                console.log(`Get: ${value}`);
                console.log(result);
            }
            return this.append(state, result);
        });
    }
}
