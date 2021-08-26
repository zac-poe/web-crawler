#!/bin/bash

while read file; do
    echo "$file"
    diff \
        <(sed '1,/behavior/ d' "$file" | sed s'/^# //g') \
        <(./web-crawler.js -f "$file")
    if [[ $? -ne 0 ]]; then
        echo "Behavior test failed!"
        exit 1
    fi
done < <(find 'samples/behavior/' -type f)
