# Firebase Service Account Setup

## Important Security Notice

Never commit your actual `serviceAccount.json` file to version control as it contains sensitive authentication credentials.

## Setup Instructions

1. **Get your service account key:**

   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Select your project (`di-swap`)
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download the JSON file

2. **Setup the file:**

   - Copy `serviceAccount.template.json` to `serviceAccount.json`
   - Replace the template content with your actual service account JSON

3. **Verify the file is ignored:**
   - The `serviceAccount.json` file should already be in `.gitignore`
   - Run `git status` to ensure it's not tracked

## Environment Variables (Alternative)

For production environments, consider using environment variables instead:

- `GOOGLE_APPLICATION_CREDENTIALS`: Path to service account file
- Or individual environment variables for each field

## File Structure

```
src/firestore/
├── serviceAccount.template.json  ← Template (committed)
├── serviceAccount.json          ← Your actual credentials (ignored)
└── README.md                    ← This file
```
