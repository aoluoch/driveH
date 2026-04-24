# DriveHub — Email Templates

This folder contains all HTML email templates for the platform.

---

## Templates

| File | Purpose | Where to configure |
|---|---|---|
| `email-verification.html` | Sent when a user registers — they must click to verify | Appwrite Console |
| `password-recovery.html` | Sent when a user requests a password reset | Appwrite Console |
| `welcome.html` | Sent after the user's email is verified (onboarding) | Appwrite Function / external email service |

---

## How to apply templates in Appwrite Console

### Email Verification & Password Recovery

1. Open your **Appwrite Console** → select your project
2. Go to **Auth** → **Email Templates**
3. Select **Verification** or **Password Recovery**
4. Replace the default HTML with the contents of the corresponding file
5. Set the **Subject** line:
   - Verification: `Verify your email – DriveHub`
   - Recovery: `Reset your password – DriveHub`
6. Click **Update**

### Template variables (Appwrite-provided)

| Variable | Value |
|---|---|
| `{{project}}` | Your Appwrite project name |
| `{{user}}` | The user's display name |
| `{{redirect}}` | Full verification / recovery URL (includes `userId` and `secret`) |
| `{{token}}` | Raw token (available if needed) |

> **Note:** Appwrite automatically appends `?userId=...&secret=...` to the URL you passed in `account.createVerification()` / `account.createRecovery()`. The app's callback pages (`/verify-email` and `/reset-password`) read these params.

---

## Welcome email (custom send)

`welcome.html` is not sent by Appwrite natively. You have two options:

### Option A — Appwrite Function (recommended)
1. Create an Appwrite Function triggered by the `users.*.update` event
2. Filter for `emailVerification === true` (first time)
3. Use the function to call an email API (SendGrid, Mailgun, Resend, etc.)
4. Render `welcome.html` with `{{user}}` replaced by the user's name

### Option B — External service on login
After the user logs in for the first time (check a `welcomeSent` flag in prefs), call your email API directly from the client or via a serverless function.

### Replace URLs before sending
Update the CTA link in `welcome.html`:
```
https://drivehub.com/cars  →  your production domain
https://drivehub.com/contact  →  your production domain
```

---

## Brand reference

| Token | Value |
|---|---|
| Primary orange | `#FF5400` |
| Dark header | `#111827` |
| Body text | `#374151` |
| Muted text | `#6b7280` |
| Background | `#f4f4f5` |
| Card | `#ffffff` |
| Border | `#e5e7eb` |
