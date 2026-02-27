
export type Guardian = {
  name: string
  contactNumber: string
}

export type Pupil = {
  id: string
  name: string
  class: string
  gender: string
  dateOfBirth: string
  guardians: Guardian[]
  enrollmentDate: string
}

export const pupilsData: Pupil[] = [
  // Nursery 2
  {
    id: "BH-N2-001",
    name: "Agboola Jasmine",
    class: "Nursery 2",
    gender: "Female",
    dateOfBirth: "2020-05-12",
    guardians: [{ name: "Mr. and Mrs. Agboola", contactNumber: "+2348000000001" }],
    enrollmentDate: "2023-09-05",
  },
  {
    id: "BH-N2-002",
    name: "Ewuzie Angela",
    class: "Nursery 2",
    gender: "Female",
    dateOfBirth: "2020-08-21",
    guardians: [{ name: "Mr. and Mrs. Ewuzie", contactNumber: "+2348000000002" }],
    enrollmentDate: "2023-09-05",
  },
  {
    id: "BH-N2-003",
    name: "Chimezie Dominion",
    class: "Nursery 2",
    gender: "Male",
    dateOfBirth: "2020-02-18",
    guardians: [{ name: "Mr. and Mrs. Chimezie", contactNumber: "+2348000000003" }],
    enrollmentDate: "2023-09-06",
  },
  {
    id: "BH-N2-004",
    name: "Inegbeneoe Gerald",
    class: "Nursery 2",
    gender: "Male",
    dateOfBirth: "2019-11-03",
    guardians: [{ name: "Mr. and Mrs. Inegbeneoe", contactNumber: "+2348000000004" }],
    enrollmentDate: "2023-09-06",
  },
  {
    id: "BH-N2-005",
    name: "Kazeem Imide",
    class: "Nursery 2",
    gender: "Male",
    dateOfBirth: "2020-01-27",
    guardians: [{ name: "Mr. and Mrs. Kazeem", contactNumber: "+2348000000005" }],
    enrollmentDate: "2023-09-07",
  },
  {
    id: "BH-N2-006",
    name: "Fakude Mabel",
    class: "Nursery 2",
    gender: "Female",
    dateOfBirth: "2020-06-14",
    guardians: [{ name: "Mr. and Mrs. Fakude", contactNumber: "+2348000000006" }],
    enrollmentDate: "2023-09-07",
  },
  // Nursery 1
  {
    id: "BH-N1-001",
    name: "Adebayo Ayomide",
    class: "Nursery 1",
    gender: "Female",
    dateOfBirth: "2021-03-10",
    guardians: [{ name: "Mr. and Mrs. Adebayo", contactNumber: "+2348000000007" }],
    enrollmentDate: "2023-09-08",
  },
  {
    id: "BH-N1-002",
    name: "Adedoyin Judith",
    class: "Nursery 1",
    gender: "Female",
    dateOfBirth: "2021-07-19",
    guardians: [{ name: "Mr. and Mrs. Adedoyin", contactNumber: "+2348000000008" }],
    enrollmentDate: "2023-09-08",
  },
  {
    id: "BH-N1-003",
    name: "Adeshida Fiyin",
    class: "Nursery 1",
    gender: "Female",
    dateOfBirth: "2021-01-05",
    guardians: [{ name: "Mr. and Mrs. Adeshida", contactNumber: "+2348000000009" }],
    enrollmentDate: "2023-09-09",
  },
  {
    id: "BH-N1-004",
    name: "Emokpea Louisa",
    class: "Nursery 1",
    gender: "Female",
    dateOfBirth: "2021-09-23",
    guardians: [{ name: "Mr. and Mrs. Emokpea", contactNumber: "+2348000000010" }],
    enrollmentDate: "2023-09-09",
  },
  {
    id: "BH-N1-005",
    name: "Ohiomah Divine",
    class: "Nursery 1",
    gender: "Female",
    dateOfBirth: "2021-05-30",
    guardians: [{ name: "Mr. and Mrs. Ohiomah", contactNumber: "+2348000000011" }],
    enrollmentDate: "2023-09-10",
  },
  {
    id: "BH-N1-006",
    name: "Akpan Light",
    class: "Nursery 1",
    gender: "Male",
    dateOfBirth: "2021-11-12",
    guardians: [{ name: "Mr. and Mrs. Akpan", contactNumber: "+2348000000012" }],
    enrollmentDate: "2023-09-10",
  },
  {
    id: "BH-N1-007",
    name: "Ose-Amen Greatgolden",
    class: "Nursery 1",
    gender: "Male",
    dateOfBirth: "2021-08-08",
    guardians: [{ name: "Mr. and Mrs. Ose-Amen", contactNumber: "+2348000000013" }],
    enrollmentDate: "2023-09-11",
  },
  // Preschool 2
  {
    id: "BH-PS2-001",
    name: "Onadefeji Zemirah",
    class: "Preschool 2",
    gender: "Female",
    dateOfBirth: "2022-02-14",
    guardians: [{ name: "Mr. and Mrs. Onadefeji", contactNumber: "+2348000000014" }],
    enrollmentDate: "2024-09-05",
  },
  {
    id: "BH-PS2-002",
    name: "Popoola Adekisha",
    class: "Preschool 2",
    gender: "Female",
    dateOfBirth: "2022-05-09",
    guardians: [{ name: "Mr. and Mrs. Popoola", contactNumber: "+2348000000015" }],
    enrollmentDate: "2024-09-05",
  },
  {
    id: "BH-PS2-003",
    name: "Kareem Jayden",
    class: "Preschool 2",
    gender: "Male",
    dateOfBirth: "2022-01-28",
    guardians: [{ name: "Mr. and Mrs. Kareem", contactNumber: "+2348000000016" }],
    enrollmentDate: "2024-09-06",
  },
  {
    id: "BH-PS2-004",
    name: "Ikejiuba Timile",
    class: "Preschool 2",
    gender: "Male",
    dateOfBirth: "2022-07-03",
    guardians: [{ name: "Mr. and Mrs. Ikejiuba", contactNumber: "+2348000000017" }],
    enrollmentDate: "2024-09-06",
  },
  {
    id: "BH-PS2-005",
    name: "Afolabi Ezekiel",
    class: "Preschool 2",
    gender: "Male",
    dateOfBirth: "2022-03-19",
    guardians: [{ name: "Mr. and Mrs. Afolabi", contactNumber: "+2348000000018" }],
    enrollmentDate: "2024-09-07",
  },
  {
    id: "BH-PS2-006",
    name: "Adeshina Khalid",
    class: "Preschool 2",
    gender: "Male",
    dateOfBirth: "2022-09-25",
    guardians: [{ name: "Mr. and Mrs. Adeshina", contactNumber: "+2348000000019" }],
    enrollmentDate: "2024-09-07",
  },
  {
    id: "BH-PS2-007",
    name: "George Angel",
    class: "Preschool 2",
    gender: "Female",
    dateOfBirth: "2022-11-30",
    guardians: [{ name: "Mr. and Mrs. George", contactNumber: "+2348000000020" }],
    enrollmentDate: "2024-09-08",
  },
  // Preschool 1
  {
    id: "BH-PS1-001",
    name: "Agboola Ajita",
    class: "Preschool 1",
    gender: "Female",
    dateOfBirth: "2023-02-10",
    guardians: [{ name: "Mr. and Mrs. Agboola", contactNumber: "+2348000000021" }],
    enrollmentDate: "2025-09-05",
  },
  {
    id: "BH-PS1-002",
    name: "Adeyemo Micah",
    class: "Preschool 1",
    gender: "Male",
    dateOfBirth: "2023-04-18",
    guardians: [{ name: "Mr. and Mrs. Adeyemo", contactNumber: "+2348000000022" }],
    enrollmentDate: "2025-09-05",
  },
  {
    id: "BH-PS1-003",
    name: "Ogara Elijah",
    class: "Preschool 1",
    gender: "Male",
    dateOfBirth: "2023-06-07",
    guardians: [{ name: "Mr. and Mrs. Ogara", contactNumber: "+2348000000023" }],
    enrollmentDate: "2025-09-06",
  },
  {
    id: "BH-PS1-004",
    name: "Sha Faiza",
    class: "Preschool 1",
    gender: "Female",
    dateOfBirth: "2023-01-25",
    guardians: [{ name: "Mr. and Mrs. Sha", contactNumber: "+2348000000024" }],
    enrollmentDate: "2025-09-06",
  },
  {
    id: "BH-PS1-005",
    name: "Ineghenose Harry",
    class: "Preschool 1",
    gender: "Male",
    dateOfBirth: "2023-05-13",
    guardians: [{ name: "Mr. and Mrs. Ineghenose", contactNumber: "+2348000000025" }],
    enrollmentDate: "2025-09-07",
  },
  {
    id: "BH-PS1-006",
    name: "Harrison Nathan",
    class: "Preschool 1",
    gender: "Male",
    dateOfBirth: "2023-08-02",
    guardians: [{ name: "Mr. and Mrs. Harrison", contactNumber: "+2348000000026" }],
    enrollmentDate: "2025-09-07",
  },
  {
    id: "BH-PS1-007",
    name: "Eke Star",
    class: "Preschool 1",
    gender: "Female",
    dateOfBirth: "2023-03-29",
    guardians: [{ name: "Mr. and Mrs. Eke", contactNumber: "+2348000000027" }],
    enrollmentDate: "2025-09-08",
  },
  {
    id: "BH-PS1-008",
    name: "Agboyin Jephzibah",
    class: "Preschool 1",
    gender: "Female",
    dateOfBirth: "2023-07-21",
    guardians: [{ name: "Mr. and Mrs. Agboyin", contactNumber: "+2348000000028" }],
    enrollmentDate: "2025-09-08",
  },
  {
    id: "BH-PS1-009",
    name: "Ogukie Joy",
    class: "Preschool 1",
    gender: "Female",
    dateOfBirth: "2023-09-11",
    guardians: [{ name: "Mr. and Mrs. Ogukie", contactNumber: "+2348000000029" }],
    enrollmentDate: "2025-09-09",
  },
  // Playgroup
  {
    id: "BH-PG-001",
    name: "Fagade Samuel",
    class: "Playgroup",
    gender: "Male",
    dateOfBirth: "2024-01-05",
    guardians: [{ name: "Mr. and Mrs. Fagade", contactNumber: "+2348000000030" }],
    enrollmentDate: "2025-09-10",
  },
  {
    id: "BH-PG-002",
    name: "Innocent Nathan",
    class: "Playgroup",
    gender: "Male",
    dateOfBirth: "2024-03-14",
    guardians: [{ name: "Mr. and Mrs. Innocent", contactNumber: "+2348000000031" }],
    enrollmentDate: "2025-09-10",
  },
  {
    id: "BH-PG-003",
    name: "Popoola Adekishi",
    class: "Playgroup",
    gender: "Female",
    dateOfBirth: "2024-05-22",
    guardians: [{ name: "Mr. and Mrs. Popoola", contactNumber: "+2348000000032" }],
    enrollmentDate: "2025-09-11",
  },
  {
    id: "BH-PG-004",
    name: "Ayowole Mabel",
    class: "Playgroup",
    gender: "Female",
    dateOfBirth: "2024-02-17",
    guardians: [{ name: "Mr. and Mrs. Ayowole", contactNumber: "+2348000000033" }],
    enrollmentDate: "2025-09-11",
  },
  {
    id: "BH-PG-005",
    name: "Okonkwo Marvelous",
    class: "Playgroup",
    gender: "Male",
    dateOfBirth: "2024-06-09",
    guardians: [{ name: "Mr. and Mrs. Okonkwo", contactNumber: "+2348000000034" }],
    enrollmentDate: "2025-09-12",
  },
  {
    id: "BH-PG-006",
    name: "Jecolua Diadem",
    class: "Playgroup",
    gender: "Female",
    dateOfBirth: "2024-04-28",
    guardians: [{ name: "Mr. and Mrs. Jecolua", contactNumber: "+2348000000035" }],
    enrollmentDate: "2025-09-12",
  },
  {
    id: "BH-PG-007",
    name: "Odunsanya Valera",
    class: "Playgroup",
    gender: "Female",
    dateOfBirth: "2024-08-16",
    guardians: [{ name: "Mr. and Mrs. Odunsanya", contactNumber: "+2348000000036" }],
    enrollmentDate: "2025-09-13",
  },
  {
    id: "BH-PG-008",
    name: "Lamidi Zody",
    class: "Playgroup",
    gender: "Male",
    dateOfBirth: "2024-10-03",
    guardians: [{ name: "Mr. and Mrs. Lamidi", contactNumber: "+2348000000037" }],
    enrollmentDate: "2025-09-13",
  },
]

