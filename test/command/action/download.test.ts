import { DownloadAction } from "../../../src/command/action/download";
import { Command } from "../../../src/command/command";
import axios from 'axios';
import fs from 'fs';
import { ActionContext } from "../../../src/command/action/action";

jest.mock('axios');
jest.mock('fs');

describe('download action', () => {
    const mockRequest:jest.Mock<any,any> = (axios.get as any);

    const context = (url: string, state: any={}): ActionContext => ({
        value: url,
        state: state,
        previousCommands: []
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

    it('download fails without url', async () => {
        const subject = new DownloadAction();

        await expect(subject.run(context(''))).rejects.not.toBeUndefined();
    });

    it('download failures do not fail action when configured', async () => {
        const expectedContext:any = {a: 'xyz'};

        mockRequest.mockRejectedValue({message: "some failure"});

        const subject = new DownloadAction();

        expectedContext.ExitOnDownloadFailure = false;
        expect(await subject.run(context('url', expectedContext))).toEqual(expectedContext);
        expectedContext.ExitOnDownloadFailure = 0;
        expect(await subject.run(context('url', expectedContext))).toEqual(expectedContext);
        expectedContext.ExitOnDownloadFailure = 'false';
        expect(await subject.run(context('url', expectedContext))).toEqual(expectedContext);
    });

    it('download failures fail action when configured', async () => {
        const failure = "some failure";

        mockRequest.mockRejectedValue({message: failure});

        const subject = new DownloadAction();

        await expect(subject.run(context('url', {
            ExitOnDownloadFailure: true
        }))).rejects.toMatch(/.*failure.*/);
        await expect(subject.run(context('url', {
            ExitOnDownloadFailure: 1
        }))).rejects.toMatch(/.*failure.*/);
        await expect(subject.run(context('url', {
            ExitOnDownloadFailure: "true"
        }))).rejects.toMatch(/.*failure.*/);
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

    it('download retry to max failures before failing action', async () => {
        const expectedRetries = 3;

        mockRequest.mockRejectedValue({});

        const subject = new DownloadAction();

        await expect(subject.run(context('url', {
            ExitOnDownloadFailure: true,
            RetryRequest: expectedRetries,
            RetryDelayMs: 0
        }))).rejects.not.toBeUndefined();
        expect(mockRequest.mock.calls.length).toEqual(expectedRetries+1);
    });

    it('download retry and invokes request', async () => {
        mockRequest.mockRejectedValueOnce({});
        mockRequest.mockRejectedValueOnce({});
        mockRequest.mockReturnValue(Promise.resolve({data:{pipe:jest.fn()}}));

        const subject = new DownloadAction();

        await subject.run(context('url', {
            ExitOnDownloadFailure: true,
            RetryRequest: 5,
            RetryDelayMs: 0
        }));
        expect(mockRequest.mock.calls.length).toEqual(3);
    });
});
