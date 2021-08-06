import axios from 'axios';

export class Crawler {
    private readonly sequence: any;
    private readonly verbose: boolean;

    constructor(sequence: any, verbose: boolean) {
        this.sequence = sequence;
        this.verbose = verbose;
    }

    async walk(): Promise<void> {
        return this.interpret(this.sequence, {});
    }

    private async interpret(command: any, state: any): Promise<void> {
        const action = Object.keys(command)[0];
        switch(action) {
            case Action[Action.Get]:
            case Action[Action.Download]:
            case Action[Action.Evaluate]:
            case Action[Action.Then]:
            case Action[Action.Repeat]:
            case Action[Action.Print]:
        }
    }
}

export enum Action {
    Get,
    Download,
    Evaluate,
    Then,
    Repeat,
    Print
}
