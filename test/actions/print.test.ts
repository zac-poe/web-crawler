import { PrintAction } from "../../src/actions/print";
import { Command } from "../../src/actions/command";

describe('print action', () => {
    it('has print command', () => {
        expect(new PrintAction().getCommand()).toEqual(Command[Command.Print]);
    });
});
