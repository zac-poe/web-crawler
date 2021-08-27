#!/bin/bash

echo "Beginning end to end tests..."

while read file; do
    echo -e "\t$file"
    diff \
        <(sed '1,/behavior/ d' "$file" | sed s'/^# //g') \
        <(./web-crawler.js -f "$file")
    if [[ $? -ne 0 ]]; then
        echo "Behavior test FAILED!"
        exit 1
    fi
done < <(find 'samples/behavior/' -type f)

echo "End to end tests PASSED"
