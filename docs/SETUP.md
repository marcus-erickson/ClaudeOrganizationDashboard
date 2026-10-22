# Setting up live data

This guide takes you from sample data to your own organization's numbers. Plan on about an hour the first time.

## What you need

- A **Claude Enterprise** plan. The Analytics API is only available on Enterprise.
- The **Primary Owner** of your Claude organization, to create the API key.
- **Node.js 18 or newer** on the machine that builds the data.
- A **roster** of everyone with a seat: email, name and role.
- Optional: a **Google Sheet** for self-reports, and the Google Sheets connector enabled for your organization.

## 1. Create an Analytics API key

The Primary Owner goes to claude.ai > Organization settings > API and creates a key with the `read:analytics` scope. Store it like any other secret. Don't put it in the repository.

Things to know about the API:

- Data runs about a day behind. The script ends its period two days before today by default.
- Engagement data starts on January 1, 2026.
- The rate limit is 60 requests per minute per organization. One build makes roughly a dozen requests.

## 2. Make the roster

Copy `data/roster.example.csv` to `data/roster.csv` and list everyone with a seat:

```csv
email,name,role,status
dana.whitfield@yourco.com,Dana Whitfield,Project Manager,active
jordan.ellis@yourco.com,Jordan Ellis,Superintendent,pending
```

- `role` drives role medians, role tracks, skill audiences and the heat map. Use the same role names in `config.js` (`companySkills` audiences) and `data/program.js` (track `roles`).
- `status` is optional. Use `pending` for people whose invite hasn't been accepted.
- You can export this from your HR system, your identity provider (SCIM), or the member list in Claude's admin settings.

People who show up in the Analytics API but not in the roster are still included, with the role "Unassigned".

## 3. List your company skills

In `config.js`, set `companySkills` to the skills your organization published, with the roles each one is meant for. The dashboard only counts these toward "company skills", so personal skills people built for themselves don't skew adoption.

Use the skill name as it appears in the Analytics API (`skill_name`, or `skill_display_name` for organization skills that are stored by ID).

## 4. Set up self-reports (optional, recommended)

1. Create a Google Sheet with a tab named `Reports` and this header row:

   ```
   date,email,name,role,chats,active_days,categories,features,top_tasks,fell_short
   ```

   `data/self-reports.example.csv` has a sample row. `categories` holds `Category=count` pairs separated by `; `, and `features` and `top_tasks` are lists separated by `; `.

