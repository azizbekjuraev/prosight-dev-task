Prosight Backend Test Task

Simple NestJS API implementing /locus endpoint using the RNACentral public PostgreSQL database.

Stack

NestJS

TypeScript

TypeORM

PostgreSQL

JWT authentication

Swagger


Setup

Install dependencies:

npm install

Create .env from example:

cp .env.example .env

Start the app:

npm run start:dev

Swagger docs:

http://localhost:3000/api/docs
Login
POST /auth/login

Example:

{
  "username": "admin",
  "password": "Admin@Secure#2024"
}

Users available:

username	role
admin	full access
normal	no sideloading
limited	restricted regions

Use the returned token:

Authorization: Bearer <token>
Endpoint
GET /locus

Returns locus data from RNACentral.

Examples:

/locus
/locus?membershipStatus=highlighted
/locus?regionId=85682522
/locus?sideloading=locusMembers

Pagination:

/locus?page=1&limit=100

Default limit: 1000

Sorting example:

/locus?sortBy=memberCount&sortOrder=desc
Tests

Run tests:

npm test

Run e2e tests:

npm run test:e2e

Just a kind reminder:

"urs_taxid"" in the task example located in the rnc_locus table, but it was inside the rnc_locus_members table.
