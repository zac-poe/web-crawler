# About
Simple web crawler to walk provided path, run xpath evaluations, and access target resources

## Usage
Install: `npm install -g`

Use with file: `web-crawler -f yourFile.yaml`

Alternatively, `npm install` and then `./web-crawler.js -f yourFile.yaml`

## Yaml File
Define your sequential crawler commands in yaml

### Commands
- `Sequence`: list of commands - provides ability to sequentially issue multiple comands of the same type
- `Get`: http get request
- `Download`: saves target resource
- `Evaluate`: define name/values where name is a variable you create and the value is an xpath expression to evaluate against a previous result
- `Print`: write value to standard out
- `Repeat`: number of times to repeat current level of actions

### Variables
Interpolate variables with curly braces, ex: `{myVariable}`

The following variables are systematically provided:
- `{Get}`: result of last Get operation
- `{Repeat}` the number of the current Repeat iteration, 0 indexed

The Sequence blocks define a new nested variable scope, inheriting any existing variables.

### Samples
Output some lorem ipsum
```
Get: https://baconipsum.com/api/?type=meat-and-filler&format=text
Print: {Get}
```

Output a html body from a news site
```
Sequence:
  - Get: https://www.cnn.com/
    Evaluate:
      Top_Article: 
  - Get: {Article}
    Evaluate:
      Body:
    Print: {Body}
```

Download several NASA images of the day
```
Get: https://www.nasa.gov/multimedia/imagegallery/iotd.html
Sequence:
  - Evaluate:
      Image: 
    Download: {Image}
    Repeat: 5
```
