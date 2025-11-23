FROM maven:3.8.3-openjdk-17 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar .


ENTRYPOINT ["sh", "-c", "java -jar /app/backend-0.0.1-SNAPSHOT.jar --server.port=$PORT"]