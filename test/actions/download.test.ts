import { DownloadAction } from "../../src/actions/download";
import { Command } from "../../src/actions/command";
import axios from 'axios';

jest.mock('axios');

describe('download action', () => {
    const mockRequest:jest.Mock<any,any> = (axios.get as any);

    beforeEach(() => {
        mockRequest.mockClear();
    });

    it('has download command', () => {
        expect(new DownloadAction().getCommand()).toEqual(Command[Command.Download]);
    });
});
