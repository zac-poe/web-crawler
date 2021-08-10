import { ActionFactory } from "../../src/actions/action-factory";
import { Command } from "../../src/actions/command";
import { Action } from "../../src/actions/action";

jest.mock('../../src/actions/action');

describe('action factory', () => {
    it('returns default action for unknown values', () => {
        const result = new ActionFactory(false).get('some unknown command');

        expect(result instanceof Action).toBeTruthy();
    });

    it('returns action for every command', () => {
        const target = new ActionFactory(false);

        Object.keys(Command)
            .filter((k: any) => typeof Command[k] === "number")
            .forEach((command: string) => {
                const result = target.get(command);

                expect(result instanceof Action).toBeTruthy();
                expect(result.getCommand()).toEqual(command);
            });
    });

    it('delegates to action for run', async () => {
        const expectedValue = 'some value',
            expectedState = { someState: 'other value' };

        const target = new ActionFactory(false);
        const mockAction = target.get(undefined as any) as any;

        await target.run(undefined as any, expectedValue, expectedState);

        expect(mockAction.run.mock.calls.length).toEqual(1);
        expect(mockAction.run.mock.calls[0][0]).toEqual(expectedValue);
        expect(mockAction.run.mock.calls[0][1]).toStrictEqual(expectedState);
    });
});
