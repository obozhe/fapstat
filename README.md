# Description

FAPSTAT - is a Fullstack Typescript project based on ReactJS, NestJS and MongoDB.

- JWT authorization with OTP (PassportJS)
- timezones handling (Luxon)
- mailing services (node-mailer)
- responsive and adaptive layout (Tailwind)
- flexible tables (Tanstack)
- HTTP Cache (SWR)

# How to launch the application

1. Start a MongoDB server.
1. Create .env file in the `backend` folder (see variables below).
1. Run `npm install` in the root folder.
1. Run `npm run dev` in the root folder.

## Required ENV variables

```
MONGO_URL=mongodb://<user>:<password>@<url>:<port>
JWT_SECRET=<JWT Secret>

MAILER_USER=<user for mail service>
MAILER_PASSWORD=<password for mail service>
MAILER_PORT=<port of mail service>
```
