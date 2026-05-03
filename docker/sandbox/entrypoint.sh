#!/bin/sh

# ===========================
# Sandbox Container Entrypoint
# ===========================

# Set resource limits
ulimit -t 60        # CPU time limit: 60 seconds
ulimit -v 512000    # Virtual memory limit: 512MB
ulimit -n 100       # Max open files: 100

# Print welcome message
echo "================================"
echo "  Welcome to Cloud Terminal"
echo "  Your isolated sandbox is ready"
echo "================================"
echo ""

# Start bash shell
exec "$@"