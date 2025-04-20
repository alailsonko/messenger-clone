#!/bin/bash

PORT=8080

kill_port() {
    PID=$(lsof -ti tcp:$PORT)
    if [[ -n "$PID" ]]; then
        echo "Killing process on port $PORT (PID $PID)"
        kill -9 $PID
    fi
}

run_bacon() {
    kill_port
    bacon run --headless &
    BACON_PID=$!
}

cleanup() {
    if [[ -n "$BACON_PID" ]]; then
        kill $BACON_PID 2>/dev/null
    fi
    exit 0
}
trap cleanup SIGINT SIGTERM

run_bacon

while inotifywait -r -e modify,create,delete ./src; do
    kill $BACON_PID 2>/dev/null
    wait $BACON_PID 2>/dev/null
    run_bacon
done