export const classesData = [
  {
    id: "class-001",
    name: "Creche",
    description:
      "For children aged 3 months to 2 years. Focused on nurturing care, sensory play, and early development milestones.",
    ageRange: "3 months - 2 years",
    teacherName: "Alexander Anwangbasi Joy",
    pupilCount: 18,
    subjects: ["Motor Skills", "Social Interaction", "Basic Recognition", "Sensory Development"],
  },
  {
    id: "class-002",
    name: "Nursery 1",
    description:
      "For children aged 2-3 years. Introducing structured learning through play, basic concepts, and social skills.",
    ageRange: "2-3 years",
    teacherName: "Adegoke Oluwatosin Elizabeth",
    pupilCount: 28,
    subjects: ["Alphabets", "Numbers", "Coloring", "Rhymes", "Basic Writing", "Social Skills"],
  },
  {
    id: "class-003",
    name: "Nursery 2",
    description:
      "For children aged 3-4 years. Building pre-academic foundations, language development, and creative expression.",
    ageRange: "3-4 years",
    teacherName: "Teniola Fetinoluwa Christiana",
    pupilCount: 32,
    subjects: [
      "Reading",
      "Writing",
      "Arithmetic",
      "Arts & Crafts",
      "Science",
      "Social Studies",
      "Physical Education",
      "Music",
    ],
  },
  {
    id: "class-004",
    name: "Playgroup",
    description:
      "An introductory program that helps children adjust to school routines through guided play and social interaction.",
    ageRange: "18 months - 3 years",
    teacherName: "Fagade Samuel",
    pupilCount: 16,
    subjects: ["Free Play", "Circle Time", "Music & Movement", "Outdoor Play"],
  },
  {
    id: "class-005",
    name: "Preschool 1",
    description:
      "For children progressing from playgroup. Focused on language development, number sense, and social confidence.",
    ageRange: "3-4 years",
    teacherName: "Akinnade Oluwafemi",
    pupilCount: 20,
    subjects: ["Pre-reading", "Pre-writing", "Numbers", "Practical Life", "Rhymes", "Story Time"],
  },
  {
    id: "class-006",
    name: "Preschool 2",
    description:
      "For children preparing to enter Nursery 1. Reinforces pre-academic skills, independence, and classroom routines.",
    ageRange: "4-5 years",
    teacherName: "Damisa Yetunde Halimat",
    pupilCount: 22,
    subjects: ["Reading Readiness", "Writing Readiness", "Mathematics Concepts", "Science Exploration", "Art & Music"],
  },
]

