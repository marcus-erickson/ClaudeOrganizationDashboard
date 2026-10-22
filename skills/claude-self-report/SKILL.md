---
name: claude-self-report
description: Summarize how I used Claude over the last 30 days (work categories, features, repeated tasks) without sharing chat content, show me the summary, and only with my OK add one row to the team's self-report sheet. Use when someone says "run my Claude self-report", "my Claude month", or "share my Claude usage".
---

# Claude self-report

You help one person see how they used Claude over the last 30 days, then, only if they agree, add a short anonymized-by-design summary to their organization's shared self-report sheet. The summary feeds the Claude Organization Dashboard, which uses it to find common tasks worth turning into shared skills and to plan training.

The person is in control the whole time. Nothing leaves this chat until they say "share".

## Organization settings

An admin fills these in before publishing the skill to the organization. Keep the category list identical to `categories` in the dashboard's `config.js`.

- **Self-report sheet:** [PASTE THE GOOGLE SHEET URL HERE]
- **Sheet tab name:** Reports
- **Categories** (use exactly these names):
  - Contracts and specs
  - Emails and meeting notes
  - RFIs and submittals
  - Daily reports and field notes
  - Estimating and bid review
  - Change orders
  - Safety
  - Schedules and lookaheads
  - Learning
  - Other (work that fits none of the above)
  - Personal (anything not about work)
- **Features to check for:** Web search, File uploads, Artifacts, Projects, Company skills, Connectors

## Privacy rules

These rules are not optional, and they apply to everything that would be shared:

1. Never include chat titles, quotes, file names or any wording copied from a chat.
2. Never include names of people, clients, owners, projects, jobs, addresses or dollar amounts. Describe tasks generically, for example "Drafting RFIs from field questions", not "RFI 42 for the Main St. hospital".
3. Personal chats are counted under "Personal" and nothing else about them is recorded or described, not even in the summary shown to the person.
4. Only the person's own chats are read. Never look up anyone else.
5. If the person says to keep it private, or doesn't answer, do not write anything to the sheet.

## Steps

### 1. Gather the last 30 days

Use your chat history tools (for example recent chats and conversation search) to list the person's chats from the last 30 days. Page back until you reach chats older than 30 days or run out. Work from chat titles and summaries; you do not need to open full transcripts.

Tell the person in one line what you could see, for example "I found 63 chats from Sep 20 to Oct 19." Mention these limits when they apply:

- If chat history search is turned off, say that the report needs it on (Settings) and stop.
- Chat search only sees one area at a time: outside a Project it sees chats outside Projects, and inside a Project it sees only that Project's chats. Nothing can read every Project from one place.

**Decide which kind of run this is:**

- **Main run** (outside any Project): the full report, both questions, and the `scope` column set to `main`.
- **Project run** (inside a Project): count this Project's chats only, skip both questions, and set `scope` to `project`. The dashboard adds Project runs to the person's main run for the same month, so they never need to combine anything by hand.

**On a main run, check for Projects.** If you have a memory tool that lists Project memory (for example paths under `/projects/`), use it to find the Projects with memory updated in the last 30 days. Updated memory means the Project was used, though it says nothing about how much. Tell the person, for example: "You also worked in 5 Projects this month: Gazette, Digital Brain, CEO Interviews, Chasing 1000 and AI Context Vault. Chats inside them aren't counted here. To include them, open each one you use for work and say 'run my Claude self-report' there. It takes about a minute each." Record the number of Projects in `projects_active`. Never put Project names in the shared row. If you can't see Project memory, ask the person whether they do much work in Projects and give the same instructions.

### 2. Sort and count

- Put each chat into exactly one category from the list above. When a chat spans two, pick the main purpose.
- Count chats per category, and the number of distinct days with at least one chat.
- Note which features showed up at least once: web search, file uploads, artifacts, Projects, a company skill, a connector.
- Pick the person's top 3 repeated tasks: kinds of work that came up in several chats. Word each one generically, in under 10 words, starting with a verb ending in -ing.

### 3. Ask two questions, one at a time (main run only)

First ask: "Where did Claude fall short for you this month? One sentence is plenty, or say skip." Wait for the answer. Strip any names or identifying details from it before it goes in the summary, and tell the person if you changed it.

Then ask: "Roughly how many hours did Claude save you this month? A gut feel is fine, or say skip." Record a whole number, or leave it empty if they skip. Don't push for precision.

### 4. Show the summary

On a Project run, show a short version: the chat count and categories for this Project, the features used, and any repeated tasks, then the row. Skip the tip.

On a main run, show the person their month in this shape:

**Your Claude month** (start date to end date, N chats on N days)

- What you used it for: each category with its count, highest first
- Features you used, and features you didn't use
- Tasks you repeat: the three tasks
- Where Claude fell short: their answer
- Time it saved you: their estimate, if they gave one
- One tip for next month: one specific, practical suggestion based on what you saw. For example, if they uploaded the same kind of document many times and never used Projects, suggest a Project. If they never used a connector, suggest connecting the tool their documents live in. Keep it to two sentences.

Then show exactly what would be shared, as the row below, and ask: "Share this with your team? (share / edit / keep private)"

| date | email | name | role | chats | active_days | categories | features | top_tasks | fell_short | hours_saved | scope | projects_active |
|---|---|---|---|---|---|---|---|---|---|---|---|---|

- `date`: today, YYYY-MM-DD
- `email`, `name`: the person's own. Ask for their role if you don't know it.
- `categories`: `Category=count` pairs separated by `; `, Personal included as a count only
- `features`, `top_tasks`: values separated by `; `
- `fell_short`: their cleaned-up answer, or empty
- `hours_saved`: a whole number, or empty (always empty on a Project run)
- `scope`: `main` or `project`
- `projects_active`: on a main run, the number of Projects used this month, or empty if unknown; empty on a Project run

### 5. Share only with permission

- **share:** append the row to the sheet with the Google Sheets connector, using the columns above in that order. Write the date as text with a leading apostrophe (`'2026-10-22`); otherwise Google Sheets turns it into a date serial number such as 46317. Read the row back to check it, then confirm in one line when it's done. If the Sheets connector isn't available or the write fails, give the person the row as one CSV line in a code block and ask them to paste it into the sheet themselves.
- **edit:** apply their changes, show the row again, and ask again.
- **keep private:** confirm nothing was shared. The summary is theirs to keep.

## Style

Write plainly and briefly. No flattery, no em dashes, and no strings of very short sentences. Ask questions one at a time.
