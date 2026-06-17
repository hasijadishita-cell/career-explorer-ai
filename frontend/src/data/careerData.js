// Career Explorer AI — mock data, questions and scoring maps
// Each option lists careers it boosts (1 point per match)

export const CAREERS = {
  "Software Engineer": {
    category: "Technology",
    description:
      "Design, build and maintain software systems that power apps, websites and digital products used by millions.",
    skills: ["Problem Solving", "Coding", "Algorithms", "System Design", "Collaboration"],
  },
  "AI Engineer": {
    category: "Technology",
    description:
      "Build intelligent systems and machine learning models that can learn, predict and automate complex tasks.",
    skills: ["Machine Learning", "Python", "Mathematics", "Data Modelling", "Research"],
  },
  "Cybersecurity Analyst": {
    category: "Technology",
    description:
      "Protect organisations from digital threats by uncovering vulnerabilities and defending systems from attack.",
    skills: ["Networking", "Threat Analysis", "Curiosity", "Attention to Detail", "Ethical Hacking"],
  },
  "Data Scientist": {
    category: "Technology",
    description:
      "Turn raw data into stories and decisions using statistics, machine learning and visualisation.",
    skills: ["Statistics", "Python / SQL", "Storytelling", "Modelling", "Critical Thinking"],
  },
  "Product Manager": {
    category: "Technology",
    description:
      "Lead the vision, strategy and roadmap of digital products — sitting at the intersection of design, engineering and business.",
    skills: ["Strategy", "Communication", "User Empathy", "Prioritisation", "Leadership"],
  },
  "Doctor": {
    category: "Healthcare",
    description:
      "Diagnose, treat and care for patients — combining science, empathy and precision under high stakes.",
    skills: ["Biology", "Diagnostics", "Empathy", "Decision Making", "Endurance"],
  },
  "Nurse": {
    category: "Healthcare",
    description:
      "Provide hands-on patient care, support recovery and act as the warm bridge between patients and doctors.",
    skills: ["Patient Care", "Empathy", "Calm Under Pressure", "Teamwork", "Medical Knowledge"],
  },
  "Physiotherapist": {
    category: "Healthcare",
    description:
      "Help people recover movement and strength after injury or surgery through guided physical treatment.",
    skills: ["Anatomy", "Motivation", "Hands-on Therapy", "Patience", "Exercise Science"],
  },
  "Psychologist": {
    category: "Healthcare",
    description:
      "Understand the human mind and help people work through emotions, behaviour and mental wellbeing.",
    skills: ["Active Listening", "Empathy", "Research", "Communication", "Critical Thinking"],
  },
  "Pharmacist": {
    category: "Healthcare",
    description:
      "Be the medication expert — guiding patients, doctors and pharmacies on safe and effective drug use.",
    skills: ["Chemistry", "Attention to Detail", "Counselling", "Pharmacology", "Ethics"],
  },
  "Entrepreneur": {
    category: "Business & Finance",
    description:
      "Spot opportunities, build companies from zero and lead teams to turn ideas into thriving businesses.",
    skills: ["Vision", "Risk Tolerance", "Leadership", "Sales", "Resilience"],
  },
  "Marketing Manager": {
    category: "Business & Finance",
    description:
      "Craft the story of a brand and connect products with the people who need them through campaigns and content.",
    skills: ["Storytelling", "Strategy", "Analytics", "Creativity", "Consumer Psychology"],
  },
  "Business Analyst": {
    category: "Business & Finance",
    description:
      "Investigate business problems and design data-driven solutions that improve how companies operate.",
    skills: ["Analytics", "Process Design", "Communication", "SQL", "Stakeholder Management"],
  },
  "Financial Analyst": {
    category: "Business & Finance",
    description:
      "Crunch numbers, model scenarios and guide companies on smart investment and money decisions.",
    skills: ["Modelling", "Excel", "Markets", "Logical Thinking", "Forecasting"],
  },
  "Accountant": {
    category: "Business & Finance",
    description:
      "Be the trusted keeper of the financial story — accuracy, structure and compliance over flash.",
    skills: ["Numeracy", "Attention to Detail", "Compliance", "Ethics", "Reporting"],
  },
  "Lawyer": {
    category: "Law",
    description:
      "Argue, advise and protect — translate complex laws into outcomes that shape businesses and lives.",
    skills: ["Argumentation", "Research", "Writing", "Logic", "Public Speaking"],
  },
  "Criminologist": {
    category: "Law",
    description:
      "Study why crime happens and how to prevent it — at the crossroads of psychology, sociology and law.",
    skills: ["Research", "Psychology", "Analytical Thinking", "Investigation", "Reporting"],
  },
  "Architect": {
    category: "Architecture & Design",
    description:
      "Design buildings and spaces that balance beauty, function and the way humans actually live.",
    skills: ["Design Thinking", "Drafting", "Spatial Awareness", "Creativity", "Engineering Basics"],
  },
  "Interior Designer": {
    category: "Architecture & Design",
    description:
      "Shape how a room feels — from materials and lighting to layout, mood and identity.",
    skills: ["Aesthetic Sense", "Materials", "Client Empathy", "Sketching", "Project Management"],
  },
  "Urban Planner": {
    category: "Architecture & Design",
    description:
      "Design the future of cities — how people move, live, work and breathe in shared spaces.",
    skills: ["Systems Thinking", "Policy", "Geography", "Data", "Stakeholder Empathy"],
  },
  "UX Designer": {
    category: "Architecture & Design",
    description:
      "Make digital products feel obvious, delightful and human — turning research into intuitive interfaces.",
    skills: ["User Research", "Wireframing", "Visual Design", "Empathy", "Prototyping"],
  },
  "Graphic Designer": {
    category: "Architecture & Design",
    description:
      "Communicate visually — through brands, posters, motion and identity systems that capture attention.",
    skills: ["Typography", "Layout", "Colour", "Software Tools", "Creative Concept"],
  },
  "Civil Engineer": {
    category: "Engineering",
    description:
      "Build the physical world — bridges, roads, buildings and the systems cities depend on.",
    skills: ["Mathematics", "Structural Design", "Project Management", "Site Work", "Safety"],
  },
  "Mechanical Engineer": {
    category: "Engineering",
    description:
      "Design machines, engines and physical products — from electric vehicles to robots.",
    skills: ["Physics", "CAD", "Problem Solving", "Manufacturing", "Material Science"],
  },
  "Teacher": {
    category: "Education",
    description:
      "Shape the next generation by making complex ideas understandable, exciting and unforgettable.",
    skills: ["Communication", "Patience", "Subject Mastery", "Empathy", "Classroom Management"],
  },
  "Sports Coach": {
    category: "Sports",
    description:
      "Develop athletes and teams — combining strategy, motivation and deep understanding of the sport.",
    skills: ["Leadership", "Sport IQ", "Motivation", "Tactical Thinking", "Communication"],
  },
  "Sports Scientist": {
    category: "Sports",
    description:
      "Apply physiology, biomechanics and data to make athletes faster, stronger and injury-free.",
    skills: ["Physiology", "Data Analysis", "Biomechanics", "Programming Training", "Research"],
  },
  "Film Producer": {
    category: "Media",
    description:
      "Bring stories to the screen — orchestrating scripts, money, talent and production into films audiences love.",
    skills: ["Storytelling", "Project Management", "Negotiation", "Creative Vision", "Finance"],
  },
  "Animator": {
    category: "Media",
    description:
      "Bring characters and worlds to life — through 2D, 3D and motion that audiences feel.",
    skills: ["Drawing", "Motion", "Software (Blender / Adobe)", "Storytelling", "Patience"],
  },
  "Actor": {
    category: "Media",
    description:
      "Step into other lives — using voice, body and emotion to make stories feel real on stage and screen.",
    skills: ["Emotional Range", "Memorisation", "Voice", "Improvisation", "Resilience"],
  },
  "Content Creator": {
    category: "Media",
    description:
      "Build an audience by creating videos, posts and stories that entertain, educate or inspire.",
    skills: ["Storytelling", "Editing", "Consistency", "Personal Brand", "Trend Awareness"],
  },
};

