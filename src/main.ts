import { CommandLine } from './command-line';
import { FileReader } from './file-reader';
import { CommandBlock } from './command/command-block';
import { logger } from './logger';

const cli = new CommandLine();

if(cli.isValid) {
    logger.silent = !cli.arguments.verbose;
    
    new CommandBlock(new FileReader(cli.arguments.file).content)
        .resolve()
        .catch(e => {
            logger.error("Web crawler failed to complete provided commands!")
            logger.error(e);
            process.exitCode = 1;
        });
}
