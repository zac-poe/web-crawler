# About
Simple web crawler to walk a provided path, running xpath evaluations and accessing target resources

## Usage
Install: `npm install -g`

Use with file: `web-crawler -f yourFile.yaml`

Alternatively, `npm install` and then `./web-crawler.js -f yourFile.yaml`

## Options
`web-crawler --help` to get a comprehensive list of command line options

## Yaml File
Define your sequential crawler commands in yaml

### Commands
- `Commands`: list of commands - provides ability to list multiple comands of the same type, as well defines as a grouping for use with Repeat
- `Request`: http request with either the string URL for a simple GET -OR- the following structure:
  - `Method`: http request method
  - `URL`: required, the URL to make the request against
  - `Body`: optionally include a value to send with your request
- `Download`: saves target resource
- `Evaluate`: define name/values where name is a variable you create and the value is an xpath expression to evaluate against a previous result
- `Set`: define name/values similar to evaluate, but value will be the literal provided
- `Print`: write value to standard out
- `Repeat`: number of times to rerun prior Commands - Repeat: 1 means commands will run a total of 2 times

### Variables
Interpolate variables with angle brackets, ex: `<myVariable>`

The following variables are systematically provided:
- `<Request>`: result of last Request operation
- `<Repeat>` the number of the current Repeat iteration, starting with 1

If you so choose, you can overwrite the systematically provided values with an `Evaluate` block.

Each Commands blocks define a new nested variable scope, inheriting any existing variables, as well as resetting Repeat to 1.

#### Configuration
Additional systematically provided variables are used for configuration. The values below can be reassigned as desired, following the same nested scope described above.

- `<ExitOnRequestFailure>`=true : fail the webcrawler if a Request fails
- `<ExitOnDownloadFailure>`=false : fail the webcrawler if a Download fails
- `<RetryRequest>`=0 : attempts to retry any Request (or Download)

### Samples
- Basic command behavior: [behavior](samples/behavior/)
- Output some lorem ipsum: [lorem-ipsum.yaml](samples/lorem-ipsum.yaml)
- Output a html body from a news site: [news.yaml](samples/news.yaml)
- Download several NASA images of the day [nasa-iotd.yaml](samples/nasa-iotd.yaml)

## XPath Resources
- http://xpather.com/
- https://devhints.io/xpath
