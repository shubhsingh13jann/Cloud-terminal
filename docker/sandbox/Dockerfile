# Minimal Alpine Linux base image
FROM alpine:3.19

# Install essential tools users might need
RUN apk add --no-cache \
    bash \
    curl \
    wget \
    git \
    vim \
    nano \
    python3 \
    py3-pip \
    nodejs \
    npm \
    gcc \
    g++ \
    make \
    && rm -rf /var/cache/apk/*

# Create a non-root user for security
RUN addgroup -S sandboxgroup && \
    adduser -S sandboxuser -G sandboxgroup

# Create working directory
RUN mkdir -p /home/sandboxuser/workspace && \
    chown -R sandboxuser:sandboxgroup /home/sandboxuser

# Switch to non-root user
USER sandboxuser

# Set working directory
WORKDIR /home/sandboxuser/workspace

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh

# Default command
CMD ["/bin/bash"]