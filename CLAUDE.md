@AGENTS.md

## Who does the work (model routing)

**The session the owner talks to is the dispatcher.** It plans, writes briefs, delegates, reviews results and merges. It does not do volume work itself. Each role carries its own model, so routing is automatic and effort is never lowered:

| the work | delegate to |
|---|---|
| implement one specified change, test-first | `builder` (opus) |
| grade a claim of done, review a PR, verify a fix | `auditor` (sonnet) |
| deep research, read a lot and answer a question | `researcher` (sonnet) |
| find code across many files | `Explore` (built in) |
| PR descriptions, textual rebases, CI log extraction | `mechanic` (haiku) |
| wait for CI or a deploy | a shell loop or monitor, no model |

- Code that ships is written on Opus (`builder`). Checking, reading and measuring run on Sonnet: grading by a different model than the one that built is the more independent check. Escalate a single `auditor` or `researcher` delegation to `model: "opus"` only to grade a change that writes production data or touches auth or billing, or to retry after a Sonnet result was wrong.
- A long autonomous task gets its own workspace: `conductor workspace create --model opus-5-5-1m --effort high …` for building, `--model sonnet-5-5-1m --effort high` for research, audit or measurement lanes.
- A builder's result is never its own grade: run `auditor` before merging or reporting done.
- A repo's own `.claude/agents/<name>.md` overrides these generic roles.
