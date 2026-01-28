FROM amazoncorretto:21-alpine

# Install Gatling
ENV GATLING_VERSION=3.10.3
ENV GATLING_HOME=/opt/gatling

RUN apk add --no-cache curl bash && \
    mkdir -p /opt && \
    curl -fsSL https://repo1.maven.org/maven2/io/gatling/highcharts/gatling-charts-highcharts-bundle/${GATLING_VERSION}/gatling-charts-highcharts-bundle-${GATLING_VERSION}-bundle.zip -o /tmp/gatling.zip && \
    unzip /tmp/gatling.zip -d /opt && \
    mv /opt/gatling-charts-highcharts-bundle-${GATLING_VERSION} ${GATLING_HOME} && \
    rm /tmp/gatling.zip && \
    chmod -R +x ${GATLING_HOME}/bin

# Copy configuration and simulations
COPY conf/ ${GATLING_HOME}/conf/
COPY simulations/ ${GATLING_HOME}/user-files/simulations/

WORKDIR ${GATLING_HOME}

# Default environment variables
ENV BASE_URL=http://messenger_server:8080
ENV TEST_TYPE=load
ENV TARGET_USERS=100
ENV TEST_DURATION=60

# Entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
