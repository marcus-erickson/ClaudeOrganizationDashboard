/*
 * Sample data for the Claude Organization Dashboard.
 * Every person here is fictional. Run scripts/build-data.mjs to create
 * data/live-data.js from your own organization; the dashboard uses it
 * automatically when it exists. The schema is described in docs/SETUP.md.
 */
window.COACHING_DATA = {
 "source": "sample",
 "orgName": "Sample Construction Co.",
 "periodStart": "2026-09-20",
 "periodEnd": "2026-10-19",
 "generatedAt": "2026-10-20T06:00:00Z",
 "skills": [
  {
   "name": "meeting-notes-to-tasks",
   "audienceRoles": [],
   "runs": 310
  },
  {
   "name": "rfi-drafter",
   "audienceRoles": [
    "Project Engineer",
    "Assistant PM"
   ],
   "runs": 140
  },
  {
   "name": "toolbox-talk-builder",
   "audienceRoles": [
    "Superintendent",
    "Safety Manager"
   ],
   "runs": 52
  },
  {
   "name": "contract-risk-check",
   "audienceRoles": [
    "Project Manager",
    "Assistant PM",
    "Executive"
   ],
   "runs": 15
  },
  {
   "name": "bid-leveling",
   "audienceRoles": [
    "Estimator",
    "Preconstruction"
   ],
   "runs": 3
  }
 ],
 "people": [
  {
   "id": "dana-whitfield",
   "name": "Dana Whitfield",
   "email": "dana.whitfield@example.com",
   "role": "Project Manager",
   "status": "active",
   "lastActive": "2026-10-19",
   "chats": 142,
   "prevChats": 120,
   "messages": 1335,
   "projects": 6,
   "artifacts": 31,
   "filesUploaded": 40,
   "connectorNames": [
    "Google Drive",
    "Gmail",
    "Procore",
    "Slack"
   ],
   "skillNames": [
    "meeting-notes-to-tasks",
    "contract-risk-check",
    "rfi-drafter"
   ],
   "weeklyChats": [
    23,
    27,
    39,
    31,
    34,
    28,
    45,
    35
   ]
  },
  {
   "id": "luis-ortega",
   "name": "Luis Ortega",
   "email": "luis.ortega@example.com",
   "role": "Estimator",
   "status": "active",
   "lastActive": "2026-10-19",
   "chats": 118,
   "prevChats": 104,
   "messages": 1322,
   "projects": 4,
   "artifacts": 22,
   "filesUploaded": 55,
   "connectorNames": [
    "Google Drive",
    "Outlook",
    "SharePoint"
   ],
   "skillNames": [
    "bid-leveling",
    "meeting-notes-to-tasks"
   ],
   "weeklyChats": [
    28,
    27,
    24,
    25,
    30,
    28,
    33,
    27
   ]
  },
  {
   "id": "priya-raman",
   "name": "Priya Raman",
   "email": "priya.raman@example.com",
   "role": "Project Engineer",
   "status": "active",
   "lastActive": "2026-10-18",
   "chats": 96,
   "prevChats": 90,
   "messages": 749,
   "projects": 5,
   "artifacts": 18,
   "filesUploaded": 31,
   "connectorNames": [
    "Google Drive",
    "Procore"
   ],
   "skillNames": [
    "rfi-drafter",
    "meeting-notes-to-tasks"
   ],
   "weeklyChats": [
    27,
    23,
    20,
    20,
    22,
    26,
    22,
    26
   ]
  },
  {
   "id": "grace-kim",
   "name": "Grace Kim",
   "email": "grace.kim@example.com",
   "role": "Preconstruction",
   "status": "active",
   "lastActive": "2026-10-18",
   "chats": 74,
   "prevChats": 60,
   "messages": 451,
   "projects": 2,
   "artifacts": 9,
   "filesUploaded": 22,
   "connectorNames": [
    "Google Drive"
   ],
   "skillNames": [],
   "weeklyChats": [
    16,
    13,
    16,
    15,
    18,
    20,
    17,
    19
   ]
  },
  {
   "id": "chen-wei",
   "name": "Chen Wei",
   "email": "chen.wei@example.com",
   "role": "Project Engineer",
   "status": "active",
   "lastActive": "2026-10-17",
   "chats": 55,
   "prevChats": 50,
   "messages": 440,
   "projects": 3,
   "artifacts": 12,
   "filesUploaded": 18,
   "connectorNames": [
    "Google Drive",
    "Procore"
   ],
   "skillNames": [],
   "weeklyChats": [
    14,
    14,
    9,
    13,
    14,
    16,
    12,
    13
   ]
  },
  {
   "id": "tom-becker",
   "name": "Tom Becker",
   "email": "tom.becker@example.com",
   "role": "Project Engineer",
   "status": "active",
   "lastActive": "2026-10-17",
   "chats": 63,
   "prevChats": 48,
   "messages": 132,
   "projects": 0,
   "artifacts": 1,
   "filesUploaded": 14,
   "connectorNames": [],
   "skillNames": [],
   "weeklyChats": [
    13,
    11,
    12,
    12,
    17,
    16,
    14,
    16
   ]
  },
  {
   "id": "aisha-bello",
   "name": "Aisha Bello",
   "email": "aisha.bello@example.com",
   "role": "Safety Manager",
   "status": "active",
   "lastActive": "2026-10-16",
   "chats": 41,
   "prevChats": 38,
   "messages": 226,
   "projects": 1,
   "artifacts": 4,
   "filesUploaded": 9,
   "connectorNames": [],
   "skillNames": [
    "toolbox-talk-builder"
   ],
   "weeklyChats": [
    10,
    10,
    11,
    7,
    13,
    10,
    8,
    10
   ]
  },
  {
   "id": "mark-delaney",
   "name": "Mark Delaney",
   "email": "mark.delaney@example.com",
   "role": "Superintendent",
   "status": "active",
   "lastActive": "2026-10-14",
   "chats": 38,
   "prevChats": 30,
   "messages": 91,
   "projects": 0,
   "artifacts": 0,
   "filesUploaded": 12,
   "connectorNames": [],
   "skillNames": [],
   "weeklyChats": [
    7,
    8,
    6,
    9,
    11,
    10,
    10,
    7
   ]
  },
  {
   "id": "rosa-jimenez",
   "name": "Rosa Jimenez",
   "email": "rosa.jimenez@example.com",
   "role": "Project Accountant",
   "status": "active",
   "lastActive": "2026-10-10",
   "chats": 12,
   "prevChats": 31,
   "messages": 36,
   "projects": 0,
   "artifacts": 0,
   "filesUploaded": 3,
   "connectorNames": [],
   "skillNames": [],
   "weeklyChats": [
    7,
    10,
    6,
    8,
    3,
    3,
    6,
    0
   ]
  },
  {
   "id": "kevin-shaw",
   "name": "Kevin Shaw",
   "email": "kevin.shaw@example.com",
   "role": "Superintendent",
   "status": "active",
   "lastActive": "2026-09-27",
   "chats": 3,
   "prevChats": 9,
   "messages": 5,
   "projects": 0,
   "artifacts": 0,
   "filesUploaded": 0,
   "connectorNames": [],
   "skillNames": [],
   "weeklyChats": [
    3,
    2,
    2,
    2,
    3,
    0,
    0,
    0
   ]
  },
  {
   "id": "hannah-moore",
   "name": "Hannah Moore",
   "email": "hannah.moore@example.com",
   "role": "Assistant PM",
   "status": "active",
   "lastActive": "2026-09-18",
   "chats": 0,
   "prevChats": 7,
   "messages": 0,
   "projects": 0,
   "artifacts": 0,
   "filesUploaded": 0,
   "connectorNames": [],
   "skillNames": [],
   "weeklyChats": [
    2,
    2,
    2,
    1,
    0,
    0,
    0,
    0
   ]
  },
  {
   "id": "jordan-ellis",
   "name": "Jordan Ellis",
   "email": "jordan.ellis@example.com",
   "role": "Superintendent",
   "status": "pending",
   "lastActive": null,
   "chats": 0,
   "prevChats": 0,
   "messages": 0,
   "projects": 0,
   "artifacts": 0,
   "filesUploaded": 0,
   "connectorNames": [],
   "skillNames": [],
   "weeklyChats": [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
   ]
  },
  {
   "id": "alex-adams",
   "name": "Alex Adams",
   "email": "alex.adams@example.com",
   "role": "Project Manager",
   "status": "active",
   "lastActive": "2026-10-18",
   "chats": 89,
   "prevChats": 73,
   "messages": 685,
   "projects": 1,
   "artifacts": 10,
   "filesUploaded": 26,
   "connectorNames": [
    "Google Drive",
    "SharePoint",
    "Procore"
   ],
   "skillNames": [
    "meeting-notes-to-tasks",
    "contract-risk-check"
   ],
   "weeklyChats": [
    17,
    22,
    15,
    19,
    30,
    22,
    19,
    18
   ]
  },
  {
   "id": "brooke-barnes",
   "name": "Brooke Barnes",
   "email": "brooke.barnes@example.com",
   "role": "Project Manager",
   "status": "active",
   "lastActive": "2026-10-18",
   "chats": 69,
   "prevChats": 59,
   "messages": 435,
   "projects": 0,
   "artifacts": 8,
   "filesUploaded": 11,
   "connectorNames": [],
   "skillNames": [
    "meeting-notes-to-tasks",
    "contract-risk-check"
   ],
   "weeklyChats": [
    16,
    14,
    15,
    14,
    17,
    16,
    17,
    19
   ]
  },
  {
   "id": "carlos-cruz",
   "name": "Carlos Cruz",
   "email": "carlos.cruz@example.com",
   "role": "Project Manager",
   "status": "active",
   "lastActive": "2026-10-16",
   "chats": 89,
   "prevChats": 96,
   "messages": 748,
   "projects": 0,
   "artifacts": 8,
   "filesUploaded": 25,
   "connectorNames": [
    "SharePoint"
   ],
   "skillNames": [
    "meeting-notes-to-tasks"
   ],
   "weeklyChats": [
    27,
    18,
    24,
    27,
    24,
    23,
    18,
    24
   ]
  },
  {
   "id": "diane-dalton",
   "name": "Diane Dalton",
   "email": "diane.dalton@example.com",
   "role": "Project Manager",
   "status": "active",
   "lastActive": "2026-10-18",
   "chats": 91,
   "prevChats": 82,
   "messages": 673,
   "projects": 3,
   "artifacts": 10,
   "filesUploaded": 21,
   "connectorNames": [],
   "skillNames": [],
   "weeklyChats": [
    15,
    18,
    23,
    26,
    17,
    27,
    29,
    18
   ]
  },
  {
   "id": "eli-evans",
   "name": "Eli Evans",
   "email": "eli.evans@example.com",
   "role": "Project Manager",
   "status": "active",
   "lastActive": "2026-10-17",
   "chats": 81,
   "prevChats": 81,
   "messages": 713,
   "projects": 1,
   "artifacts": 5,
   "filesUploaded": 21,
   "connectorNames": [
    "Procore"
   ],
   "skillNames": [
    "contract-risk-check"
   ],
   "weeklyChats": [
    21,
    15,
    22,
    23,
    19,
    23,
    15,
    24
   ]
  },
  {
   "id": "fatima-flores",
   "name": "Fatima Flores",
   "email": "fatima.flores@example.com",
   "role": "Project Manager",
   "status": "active",
   "lastActive": "2026-10-19",
   "chats": 120,
   "prevChats": 120,
   "messages": 912,
   "projects": 3,
   "artifacts": 14,
   "filesUploaded": 17,
   "connectorNames": [
    "Outlook",
    "Gmail",
    "Procore"
   ],
   "skillNames": [
    "meeting-notes-to-tasks"
   ],
   "weeklyChats": [
    29,
    30,
    29,
    32,
    30,
    22,
    36,
    32
   ]
  },
  {
   "id": "gabe-garza",
   "name": "Gabe Garza",
   "email": "gabe.garza@example.com",
   "role": "Project Manager",
   "status": "active",
   "lastActive": "2026-10-15",
   "chats": 69,
   "prevChats": 69,
   "messages": 380,
   "projects": 0,
   "artifacts": 9,
   "filesUploaded": 23,
   "connectorNames": [
    "Gmail"
   ],
   "skillNames": [
    "meeting-notes-to-tasks",
    "contract-risk-check"
   ],
   "weeklyChats": [
    19,
    16,
    18,
    16,
    15,
    21,
    20,
    13
   ]
  },
  {
   "id": "holly-hayes",
   "name": "Holly Hayes",
   "email": "holly.hayes@example.com",
   "role": "Project Manager",
   "status": "active",
   "lastActive": "2026-10-19",
   "chats": 73,
   "prevChats": 75,
   "messages": 431,
   "projects": 3,
   "artifacts": 10,
   "filesUploaded": 22,
   "connectorNames": [],
   "skillNames": [
    "contract-risk-check"
   ],
   "weeklyChats": [
    21,
    18,
    18,
    18,
    17,
    20,
    22,
    14
   ]
  },
  {
   "id": "ivan-ibarra",
   "name": "Ivan Ibarra",
   "email": "ivan.ibarra@example.com",
   "role": "Assistant PM",
   "status": "active",
   "lastActive": "2026-10-19",
   "chats": 37,
   "prevChats": 36,
   "messages": 289,
   "projects": 2,
   "artifacts": 3,
   "filesUploaded": 5,
   "connectorNames": [
    "Outlook",
    "Gmail",
    "Procore"
   ],
   "skillNames": [],
   "weeklyChats": [
    7,
    12,
    8,
    9,
    10,
    7,
    10,
    10
   ]
  },
  {
   "id": "jess-jensen",
   "name": "Jess Jensen",
   "email": "jess.jensen@example.com",
   "role": "Assistant PM",
   "status": "active",
   "lastActive": "2026-10-19",
   "chats": 59,
   "prevChats": 45,
   "messages": 236,
   "projects": 3,
   "artifacts": 5,
   "filesUploaded": 21,
   "connectorNames": [],
   "skillNames": [
    "rfi-drafter"
   ],
   "weeklyChats": [
    10,
    10,
    14,
    11,
    16,
    14,
    11,
    18
   ]
  },
  {
   "id": "kyle-keller",
   "name": "Kyle Keller",
   "email": "kyle.keller@example.com",
   "role": "Assistant PM",
   "status": "active",
   "lastActive": "2026-10-19",
   "chats": 53,
   "prevChats": 50,
   "messages": 339,
   "projects": 0,
   "artifacts": 7,
   "filesUploaded": 14,
   "connectorNames": [],
   "skillNames": [
    "meeting-notes-to-tasks"
   ],
   "weeklyChats": [
    15,
    9,
    14,
    12,
    17,
    15,
    12,
    9
   ]
  },
  {
   "id": "lena-lopez",
   "name": "Lena Lopez",
   "email": "lena.lopez@example.com",
   "role": "Project Engineer",
   "status": "active",
   "lastActive": "2026-10-18",
   "chats": 54,
   "prevChats": 53,
   "messages": 346,
   "projects": 3,
   "artifacts": 4,
   "filesUploaded": 9,
   "connectorNames": [
    "SharePoint",
    "Google Drive",
    "Procore"
   ],
   "skillNames": [
    "rfi-drafter",
    "meeting-notes-to-tasks"
   ],
   "weeklyChats": [
    16,
    10,
    11,
    16,
    14,
    14,
    13,
    13
   ]
  },
  {
   "id": "manny-mendez",
   "name": "Manny Mendez",
   "email": "manny.mendez@example.com",
   "role": "Project Engineer",
   "status": "active",
   "lastActive": "2026-10-18",
   "chats": 83,
   "prevChats": 66,
   "messages": 647,
   "projects": 1,
   "artifacts": 9,
   "filesUploaded": 31,
   "connectorNames": [],
   "skillNames": [
    "rfi-drafter",
    "meeting-notes-to-tasks"
   ],
   "weeklyChats": [
    15,
    18,
    14,
    19,
    19,
    22,
    21,
    21
   ]
  },
  {
   "id": "nora-nash",
   "name": "Nora Nash",
   "email": "nora.nash@example.com",
   "role": "Project Engineer",
   "status": "active",
   "lastActive": "2026-10-13",
   "chats": 45,
   "prevChats": 34,
   "messages": 310,
   "projects": 1,
   "artifacts": 7,
   "filesUploaded": 13,
   "connectorNames": [
    "Outlook",
    "SharePoint"
   ],
   "skillNames": [
    "rfi-drafter"
   ],
   "weeklyChats": [
    7,
    9,
    10,
    8,
    12,
    12,
    11,
    10
   ]
  },
  {
   "id": "owen-ortiz",
   "name": "Owen Ortiz",
   "email": "owen.ortiz@example.com",
   "role": "Project Engineer",
   "status": "active",
   "lastActive": "2026-10-19",
   "chats": 88,
   "prevChats": 94,
   "messages": 686,
   "projects": 2,
   "artifacts": 11,
   "filesUploaded": 31,
   "connectorNames": [
    "SharePoint"
   ],
   "skillNames": [
    "rfi-drafter",
    "meeting-notes-to-tasks"
   ],
   "weeklyChats": [
    28,
    24,
    21,
    21,
    17,
    21,
    24,
    26
   ]
  },
  {
   "id": "paige-price",
   "name": "Paige Price",
   "email": "paige.price@example.com",
   "role": "Project Engineer",
   "status": "active",
   "lastActive": "2026-10-19",
   "chats": 52,
   "prevChats": 42,
   "messages": 541,
   "projects": 0,
   "artifacts": 5,
   "filesUploaded": 5,
   "connectorNames": [
    "SharePoint",
    "Gmail"
   ],
   "skillNames": [],
   "weeklyChats": [
    8,
    13,
    10,
    11,
    13,
    12,
    11,
    16
   ]
  },
  {
   "id": "quinn-quintero",
   "name": "Quinn Quintero",
   "email": "quinn.quintero@example.com",
   "role": "Project Engineer",
   "status": "active",
   "lastActive": "2026-10-17",
   "chats": 89,
   "prevChats": 87,
   "messages": 498,
   "projects": 4,
   "artifacts": 10,
   "filesUploaded": 22,
   "connectorNames": [
    "Gmail",
    "Google Drive"
   ],
   "skillNames": [
    "rfi-drafter",
    "meeting-notes-to-tasks"
   ],
   "weeklyChats": [
    24,
    22,
    22,
    19,
    16,
    26,
    21,
    26
   ]
  },
  {
   "id": "raul-reyes",
   "name": "Raul Reyes",
   "email": "raul.reyes@example.com",
   "role": "Project Engineer",
   "status": "active",
   "lastActive": "2026-10-18",
   "chats": 51,
   "prevChats": 49,
   "messages": 439,
   "projects": 0,
   "artifacts": 6,
   "filesUploaded": 13,
   "connectorNames": [
    "Gmail"
   ],
   "skillNames": [
    "rfi-drafter"
   ],
   "weeklyChats": [
    13,
    10,
    15,
    11,
    9,
    15,
    12,
    15
   ]
  },
  {
   "id": "sara-soto",
   "name": "Sara Soto",
   "email": "sara.soto@example.com",
   "role": "Superintendent",
   "status": "active",
   "lastActive": "2026-10-03",
   "chats": 0,
   "prevChats": 5,
   "messages": 0,
   "projects": 0,
   "artifacts": 0,
   "filesUploaded": 0,
   "connectorNames": [],
   "skillNames": [],
   "weeklyChats": [
    1,
    1,
    1,
    2,
    0,
    0,
    0,
    0
   ]
  },
  {
   "id": "trent-turner",
   "name": "Trent Turner",
   "email": "trent.turner@example.com",
   "role": "Superintendent",
   "status": "active",
   "lastActive": "2026-10-16",
   "chats": 12,
   "prevChats": 12,
   "messages": 49,
   "projects": 0,
   "artifacts": 0,
   "filesUploaded": 1,
   "connectorNames": [],
   "skillNames": [],
   "weeklyChats": [
    3,
    3,
    3,
    3,
    2,
    3,
    3,
    4
   ]
  },
  {
   "id": "uma-underwood",
   "name": "Uma Underwood",
   "email": "uma.underwood@example.com",
   "role": "Superintendent",
   "status": "active",
   "lastActive": "2026-10-19",
   "chats": 18,
   "prevChats": 19,
   "messages": 72,
   "projects": 0,
   "artifacts": 2,
   "filesUploaded": 3,
   "connectorNames": [],
   "skillNames": [],
   "weeklyChats": [
    5,
    5,
    6,
    3,
    5,
    5,
    4,
    4
   ]
  },
  {
   "id": "victor-vega",
   "name": "Victor Vega",
   "email": "victor.vega@example.com",
   "role": "Superintendent",
   "status": "active",
   "lastActive": "2026-10-19",
   "chats": 17,
   "prevChats": 14,
   "messages": 24,
   "projects": 0,
   "artifacts": 5,
   "filesUploaded": 6,
   "connectorNames": [],
   "skillNames": [],
   "weeklyChats": [
    3,
    3,
    4,
    4,
    4,
    5,
    4,
    4
   ]
  },
  {
   "id": "wendy-walsh",
   "name": "Wendy Walsh",
   "email": "wendy.walsh@example.com",
   "role": "Superintendent",
   "status": "active",
   "lastActive": "2026-10-18",
   "chats": 20,
   "prevChats": 17,
   "messages": 54,
   "projects": 0,
   "artifacts": 5,
   "filesUploaded": 4,
   "connectorNames": [],
   "skillNames": [],
   "weeklyChats": [
    4,
    4,
    5,
    4,
    4,
    4,
    6,
    6
   ]
  },
  {
   "id": "xavier-young",
   "name": "Xavier Young",
   "email": "xavier.young@example.com",
   "role": "Superintendent",
   "status": "active",
   "lastActive": "2026-10-15",
   "chats": 15,
   "prevChats": 14,
   "messages": 36,
   "projects": 0,
   "artifacts": 0,
   "filesUploaded": 2,
   "connectorNames": [
    "Gmail",
    "Outlook"
   ],
   "skillNames": [
    "toolbox-talk-builder"
   ],
   "weeklyChats": [
    3,
    3,
    4,
    4,
    4,
    4,
    4,
    3
   ]
  },
  {
   "id": "yara-zamora",
   "name": "Yara Zamora",
   "email": "yara.zamora@example.com",
   "role": "Estimator",
   "status": "active",
   "lastActive": "2026-10-18",
   "chats": 95,
   "prevChats": 106,
   "messages": 504,
   "projects": 2,
   "artifacts": 10,
   "filesUploaded": 37,
   "connectorNames": [
    "Outlook"
   ],
   "skillNames": [],
   "weeklyChats": [
    29,
    24,
    22,
    31,
    20,
    21,
    23,
    31
   ]
  },
  {
   "id": "zach-bishop",
   "name": "Zach Bishop",
   "email": "zach.bishop@example.com",
   "role": "Estimator",
   "status": "active",
   "lastActive": "2026-09-30",
   "chats": 0,
   "prevChats": 3,
   "messages": 0,
   "projects": 0,
   "artifacts": 0,
   "filesUploaded": 0,
   "connectorNames": [],
   "skillNames": [],
   "weeklyChats": [
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0
   ]
  },
  {
   "id": "bianca-carter",
   "name": "Bianca Carter",
   "email": "bianca.carter@example.com",
   "role": "Estimator",
   "status": "active",
   "lastActive": "2026-10-15",
   "chats": 58,
   "prevChats": 62,
   "messages": 568,
   "projects": 0,
   "artifacts": 7,
   "filesUploaded": 8,
   "connectorNames": [],
   "skillNames": [],
   "weeklyChats": [
    13,
    11,
    19,
    19,
    13,
    13,
    17,
    15
   ]
  },
  {
   "id": "derek-doyle",
   "name": "Derek Doyle",
   "email": "derek.doyle@example.com",
   "role": "Preconstruction",
   "status": "active",
   "lastActive": "2026-10-18",
   "chats": 72,
   "prevChats": 77,
   "messages": 497,
   "projects": 0,
   "artifacts": 6,
   "filesUploaded": 12,
   "connectorNames": [],
   "skillNames": [],
   "weeklyChats": [
    18,
    15,
    24,
    20,
    16,
    19,
    20,
    17
   ]
  },
  {
   "id": "erin-ellison",
   "name": "Erin Ellison",
   "email": "erin.ellison@example.com",
   "role": "Safety Manager",
   "status": "active",
   "lastActive": "2026-10-13",
   "chats": 54,
   "prevChats": 54,
   "messages": 378,
   "projects": 4,
   "artifacts": 7,
   "filesUploaded": 11,
   "connectorNames": [],
   "skillNames": [],
   "weeklyChats": [
    16,
    14,
    11,
    13,
    14,
    16,
    10,
    14
   ]
  },
  {
   "id": "frank-foster",
   "name": "Frank Foster",
   "email": "frank.foster@example.com",
   "role": "Safety Manager",
   "status": "active",
   "lastActive": "2026-10-19",
   "chats": 28,
   "prevChats": 27,
   "messages": 176,
   "projects": 0,
   "artifacts": 3,
   "filesUploaded": 10,
   "connectorNames": [],
   "skillNames": [],
   "weeklyChats": [
    7,
    5,
    8,
    7,
    6,
    7,
    8,
    7
   ]
  },
  {
   "id": "gina-gomez",
   "name": "Gina Gomez",
   "email": "gina.gomez@example.com",
   "role": "Project Accountant",
   "status": "active",
   "lastActive": "2026-10-17",
   "chats": 24,
   "prevChats": 24,
   "messages": 91,
   "projects": 4,
   "artifacts": 1,
   "filesUploaded": 2,
   "connectorNames": [
    "SharePoint",
    "Google Drive"
   ],
   "skillNames": [],
   "weeklyChats": [
    7,
    5,
    5,
    7,
    7,
    6,
    6,
    5
   ]
  },
  {
   "id": "hector-hart",
   "name": "Hector Hart",
   "email": "hector.hart@example.com",
   "role": "Project Accountant",
   "status": "active",
   "lastActive": "2026-10-18",
   "chats": 17,
   "prevChats": 17,
   "messages": 61,
   "projects": 0,
   "artifacts": 2,
   "filesUploaded": 3,
   "connectorNames": [
    "Google Drive",
    "Outlook"
   ],
   "skillNames": [],
   "weeklyChats": [
    4,
    5,
    4,
    4,
    5,
    4,
    4,
    4
   ]
  },
  {
   "id": "isla-irwin",
   "name": "Isla Irwin",
   "email": "isla.irwin@example.com",
   "role": "Project Accountant",
   "status": "active",
   "lastActive": "2026-10-15",
   "chats": 15,
   "prevChats": 11,
   "messages": 54,
   "projects": 0,
   "artifacts": 1,
   "filesUploaded": 2,
   "connectorNames": [],
   "skillNames": [],
   "weeklyChats": [
    3,
    2,
    3,
    3,
    3,
    4,
    5,
    3
   ]
  },
  {
   "id": "jamal-jordan",
   "name": "Jamal Jordan",
   "email": "jamal.jordan@example.com",
   "role": "Executive",
   "status": "active",
   "lastActive": "2026-10-16",
   "chats": 42,
   "prevChats": 42,
   "messages": 181,
   "projects": 4,
   "artifacts": 5,
   "filesUploaded": 7,
   "connectorNames": [],
   "skillNames": [],
   "weeklyChats": [
    7,
    13,
    12,
    10,
    10,
    9,
    12,
    11
   ]
  },
  {
   "id": "kara-knox",
   "name": "Kara Knox",
   "email": "kara.knox@example.com",
   "role": "Executive",
   "status": "active",
   "lastActive": "2026-10-18",
   "chats": 26,
   "prevChats": 20,
   "messages": 143,
   "projects": 0,
   "artifacts": 0,
   "filesUploaded": 5,
   "connectorNames": [
    "Gmail"
   ],
   "skillNames": [
    "meeting-notes-to-tasks",
    "contract-risk-check"
   ],
   "weeklyChats": [
    5,
    4,
    6,
    5,
    5,
    8,
    6,
    7
   ]
  },
  {
   "id": "leo-lambert",
   "name": "Leo Lambert",
   "email": "leo.lambert@example.com",
   "role": "Executive",
   "status": "active",
   "lastActive": "2026-10-18",
   "chats": 33,
   "prevChats": 34,
   "messages": 188,
   "projects": 2,
   "artifacts": 2,
   "filesUploaded": 4,
   "connectorNames": [],
   "skillNames": [
    "meeting-notes-to-tasks"
   ],
   "weeklyChats": [
    8,
    10,
    10,
    6,
    7,
    8,
    8,
    10
   ]
  }
 ],
 "selfReports": [
  {
   "date": "2026-10-10",
   "email": "dana.whitfield@example.com",
   "name": "Dana Whitfield",
   "role": "Project Manager",
   "chats": 142,
   "activeDays": 30,
   "categories": {
    "Contracts and specs": 36,
    "Emails and meeting notes": 28,
    "RFIs and submittals": 11,
    "Daily reports and field notes": 3,
    "Estimating and bid review": 4,
    "Change orders": 25,
    "Safety": 3,
    "Schedules and lookaheads": 11,
    "Learning": 7,
    "Personal": 3
   },
   "features": [
    "Web search",
    "File uploads",
    "Artifacts",
    "Projects",
    "Company skills",
    "Connectors"
   ],
   "topTasks": [
    "Checking change order backup against the contract",
    "Building a 3-week lookahead summary",
    "Contract questions for the owner meeting"
   ],
   "fellShort": "Not sure what owner documents I'm allowed to upload."
  },
  {
   "date": "2026-10-09",
   "email": "trent.turner@example.com",
   "name": "Trent Turner",
   "role": "Superintendent",
   "chats": 12,
   "activeDays": 3,
   "categories": {
    "Contracts and specs": 1,
    "Emails and meeting notes": 1,
    "RFIs and submittals": 1,
    "Daily reports and field notes": 3,
    "Safety": 2,
    "Schedules and lookaheads": 1,
    "Personal": 3
   },
   "features": [
    "Web search",
    "File uploads"
   ],
   "topTasks": [
    "Writing the daily report from field notes",
    "Punch list from a walkthrough",
    "Toolbox talk for this week's work"
   ],
   "fellShort": "Too slow to type on my phone at the jobsite."
  },
  {
   "date": "2026-10-09",
   "email": "uma.underwood@example.com",
   "name": "Uma Underwood",
   "role": "Superintendent",
   "chats": 18,
   "activeDays": 5,
   "categories": {
    "Contracts and specs": 1,
    "Emails and meeting notes": 2,
    "RFIs and submittals": 1,
    "Daily reports and field notes": 6,
    "Change orders": 1,
    "Safety": 4,
    "Schedules and lookaheads": 2,
    "Personal": 1
   },
   "features": [
    "Web search",
    "File uploads",
    "Artifacts"
   ],
   "topTasks": [
    "Writing the daily report from field notes",
    "Toolbox talk for this week's work",
    "Punch list from a walkthrough"
   ],
   "fellShort": "Hard to read marked-up drawings and plans."
  },
  {
   "date": "2026-10-09",
   "email": "erin.ellison@example.com",
   "name": "Erin Ellison",
   "role": "Safety Manager",
   "chats": 54,
   "activeDays": 15,
   "categories": {
    "Contracts and specs": 2,
    "Emails and meeting notes": 6,
    "Daily reports and field notes": 5,
    "Safety": 33,
    "Schedules and lookaheads": 1,
    "Learning": 2,
    "Personal": 3
   },
   "features": [
    "Web search",
    "File uploads",
    "Artifacts",
    "Projects"
   ],
   "topTasks": [
    "Toolbox talk in English and Spanish",
    "Incident report summaries",
    "JHA for new tasks"
   ],
   "fellShort": "Nothing major this month."
  },
  {
   "date": "2026-10-08",
   "email": "priya.raman@example.com",
   "name": "Priya Raman",
   "role": "Project Engineer",
   "chats": 96,
   "activeDays": 27,
   "categories": {
    "Contracts and specs": 15,
    "Emails and meeting notes": 12,
    "RFIs and submittals": 33,
    "Daily reports and field notes": 4,
    "Estimating and bid review": 2,
    "Change orders": 10,
    "Safety": 2,
    "Schedules and lookaheads": 6,
    "Learning": 6
   },
   "features": [
    "Web search",
    "File uploads",
    "Artifacts",
    "Projects",
    "Company skills",
    "Connectors"
   ],
   "topTasks": [
    "Drafting RFIs from field questions",
    "Looking up which spec section covers a product",
    "Submittal log review"
   ],
   "fellShort": "It doesn't know our job's specs unless I upload them every time."
  },
  {
   "date": "2026-10-08",
   "email": "rosa.jimenez@example.com",
   "name": "Rosa Jimenez",
   "role": "Project Accountant",
   "chats": 12,
   "activeDays": 3,
   "categories": {
    "Contracts and specs": 1,
    "Emails and meeting notes": 3,
    "Change orders": 3,
    "Learning": 1,
    "Personal": 2
   },
   "features": [
    "Web search",
    "File uploads"
   ],
   "topTasks": [
    "Change order summaries for billing",
    "Pay application backup checks",
    "Vendor email follow-ups"
   ],
   "fellShort": "Not sure what owner documents I'm allowed to upload."
  },
  {
   "date": "2026-10-06",
   "email": "aisha.bello@example.com",
   "name": "Aisha Bello",
   "role": "Safety Manager",
   "chats": 41,
   "activeDays": 11,
   "categories": {
    "Contracts and specs": 2,
    "Emails and meeting notes": 5,
    "Daily reports and field notes": 4,
    "Safety": 24,
    "Schedules and lookaheads": 1,
    "Learning": 2,
    "Personal": 3
   },
   "features": [
    "Web search",
    "File uploads",
    "Artifacts",
    "Projects",
    "Company skills"
   ],
   "topTasks": [
    "Toolbox talk in English and Spanish",
    "Incident report summaries",
    "JHA for new tasks"
   ],
   "fellShort": "Nothing major this month."
  },
  {
   "date": "2026-10-06",
   "email": "kyle.keller@example.com",
   "name": "Kyle Keller",
   "role": "Assistant PM",
   "chats": 53,
   "activeDays": 15,
   "categories": {
    "Contracts and specs": 10,
    "Emails and meeting notes": 12,
    "RFIs and submittals": 8,
    "Daily reports and field notes": 3,
    "Estimating and bid review": 1,
    "Change orders": 7,
    "Safety": 1,
    "Schedules and lookaheads": 4,
    "Learning": 3
   },
   "features": [
    "Web search",
    "File uploads",
    "Artifacts",
    "Company skills"
   ],
   "topTasks": [
    "Writing the daily report from super notes",
    "Meeting minutes for OAC meetings",
    "Change order logs"
   ],
   "fellShort": "It doesn't know our job's specs unless I upload them every time."
  },
  {
   "date": "2026-10-06",
   "email": "nora.nash@example.com",
   "name": "Nora Nash",
   "role": "Project Engineer",
   "chats": 45,
   "activeDays": 12,
   "categories": {
    "Contracts and specs": 7,
    "Emails and meeting notes": 5,
    "RFIs and submittals": 15,
    "Daily reports and field notes": 2,
    "Estimating and bid review": 1,
    "Change orders": 4,
    "Safety": 1,
    "Schedules and lookaheads": 3,
    "Learning": 3,
    "Personal": 1
   },
   "features": [
    "Web search",
    "File uploads",
    "Artifacts",
    "Projects",
    "Company skills",
    "Connectors"
   ],
   "topTasks": [
    "Drafting RFIs from field questions",
    "Rewording emails to the architect",
    "Submittal log review"
   ],
   "fellShort": "Nothing major this month."
  },
  {
   "date": "2026-10-06",
   "email": "diane.dalton@example.com",
   "name": "Diane Dalton",
   "role": "Project Manager",
   "chats": 91,
   "activeDays": 26,
   "categories": {
    "Contracts and specs": 23,
    "Emails and meeting notes": 18,
    "RFIs and submittals": 7,
    "Daily reports and field notes": 2,
    "Estimating and bid review": 3,
    "Change orders": 16,
    "Safety": 2,
    "Schedules and lookaheads": 7,
    "Learning": 4,
    "Personal": 3
   },
   "features": [
    "Web search",
    "File uploads",
    "Artifacts",
    "Projects"
   ],
   "topTasks": [
    "Checking change order backup against the contract",
    "Building a 3-week lookahead summary",
    "Contract questions for the owner meeting"
   ],
   "fellShort": "Not sure what owner documents I'm allowed to upload."
  },
  {
   "date": "2026-10-06",
   "email": "yara.zamora@example.com",
   "name": "Yara Zamora",
   "role": "Estimator",
   "chats": 95,
   "activeDays": 27,
   "categories": {
    "Contracts and specs": 13,
    "Emails and meeting notes": 7,
    "RFIs and submittals": 2,
    "Estimating and bid review": 54,
    "Change orders": 6,
    "Schedules and lookaheads": 2,
    "Learning": 4,
    "Personal": 2
   },
   "features": [
    "Web search",
    "File uploads",
    "Artifacts",
    "Projects",
    "Connectors"
   ],
   "topTasks": [
    "Finding scope gaps between sub bids",
    "Bid clarifications and exclusions",
    "Quantity takeoff questions"
   ],
   "fellShort": "Nothing major this month."
  },
  {
   "date": "2026-10-05",
   "email": "mark.delaney@example.com",
   "name": "Mark Delaney",
   "role": "Superintendent",
   "chats": 38,
   "activeDays": 10,
   "categories": {
    "Contracts and specs": 2,
    "Emails and meeting notes": 4,
    "RFIs and submittals": 2,
    "Daily reports and field notes": 14,
    "Change orders": 2,
    "Safety": 8,
    "Schedules and lookaheads": 4,
    "Learning": 1
   },
   "features": [
    "Web search",
    "File uploads"
   ],
   "topTasks": [
    "Writing the daily report from field notes",
    "Toolbox talk for this week's work",
    "Updating the lookahead schedule"
   ],
   "fellShort": "Too slow to type on my phone at the jobsite."
  },
  {
   "date": "2026-10-05",
   "email": "hector.hart@example.com",
   "name": "Hector Hart",
   "role": "Project Accountant",
   "chats": 17,
   "activeDays": 4,
   "categories": {
    "Contracts and specs": 2,
    "Emails and meeting notes": 4,
    "Estimating and bid review": 1,
    "Change orders": 5,
    "Learning": 1,
    "Personal": 1
   },
   "features": [
    "Web search",
    "File uploads",
    "Artifacts",
    "Connectors"
   ],
   "topTasks": [
    "Change order summaries for billing",
    "Vendor email follow-ups",
    "Pay application backup checks"
   ],
   "fellShort": "Not sure what owner documents I'm allowed to upload."
  },
  {
   "date": "2026-10-03",
   "email": "luis.ortega@example.com",
   "name": "Luis Ortega",
   "role": "Estimator",
   "chats": 118,
   "activeDays": 30,
   "categories": {
    "Contracts and specs": 16,
    "Emails and meeting notes": 9,
    "RFIs and submittals": 2,
    "Estimating and bid review": 68,
    "Change orders": 7,
    "Schedules and lookaheads": 2,
    "Learning": 5,
    "Personal": 1
   },
   "features": [
    "Web search",
    "File uploads",
    "Artifacts",
    "Projects",
    "Company skills",
    "Connectors"
   ],
   "topTasks": [
    "Finding scope gaps between sub bids",
    "Bid clarifications and exclusions",
    "Quantity takeoff questions"
   ],
   "fellShort": "It doesn't know our job's specs unless I upload them every time."
  },
  {
   "date": "2026-10-03",
   "email": "grace.kim@example.com",
   "name": "Grace Kim",
   "role": "Preconstruction",
   "chats": 74,
   "activeDays": 21,
   "categories": {
    "Contracts and specs": 11,
    "Emails and meeting notes": 7,
    "RFIs and submittals": 1,
    "Estimating and bid review": 37,
    "Change orders": 4,
    "Schedules and lookaheads": 4,
    "Learning": 3,
    "Personal": 3
   },
   "features": [
    "Web search",
    "File uploads",
    "Artifacts",
    "Projects",
    "Connectors"
   ],
   "topTasks": [
    "Finding scope gaps between sub bids",
    "Value engineering ideas",
    "Budget narrative for the owner"
   ],
   "fellShort": "It doesn't know our job's specs unless I upload them every time."
  },
  {
   "date": "2026-10-01",
   "email": "raul.reyes@example.com",
   "name": "Raul Reyes",
   "role": "Project Engineer",
   "chats": 51,
   "activeDays": 14,
   "categories": {
    "Contracts and specs": 8,
    "Emails and meeting notes": 6,
    "RFIs and submittals": 17,
    "Daily reports and field notes": 2,
    "Estimating and bid review": 1,
    "Change orders": 5,
    "Safety": 1,
    "Schedules and lookaheads": 3,
    "Learning": 3,
    "Personal": 1
   },
   "features": [
    "Web search",
    "File uploads",
    "Artifacts",
    "Company skills",
    "Connectors"
   ],
   "topTasks": [
    "Drafting RFIs from field questions",
    "Submittal log review",
    "Rewording emails to the architect"
   ],
   "fellShort": "It doesn't know our job's specs unless I upload them every time."
  },
  {
   "date": "2026-10-01",
   "email": "fatima.flores@example.com",
   "name": "Fatima Flores",
   "role": "Project Manager",
   "chats": 120,
   "activeDays": 30,
   "categories": {
    "Contracts and specs": 30,
    "Emails and meeting notes": 23,
    "RFIs and submittals": 9,
    "Daily reports and field notes": 2,
    "Estimating and bid review": 4,
    "Change orders": 21,
    "Safety": 2,
    "Schedules and lookaheads": 9,
    "Learning": 6,
    "Personal": 3
   },
   "features": [
    "Web search",
    "File uploads",
    "Artifacts",
    "Projects",
    "Company skills",
    "Connectors"
   ],
   "topTasks": [
    "Checking change order backup against the contract",
    "Drafting emails to the architect",
    "Contract questions for the owner meeting"
   ],
   "fellShort": "Not sure what owner documents I'm allowed to upload."
  },
  {
   "date": "2026-09-30",
   "email": "tom.becker@example.com",
   "name": "Tom Becker",
   "role": "Project Engineer",
   "chats": 63,
   "activeDays": 18,
   "categories": {
    "Contracts and specs": 10,
    "Emails and meeting notes": 7,
    "RFIs and submittals": 21,
    "Daily reports and field notes": 2,
    "Estimating and bid review": 1,
    "Change orders": 6,
    "Safety": 1,
    "Schedules and lookaheads": 4,
    "Learning": 4,
    "Personal": 2
   },
   "features": [
    "Web search",
    "File uploads",
    "Artifacts"
   ],
   "topTasks": [
    "Drafting RFIs from field questions",
    "Looking up which spec section covers a product",
    "Rewording emails to the architect"
   ],
   "fellShort": "It doesn't know our job's specs unless I upload them every time."
  },
  {
   "date": "2026-09-30",
   "email": "gina.gomez@example.com",
   "name": "Gina Gomez",
   "role": "Project Accountant",
   "chats": 24,
   "activeDays": 6,
   "categories": {
    "Contracts and specs": 2,
    "Emails and meeting notes": 6,
    "Estimating and bid review": 1,
    "Change orders": 7,
    "Learning": 1,
    "Personal": 1
   },
   "features": [
    "Web search",
    "File uploads",
    "Artifacts",
    "Projects",
    "Connectors"
   ],
   "topTasks": [
    "Change order summaries for billing",
    "Pay application backup checks",
    "Vendor email follow-ups"
   ],
   "fellShort": "Too slow to type on my phone at the jobsite."
  }
 ]
};
