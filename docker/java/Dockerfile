# Hardened Java 17 Runner Sandbox
FROM eclipse-temurin:17-alpine

# Install coreutils for GNU timeout
RUN apk add --no-cache coreutils

# Create unprivileged runner user
RUN addgroup -g 1000 sandbox && \
    adduser -u 1000 -G sandbox -D -s /bin/sh -h /home/sandbox sandbox

WORKDIR /sandbox

USER sandbox

ENTRYPOINT ["timeout", "-k", "0.2"]
