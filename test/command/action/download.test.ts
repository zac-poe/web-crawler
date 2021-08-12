import { DownloadAction } from "../../../src/command/action/download";
import { Command } from "../../../src/command/command";
import { ActionContext } from "../../../src/command/action/action";
import axios from 'axios';

jest.mock('axios');

describe('download action', () => {
    const mockRequest:jest.Mock<any,any> = (axios.get as any);
    
    const context = (value: number): ActionContext => ({
        value: value,
        state: {},
        block: undefined as any
    });

    beforeEach(() => {
        mockRequest.mockClear();
    });

    it('has download command', () => {
        expect(new DownloadAction().getCommand()).toEqual(Command[Command.Download]);
    });
});
