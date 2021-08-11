import { CommandLine } from './command-line';
import { FileReader } from './file-reader';
import { Block } from './block';
import { logger } from './logger';

const cli = new CommandLine();

if(cli.isValid) {
    logger.silent = !cli.arguments.verbose;
    
    new Block(new FileReader(cli.arguments.file).content).resolve();
}