export type ResultRecord = {
  id: string
  pupilId: string
  pupilName: string
  class: string
  term: string
  averageScore: number
  grade: string
  date: string
  status: string
  proprietressComment?: string
  attendancePercentage?: number
  attendanceScore?: number
  finalScore?: number
  scores?: Record<string, { midterm: string; exam: string }>
  teacherComment?: string
}

export const resultsData: ResultRecord[] = [
  {
    id: "R001",
    pupilId: "BH-N2-001",
    pupilName: "Agboola Jasmine",
    class: "Nursery 2",
    term: "Term 2",
    averageScore: 78.5,
    grade: "A",
    date: "2023-03-15",
    status: "Published",
  },
  {
    id: "R002",
    pupilId: "BH-N1-002",
    pupilName: "Adedoyin Judith",
    class: "Nursery 1",
    term: "Term 2",
    averageScore: 82.3,
    grade: "A",
    date: "2023-03-15",
    status: "Published",
  },
  {
    id: "R003",
    pupilId: "BH-PS2-003",
    pupilName: "Kareem Jayden",
    class: "Preschool 2",
    term: "Term 2",
    averageScore: 65.8,
    grade: "B",
    date: "2023-03-14",
    status: "Published",
  },
  {
    id: "R004",
    pupilId: "BH-N2-006",
    pupilName: "Fakude Mabel",
    class: "Nursery 2",
    term: "Term 2",
    averageScore: 91.2,
    grade: "A",
    date: "2023-03-14",
    status: "Published",
  },
  {
    id: "R005",
    pupilId: "BH-N1-005",
    pupilName: "Ohiomah Divine",
    class: "Nursery 1",
    term: "Term 2",
    averageScore: 88.5,
    grade: "A",
    date: "2023-03-14",
    status: "Published",
  },
]

export const calculateAttendanceScore = (attendancePercentage: number): number => {
    // Attendance score out of 5 based on percentage
    return Math.round((attendancePercentage / 100) * 5)
}

export const calculateFinalScore = (academicAverage: number, attendanceScore: number): number => {
    // Final score = Academic Average (e.g., out of 100) + Attendance Score (e.g., out of 5)
    // Or weighted average? For now, let's assume it's additive or weighted
    // If academic is 95% and attendance is 5/5, total could be 100
    // But usually academic is max 95? 
    // Let's assume academic is 100% and we add bonus? Or academic is scaled?
    
    // Simple implementation based on existing usage in edit page:
    return academicAverage + attendanceScore
}
