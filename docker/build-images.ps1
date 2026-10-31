Write-Host "🐳 Building Code Judge Sandboxed Runner Images..." -ForegroundColor Cyan

docker build -t codejudge-runner-python ./docker/python
docker build -t codejudge-runner-c ./docker/c
docker build -t codejudge-runner-cpp ./docker/cpp
docker build -t codejudge-runner-java ./docker/java

Write-Host "✨ All 4 sandbox runner images built successfully!" -ForegroundColor Green
docker images | Select-String "codejudge-runner"

