/*
 * Claude Organization Dashboard: configuration
 *
 * Everything that is specific to your organization or industry lives here
 * and in data/program.js. The code in app.js does not need to change.
 *
 * The values below are set up for the sample construction company. See
 * docs/CUSTOMIZE.md for how to adapt them to another industry.
 */
window.COACHING_CONFIG = {
  orgName: "Sample Construction Co.",

  // Days covered by one reporting period. Match this to the window you
  // pull from the Analytics API in scripts/build-data.mjs.
  periodDays: 30,

  // The fixed list of work categories the self-report skill sorts chats into.
  // Keep this list identical in skills/claude-self-report/SKILL.md so every
  // report can be added together. "Personal" and "Other" are always allowed.
  categories: [
    "Contracts and specs",
    "Emails and meeting notes",
    "RFIs and submittals",
    "Daily reports and field notes",
    "Estimating and bid review",
    "Change orders",
    "Safety",
    "Schedules and lookaheads",
    "Learning"
  ],

  // Short labels used as column headers in the "Use by role" heat map.
  categoryShortNames: {
    "Contracts and specs": "Contracts and specs",
    "Emails and meeting notes": "Emails and notes",
    "RFIs and submittals": "RFIs and submittals",
    "Daily reports and field notes": "Daily reports",
    "Estimating and bid review": "Estimating",
    "Change orders": "Change orders",
    "Safety": "Safety",
    "Schedules and lookaheads": "Schedules",
    "Learning": "Learning"
  },

  // Skills your organization published, and who each one is meant for.
  // An empty audienceRoles list means everyone. Role names must match the
  // "role" column of your roster. scripts/build-data.mjs uses this list to
  // count company skill use; other skills people run are ignored.
  companySkills: [
    { name: "meeting-notes-to-tasks", audienceRoles: [] },
    { name: "rfi-drafter", audienceRoles: ["Project Engineer", "Assistant PM"] },
    { name: "toolbox-talk-builder", audienceRoles: ["Superintendent", "Safety Manager"] },
    { name: "contract-risk-check", audienceRoles: ["Project Manager", "Assistant PM", "Executive"] },
    { name: "bid-leveling", audienceRoles: ["Estimator", "Preconstruction"] }
  ],

  // The company skill (if any) that covers each category. A category with no
  // skill and a large share of use is flagged as a "Skill opportunity".
  categorySkills: {
    "Contracts and specs": "contract-risk-check",
    "Emails and meeting notes": "meeting-notes-to-tasks",
    "RFIs and submittals": "rfi-drafter",
    "Estimating and bid review": "bid-leveling",
    "Safety": "toolbox-talk-builder"
  },

  // Thresholds for the coaching rules. These are starting points: adjust them
  // once you see how your people actually use Claude.
  thresholds: {
    inactiveDays: 14,            // no activity for this many days = inactive seat
    oneShotMaxMessagesPerChat: 3, // below this is "one-shot questions"...
    oneShotMinChats: 10,          // ...but only if they had at least this many chats
    slowingDropPct: 50,           // chats down this much vs. last period = slowing down
    slowingMinPriorChats: 6,      // ignore drops from very low starting points
    lowSkillAdoptionPct: 25,      // company skill used by less than this share of its audience
    skillOpportunityMinSharePct: 9, // category share at or above this with no skill = opportunity
    taskOpportunityMinPeople: 4,  // repeated task reported by this many people = worth a skill
    championTopPct: 10,           // top share of active people by chats...
    championMinStage: 4,          // ...who have also reached this adoption stage
    powerUserMinArtifacts: 5,     // artifacts needed for stage 5
    newSeatGraceDays: 21,         // no "next step" nudges until someone has used Claude this long
    startHereCount: 5,            // people shown in "Start here this week" on the overview
    trainingWindowMonths: 2       // months after a session to check whether attendees moved up a stage
  },

  // When your Claude rollout started (YYYY-MM-DD). The Rollout tab and
  // scripts/build-data.mjs start their history here. The Analytics API has
  // data from 2026-01-01 onward, so earlier dates are moved up to that day.
  launchDate: "2026-01-12",

  // Ladder steps a role doesn't need. Those steps are skipped when working out
  // the person's stage, and they are never nudged about them.
  // Step names: "projects", "connectors", "skills", "artifacts".
  roleOptionalSteps: {
    "Superintendent": ["connectors"],
    "Safety Manager": ["connectors"]
  },

  // Adoption ladder. Each step is reached when the test is true, and a person's
  // stage is the highest step reached in order (see docs/CUSTOMIZE.md).
  stages: [
    { name: "Asking", step: "Asks questions", desc: "Chats with Claude regularly." },
    { name: "Organizing", step: "Organizes in Projects", desc: "Keeps recurring work, like each job's contract, specs and schedule, in a Project." },
    { name: "Connected", step: "Connects work tools", desc: "Lets Claude read work files, email or other tools through connectors." },
    { name: "Reusing", step: "Reuses company skills", desc: "Runs skills the company published for their role." },
    { name: "Power user", step: "Builds and shares", desc: "Creates artifacts or skills that teammates use." }
  ],

  // Labels shown in the header.
  labels: {
    title: "Claude Coaching",
    overviewHeading: "How our teams are using Claude",
    overviewSubheading: "Find who needs a hand, who to learn from, and which jobsite and office tasks are worth turning into shared skills."
  }
};
