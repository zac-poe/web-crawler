import { CommandLine } from './command-line';
import { FileReader } from './file-reader';
import { Crawler } from './crawler';

const cli = new CommandLine();

if(cli.isValid) {
    new Crawler(new FileReader(cli.arguments.file).content).walk();
}
