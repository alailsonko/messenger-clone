#!/bin/bash
set -e

# Default simulation class
SIMULATION=${SIMULATION:-"messenger.UserSimulation"}

echo "========================================"
echo "  Gatling Load Test Runner"
echo "========================================"
echo "  Base URL:     ${BASE_URL}"
echo "  Test Type:    ${TEST_TYPE}"
echo "  Simulation:   ${SIMULATION}"
echo "  Target Users: ${TARGET_USERS}"
echo "  Duration:     ${TEST_DURATION}s"
echo "========================================"

# Wait for the server to be ready
echo "Waiting for server to be ready..."
for i in {1..60}; do
    if curl -sf "${BASE_URL}/health" > /dev/null 2>&1; then
        echo "Server is ready!"
        break
    fi
    if [ $i -eq 60 ]; then
        echo "Warning: Server may not be ready, proceeding anyway..."
    else
        echo "Attempt $i/60: Server not ready, waiting..."
        sleep 2
    fi
done

# Run Gatling in batch mode (non-interactive)
echo "Starting Gatling simulation..."
echo "DEBUG: Running: gatling.sh -s ${SIMULATION} --run-mode local"
exec ${GATLING_HOME}/bin/gatling.sh \
    -s "${SIMULATION}" \
    --run-description "Messenger API Load Test - ${TEST_TYPE}" \
    --results-folder /results \
    --run-mode local
