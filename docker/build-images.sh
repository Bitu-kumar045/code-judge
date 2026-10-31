#!/usr/bin/env bash
set -e

echo "🐳 Building Code Judge Sandboxed Runner Images..."

docker build -t codejudge-runner-python ./docker/python
docker build -t codejudge-runner-c ./docker/c
docker build -t codejudge-runner-cpp ./docker/cpp
docker build -t codejudge-runner-java ./docker/java

echo "✨ All 4 sandbox runner images built successfully!"
docker images | grep "codejudge-runner"

