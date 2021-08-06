import * as cli from 'command-line-args';
import * as cli_usage from 'command-line-usage';

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
    readonly arguments;
    readonly isValid: boolean;

    constructor() {
        const usageMessage = cli_usage(this.usage);

        this.arguments = cli(this.options);

        this.isValid = !!(!this.arguments.help && this.arguments.file);

        if(!this.isValid) {
            console.log(usageMessage);
        }
    }
}
