import { ActionContext } from "../../../src/command/action/action";
import { SetAction } from "../../../src/command/action/set";
import { Command } from "../../../src/command/command";
import { logger } from "../../../src/logger";

logger.silent = false;

describe('set action', () => {
    const context = (evaluations: object, state: any={}): ActionContext => ({
        value: evaluations,
        state: state,
        previousCommands: []
    });

    it('has set command', () => {
        expect(new SetAction().getCommand()).toEqual(Command[Command.Set]);
    });

    it('rejects when value is not an object', async () => {
        await expect(new SetAction().run(context('a string' as any))).rejects.not.toBeUndefined();
    });

    it('sets multiple variables', async () => {
        const variable1 = 'v1', variable2 = 'v2',
            expectedResult1 = 'abcd', expectedResult2 = 12345;

        const subject = new SetAction();

        const result = await subject.run(context({
                [variable1]: expectedResult1,
                [variable2]: expectedResult2
            }));

        expect(result[variable1]).toEqual(expectedResult1);
        expect(result[variable2]).toEqual(expectedResult2.toString());
    });

    it('interpolates before evaluating', async () => {
        const variable = 'value';

        const subject = new SetAction();

        const result = await subject.run(context({
            [variable]: 'i love <subject>'
            }, { subject: 'pizza' }));

        expect(result[variable]).toEqual('i love pizza');
    });
});
