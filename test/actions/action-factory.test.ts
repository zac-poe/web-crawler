import { actionFactory } from "../../src/actions/action-factory";
import { Command } from "../../src/actions/command";
import { Action } from "../../src/actions/action";

jest.mock('../../src/actions/action');

describe('action factory', () => {
    it('returns default action for unknown values', () => {
        const result = actionFactory.get('some unknown command');

        expect(result instanceof Action).toBeTruthy();
    });

    it('returns action for every command', () => {
        Object.keys(Command)
            .filter((k: any) => typeof Command[k] === "number")
            .forEach((command: string) => {
                const result = actionFactory.get(command);

                expect(result instanceof Action).toBeTruthy();
                expect(result.getCommand()).toEqual(command);
            });
    });
});
