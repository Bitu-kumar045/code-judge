# Hardened C++ Runner Sandbox
FROM alpine:3.19

# Install GCC/G++, musl-dev, and coreutils (for GNU timeout)
RUN apk add --no-cache g++ musl-dev coreutils

# Create unprivileged runner user
RUN addgroup -g 1000 sandbox && \
    adduser -u 1000 -G sandbox -D -s /bin/sh -h /home/sandbox sandbox

WORKDIR /sandbox

USER sandbox

ENTRYPOINT ["timeout", "-k", "0.2"]

