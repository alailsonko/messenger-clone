package messenger

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._
import java.util.UUID

/**
 * Gatling Load Test Simulation for Messenger Clone API
 *
 * Test Scenarios:
 * 1. Smoke Test - Basic health check (10 users)
 * 2. Load Test - Normal load (100 users over 1 min)
 * 3. Stress Test - High load (500 users, ramp up)
 * 4. Spike Test - Sudden traffic spike
 * 5. Soak Test - Extended duration test
 */
class UserSimulation extends Simulation {

  // Configuration from environment variables with defaults
  val baseUrl = System.getenv().getOrDefault("BASE_URL", "http://messenger_server:8080")
  val testType = System.getenv().getOrDefault("TEST_TYPE", "load")
  val targetUsers = System.getenv().getOrDefault("TARGET_USERS", "100").toInt
  val testDuration = System.getenv().getOrDefault("TEST_DURATION", "60").toInt

  // HTTP Configuration
  val httpProtocol = http
    .baseUrl(baseUrl)
    .acceptHeader("application/json")
    .contentTypeHeader("application/json")
    .userAgentHeader("Gatling/LoadTest")
    .shareConnections

  // Feeder for random user data
  val userFeeder = Iterator.continually(Map(
    "userName" -> s"user_${UUID.randomUUID().toString.take(8)}",
    "userEmail" -> s"${UUID.randomUUID().toString.take(8)}@loadtest.com"
  ))

  // ============================================================
  // Request Definitions
  // ============================================================

  val createUser = exec(
    http("Create User")
      .post("/api/v1/users/")
      .body(StringBody("""{"name": "${userName}", "email": "${userEmail}"}""")).asJson
      .check(status.in(200, 201))
      .check(jsonPath("$.id").optional.saveAs("userId"))
  )

  val getAllUsers = exec(
    http("Get All Users")
      .get("/api/v1/users/")
      .queryParam("limit", "20")
      .queryParam("offset", "0")
      .check(status.is(200))
  )

  val getAllUsersPaginated = exec(
    http("Get Users Page 1")
      .get("/api/v1/users/?limit=20&offset=0")
      .check(status.is(200))
  ).pause(100.milliseconds)
    .exec(
      http("Get Users Page 2")
        .get("/api/v1/users/?limit=20&offset=20")
        .check(status.is(200))
    )

  val getUserById = exec(session => {
    val userId = session("userId").asOption[String].getOrElse("00000000-0000-0000-0000-000000000001")
    session.set("currentUserId", userId)
  }).exec(
    http("Get User By ID")
      .get("/api/v1/users/${currentUserId}")
      .check(status.in(200, 404))
  )

  val updateUser = exec(session => {
    val userId = session("userId").asOption[String].getOrElse("00000000-0000-0000-0000-000000000001")
    session.set("currentUserId", userId)
  }).exec(
    http("Update User")
      .put("/api/v1/users/${currentUserId}")
      .body(StringBody("""{"name": "Updated_${userName}"}""")).asJson
      .check(status.in(200, 404))
  )

  val deleteUser = exec(session => {
    val userId = session("userId").asOption[String].getOrElse("skip")
    session.set("currentUserId", userId)
  }).doIf(session => session("currentUserId").as[String] != "skip") {
    exec(
      http("Delete User")
        .delete("/api/v1/users/${currentUserId}")
        .check(status.in(200, 204, 404))
    )
  }

  // ============================================================
  // Scenarios
  // ============================================================

  // Full CRUD cycle
  val crudScenario = scenario("CRUD Operations")
    .feed(userFeeder)
    .exec(createUser)
    .pause(100.milliseconds, 500.milliseconds)
    .exec(getAllUsers)
    .pause(50.milliseconds, 200.milliseconds)
    .exec(getUserById)
    .pause(50.milliseconds, 200.milliseconds)
    .exec(updateUser)
    .pause(50.milliseconds, 200.milliseconds)
    .exec(deleteUser)

  // Read-heavy scenario (80% reads, 20% writes)
  val readHeavyScenario = scenario("Read Heavy Load")
    .feed(userFeeder)
    .randomSwitch(
      80.0 -> exec(getAllUsers),
      15.0 -> exec(getAllUsersPaginated),
      5.0 -> exec(createUser)
    )

  // Write-heavy scenario
  val writeHeavyScenario = scenario("Write Heavy Load")
    .feed(userFeeder)
    .exec(createUser)
    .pause(50.milliseconds)
    .doIf(session => session.contains("userId")) {
      exec(updateUser)
        .pause(50.milliseconds)
        .exec(deleteUser)
    }

  // Browse scenario (pagination test)
  val browseScenario = scenario("Browse Users")
    .exec(
      http("Browse Page 1").get("/api/v1/users/?limit=20&offset=0").check(status.is(200))
    ).pause(200.milliseconds)
    .exec(
      http("Browse Page 2").get("/api/v1/users/?limit=20&offset=20").check(status.is(200))
    ).pause(200.milliseconds)
    .exec(
      http("Browse Page 3").get("/api/v1/users/?limit=20&offset=40").check(status.is(200))
    ).pause(200.milliseconds)
    .exec(
      http("Browse Page 4").get("/api/v1/users/?limit=20&offset=60").check(status.is(200))
    )

  // ============================================================
  // Load Profiles based on test type
  // ============================================================

  val populationBuilders = testType match {
    case "smoke" => 
      crudScenario.inject(
        atOnceUsers(1),
        rampUsers(10).during(10.seconds)
      )
    
    case "load" =>
      crudScenario.inject(
        rampUsers(targetUsers).during(30.seconds),
        constantUsersPerSec(targetUsers.toDouble / 10).during(testDuration.seconds)
      )
    
    case "stress" =>
      crudScenario.inject(
        rampUsers(targetUsers / 2).during(30.seconds),
        constantUsersPerSec(targetUsers.toDouble / 5).during(60.seconds),
        rampUsers(targetUsers).during(30.seconds)
      )
    
    case "spike" =>
      crudScenario.inject(
        nothingFor(5.seconds),
        atOnceUsers(targetUsers / 2),
        nothingFor(10.seconds),
        atOnceUsers(targetUsers),
        nothingFor(10.seconds),
        rampUsers(targetUsers / 4).during(10.seconds)
      )
    
    case "soak" =>
      readHeavyScenario.inject(
        rampUsers(targetUsers / 4).during(60.seconds),
        constantUsersPerSec(targetUsers.toDouble / 10).during(testDuration.seconds)
      )
    
    case "pagination" =>
      browseScenario.inject(
        rampUsers(targetUsers).during(30.seconds),
        constantUsersPerSec(targetUsers.toDouble / 5).during(testDuration.seconds)
      )
    
    case "write" =>
      writeHeavyScenario.inject(
        rampUsers(targetUsers).during(30.seconds)
      )
    
    case "read" =>
      readHeavyScenario.inject(
        rampUsers(targetUsers).during(30.seconds)
      )
    
    case _ =>
      crudScenario.inject(
        rampUsers(targetUsers).during(30.seconds)
      )
  }

  setUp(populationBuilders)
    .protocols(httpProtocol)
    .assertions(
      global.responseTime.max.lt(5000),           // Max response time < 5s
      global.responseTime.percentile(95).lt(2000), // 95th percentile < 2s
      global.successfulRequests.percent.gt(95)    // > 95% success rate
    )
}
