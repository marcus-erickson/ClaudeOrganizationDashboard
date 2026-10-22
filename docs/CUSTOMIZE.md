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
| `thresholds` | When each coaching flag fires. Start with the defaults, then adjust once you see your real numbers. If half the company is flagged for something, the threshold is probably too strict for where you are today. |
| `stages` | Names and descriptions of the five adoption steps. The tests behind them (chat, Project, connector, company skill, artifacts) are fixed in `app.js`. |
| `labels` | Page title and overview heading text. |

## `data/program.js`

| Section | What it is |
|---|---|
| `coaching` | The wording for each flag: the overview card (`queue`) and the person's coaching plan (`plan`). Use `{firstName}`, `{chats}`, `{mpc}`, `{days}`, `{roleSkill}` and `{roleSkillUsers}` to fill in details, and threshold names like `{inactiveDays}` in queue text. |
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

## Changing the rules themselves

The rule tests are in `app.js`, in the block that starts with `people.forEach(function (p) { var f = {};`. Each flag is one line, so adding a new one means:

1. Add the test there and its key to `WARN_FLAGS`.
2. Add wording for it under `coaching` in `data/program.js`.
3. Add a row for it in `viewRules()` so the Rules tab explains it.
