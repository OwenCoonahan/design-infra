# Security

Do not put vendor keys, login details, private source or customer data in this catalog, registry, feedback reports or issues. Connections to the hosted catalog are keyless. Vendor credentials belong in a local secret store, and paid access belongs to each authorized user.

Report suspected credential exposure or a vulnerability privately to a repository maintainer through an existing direct channel. Do not post a working exploit or credentials in a public issue. GitHub private vulnerability reporting may be enabled when the repository becomes public; it is not promised for the current private pilot.

If a credential is exposed, revoke or rotate it with the vendor first. Removing a file does not remove prior commits. This repo runs a redacted Gitleaks scan in CI; a passing scan is useful evidence, not a guarantee that no secret exists. Before a visibility change, review full Git history and the asset/licence inventory.

The bootstrap executes selected toolchain commands. Download and inspect the script, use `--connect` for minimal setup, or review an advanced `--dry-run`. Overwriting existing configuration requires `--overwrite`. Restarted agent tools still require verification in the active client.

The current shadcn development CLI transitively includes braces 3.0.3. The [reviewed deep-pattern recursion advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) has no published patch verified during this review. It is a development/build dependency, outside the production request path; use trusted registry/build inputs and recheck before a public release. Production dependencies passed the audit on 2026-10-11.
