# Documentation Audit Findings

Reference file for fixing docs. Delete after all fixes are applied.

---

## 1. CRITICAL API FIXES (api/page.mdx)

### 1a. Rollback endpoint field names are WRONG
- Docs: `{ "channelName": "production", "platform": "ios" }`
- Actual: `{ "runtimeVersion": "1.0.0", "platform": "ios", "channel": "production", "rollbackToUpdateId": 123 }`
- `channelName` → `channel`
- `runtimeVersion` is REQUIRED but missing from docs
- `rollbackToUpdateId` is optional but missing from docs (allows rollback to specific update, not just embedded)

### 1b. Flag rule creation payload field name is WRONG
- Docs: `"variationId": 1`
- Actual: `"variantValue": "true"` (sends the value, not an ID)

### 1c. Webhook creation payload field name is WRONG
- Docs: `"enabled": true`
- Actual: no `enabled` field on create. Record uses `isActive`. Patch uses `isActive`.
- Also: `secret` field exists on create but not documented

### 1d. Publish build payload missing fields
- Docs: `{ channel, rolloutPercentage }`
- Actual: `{ channel, rolloutPercentage, isCritical, releaseMessage, groupId, linkedFlags }`
- `linkedFlags` is `{ flagId: number; enabled: boolean }[]`

### 1e. Create flag payload missing `variations` field
- Actual: `variations?: { name: string; value: string }[]`

### 1f. User override create payload missing `note` field
- Actual: `{ userId, branchName, note? }`

### 1g. Segment condition response uses `valuesJson` not `values`

### 1h. Republish endpoint payload undocumented
- `POST /v1/ota/updates/{id}/republish` sends `{ channels?: string[], releaseMessage?: string }`
- Returns `{ updates: [...], groupId }`

### 1i. Segment response extra fields undocumented
- `projectId`, `estimatedDevices`, `updatedAt`, `conditions` with `id`, `segmentId`, `sortOrder`

---

## 2. TERMINOLOGY ALIGNMENT

These are the terms used in the actual app UI vs docs. Docs should match the app.

| App UI Term | Current Docs Term | Decision needed |
|-------------|-------------------|-----------------|
| "Releases" (sidebar, headers) | "Updates" (section title) | DECISION: Use "Releases" in docs, note OTA updates = releases |
| "Ship to production" (button) | "Publish" (docs) | Keep "publish" in docs (technical term) |
| "Dispatch" (product name in UI) | "AppDispatch" (docs) | Keep "AppDispatch" in docs |
| "Linked Feature Flags" / "linked flags" | "Release flags" | DECISION: Align to "linked flags" |
| "Pre-release state" (rollback target) | "Global flag state" | DECISION: Align to "pre-release state" |
| "User Targeting" (settings tab) | "User Overrides" (docs) | Keep "user overrides" in docs |
| "Auto-rollback" (threshold action) | "Rollback" | DECISION: Add "auto-rollback" term |
| "Attribute match" (rule type label) | "Attribute rules" | Minor, keep docs term |
| `dispatchOTA/cli` (actual GitHub org) | `AppDispatch/cli` (docs) | DECISION: Keep AppDispatch/cli (app is outdated) |
| `dispatch-aarch64-apple-darwin` (binary) | `dispatch-darwin-arm64` (docs) | DECISION: Keep dispatch-darwin-arm64 (app is outdated) |
| "Default cohort" (UI for no-match) | "No rules matched" / DEFAULT | Add "default cohort" term |
| "Environments" (sidebar label) | "Per-environment settings" | Keep, but clarify channel=environment |

---

## 3. INACCURATE CONTENT TO FIX

### 3a. insights/page.mdx (Telemetry)
- REMOVE "Avg session duration" column from flag impact matrix table — does NOT exist in code
- FIX time range: docs say "14, 30, or 90 days" → actual is "7, 14, or 30 days"
- The flag impact matrix columns are: Flag/Variation, Update, Channel, Devices, Error rate, Crash-free

### 3b. feature-flags/segments/page.mdx
- REMOVE `ends_with` from operators list — does NOT exist in segment operator list
- Segment operators (actual 14): eq, neq, in, not_in, contains, starts_with, gt, gte, lt, lte, exists, not_exists, semver_gte, semver_lte
- ADD: segments can be referenced by rollouts too, not just flags ("flags or rollouts")
- ADD: segments can be edited/updated after creation
- FIX: deletion behavior — the detail view disables delete when referenced, but warn dialog says rules will stop matching. Docs say "can't delete" which is close enough but could be more nuanced.

### 3c. feature-flags/page.mdx
- ADD `force` rule type (exists in code for display, though not creatable from UI)
- The `environment` context kind exists but SDK docs only list user/device/organization/service
- Segments support both AND and OR match logic (docs mention this for segments page but not on FF overview)

