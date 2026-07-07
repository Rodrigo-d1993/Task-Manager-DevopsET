# ---------- Etapa 1: Build ----------
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copiamos primero el pom.xml para aprovechar cache de dependencias
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiamos el código fuente y compilamos
COPY src ./src
RUN mvn clean package -DskipTests -B

# ---------- Etapa 2: Runtime ----------
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Usuario no-root por buenas prácticas de seguridad
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY --from=builder /app/target/task-manager.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
