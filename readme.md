# About
Simple web crawler to walk provided path, run xpath evaluations, and access target resources

## Usage
Install: `npm install -g`

Use with file: `web-crawler -f yourFile.yaml`

Alternatively, `npm install` and then `./web-crawler.js -f yourFile.yaml`

## Crawl Path
Define your sequential crawl path steps in yaml

### Fields
- `Get`: http get request
- `Evaluate`: define name/values where name is a variable you create and the value is an xpath expression to evaluate against a previous result
- `Then`: group a subsequent set of actions
- `Repeat`: number of times to repeat current level of actions

### Variables
Interpolate variables with curly braces, ex: `{myVariable}`

The variable `{Repeat}` is systematically provided and will evalute to 0, or the current iteration

### Samples
Output a text body from a news site
```
Get: https://www.cnn.com/
Evaluate:
  Top_Article: 
Get: {Article}
Then:
  Evaluate:
    Text:
  Print: {Text}
```

Download several NASA images of the day
```
Get: https://www.nasa.gov/multimedia/imagegallery/iotd.html
Then:
  Evaluate:
    Image: 
  Download: {Image}
  Repeat: 5
```
