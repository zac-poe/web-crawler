import { Action } from "../../src/actions/action";

describe('action', () => {
    const context = (state: any) => ({
        value: undefined,
        state: state,
        block: (undefined as any)
    });

    it('has no command', () => {
        expect(new Action().getCommand()).toEqual(undefined);
    });

    it('resolves to value', async () => {
        const expectedResult = { varaible: "some value" };

        expect(await new Action().run(context(expectedResult))).toStrictEqual(expectedResult);
    });

    it('appends to state by command', () => {
        const expectedKey = "some state key",
            expectedValue = "some state value";

        class TestAction extends Action {
            getCommand(): string {
                return (expectedKey as any);
            }
            test(state: any, value: any) {
                return this.append(state, value);
            }
        }

        const result = new TestAction().test({}, expectedValue);

        expect(result[expectedKey]).toEqual(expectedValue);
    });

    it('interpolates variables', () => {
        const result = new TestInterpolation().test("this is an <type>-<thing>", {
            type: "interpolated",
            thing: "string"
        });

        expect(result).toEqual("this is an interpolated-string");
    });

    it('interpolates without variables', () => {
        const result = new TestInterpolation().test("this is a string", {});

        expect(result).toEqual("this is a string");
    });

    it('interpolates recurring variables', () => {
        const result = new TestInterpolation().test("<animal> <animal> in <animal>", {
            animal: "buffalo"
        });

        expect(result).toEqual("buffalo buffalo in buffalo");
    });

    it('interpolates empty values', () => {
        expect(new TestInterpolation().test(undefined as any, {})).toEqual("undefined");
        expect(new TestInterpolation().test(null as any, {})).toEqual("null");
        expect(new TestInterpolation().test(0 as any, {})).toEqual("0");
        expect(new TestInterpolation().test('', {})).toEqual("");
    });
});

class TestInterpolation extends Action {
    test(str: string, state: any) {
        return this.interpolate(str, state);
    }
}
