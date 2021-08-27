import { RequestAction } from "../../../src/command/action/request";
import { Command } from "../../../src/command/command";
import axios from 'axios';
import { ActionContext } from "../../../src/command/action/action";

jest.mock('axios');

describe('request action', () => {
    const mockRequest:jest.Mock<any,any> = (axios as any);
    const context = (request: any, state: any={}): ActionContext => ({
        value: request,
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

    it('invokes request', async () => {
        const expectedUrl = "some url", expectedMethod = 'some method';

        mockRequest.mockReturnValue(Promise.resolve());

        await new RequestAction().run(context({
            Method: expectedMethod,
            URL: expectedUrl
        }));

        expect(mockRequest.mock.calls.length).toEqual(1);
        expect(mockRequest.mock.calls[0][0]).toEqual(expectedUrl);
        expect(mockRequest.mock.calls[0][1].method).toEqual(expectedMethod);
    });

    it('invokes request with text body', async () => {
        const expectedBody = "some content";

        mockRequest.mockReturnValue(Promise.resolve());

        await new RequestAction().run(context({
            Method: 'm',
            URL: 'u',
            Body: expectedBody
        }));

        expect(mockRequest.mock.calls[0][1].data).toEqual(expectedBody);
        expect(mockRequest.mock.calls[0][1].headers['Content-Type']).toMatch(/.*text\/plain.*/);
    });

    it('invokes request with json body', async () => {
        const expectedBody = { a: 'abc', b: 123 };

        mockRequest.mockReturnValue(Promise.resolve());

        await new RequestAction().run(context({
            Method: 'm',
            URL: 'u',
            Body: expectedBody
        }));

        expect(mockRequest.mock.calls[0][1].data).toStrictEqual(expectedBody);
        expect(mockRequest.mock.calls[0][1].headers['Content-Type']).toMatch(/.*text\/json.*/);
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

    it('request fails without method', async () => {
        const subject = new RequestAction();

        await expect(subject.run(context({
            URL: 'abc'
        }))).rejects.not.toBeUndefined();
    });

    it('request fails without url', async () => {
        const subject = new RequestAction();

        await expect(subject.run(context({
            Method: 'abc'
        }))).rejects.not.toBeUndefined();
    });

    it('web request failures fail action when configured', async () => {
        const failure = "some failure";

        mockRequest.mockRejectedValue({message: failure});

        const subject = new RequestAction();


        const getResult = async (value: any) => {
            let {ExitOnRequestFailure, ...result} = await subject
                .run(context('url', { ExitOnRequestFailure: value }));
            return result;
        };

        await expect(getResult(true)).rejects.toEqual(`${failure}: url`);
        await expect(getResult(1)).rejects.toEqual(`${failure}: url`);
        await expect(getResult("true")).rejects.toEqual(`${failure}: url`);
    });

    it('web request failures do not fail action when configured', async () => {
        const expectedState = { var: "abcd" };

        mockRequest.mockRejectedValue({message: "some failure"});

        const subject = new RequestAction();

        const getResult = async (value: any) => {
            let {ExitOnRequestFailure, ...result} = await subject
                .run(context('url', {
                    ExitOnRequestFailure: value,
                    ...expectedState
                }));
            return result;
        };
        expect(await getResult(false)).toEqual(expectedState);
        expect(await getResult(0)).toEqual(expectedState);
        expect(await getResult("false")).toEqual(expectedState);
    });

    it('request interpolated url', async () => {
        const state = {
            variable: 'some value'
        };

        mockRequest.mockReturnValue(Promise.resolve());

        await new RequestAction().run(context('http://<variable>/path', state));

        expect(mockRequest.mock.calls[0][0]).toEqual('http://some value/path');
    });

    it('invokes request with interpolated body', async () => {
        const state = {
            variable: 'partial body'
        };

        mockRequest.mockReturnValue(Promise.resolve());

        await new RequestAction().run(context({
            Method: 'm',
            URL: 'u',
            Body: "a<variable>b"
        }, state));

        expect(mockRequest.mock.calls[0][1].data).toEqual('apartial bodyb');
    });

    it('appends json result as string to state', async () => {
        mockRequest.mockReturnValue(Promise.resolve({data: {a: 123, b: "value"}}));

        const result = await new RequestAction().run(context('url'));

        expect(result[Command[Command.Request]]).toEqual('{"a":123,"b":"value"}');
    });
});
