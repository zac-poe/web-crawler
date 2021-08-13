import { ActionContext } from "../../../src/command/action/action";
import { EvaluateAction } from "../../../src/command/action/evaluate";
import { Command } from "../../../src/command/command";
import { logger } from "../../../src/logger";

logger.silent = false;

describe('evaluate action', () => {
    const context = (evaluations: object, html: string='', additionalState: any={}): ActionContext => ({
        value: evaluations,
        state: {Get: html, ...additionalState},
        block: undefined as any
    });

    it('has evaluate command', () => {
        expect(new EvaluateAction().getCommand()).toEqual(Command[Command.Evaluate]);
    });

    it('rejects when value is not an object', async () => {
        await expect(new EvaluateAction().run(context('a string' as any))).rejects.not.toBeUndefined();
    });

    it('joins multiple matches', async () => {
        const variable = 'result';

        const subject = new EvaluateAction();

        const result = await subject.run(context({[variable]: '//div/text()'},
            `<div>hi</div><div> there</div>`));

        expect(result[variable]).toEqual('hi there');
    });

    it('evaluates attribute', async () => {
        const variable = 'Attribute',
            expectedResult = '12345';

        const subject = new EvaluateAction();

        const result = await subject.run(context({[variable]: '/div/@id'},
            `<div id=${expectedResult}>text</div>`));

        expect(result[variable]).toEqual(expectedResult);
    });

    it('evaluates multiple variables', async () => {
        const variable1 = 'v1', variable2 = 'v2',
            expectedResult1 = 'a', expectedResult2 = 'b';

        const subject = new EvaluateAction();

        const result = await subject.run(context({
                [variable1]: '//div/text()',
                [variable2]: '//span/text()'
            },
            `<div>${expectedResult1}</div><span>${expectedResult2}</span>`));

        expect(result[variable1]).toEqual(expectedResult1);
        expect(result[variable2]).toEqual(expectedResult2);
    });

    it('interpolates before evaluating', async () => {
        const variable = 'value',
            expectedResult = 'b';

        const subject = new EvaluateAction();

        const result = await subject.run(context({[variable]: '//div[<Repeat>]/text()'},
            `<div>a</div><div>${expectedResult}</div><div>c</div>`,
            { Repeat: 2 }));

        expect(result[variable]).toEqual(expectedResult);
    });

    it('omits whitespace from evaluation', async () => {
        const variable = 'result';

        const subject = new EvaluateAction();

        const result = await subject.run(context({[variable]: '//div/text()'},
            '<div>\n</div><div>value</div><div>   </div>'));

        expect(result[variable]).toEqual('value');
    });

    it('handles no respose', async () => {
        const variable = 'result';

        const subject = new EvaluateAction();

        const result = await subject.run(context({[variable]: '//body/text()'}));

        expect(result[variable]).toEqual('');
    });

    it('handles unmatched result', async () => {
        const variable = 'result';

        const subject = new EvaluateAction();

        const result = await subject.run(context({[variable]: '//span'},
            '<div>value</div>'));

        expect(result[variable]).toEqual('');
    });

    it('decodes html', async () => {
        const variable = 'result';

        const subject = new EvaluateAction();

        const result = await subject.run(context({[variable]: '//div/text()'},
            '<div>name &copy;</div>'));

        expect(result[variable]).toEqual('name ©');
    });

    it('evaluates json', async () => {
        const variable = 'Result',
            expectedResult = '12345';

        const subject = new EvaluateAction();

        const result = await subject.run(context({[variable]: '//items[2]/id/text()'},
            JSON.stringify({payload:{items:[{id:"abc"},{id:expectedResult}]}})));

        expect(result[variable]).toEqual(expectedResult);
    });
});