2. Share the sheet so everyone who will run the skill can edit it.
3. Open `skills/claude-self-report/SKILL.md`, paste the sheet URL into **Organization settings**, and make sure the category list matches `categories` in `config.js` exactly.
4. Install the skill for your organization. See [Installing the self-report skill](#installing-the-self-report-skill) below.
5. Announce it. A monthly nudge from managers works well, for example at the first one-on-one of the month. People need the Google Sheets connector connected for the skill to add their row; without it, the skill gives them a CSV line to paste into the sheet.
6. For the build script, either download the sheet as CSV to `data/self-reports.csv`, or publish it as CSV (File > Share > Publish to web > CSV) and pass that URL. A published URL is readable by anyone who has it, so only do that if your sheet holds nothing sensitive and your organization allows it.

### Installing the self-report skill

Claude installs skills from a ZIP file of the skill's folder. The folder must keep the name `claude-self-report`, matching the `name` in `SKILL.md`.

**1. Package it** after you've edited `SKILL.md`:

- macOS or Linux, from the repository folder:

  ```bash
  cd skills && zip -r ../claude-self-report.zip claude-self-report && cd ..
  ```

- Windows: open the `skills` folder, right-click the `claude-self-report` folder, and choose **Send to > Compressed (zipped) folder** (or **Compress to ZIP file** on Windows 11).

**2. Test it on your own account first.** In Claude, go to **Customize > Skills**, click **+**, choose **Create skill > Upload a skill**, and select the ZIP. Then ask Claude to "run my Claude self-report". Delete or turn off your personal copy once the organization copy is installed.

**3. Provision it to everyone** (an Owner does this; Team and Enterprise plans):

1. Go to **Organization settings > Plugins & skills**.
2. On the **Policy** tab, check that **Cloud code execution and file creation** and **Skills** are both on. Skills don't run without code execution.
3. Click **Add > Upload a skill** and select the ZIP.

The skill is turned on for everyone right away, and each person can turn it off for themselves. To give it only to certain groups instead, Enterprise plans can bundle it into a plugin assigned to those groups.

**4. Updating it:** edit `SKILL.md`, zip the folder again, and upload the new ZIP in the same place.

Anthropic's guides: [Provision and manage skills for your organization](https://support.claude.com/en/articles/13119606-provision-and-manage-skills-for-your-organization) and [Use skills in Claude](https://support.claude.com/en/articles/12512180-use-skills-in-claude).

## 5. Build the data

```bash
export ANTHROPIC_ANALYTICS_KEY=sk-ant-...
node scripts/build-data.mjs --roster data/roster.csv --reports data/self-reports.csv
```

Useful options:

| Option | Default | Meaning |
|---|---|---|
| `--end YYYY-MM-DD` | two days ago | Last day of the period |
| `--days 30` | `periodDays` in config.js | Period length |
| `--reports <path or URL>` | none | Self-report CSV |
| `--out <path>` | `data/live-data.js` | Output file |

Open `index.html`. The header now says **Live data**. Delete or rename `data/live-data.js` to go back to the sample.

What the script pulls:

| Endpoint | Used for |
|---|---|
| `/v1/organizations/analytics/users` (this period, previous period, last 8 weeks) | Chats, messages, Projects, artifacts, files, connector counts, last active date, trend, "slowing down" |
| `/v1/organizations/analytics/skills` grouped by user | Company skills each person ran, and total runs per skill |
| `/v1/organizations/analytics/connectors` grouped by user | Connector names per person, if available. Skipped quietly if not. |

The users and skills endpoints and their fields are documented in the [Analytics API reference](https://platform.claude.com/docs/en/api/beta/organization/analytics). If the connectors endpoint path or fields differ for your organization, the script falls back to connector counts and the dashboard still works.

## 6. Refresh it automatically

Run the build nightly so coaches always see yesterday's numbers. Some options:

- A cron job or scheduled task on an internal server that runs the script and copies the folder to an internal web host.
- A scheduled CI job in a **private** repository that runs the script with the key stored as a secret and publishes to an internal-only site.

Don't publish live data to a public GitHub Pages site.

## Data file format

If you'd rather produce `data/live-data.js` another way, for example from your own warehouse, write this shape:

```js
window.COACHING_DATA = {
  source: "live",
  orgName: "Your Co.",
  periodStart: "2026-09-20",
  periodEnd: "2026-10-19",
  skills: [{ name: "rfi-drafter", audienceRoles: ["Project Engineer"], runs: 140 }],
  people: [{
    id: "dana-whitfield", name: "Dana Whitfield", email: "dana@yourco.com", role: "Project Manager",
    status: "active",              // or "pending"
    lastActive: "2026-10-19",      // or null
    chats: 142, prevChats: 120, messages: 1335,
    projects: 6, artifacts: 31, filesUploaded: 40,
    connectorNames: ["Google Drive"], connectorCount: 1,
    skillNames: ["rfi-drafter"],   // company skills only
    weeklyChats: [30, 28, 31, 31, 34, 36, 35, 37]   // 8 weeks, oldest first
  }],
  selfReports: [{
    date: "2026-10-09", email: "tom@yourco.com", name: "Tom Becker", role: "Project Engineer",
    chats: 63, activeDays: 17,
    categories: { "RFIs and submittals": 24, "Personal": 2 },
    features: ["Web search", "File uploads"],
    topTasks: ["Drafting RFIs from field questions"],
    fellShort: "It doesn't know our job's specs unless I upload them."
  }]
};
```
