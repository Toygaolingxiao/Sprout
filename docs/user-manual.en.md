# Sprout User Manual

Last Updated: 2026-05-01
Target: End users (task sharing for TTC, pregnancy, postpartum, and childcare)

## 1. What You Can Do

- Manage checklists for TTC, pregnancy, postpartum, and childcare
- Check upcoming tasks and toggle complete/incomplete status
- Share the same tasks with partner/family (invite, join, leave)
- Filter tasks by women/men/shared target
- Reapply templates (High/Medium/Low) and bulk-manage custom tasks
- Check Google/LINE link status and manage linking in Settings
- Manage profile, schedule, appearance, and language from one settings page
- Check simplified release notes from Settings

## 2. Before You Start

- Browser on PC or smartphone
- Internet connection
- Email address, Google account, or LINE account

Notes:
- During Google/LINE login, Sprout does not store passwords from those services.

## 3. Sign Up and Log In

### 3.1 Sign Up with Email

1. Open the Sign Up page.
2. Enter nickname, email address, and password (8+ characters).
3. Tap "Create account".
4. Registration is complete once you land on the dashboard.

### 3.2 Sign Up / Log In with Google or LINE

1. On Login or Sign Up page, tap "Continue with Google" or "Continue with LINE".
2. Complete provider authentication flow.
3. Done when redirected to the dashboard.

Notes:
- LINE login may fail if environment settings are incomplete (provider name, redirect URL, OIDC settings, etc.).
- If it fails, follow the on-screen error message and review settings.

## 4. Initial Setup (Settings Page)

1. Open Settings.
2. In "Profile and schedule", input the required information.
3. Tap "Save".

Input items:
- Life stage
- Planned pregnancy timing (for TTC stage)
- Due date (for pregnancy/postpartum stages)
- Baby gender
- Your gender

## 5. Family Sharing (Connect Two Accounts)

### 5.1 How Sharing Works

- The first account becomes the family group owner.
- Only the owner can create invite links.
- Invite links are valid for 7 days.

### 5.2 Connection Steps

1. First user opens Family page.
2. Tap "Generate invite link".
3. Copy the generated link and share it with the second user.
4. Second user logs in with another account.
5. Second user opens the invite link and taps "Join family group".
6. Setup is complete when both users appear in the same member list.

### 5.3 Leave Family Group

1. Open leave section on Family page.
2. Enter confirmation text `LEAVE`.
3. Tap "Leave now".

Notes:
- If the last member leaves, the family group is deleted automatically.

## 6. How to Use Checklists

### 6.1 Select Stage

1. Open target stage on Checklist page.
2. Use top tabs to switch stages.

### 6.2 Complete Tasks

- Tap the checkbox on the left side of a task to complete.
- Tap again to set it back to incomplete.

### 6.3 View Task Details

- Tap "Show key points and cautions" to expand details.
- URLs in tips can be opened as links.

### 6.4 Filters

- Category filter (Procedures / Shopping / Health / Finance / Other)
- Gender filter (All / For women / For men)

### 6.5 Template Management

1. Open "Templates" section in Settings.
2. Select priority to reapply (High / Medium / Low).
3. Tap "Reapply templates".

Notes:
- Reapply targets only default template items and keeps custom tasks.

### 6.6 Bulk Delete Custom Tasks

- "Delete custom tasks in this stage": remove custom tasks only in current stage
- "Delete custom tasks in all stages": remove custom tasks across all stages

## 7. Settings Sections

- Profile and schedule: edit base profile and date settings
- Display: switch language, theme, and text size
- Templates: reapply templates and bulk-delete custom tasks
- App info: version, manual, and simplified release notes
- Account: provider links, email update, password change, logout
- Sensitive actions: account deletion (requires `DELETE` confirmation)

## 8. Switch Language

1. Open Settings.
2. In Language, choose Japanese, Simplified Chinese, or English.
3. UI text updates immediately.

## 9. Common Troubles

### 9.1 Invite Link Does Not Work

- Check if 7-day validity has expired.
- Check if the link has already been used.
- Ask owner to generate a new invite link.

### 9.2 Google / LINE Login Fails

- Retry after a short wait.
- Confirm browser cookies are enabled.
- Follow setup hint shown in error messages (provider name, redirect URL, etc.).

### 9.3 Tasks Are Not Displayed

- Confirm selected stage is correct.
- Use "Reapply templates" to restore default items.
- Reload the page.

## 10. Basic Security Practices

- Prefer Google / LINE login when possible.
- Use strong, unique passwords for email login.
- Always log out on shared/public devices.
- Share invite links only with trusted people.
- Double-check confirmation text before leave/delete actions.

## 11. Changelog Notes

- 2026-05-01: Added full English support for core UI and documentation
- 2026-04-30: Reflected 1.9.x updates (provider link management, settings IA refresh, family leave, safer actions)
- 2026-04-16: Initial version
