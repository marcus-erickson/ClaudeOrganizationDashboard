/*
 * Claude Organization Dashboard: your enablement program
 *
 * The content your AI lead or champions curate: coaching messages, the
 * repeated tasks you watch for, training tracks and the skill pipeline.
 * Edit freely. Wording in {curly braces} is filled in by the dashboard.
 *
 * Placeholders available in coaching text:
 *   {name} {firstName} {role} {chats} {mpc} {days} {roleSkill} {roleSkillUsers}
 */
window.COACHING_PROGRAM = {

  // One entry per coaching flag. "queue" text appears on the overview cards,
  // "plan" text appears in a person's coaching plan.
  coaching: {
    inactive: {
      label: "Inactive seat",
      queue: { signal: "No activity in {inactiveDays}+ days. Mostly field roles.", action: "Check in personally, and show voice mode on their phone before giving up on the seat.", cta: "Draft check-ins" },
      plan: { title: "Inactive seat", why: "No activity for {days} days.", action: "Check in personally. Reassign the seat after 30 days if they don't need it.", cta: "Draft check-in" }
    },
    pending: {
      label: "Hasn't signed in",
      queue: { signal: "Invite sent but never accepted.", action: "Walk them through sign-in on their phone and show one quick win.", cta: "Resend invites" },
      plan: { title: "Hasn't signed in", why: "Invite sent but never accepted.", action: "Walk {firstName} through sign-in on their phone at the jobsite and show voice mode.", cta: "Resend invite" }
    },
    slowing: {
      label: "Slowing down",
      queue: { signal: "Chats down {slowingDropPct}% or more from last period.", action: "Ask what changed. Often a bad answer or a blocker nobody mentioned.", cta: "Draft check-ins" },
      plan: { title: "Usage is dropping", why: "{chats} chats this period, down by half or more from last period.", action: "Ask what changed. Often a bad answer or a blocker they haven't mentioned.", cta: "Draft check-in" }
    },
    oneShot: {
      label: "One-shot questions",
      queue: { signal: "Under {oneShotMaxMessagesPerChat} messages per chat with {oneShotMinChats}+ chats this period.", action: "Invite to the 30-minute \"Getting better answers\" session.", cta: "Send invites" },
      plan: { title: "Mostly one-shot questions", why: "{mpc} messages per chat across {chats} chats. First answers are rarely the best ones.", action: "Invite to \"Getting better answers\" and pair for 30 minutes with a champion in a similar role.", cta: "Send invite" }
    },
    noProjects: {
      label: "No Projects",
      queue: { signal: "Active, but no Project used this period.", action: "Set up a Project per active job with the contract, specs and schedule loaded.", cta: "Share job Project template" },
      plan: { title: "No Projects yet", why: "Re-explains the job and re-uploads documents chat by chat.", action: "Set up a Project for {firstName}'s current job with the contract, spec book and schedule loaded.", cta: "Share job Project template" }
    },
    noConnectors: {
      label: "No connectors",
      queue: { signal: "Hasn't connected the job folder, email or other work tools.", action: "Help connect the job folder so Claude can read specs and logs directly.", cta: "Send setup guide" },
      plan: { title: "No connectors", why: "Nothing connected, so Claude only sees what {firstName} pastes in.", action: "Connect the job folder so Claude can read logs, specs and correspondence directly.", cta: "Send setup guide" }
    },
    noSkills: {
      label: "No company skills",
      queue: { signal: "Active, but hasn't run any skill we published.", action: "Send the 2 skills most used by others in the same role.", cta: "Send skill picks" },
      plan: { title: "Hasn't used a company skill", why: "{roleSkill} is used by {roleSkillUsers} in this role.", action: "Send {roleSkill} with a one-line example of what to type.", cta: "Send skill" }
    },
    champion: {
      label: "Champion",
      queue: { signal: "Top {championTopPct}% by use and at stage {championMinStage} or above.", action: "Ask them to demo a workflow at the next PM or superintendent meeting.", cta: "Ask to demo" },
      plan: { title: "Champion", why: "Among the top users and well up the adoption ladder.", action: "Ask {firstName} to demo one workflow at the next role meeting and own a skill in the pipeline.", cta: "Ask to demo" }
    }
  },

  // Repeated tasks to watch for in self-reports. A report counts toward a
  // theme when any of its "top tasks" contains one of the match words.
  taskThemes: [
    { task: "Turn field notes and photos into the daily report", roles: "Superintendents, APMs", match: ["daily report", "field notes", "daily log"], skill: "", rec: "Build daily-report-writer. Voice-first so it works from the truck." },
    { task: "Check change order backup against the contract", roles: "PMs, Accounting", match: ["change order"], skill: "", rec: "Build change-order-check using our standard subcontract terms." },
    { task: "Draft an RFI from a field question", roles: "Project Engineers", match: ["rfi"], skill: "rfi-drafter", rec: "Working. Promote to APMs and superintendents." },
    { task: "Find which spec section covers a product or detail", roles: "PEs, PMs", match: ["spec section", "spec lookup", "specs for"], skill: "", rec: "Not a skill. Teach a job Project with the spec book loaded." },
    { task: "Find scope gaps between sub bids", roles: "Estimators", match: ["bid", "scope gap"], skill: "bid-leveling", rec: "Exists but unused. Ask estimators what is missing." },
    { task: "Write a toolbox talk on this week's hazard", roles: "Safety, Superintendents", match: ["toolbox", "jha", "safety talk"], skill: "toolbox-talk-builder", rec: "Healthy. Add Spanish output for crews." },
    { task: "Build a 3-week lookahead from the master schedule", roles: "Superintendents, PMs", match: ["lookahead", "schedule"], skill: "", rec: "Pilot with one superintendent before building." }
  ],

  // Themes for the "Where did Claude fall short?" answers, matched the same way.
  shortfallThemes: [
    { theme: "Doesn't know our job's specs and contract unless I upload them", match: ["unless i upload", "doesn't know our", "every time"], fix: "Teach job Projects, one per active job." },
    { theme: "Hard to read drawings and marked-up plans", match: ["drawing", "plans", "markup"], fix: "Show how to crop sheets and ask about one detail at a time." },
    { theme: "Answers too generic for our contract terms", match: ["generic", "contract terms"], fix: "Add our standard subcontract to a shared Project." },
    { theme: "Not sure what documents I'm allowed to upload", match: ["allowed", "policy", "confidential"], fix: "Publish a one-page AI use policy." },
    { theme: "Too slow to type on the jobsite", match: ["type", "typing", "phone"], fix: "Train field staff on voice mode." }
  ],

  // Skill pipeline, from idea to shared. Move cards by editing this list.
  pipeline: [
    { stage: "Idea", name: "lookahead-builder", note: "3 people asked", owner: "TBD" },
    { stage: "Idea", name: "submittal-log-check", note: "From PE reports", owner: "TBD" },
    { stage: "Building", name: "daily-report-writer", note: "7 people want it", owner: "Mark Delaney" },
    { stage: "Building", name: "change-order-check", note: "6 people want it", owner: "Dana Whitfield" },
    { stage: "Piloting", name: "toolbox-talk (Spanish)", note: "2 crews testing", owner: "Aisha Bello" },
    { stage: "Shared", name: "rfi-drafter", note: "Used across PEs", owner: "Priya Raman" },
    { stage: "Shared", name: "meeting-notes-to-tasks", note: "Used company-wide", owner: "Dana Whitfield" }
  ],
  pipelineStages: ["Idea", "Building", "Piloting", "Shared"],

  // The session each adoption-stage cohort gets next.
  cohortSessions: {
    inactive: { name: "Sign-in and voice mode, 1-on-1", length: "15 minutes, in person" },
    "1": { name: "Getting better answers", length: "30 minutes, live" },
    "2": { name: "One Project per job", length: "45 minutes, bring your job documents" },
    "3": { name: "Company skills tour by role", length: "30 minutes, live" },
    "4": { name: "Build a skill for your team", length: "60 minutes, workshop" }
  },

  // Role tracks: starter workflows taught with each role's own documents.
  // "roles" lists the role names from your roster that belong to the track.
  tracks: [
    { track: "Superintendents", roles: ["Superintendent"], champion: "Mark Delaney", items: ["Daily report from voice notes and photos", "Toolbox talk for this week's work", "Punch list from a walkthrough"], tip: "Teach on a phone, at the jobsite trailer." },
    { track: "Project Managers", roles: ["Project Manager", "Assistant PM"], champion: "Dana Whitfield", items: ["Ask questions of the contract in a job Project", "Check change order backup", "Owner and architect emails"], tip: "Use their own job's contract in the session." },
    { track: "Project Engineers", roles: ["Project Engineer"], champion: "Priya Raman", items: ["RFIs with rfi-drafter", "Spec section lookups", "Submittal log review"], tip: "Pair new PEs with a champion for one RFI." },
    { track: "Estimators and precon", roles: ["Estimator", "Preconstruction"], champion: "Luis Ortega", items: ["Scope gaps across sub bids", "Bid clarifications and exclusions", "Excel add-in for bid tabs"], tip: "Find out why bid-leveling isn't used." },
    { track: "Safety", roles: ["Safety Manager"], champion: "Aisha Bello", items: ["JHAs for new tasks", "Toolbox talks in English and Spanish", "Incident report summaries"], tip: "Pilot Spanish output with two crews." },
    { track: "Accounting", roles: ["Project Accountant"], champion: "", items: ["Change order summaries", "Pay application backup checks", "Vendor email follow-ups"], tip: "No champion yet. Ask someone to pilot." }
  ],

  // Upcoming sessions.
  sessions: [
    { date: "Oct 27", name: "Getting better answers", audience: "Asking cohort", host: "Priya Raman" },
    { date: "Oct 29", name: "Voice mode and daily reports", audience: "Superintendents", host: "Mark Delaney" },
    { date: "Nov 3", name: "One Project per job", audience: "Organizing cohort", host: "Dana Whitfield" },
    { date: "Nov 5", name: "contract-risk-check demo", audience: "Project Managers", host: "Dana Whitfield" }
  ]
};
