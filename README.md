# springboot-react-car-booking-system
A full-stack car booking system built with Spring Boot and React, featuring car listings, user booking management, authentication, and an admin dashboard.

## Backend secrets

Do not commit real passwords, JWT secrets, or AWS keys. Set these as environment variables before running the Spring Boot backend:

- `JWT_SECRET` - required, at least 32 bytes
- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `AWS_S3_BUCKET`
- `AWS_S3_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
