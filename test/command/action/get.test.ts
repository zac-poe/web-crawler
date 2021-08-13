import { GetAction } from "../../../src/command/action/get";
import { Command } from "../../../src/command/command";
import axios from 'axios';

jest.mock('axios');

describe('get action', () => {
    const mockRequest:jest.Mock<any,any> = (axios.get as any);
    const context = (url: string, state: any={}) => ({
        value: url,
        state: state,
        block: (undefined as any)
    });

    beforeEach(() => {
        mockRequest.mockClear();
    });

    it('has get command', () => {
        expect(new GetAction().getCommand()).toEqual(Command[Command.Get]);
    });

    it('gets url', async () => {
        const expectedUrl = "some url";

        mockRequest.mockReturnValue(Promise.resolve());

        await new GetAction().run(context(expectedUrl));

        expect(mockRequest.mock.calls.length).toEqual(1);
        expect(mockRequest.mock.calls[0][0]).toEqual(expectedUrl);
    });

    it('appends result to state', async () => {
        const expectedResult = "some content";

        mockRequest.mockReturnValue(Promise.resolve({data: expectedResult}));

        const result = await new GetAction().run(context('url'));

        expect(result[Command[Command.Get]]).toEqual(expectedResult);
    });

    it('get fails without url', async () => {
        const subject = new GetAction();

        await expect(subject.run(context(''))).rejects.not.toBeUndefined();
    });

    it('get failures fail crawler', async () => {
        const failure = "some failure";

        mockRequest.mockRejectedValue(failure);

        const subject = new GetAction();

        await expect(subject.run(context('url'))).rejects.toEqual(failure);
    });

    it('request interpolated url', async () => {
        const state = {
            variable: 'some value'
        };

        mockRequest.mockReturnValue(Promise.resolve());

        await new GetAction().run(context('http://<variable>/path', state));

        expect(mockRequest.mock.calls[0][0]).toEqual('http://some value/path');
    });

    it('appends json result as string to state', async () => {
        mockRequest.mockReturnValue(Promise.resolve({data: {a: 123, b: "value"}}));

        const result = await new GetAction().run(context('url'));

        expect(result[Command[Command.Get]]).toEqual('{"a":123,"b":"value"}');
    });
});
