import { CommandLine } from './command-line';
import { FileReader } from './file-reader';
import { CommandBlock } from './command/command-block';
import { logger } from './logger';

const cli = new CommandLine();

if(cli.isValid) {
    logger.silent = !cli.arguments.verbose;
    
    new CommandBlock(new FileReader(cli.arguments.file).content)
        .resolve()
        .catch(e => console.error(e));
}
