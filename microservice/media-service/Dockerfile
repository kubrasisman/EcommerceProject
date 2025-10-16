FROM openjdk:17-jdk-slim

# Media dosyaları için klasör oluşturuluyor
RUN mkdir -p /media

WORKDIR /app

COPY target/media-service-0.0.1-SNAPSHOT.jar app.jar

# Spring Boot uygulamanı başlat
ENTRYPOINT ["java", "-jar", "app.jar"]
