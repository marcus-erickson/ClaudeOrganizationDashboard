# Customizing for your organization

The dashboard's logic (metrics, flags, adoption stages, views) works for any organization. What changes from one industry to another is the content: roles, work categories, skills, coaching wording and training. All of it lives in two files.

## `config.js`

| Setting | What to change |
|---|---|
| `orgName` | Your organization's name, shown in the header. |
| `periodDays` | Length of a reporting period. 30 is a good default. |
| `categories` | The work categories people report against in their self-report. Keep it to 8 to 10, all about work. "Other" and "Personal" are added automatically. **Copy the same list into `skills/claude-self-report/SKILL.md`.** |
| `categoryShortNames` | Short column headers for the heat map. |
| `companySkills` | Skills your organization published, and the roles each is meant for. An empty `audienceRoles` list means everyone. |
| `categorySkills` | Which company skill covers each category. A category with a big share of use and no skill is flagged as a skill opportunity. |
| `thresholds` | When each coaching flag fires, how long new users get before next-step nudges (`newSeatGraceDays`), how many people "Start here this week" shows, and how long after a session training impact is measured. Start with the defaults, then adjust once you see your real numbers. If a large share of people need attention, the threshold is probably too strict for where you are today. |
| `launchDate` | When your rollout started. The Rollout tab's history and the build script start here. |
| `roleOptionalSteps` | Ladder steps a role doesn't need, for example connectors for superintendents. Those steps are skipped when working out the person's stage, and nobody in that role is nudged about them. |
| `stages` | Names and descriptions of the five adoption steps. The tests behind them (chat, Project, connector, company skill, artifacts) are fixed in `app.js`. |
| `labels` | Page title and overview heading text. |

## `data/program.js`

| Section | What it is |
|---|---|
| `coaching` | The wording for each focus: the overview card (`queue`) and the person's coaching plan (`plan`). Each entry has a `group`: `attention` (problems, fixed first, in the order listed), `next` (the next rung on the ladder) or `recognition` (champions). Use `{firstName}`, `{chats}`, `{prevChats}`, `{mpc}`, `{days}`, `{roleSkill}` and `{roleSkillUsers}` to fill in details, and threshold names like `{inactiveDays}` in queue text. |
| `taskThemes` | Repeated tasks you want to watch for. A self-report counts toward a theme when one of its top tasks contains any of the `match` words. Check the "don't match a theme yet" list on the Use cases tab each month and add themes for what you see. |
| `shortfallThemes` | Same idea for "where did Claude fall short" answers, each with the fix you'll apply. |
| `pipeline`, `pipelineStages` | Your skill pipeline. Move a skill by changing its `stage`. |
| `cohortSessions` | The next session for each adoption-stage cohort. |
| `tracks` | Role tracks: which roster roles belong to each, the champion, starter workflows and a teaching tip. |
| `sessions` | Upcoming sessions. |

## Examples for other industries

Swap these into `categories` and adjust `tracks` to match.

**Law firm**
Contract review and drafting · Legal research · Client emails and letters · Discovery and document review · Briefs and motions · Billing narratives · Matter summaries · Learning
Roles: Partner, Associate, Paralegal, Legal assistant. Possible skills: clause-comparison, deposition-summary, billing-narrative-cleanup.

**Healthcare group (administrative staff)**
Policies and compliance · Patient communication drafts · Scheduling and staffing · Prior authorizations · Meeting notes · Reports and dashboards · Training materials · Learning
Roles: Practice manager, Billing specialist, Nurse manager, Front desk. Keep patient data out of chats unless your Claude setup and agreements allow it, and say so in your AI policy.

**Marketing or creative agency**
Briefs and strategy · Copywriting · Client emails and decks · Research and competitive analysis · Social content · Reporting · Proposals and pricing · Learning
Roles: Account manager, Strategist, Copywriter, Designer, Media buyer.

**General office or SaaS company**
Emails and meeting notes · Writing and editing · Research · Data and spreadsheets · Coding · Planning and project management · Customer support · Learning
Roles: by department (Sales, Customer Success, Engineering, Finance, HR, Operations).

## Changing the look

Colors are CSS variables at the top of `styles.css`, with a light and a dark set. Change `--accent` and `--accent-strong` to your brand color, and keep text contrast at 4.5:1 or better.

## How a person's focus is chosen

Each person gets exactly one focus, so the coaching queue stays short and nobody gets a list of ten things to fix:

1. If any **attention** rule applies (slowing down, one-shot questions, inactive, hasn't signed in), the first one in that order is the focus.
2. Otherwise, if they've used Claude for at least `newSeatGraceDays`, the focus is the **next rung** on the adoption ladder, skipping steps their role doesn't need.
3. Otherwise they're on track and have no focus.

A person's coaching plan shows the focus first and anything else as "Later".

## Changing the rules themselves

The attention tests are in `app.js`, in the block that starts with `people.forEach(function (p) { var a = {};`. Each test is one line, so adding a new one means:

1. Add the test there and its key to `ATTENTION`, in priority order.
2. Add wording for it under `coaching` in `data/program.js` with `group: "attention"`.
3. Add a row for it in `viewRules()` so the Rules tab explains it.
