#!/bin/bash
# Sharding Load Test Script
# Tests the sharded API with concurrent user creation

API_URL="http://localhost:8082"

echo "=========================================="
echo "       SHARDING LOAD TEST"
echo "=========================================="
echo ""

# Check health
echo "1. Checking server health..."
health=$(curl -s $API_URL/health)
echo "   Health: $health"
echo ""

# Check initial stats
echo "2. Initial Shard Statistics:"
curl -s $API_URL/api/shards/stats | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(f\"   Total users: {data['total_users']}\")
for shard in data['shards']:
    print(f\"   {shard['shard_name']}: {shard['user_count']} users\")
"
echo ""

# Create users
echo "3. Creating 500 users..."
start_time=$(python3 -c "import time; print(time.time())")

for i in $(seq 1 500); do
    curl -s -X POST $API_URL/api/users \
        -H "Content-Type: application/json" \
        -d "{\"first_name\":\"LoadTest\",\"last_name\":\"User$i\"}" > /dev/null
    
    if [ $((i % 100)) -eq 0 ]; then
        echo "   Created $i users..."
    fi
done

end_time=$(python3 -c "import time; print(time.time())")
duration=$(python3 -c "print(f'{$end_time - $start_time:.2f}')")
rate=$(python3 -c "print(f'{500 / ($end_time - $start_time):.2f}')")

echo ""
echo "4. Load Test Results:"
echo "   Duration: $duration seconds"
echo "   Throughput: $rate requests/sec"
echo ""

# Check final stats
echo "5. Final Shard Distribution:"
curl -s $API_URL/api/shards/stats | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(f\"   Total users: {data['total_users']}\")
total = data['total_users']
for shard in data['shards']:
    pct = (shard['user_count'] / total * 100) if total > 0 else 0
    bar = '█' * int(pct / 2) + '░' * (50 - int(pct / 2))
    print(f\"   {shard['shard_name']}: {shard['user_count']:5d} ({pct:5.1f}%) |{bar}|\")
"
echo ""
echo "=========================================="
echo "       LOAD TEST COMPLETE"
echo "=========================================="
