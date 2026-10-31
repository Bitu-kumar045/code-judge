# Hardened Python 3 Sandbox Runner
FROM python:3.11-alpine

# Install coreutils for GNU timeout
RUN apk add --no-cache coreutils

# Create non-root unprivileged runner user
RUN addgroup -g 1000 sandbox && \
    adduser -u 1000 -G sandbox -D -s /bin/sh -h /home/sandbox sandbox

WORKDIR /sandbox

# Restrict root directory and switch to unprivileged user
USER sandbox

# Default entrypoint wrapper
ENTRYPOINT ["timeout", "-k", "0.2"]