### 3d. updates/rollout-policies/page.mdx
- FIX terminology: "release flags" → "linked flags" or "linked feature flags"
- FIX rollback language: "global flag state" → "pre-release state"
- ADD: threshold action "auto-rollback" (not just "rollback")
- ADD: policy active/inactive toggle
- ADD: policy edit and delete flows
- ADD: edit locking when executions are running
- ADD: SSE live updates for execution monitoring
- FIX: example stage min-devices values should be realistic (not critical)
- NOTE: channel-level rollback calls same cancelExecution as bundle-level

### 3e. updates/page.mdx and updates/channels/page.mdx
- The publish flow is much richer than documented: multi-channel, multi-build grouping, critical toggle, release notes, rollout policy selection, feature flag linking
- Per-update rollout percentage sliders exist (not just channel-level)
- Rollback supports targeting a specific update ID, not just "embedded update"
- `isCritical` and `isEnabled` per-update toggles exist
- The branch-channel model in docs may not match reality — updates publish directly to channels

### 3f. feature-flags/sdk/page.mdx
- ADD `environment` as a context kind option (currently only lists user/device/organization/service)

### 3g. getting-started/page.mdx
- The app's getting started uses `dispatch login --server <url> --key <key>` but docs omit `--server`
- Code signing is covered in-app but not in docs quickstart (maybe ok to leave out of quickstart)
- The app warns about Expo.plist native config requirement — undocumented caveat

### 3h. insights/adoption/page.mdx
- FIX label: "Active devices" → "Total Active Devices"
- FIX label: "Downloads" → "Downloads (Xd)" (includes day count)
- ADD: 90-day time range option exists

### 3i. CLI docs
- `dispatch login` should document `--server` flag
- `dispatch publish` should document `--no-publish` flag
- Binary names: `dispatch-aarch64-apple-darwin` (not `dispatch-darwin-arm64`)
- GitHub org: `dispatchOTA/cli` (not `AppDispatch/cli`)

---

## 4. MISSING DOCUMENTATION PAGES

### 4a. Observe page (NEW PAGE NEEDED: insights/observe/page.mdx)
From Observe.tsx:
- Tabs: All, Errors, Crashes, Events (filtering by js_error, crash, custom)
- Summary cards: Errors count, Crashes count, Custom Events count
- Search functionality
- Channel filter: production, staging, canary
- Platform filter: iOS, Android
- Event row fields: eventMessage, eventName, isFatal badge, errorName badge, count, receivedAt, platform, channelName, deviceId, flag count
- Collapsed stack trace preview (first 2 lines)
- Expanded detail: full timestamp, platform, channel, runtimeVersion, deviceId, fatal badge, errorName, count, full stack trace, component stack, tags (key-value), flag states (key-value), updateUuid
- Pagination (50 items per page)
- app_launch events filtered from "All" tab
- Empty state mentions @appdispatch/health-reporter
- Subtitle: "Events, errors, and crashes from your devices"

### 4b. Audit Log page (NEW PAGE NEEDED: insights/audit-log/page.mdx)
From AuditLog.tsx:
- Category filter tabs: All, Releases, Builds, Branches, Channels, Flags, Webhooks
- Search across action labels, actor names, entity types, detail values
- 23 tracked action types:
  - build.uploaded, build.published, build.deleted
  - update.created, update.patched, update.republished, update.deleted, update.rollback
  - branch.created, branch.deleted
  - channel.created, channel.updated, channel.deleted
  - webhook.created, webhook.updated, webhook.deleted
  - flag.created, flag.updated, flag.deleted, flag.toggled
  - rule.created, rule.updated, rule.deleted
  - env_setting.updated, variation.updated
- Flag category includes: flag, rule, env_setting, variation prefixes
- Date grouping with sticky headers
- Actor display with different icons for api_key vs user
- Detail key-value display
- Load more pagination (cursor-based, 100 items/page)

### 4c. Contexts dashboard page (NEW PAGE NEEDED: feature-flags/contexts/page.mdx)
From Contexts.tsx (Contexts tab):
- List view: kind icon (color-coded), targeting key, kind badge, name, attribute chips (up to 3 + overflow), eval count, last seen, delete button
- 5 context kinds: user, device, organization, service, environment
- Search by key, name, or attribute
- Kind filter dropdown
- Pagination (50/page)
- Detail dialog: targeting key, kind, name, summary stats (evaluations, first seen, last seen), attributes table, flag evaluations list (flag name, key, channel, variation value, eval count, last evaluated)
- Create context dialog: kind selector (visual grid), targeting key, name, attributes (dynamic key-value)
- Delete context with confirmation

### 4d. Undocumented API endpoints (add to api/page.mdx)
44 endpoints missing. Key groups:
- Auth & user management (8 endpoints): setup-status, register, login, me, logout, invite, users, accept-invite
- API key management (4): list, create, revoke, delete
- Projects (3): list, create, delete
- Contexts (5): list, create, get, delete, kinds
- Rollout policies (5): list, create, get, update, delete
- Rollout executions (8): list, get, pause, resume, cancel, advance, add flag, remove flag, revert flag
- Telemetry (3): timeseries, flag-impacts, events
- Observe (1): events
- Flag health (1): GET /flags/{id}/health
- Asset upload (1): POST /assets/upload
- Adoption (1): GET /insights/adoption
- GC (2): GET /gc, POST /gc

