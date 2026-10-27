# Paisa Pani — Step 1 frontend cleanup

This archive contains the frontend cleanup pass discussed with ChatGPT.

## Changes
- Removed seeded sample expenses; the app starts with an empty expense list.
- Removed default `Our Family` and `Office` groups; legacy demo group IDs are filtered from browser storage.
- Reworked the home dashboard greeting to use the authenticated user's name.
- Added polished empty states and a midnight/indigo/emerald visual treatment.
- Removed hardcoded group-member lists and invite-code claims from the group-management UI.
- Replaced hardcoded profile defaults with the signed-in Cognito account details.
- Removed the hardcoded payer dropdown and use the signed-in user for personal expense entries.
- Group expense creation is intentionally blocked until the backend supports group authorization.

## Validation
- `npm run typecheck` passed in the working environment.
- `npm run build` could not complete in the Linux working environment because the uploaded Windows `node_modules` did not contain Rollup's Linux optional native package. This is an environment/dependency packaging issue, not a TypeScript error.

## Important
This is an intermediate frontend cleanup only. Groups created in this phase are still stored in browser localStorage, not RDS. Profile editing and email invitations are not yet connected to backend APIs. The next phase should implement real group/profile endpoints and then connect the UI.

Run `npm ci`, `npm run typecheck`, and `npm run build` in your own project environment before deploying.
