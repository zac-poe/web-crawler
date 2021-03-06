import command_line_args from 'command-line-args';
import command_line_usage from 'command-line-usage';

export class CommandLine {
    private readonly options = [
        {name: 'help', alias: 'h', type: Boolean, description: 'display usage'},
        {name: 'file', alias: 'f', typeLabel: 'file', description: 'name of yaml file containing crawler path'},
        {name: 'verbose', alias: 'v', type: Boolean, description: 'write all results to standard out during execution'},
    ];
    private readonly usage = [
        {header: "Web Crawler", content: "Accepts a path and walks it sequentially"},
        {header: "Options", optionList: this.options},
    ];
    readonly arguments: any;
    readonly isValid: boolean;

    constructor() {
        const usageMessage = command_line_usage(this.usage);

        try {
            this.arguments = command_line_args(this.options);
            this.isValid = !!(!this.arguments.help && this.arguments.file);
        } catch(e) {
            this.isValid = false;
            this.arguments = {};
        }

        if(!this.isValid) {
            process.stdout.write(usageMessage + '\n');
        }
    }
}
