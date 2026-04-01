# Servify Release Checklist

## Environment Setup

- Configure [backend/.env.example](C:/Users/ashut/OneDrive/Desktop/Servify/backend/.env.example) as `backend/.env`
- Configure [mobile-app/.env.example](C:/Users/ashut/OneDrive/Desktop/Servify/mobile-app/.env.example) as `mobile-app/.env`
- Configure [admin-dashboard/.env.example](C:/Users/ashut/OneDrive/Desktop/Servify/admin-dashboard/.env.example) as `admin-dashboard/.env`

## Credentials

- MongoDB connection string set
- JWT secret and refresh secret set
- Razorpay key ID and key secret set
- Firebase project ID, client email, and private key set
- Google Maps API key set

## Backend

- Run seed script if needed: `npm --workspace backend run seed`
- Confirm `/health` returns success
- Confirm admin login works with seeded admin account

## Mobile

- Build Expo development client
- Configure EAS project values in [mobile-app/app.json](C:/Users/ashut/OneDrive/Desktop/Servify/mobile-app/app.json)
- Verify push permissions on a physical device
- Verify Razorpay checkout on a physical device

## Docker

- Run `docker compose up --build`
- Confirm MongoDB, backend, and admin health checks pass
- Confirm backend logs and uploads volumes persist

## Admin Dashboard

- Login with admin credentials
- Verify user moderation, provider approval, service CRUD, booking filters, and payment history

## Final QA

- Run backend tests
- Build admin dashboard
- Verify booking flow end-to-end
- Verify payment success and failure flows
- Verify test push notification delivery