export const CAREER_NAMES = Object.keys(CAREERS);

// Round 1
export const ROUND_1 = [
  {
    id: "q1",
    round: 1,
    title: "What stage are you in?",
    helper: "We'll tailor recommendations to where you are.",
    scoring: false,
    options: [
      { value: "high_school", label: "High School Student" },
      { value: "university", label: "University Student" },
      { value: "graduate", label: "Graduate" },
      { value: "working", label: "Working Professional" },
    ],
  },
  {
    id: "q2",
    round: 1,
    title: "What matters most in a career?",
    helper: "Pick the one closest to your truth.",
    scoring: true,
    options: [
      {
        value: "salary",
        label: "High Salary",
        careers: ["Software Engineer", "Entrepreneur", "Financial Analyst", "Lawyer", "Doctor"],
      },
      {
        value: "passion",
        label: "Passion",
        careers: ["Actor", "Content Creator", "Entrepreneur", "Sports Coach", "Animator"],
      },
      {
        value: "stability",
        label: "Stability",
        careers: ["Accountant", "Teacher", "Nurse", "Civil Engineer", "Pharmacist"],
      },
      {
        value: "balance",
        label: "Work-Life Balance",
        careers: ["Teacher", "UX Designer", "Graphic Designer", "Physiotherapist", "Accountant"],
      },
      {
        value: "impact",
        label: "Making an Impact",
        careers: ["Doctor", "Teacher", "Psychologist", "Urban Planner", "Lawyer"],
      },
    ],
  },
  {
    id: "q3",
    round: 1,
    title: "If money was guaranteed, what would you spend most of your time doing?",
    helper: "The honest answer, not the impressive one.",
    scoring: true,
    options: [
      {
        value: "building",
        label: "Building Things",
        careers: ["Software Engineer", "Civil Engineer", "Mechanical Engineer", "Architect", "AI Engineer"],
      },
      {
        value: "helping",
        label: "Helping People",
        careers: ["Doctor", "Nurse", "Teacher", "Psychologist", "Physiotherapist"],
      },
      {
        value: "creating",
        label: "Creating Things",
        careers: ["Animator", "Graphic Designer", "Film Producer", "Content Creator", "UX Designer"],
      },
      {
        value: "leading",
        label: "Leading People",
        careers: ["Entrepreneur", "Product Manager", "Marketing Manager", "Sports Coach", "Business Analyst"],
      },
      {
        value: "competing",
        label: "Competing & Performing",
        careers: ["Sports Coach", "Actor", "Entrepreneur", "Sports Scientist", "Lawyer"],
      },
    ],
  },
];

