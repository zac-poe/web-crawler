import { DownloadAction } from "../../../src/command/action/download";
import { Command } from "../../../src/command/command";
import axios from 'axios';
import fs from 'fs';

jest.mock('axios');
jest.mock('fs');

describe('download action', () => {
    const mockRequest:jest.Mock<any,any> = (axios.get as any);

    const context = (url: string, state: any={}) => ({
        value: url,
        state: state,
        block: (undefined as any)
    });

    beforeAll(() => {
        (fs.createWriteStream as any).mockImplementation(() => ({
            on: (event:any, resolve:any) => resolve()
        }));
    })

    beforeEach(() => {
        mockRequest.mockClear();
        (fs.createWriteStream as any).mockClear();
    });

    it('has download command', () => {
        expect(new DownloadAction().getCommand()).toEqual(Command[Command.Download]);
    });

    it('get fails without url', async () => {
        const subject = new DownloadAction();

        await expect(subject.run(context(''))).rejects.not.toBeUndefined();
    });

    it('get failures fail action', async () => {
        const failure = "some failure";

        mockRequest.mockRejectedValue(failure);

        const subject = new DownloadAction();

        await expect(subject.run(context('url'))).rejects.toEqual(failure);
    });

    it('downloads file', async () => {
        const expectedFile = 'some-file.txt'
        const expectedUrl = `some/url/${expectedFile}`;
        const expectedStream = jest.fn();

        mockRequest.mockReturnValue(Promise.resolve({data:{pipe:expectedStream}}));

        await new DownloadAction().run(context(expectedUrl));

        expect(mockRequest.mock.calls.length).toEqual(1);
        expect(mockRequest.mock.calls[0][0]).toEqual(expectedUrl);
        expect(mockRequest.mock.calls[0][1].responseType).toEqual('stream');
        expect(expectedStream.mock.calls.length).toEqual(1);
        expect((fs.createWriteStream as any).mock.calls.length).toEqual(1);
        expect((fs.createWriteStream as any).mock.calls[0][0]).toEqual(expectedFile);
    });

    it('request interpolated url', async () => {
        const state = {
            variable: 'some value'
        };

        mockRequest.mockReturnValue(Promise.resolve({data:{pipe:jest.fn()}}));

        await new DownloadAction().run(context('http://<variable>/path', state));

        expect(mockRequest.mock.calls[0][0]).toEqual('http://some value/path');
    });
});
