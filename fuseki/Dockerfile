# Apache's standalone Fuseki Main artifact; deliberately no public admin UI.
FROM eclipse-temurin:21-jre-alpine
ARG JENA_VERSION=6.2.0
ARG FUSEKI_SHA512=59c5d0fd4e3f2c51819816dd178ee7d619552aae12400286338cc55c6955653e6c503d58b6cb12f3124407c903a81a2ecf4a9b0d5ba8028e7fcdc7c5c98710d4
WORKDIR /opt/fuseki
RUN wget -q -O fuseki.jar \
      "https://repo.maven.apache.org/maven2/org/apache/jena/jena-fuseki-server/${JENA_VERSION}/jena-fuseki-server-${JENA_VERSION}.jar" \
    && printf '%s  fuseki.jar\n' "$FUSEKI_SHA512" | sha512sum --check - \
    && adduser -D -u 10001 fuseki \
    && mkdir -p /fuseki/databases && chown -R fuseki:fuseki /fuseki
COPY config.ttl /opt/fuseki/config.ttl
USER fuseki
ENV JAVA_TOOL_OPTIONS="-Xmx512m"
EXPOSE 3030
HEALTHCHECK --interval=15s --timeout=5s --start-period=40s CMD wget -q -O /dev/null http://localhost:3030/\$/ping || exit 1
ENTRYPOINT ["java", "-cp", "/opt/fuseki/fuseki.jar", "org.apache.jena.fuseki.main.cmds.FusekiMainCmd", "--config=/opt/fuseki/config.ttl", "--port=3030", "--ping"]
