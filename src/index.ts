import * as cli from 'command-line-args';
import * as cli_usage from 'command-line-usage';

const options = [
    {name: 'help', alias: 'h', type: Boolean, description: 'display usage'},
    {name: 'file', alias: 'f', typeLabel: 'file', description: 'name of file containing crawler path'},
];
const usage = cli_usage([
    {header: "Web Crawler", content: "Accepts a path and walks it sequentially"},
    {header: "Options", optionList: options}
]);
const args = cli(options);

if(args.help || !args.file) {
    console.log(usage);
} else {
    console.log(args)
}
