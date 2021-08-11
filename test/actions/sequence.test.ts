import { SequenceAction } from "../../src/actions/sequence";
import { Command } from "../../src/actions/command";

describe('sequence action', () => {
    it('has sequence command', () => {
        expect(new SequenceAction().getCommand()).toEqual(Command[Command.Sequence]);
    });

    it('executes sequences', async () => {
    });

    it('executes sub sequences', async () => {
    });

    it('isolates sequences state', async () => {
    });
});
