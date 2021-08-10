import { ActionFactory } from "../../src/actions/action-factory";
import { Command } from "../../src/actions/command";
import { Action } from "../../src/actions/action";

describe('action factory', () => {
    it('returns default action for unknown values', () => {
        const result = new ActionFactory(false).get('some unknown command');

        expect(result instanceof Action).toBeTruthy();
    });

    it('returns action for every command', () => {
        const target = new ActionFactory(false);

        Object.keys(Command).forEach(c => {
            const result = target.get(c);
            expect(result instanceof Action).toBeTruthy();
            expect(result.getCommand()).toEqual(Command[c]);
        });
    });

    it('delegates to action for run', () => {
        const target = new ActionFactory(false);
    });
});
