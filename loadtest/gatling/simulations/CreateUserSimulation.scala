package messenger

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._
import java.util.UUID

/**
 * Gatling Load Test Simulation - CreateUser Only
 *
 * This simulation focuses exclusively on testing the Create User endpoint
 * with high concurrency to measure write performance and database throughput.
 *
 * Test Configuration:
 *   - TARGET_USERS: Number of concurrent users (default: 5000)
 *   - TEST_DURATION: Duration in seconds (default: 120)
 *   - BASE_URL: Server URL (default: http://messenger_server:8080)
 *
 * Usage:
 *   LOADTEST_SIMULATION=CreateUserSimulation \
 *   LOADTEST_USERS=5000 \
 *   LOADTEST_DURATION=120 \
 *   docker compose -f docker.compose.yml --profile loadtest run --rm loadtest
 */
class CreateUserSimulation extends Simulation {

  // Configuration from environment variables with defaults
  val baseUrl = System.getenv().getOrDefault("BASE_URL", "http://messenger_server:8080")
  val targetUsers = System.getenv().getOrDefault("TARGET_USERS", "5000").toInt
  val testDuration = System.getenv().getOrDefault("TEST_DURATION", "120").toInt
  val rampDuration = System.getenv().getOrDefault("RAMP_DURATION", "30").toInt

  // HTTP Configuration optimized for high throughput
  val httpProtocol = http
    .baseUrl(baseUrl)
    .acceptHeader("application/json")
    .contentTypeHeader("application/json")
    .userAgentHeader("Gatling/CreateUserTest")
    .shareConnections // Share connections between virtual users for efficiency

  // Feeder for generating unique user data
  // Each virtual user gets unique data to avoid conflicts
  val userFeeder = Iterator.continually(Map(
    "firstName" -> s"User_${UUID.randomUUID().toString.take(8)}",
    "lastName" -> s"Test_${UUID.randomUUID().toString.take(8)}",
    "timestamp" -> System.currentTimeMillis()
  ))

  // ============================================================
  // Create User Request
  // ============================================================
  val createUser = feed(userFeeder).exec(
    http("Create User")
      .post("/api/v1/users/")
      .body(StringBody(
        """{
          |  "first_name": "${firstName}",
          |  "last_name": "${lastName}"
          |}""".stripMargin
      )).asJson
      .check(status.in(200, 201))
      .check(jsonPath("$.id").exists)
      .check(responseTimeInMillis.lte(5000)) // Fail if response > 5 seconds
  )

  // ============================================================
  // Scenario: Continuous Create Users
  // ============================================================
  // Each user continuously creates new users for the test duration
  val createUserScenario = scenario("Create User Load Test")
    .during(testDuration.seconds) {
      exec(createUser)
        .pause(10.milliseconds, 50.milliseconds) // Small pause between requests
    }

  // ============================================================
  // Scenario: Single Create Per User
  // ============================================================
  // Each virtual user creates exactly one user (good for measuring peak throughput)
  val singleCreateScenario = scenario("Single Create Per User")
    .exec(createUser)

  // ============================================================
  // Load Profile Setup
  // ============================================================
  setUp(
    // Continuous creation scenario
    createUserScenario.inject(
      // Ramp up to target users over ramp duration
      rampUsers(targetUsers).during(rampDuration.seconds)
    )
  ).protocols(httpProtocol)
    .assertions(
      // At least 95% of requests should succeed
      global.successfulRequests.percent.gte(95.0),
      // 95th percentile response time should be under 2 seconds
      global.responseTime.percentile(95).lt(2000),
      // Max response time should be under 5 seconds
      global.responseTime.max.lt(5000)
    )
}

/**
 * Alternative simulation for burst/spike testing
 * Injects all users at once to test peak capacity
 */
class CreateUserBurstSimulation extends Simulation {

  val baseUrl = System.getenv().getOrDefault("BASE_URL", "http://messenger_server:8080")
  val targetUsers = System.getenv().getOrDefault("TARGET_USERS", "5000").toInt

  val httpProtocol = http
    .baseUrl(baseUrl)
    .acceptHeader("application/json")
    .contentTypeHeader("application/json")
    .userAgentHeader("Gatling/CreateUserBurst")
    .shareConnections

  val userFeeder = Iterator.continually(Map(
    "firstName" -> s"Burst_${UUID.randomUUID().toString.take(8)}",
    "lastName" -> s"Test_${UUID.randomUUID().toString.take(8)}"
  ))

  val createUser = feed(userFeeder).exec(
    http("Create User (Burst)")
      .post("/api/v1/users/")
      .body(StringBody(
        """{
          |  "firstName": "${firstName}",
          |  "lastName": "${lastName}"
          |}""".stripMargin
      )).asJson
      .check(status.in(200, 201))
  )

  // Each user creates one user, all injected at once
  val burstScenario = scenario("Burst Create Users")
    .exec(createUser)

  setUp(
    burstScenario.inject(
      atOnceUsers(targetUsers) // Inject all users simultaneously
    )
  ).protocols(httpProtocol)
    .assertions(
      global.successfulRequests.percent.gte(90.0)
    )
}

/**
 * Sustained load simulation
 * Maintains constant request rate for extended period
 */
class CreateUserSustainedSimulation extends Simulation {

  val baseUrl = System.getenv().getOrDefault("BASE_URL", "http://messenger_server:8080")
  val requestsPerSecond = System.getenv().getOrDefault("REQUESTS_PER_SECOND", "1000").toInt
  val testDuration = System.getenv().getOrDefault("TEST_DURATION", "300").toInt // 5 minutes default

  val httpProtocol = http
    .baseUrl(baseUrl)
    .acceptHeader("application/json")
    .contentTypeHeader("application/json")
    .userAgentHeader("Gatling/CreateUserSustained")
    .shareConnections

  val userFeeder = Iterator.continually(Map(
    "firstName" -> s"Sustained_${UUID.randomUUID().toString.take(8)}",
    "lastName" -> s"Test_${UUID.randomUUID().toString.take(8)}"
  ))

  val createUser = feed(userFeeder).exec(
    http("Create User (Sustained)")
      .post("/api/v1/users/")
      .body(StringBody(
        """{
          |  "firstName": "${firstName}",
          |  "lastName": "${lastName}"
          |}""".stripMargin
      )).asJson
      .check(status.in(200, 201))
  )

  val sustainedScenario = scenario("Sustained Create Users")
    .exec(createUser)

  setUp(
    sustainedScenario.inject(
      constantUsersPerSec(requestsPerSecond).during(testDuration.seconds)
    )
  ).protocols(httpProtocol)
    .assertions(
      global.successfulRequests.percent.gte(99.0),
      global.responseTime.percentile(99).lt(1000)
    )
}
