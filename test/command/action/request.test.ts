import { RequestAction } from "../../../src/command/action/request";
import { Command } from "../../../src/command/command";
import axios from 'axios';
import { ActionContext } from "../../../src/command/action/action";

jest.mock('axios');

describe('request action', () => {
    const mockRequest:jest.Mock<any,any> = (axios.get as any);
    const context = (url: string, state: any={}): ActionContext => ({
        value: url,
        state: state,
        previousCommands: []
    });

    beforeEach(() => {
        mockRequest.mockReset();
    });

    it('has request command', () => {
        expect(new RequestAction().getCommand()).toEqual(Command[Command.Request]);
    });

    it('gets url', async () => {
        const expectedUrl = "some url";

        mockRequest.mockReturnValue(Promise.resolve());

        await new RequestAction().run(context(expectedUrl));

        expect(mockRequest.mock.calls.length).toEqual(1);
        expect(mockRequest.mock.calls[0][0]).toEqual(expectedUrl);
    });

    it('appends result to state', async () => {
        const expectedResult = "some content";

        mockRequest.mockReturnValue(Promise.resolve({data: expectedResult}));

        const result = await new RequestAction().run(context('url'));

        expect(result[Command[Command.Request]]).toEqual(expectedResult);
    });

    it('get fails without url', async () => {
        const subject = new RequestAction();

        await expect(subject.run(context(''))).rejects.not.toBeUndefined();
    });

    it('get failures fail crawler', async () => {
        const failure = "some failure";

        mockRequest.mockRejectedValue({message: failure});

        const subject = new RequestAction();

        await expect(subject.run(context('url'))).rejects.toEqual(`${failure}: url`);
    });

    it('request interpolated url', async () => {
        const state = {
            variable: 'some value'
        };

        mockRequest.mockReturnValue(Promise.resolve());

        await new RequestAction().run(context('http://<variable>/path', state));

        expect(mockRequest.mock.calls[0][0]).toEqual('http://some value/path');
    });

    it('appends json result as string to state', async () => {
        mockRequest.mockReturnValue(Promise.resolve({data: {a: 123, b: "value"}}));

        const result = await new RequestAction().run(context('url'));

        expect(result[Command[Command.Request]]).toEqual('{"a":123,"b":"value"}');
    });
});
