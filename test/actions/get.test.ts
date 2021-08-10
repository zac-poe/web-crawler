import { GetAction } from "../../src/actions/get";
import { Command } from "../../src/actions/command";
import axios from 'axios';

jest.mock('axios');

describe('get action', () => {
    const mockRequest:jest.Mock<any,any> = (axios.get as any);

    beforeEach(() => {
        mockRequest.mockClear();
    });

    it('has get command', () => {
        expect(new GetAction().getCommand()).toEqual(Command[Command.Get]);
    });

    it('gets url', async () => {
        const expectedUrl = "some url";

        mockRequest.mockReturnValue(Promise.resolve());

        await new GetAction().run(expectedUrl, {}, false);

        expect(mockRequest.mock.calls.length).toEqual(1);
        expect(mockRequest.mock.calls[0][0]).toEqual(expectedUrl);
    });

    it('appends result to state', async () => {
        const expectedResult = "some content";

        mockRequest.mockReturnValue(Promise.resolve(expectedResult));

        const result = await new GetAction().run('url', {}, false);

        expect(result[Command[Command.Get]]).toEqual(expectedResult);
    });

    it('get fails without url', async () => {
        const subject = new GetAction();

        await expect(subject.run(undefined, {}, false)).rejects.not.toBeUndefined();
    });

    it('get failures fail crawler', async () => {
        const failure = "some failure";

        mockRequest.mockRejectedValue(failure);

        const subject = new GetAction();

        await expect(subject.run('url', {}, false)).rejects.toEqual(failure);
    });

    it('request interpolated url', async () => {
        const state = {
            variable: 'some value'
        };

        mockRequest.mockReturnValue(Promise.resolve());

        await new GetAction().run('http://{variable}/path', state, false);

        expect(mockRequest.mock.calls[0][0]).toEqual('http://some value/path');
    });
});
