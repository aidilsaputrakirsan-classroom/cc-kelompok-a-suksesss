#!/bin/bash
# Log helper script untuk debugging microservices
# Usage: ./scripts/logs.sh [command] [args]

case "$1" in
  all)
    echo "📋 Showing all service logs..."
    docker compose -f docker-compose.microservices.yml logs -f auth-service item-service gateway
    ;;
  errors)
    echo "❌ Showing ERROR logs only..."
    docker compose -f docker-compose.microservices.yml logs auth-service item-service gateway 2>&1 | grep '"level":"ERROR"'
    ;;
  trace)
    if [ -z "$2" ]; then
      echo "Usage: ./scripts/logs.sh trace <correlation-id>"
      exit 1
    fi
    echo "🔗 Tracing correlation ID: $2"
    docker compose -f docker-compose.microservices.yml logs auth-service item-service gateway 2>&1 | grep "$2"
    ;;
  metrics)
    echo "📊 Fetching metrics..."
    echo "--- Auth Service ---"
    curl -s http://localhost:8001/metrics | python3 -m json.tool
    echo ""
    echo "--- Item Service ---"
    curl -s http://localhost:8002/metrics | python3 -m json.tool
    ;;
  *)
    echo "Usage: ./scripts/logs.sh {all|errors|trace <id>|metrics}"
    ;;
esac