// Round 2
export const ROUND_2 = [
  {
    id: "q4",
    round: 2,
    title: "Which YouTube rabbit hole would keep you watching for 3 hours?",
    helper: "Be honest — the one you'd actually click.",
    scoring: true,
    options: [
      { value: "tech", label: "Tech & AI", careers: ["AI Engineer", "Software Engineer", "Data Scientist", "Cybersecurity Analyst", "Product Manager"] },
      { value: "startups", label: "Business & Startups", careers: ["Entrepreneur", "Business Analyst", "Marketing Manager", "Product Manager", "Financial Analyst"] },
      { value: "medicine", label: "Medicine & Health", careers: ["Doctor", "Nurse", "Pharmacist", "Physiotherapist", "Psychologist"] },
      { value: "sports", label: "Sports", careers: ["Sports Coach", "Sports Scientist", "Physiotherapist", "Actor"] },
      { value: "psychology", label: "Psychology & Human Behaviour", careers: ["Psychologist", "Teacher", "UX Designer", "Marketing Manager", "Criminologist"] },
      { value: "design", label: "Design & Creativity", careers: ["Graphic Designer", "UX Designer", "Interior Designer", "Animator", "Architect"] },
      { value: "law", label: "Law & Crime", careers: ["Lawyer", "Criminologist", "Cybersecurity Analyst"] },
    ],
  },
  {
    id: "q5",
    round: 2,
    title: "Which headline would you click first?",
    helper: "Instinct, not strategy.",
    scoring: true,
    options: [
      { value: "google", label: "How Google built its search engine", careers: ["Software Engineer", "AI Engineer", "Data Scientist", "Product Manager"] },
      { value: "unicorn", label: "How a startup became worth $1 billion", careers: ["Entrepreneur", "Business Analyst", "Marketing Manager", "Financial Analyst"] },
      { value: "surgery", label: "How surgeons performed a rare operation", careers: ["Doctor", "Nurse", "Pharmacist", "Physiotherapist"] },
      { value: "cricket", label: "How a cricket player reached the international level", careers: ["Sports Coach", "Sports Scientist", "Actor"] },
      { value: "hack", label: "How hackers breached a major company", careers: ["Cybersecurity Analyst", "Software Engineer", "Criminologist"] },
      { value: "movie", label: "How a famous movie was created", careers: ["Film Producer", "Animator", "Actor", "Content Creator", "Graphic Designer"] },
      { value: "case", label: "How a lawyer won a difficult case", careers: ["Lawyer", "Criminologist", "Psychologist"] },
    ],
  },
  {
    id: "q6",
    round: 2,
    title: "Which problem would you enjoy solving?",
    helper: "Pick the one that energises rather than drains you.",
    scoring: true,
    options: [
      { value: "systems", label: "Computer systems failing", careers: ["Software Engineer", "Cybersecurity Analyst", "AI Engineer", "Data Scientist"] },
      { value: "money", label: "A business losing money", careers: ["Business Analyst", "Financial Analyst", "Marketing Manager", "Accountant", "Entrepreneur"] },
      { value: "patient", label: "A patient needing treatment", careers: ["Doctor", "Nurse", "Pharmacist", "Physiotherapist", "Psychologist"] },
      { value: "team", label: "A team performing poorly", careers: ["Sports Coach", "Product Manager", "Marketing Manager", "Entrepreneur"] },
      { value: "design", label: "A design not attracting users", careers: ["UX Designer", "Graphic Designer", "Product Manager", "Marketing Manager", "Interior Designer"] },
      { value: "athlete", label: "An athlete not improving", careers: ["Sports Coach", "Sports Scientist", "Physiotherapist"] },
      { value: "city", label: "A city needing better infrastructure", careers: ["Civil Engineer", "Urban Planner", "Architect", "Mechanical Engineer"] },
    ],
  },
  {
    id: "q7",
    round: 2,
    title: "Which achievement sounds most exciting?",
    helper: "If you could put any one of these on your resume.",
    scoring: true,
    options: [
      { value: "app", label: "Building a successful app", careers: ["Software Engineer", "AI Engineer", "Product Manager", "UX Designer"] },
      { value: "company", label: "Starting a successful company", careers: ["Entrepreneur", "Business Analyst", "Marketing Manager", "Financial Analyst"] },
      { value: "life", label: "Saving someone's life", careers: ["Doctor", "Nurse", "Pharmacist", "Physiotherapist"] },
      { value: "championship", label: "Winning a championship", careers: ["Sports Coach", "Sports Scientist", "Actor"] },
      { value: "vuln", label: "Discovering a major security vulnerability", careers: ["Cybersecurity Analyst", "Software Engineer", "Criminologist"] },
      { value: "millions", label: "Creating something seen by millions", careers: ["Film Producer", "Animator", "Actor", "Content Creator", "Graphic Designer"] },
      { value: "landmark", label: "Designing a landmark building", careers: ["Architect", "Interior Designer", "Urban Planner", "Civil Engineer"] },
    ],
  },
  {
    id: "q8",
    round: 2,
    title: "What kind of challenge energizes you?",
    helper: "The kind you'd lose track of time solving.",
    scoring: true,
    options: [
      { value: "technical", label: "Technical challenges", careers: ["Software Engineer", "AI Engineer", "Cybersecurity Analyst", "Data Scientist", "Mechanical Engineer", "Civil Engineer"] },
      { value: "human", label: "Human challenges", careers: ["Psychologist", "Teacher", "Nurse", "Doctor", "Marketing Manager"] },
      { value: "creative", label: "Creative challenges", careers: ["Graphic Designer", "Animator", "Film Producer", "UX Designer", "Interior Designer", "Architect", "Content Creator"] },
      { value: "physical", label: "Physical challenges", careers: ["Sports Coach", "Sports Scientist", "Actor", "Physiotherapist"] },
      { value: "strategic", label: "Strategic challenges", careers: ["Entrepreneur", "Business Analyst", "Financial Analyst", "Lawyer", "Product Manager", "Accountant"] },
    ],
  },
  {
    id: "q9",
    round: 2,
    title: "If you could instantly become world-class in ONE field tomorrow, which would you choose?",
    helper: "The dream answer — no qualifiers, no doubts.",
    scoring: true,
    weight: 2, // double the weight for this signature question
    options: [
      { value: "se", label: "Software Engineering", careers: ["Software Engineer", "AI Engineer", "Product Manager"] },
      { value: "entre", label: "Entrepreneurship", careers: ["Entrepreneur", "Business Analyst", "Marketing Manager"] },
      { value: "cyber", label: "Cybersecurity", careers: ["Cybersecurity Analyst", "Software Engineer"] },
      { value: "ai", label: "Artificial Intelligence", careers: ["AI Engineer", "Data Scientist", "Software Engineer"] },
      { value: "med", label: "Medicine", careers: ["Doctor", "Nurse", "Pharmacist", "Physiotherapist"] },
      { value: "fin", label: "Finance", careers: ["Financial Analyst", "Accountant", "Business Analyst"] },
      { value: "arch", label: "Architecture", careers: ["Architect", "Interior Designer", "Urban Planner", "Civil Engineer"] },
      { value: "sport", label: "Sports", careers: ["Sports Coach", "Sports Scientist", "Actor"] },
      { value: "psych", label: "Psychology", careers: ["Psychologist", "Teacher", "Criminologist"] },
      { value: "film", label: "Film & Media", careers: ["Film Producer", "Animator", "Actor", "Content Creator"] },
    ],
  },
];

export const QUESTIONS = [...ROUND_1, ...ROUND_2];
