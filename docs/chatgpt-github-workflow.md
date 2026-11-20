# ChatGPT → GitHub → Lovable workflow

This repository is the code source for the MTC Pocket Market app built in Lovable.

## Workflow

1. Discuss the next feature and requirements in ChatGPT.
2. Read the latest repository files before making changes.
3. Make focused code changes in a feature branch where practical, review and test them, then merge into the branch selected in Lovable (normally `main`).
4. Lovable's Git sync should import commits pushed to the active branch. Confirm the commit appears in Lovable and the preview builds successfully.
5. Review the mobile and desktop experience before publishing. A GitHub commit is not automatically a published production release.

## Guardrails

- Don't send normal implementation requests to Lovable's chat AI unless needed, to reduce Lovable AI credit usage.
- Preserve current functionality, MTC branding, responsive layout, and working backend integrations.
- Never commit passwords, private keys, personal KYC records, or customer data.
- Distinguish prototype/mock data from verified MTC products, pricing and operational policies.
- No forced pushes. Keep changes small and reversible.

Verified initially on 2026-11-20 with GitHub repo `didireloaded/mtc-pocket-market` and Lovable project `e459443e-2f89-4545-9e2a-d3a5dbb456e8`.