---

## 5. FEATURE FLAGS PAGE DETAIL (feature-flags/page.mdx)

### Currently undocumented features visible in FeatureFlags.tsx:
- Flag creation dialog: name, key (auto-slugified), description, type, variations (boolean: fixed true/false; others: named value pairs)
- Search/filter in flag list
- Copy key to clipboard
- Inline variation editing in detail sidebar
- Audit history section: flag.created, flag.updated, flag.deleted, flag_rule.created/updated/deleted, flag_env.updated, flag_variation.updated, flag.rollout_applied/reverted/restored
- Active rollout banner — locks all targeting config
- Per-channel evaluation counts in list view (7-day)
- Health badges in flag list (worst variation + error rate)
- Evaluation analytics panel: total count, per-variation breakdown, daily bar chart, time ranges (7/14/30/90 days)
- Health panel: status (healthy/degraded/incident), error rate with delta, crash-free %, affected devices, per-variation health table

### Setup guide modal in FeatureFlags.tsx shows:
- Install: `npm install @appdispatch/react-native @openfeature/react-sdk`
- Uses `DispatchProvider` (not `AppDispatchProvider`)
- Shows server-side Node.js usage too

Note: The setup guide in FeatureFlags.tsx uses DIFFERENT package names than the docs SDK page. This needs investigation — either the in-app guide is outdated or the docs are wrong about the unified package.

---

## 6. UPDATES/RELEASES DETAIL

### From UpdatesList.tsx:
- Page title: "Releases" (not "Updates")
- Per-update controls: Active switch, Critical switch, Rollout % slider
- Update grouping by groupId (multi-platform groups)
- Search: message, commit, UUID
- Filters: platform (All/iOS/Android), channel, branch
- Fields shown: platform, runtime version, rollout %, critical badge, rollback badge, disabled badge, release message, git info, downloads, devices, asset count, size, timestamps

### From UpdateDrawer.tsx:
- Sections: Overview, Build Info, Analytics, Actions, Change History
- Overview fields: Runtime Version, Fingerprint, Platform, Channel, Branch, Status badges, Rollout %, Assets (count+size), Created, Group ID, "Rolls back to"
- Build Info: git commit (with copy), git branch, CI/CD Run URL, build message
- Analytics: Total Downloads, Unique Devices
- Actions: Republish (multi-channel), Rollback to this update
- Change History: build.published, update.created, update.patched, update.rollback, update.republished

### From PublishUpdate.tsx:
- Two-step wizard: Step 1 select builds, Step 2 configure release
- Multi-channel publish (checkboxes)
- Release notes text input
- Initial rollout slider (0-100%)
- Critical update checkbox
- Rollout policy selector (searchable dropdown)
- Flag configuration: searchable flag picker, per-flag enable/disable or variation selection
- Redundancy warnings when override matches channel default
- Partial rollout warnings

### From BuildsList.tsx:
- Shows CI/CD builds with status (pending/published)
- Build UUID, git info, platform, runtime version, asset count, created date
- "Publish" button per unpublished build
- Empty state with CLI setup instructions

---

## 7. SETTINGS FEATURES (undocumented)

From Settings.tsx:
- **Users tab**: List users, invite (email/name/role), roles: admin/editor/viewer
- **API Keys tab**: Create, revoke, delete; shows prefix, name, last used, created
- **Branches & Channels tab**: Create/delete branches; create/delete/edit channels
- **User Targeting tab**: Create/delete user overrides (userId, branch, note)
- **Webhooks tab**: Create/delete/edit (URL, events, secret, enabled toggle); delivery history with status codes and retries
- **Storage tab**: Garbage collection preview

---

## 8. PLAYBOOKS (completely undocumented)

From Playbooks.tsx - 12 deployment workflow guides:
1. Slow roll to production
2. Canary deployments with channels
3. Channel-level traffic splitting
4. Emergency rollback
5. Coordinated multi-platform releases
6. Staging environment
7. CI/CD automation
8. Webhook monitoring
9. Runtime version management
10. Branch-per-feature workflow
11. API key rotation
12. Scheduled maintenance windows

---

## 9. NAVIGATION STRUCTURE MISMATCH

App sidebar:
- Getting Started, Playbooks
- OTA Updates: Releases, Builds, New Release
- Experimentation: Feature Flags, Contexts
- Progressive Delivery: Rollouts, Policies
- Observe: Observe
- Insights: Adoption, Telemetry
- Audit Log, Settings

Docs sidebar:
- Home, Getting Started (Quickstart, First Flag)
- Updates (Overview, Channels, Rollout Policies, CI/CD)
- Feature Flags (Overview, Segments, SDK, Health Reporter, OpenFeature)
- Insights (Telemetry, Adoption, Flag Health)
- CLI (Overview, login, init, publish)
- API Reference
