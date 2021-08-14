import { CommandLine } from './command-line';
import { FileReader } from './file-reader';
import { CommandBlock } from './command/command-block';
import { logger } from './logger';

const cli = new CommandLine();

if(cli.isValid) {
    logger.silent = !cli.arguments.verbose;
    
    new FileReader(cli.arguments.file).getContent()
    .then((content: any) => new CommandBlock(content).resolve())
    .catch(e => {
        logger.error(e);
        logger.error("Error: Failed to complete provided commands!")
        process.exitCode = 1;
    });
}
