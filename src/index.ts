import { CommandLine } from './command-line'

const cli = new CommandLine()

if(cli.isValid) {
    console.log(cli.arguments)
}
