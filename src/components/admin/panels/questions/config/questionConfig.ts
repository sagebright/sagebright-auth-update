
export const QUESTION_TYPES = [
  { value: "icebreaker", label: "Icebreaker", color: "bg-blue-100 text-blue-800" },
  { value: "reflective", label: "Reflective", color: "bg-purple-100 text-purple-800" },
  { value: "team", label: "Team", color: "bg-green-100 text-green-800" }
];

export const DEPARTMENTS = [
  { value: "all", label: "All Departments" },
  { value: "engineering", label: "Engineering" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "hr", label: "Human Resources" },
  { value: "operations", label: "Operations" }
];

export const SAMPLE_QUESTIONS = [
  {
    id: 1,
    text: "What's one small win you had this week that you're proud of?",
    type: "reflective",
    tags: ["reflective", "weekly-check-in"],
    department: "all",
    popularity: 4,
    active: true
  },
  {
    id: 2,
    text: "If you were a kitchen appliance, which one would you be and why?",
    type: "icebreaker",
    tags: ["icebreaker", "fun"],
    department: "all",
    popularity: 5,
    active: true
  },
  {
    id: 3,
    text: "What's one project you're excited about right now?",
    type: "team",
    tags: ["team", "projects"],
    department: "engineering",
    popularity: 3,
    active: true
  },
  {
    id: 4,
    text: "If you could improve one thing about our team meetings, what would it be?",
    type: "team",
    tags: ["team", "improvement"],
    department: "all",
    popularity: 2,
    active: false
  },
  {
    id: 5,
    text: "What was your favorite movie growing up?",
    type: "icebreaker",
    tags: ["icebreaker", "personal"],
    department: "all",
    popularity: 5,
    active: true
  },
];
