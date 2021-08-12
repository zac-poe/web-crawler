import { ActionFactory } from "../../../src/command/action/action-factory";
import { Command } from "../../../src/command/command";
import { Action } from "../../../src/command/action/action";

jest.mock('../../../src/command/action/action');

describe('action factory', () => {
    it('returns default action for unknown values', () => {
        const result = new ActionFactory().get('some unknown command');

        expect(result instanceof Action).toBeTruthy();
    });

    it('returns action for every command', () => {
        Object.keys(Command)
            .filter((k: any) => typeof Command[k] === "number")
            .forEach((command: string) => {
                const result = new ActionFactory().get(command);

                expect(result instanceof Action).toBeTruthy();
                expect(result.getCommand()).toEqual(command);
            });
    });
});
