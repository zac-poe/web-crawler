import { CommandLine } from './command-line';
import { FileReader } from './file-reader';
import { ActionFactory } from './actions/action-factory';
import { Sequencer } from './sequencer';

const cli = new CommandLine();

if(cli.isValid) {
    const isVerbose = cli.arguments.verbose;
    
    new Sequencer(new ActionFactory(isVerbose).run, isVerbose)
        .run(new FileReader(cli.arguments.file).content);
}
