
export type Guardian = {
  name: string
  contactNumber: string
  email?: string
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
  // NURSERY 2
  {
    id: "BPS-001",
    name: "Agboola Jasmine",
    class: "Nursery 2",
    gender: "Female",
    dateOfBirth: "2020-05-12",
    guardians: [{ name: "Mr. and Mrs. Agboola", contactNumber: "+2348000000001", email: "parent@example.com" }],
    enrollmentDate: "2023-09-05",
  },
  {
    id: "BPS-002",
    name: "Ewuzie Angela",
    class: "Nursery 2",
    gender: "Female",
    dateOfBirth: "2020-08-21",
    guardians: [{ name: "Mr. and Mrs. Ewuzie", contactNumber: "+2348000000002" }],
    enrollmentDate: "2023-09-05",
  },
  {
    id: "BPS-003",
    name: "Chimezie Dominion",
    class: "Nursery 2",
    gender: "Male",
    dateOfBirth: "2020-02-18",
    guardians: [{ name: "Mr. and Mrs. Chimezie", contactNumber: "+2348000000003" }],
    enrollmentDate: "2023-09-06",
  },
  {
    id: "BPS-004",
    name: "Inegbenose Gerald",
    class: "Nursery 2",
    gender: "Male",
    dateOfBirth: "2019-11-03",
    guardians: [{ name: "Mr. and Mrs. Inegbenose", contactNumber: "+2348000000004" }],
    enrollmentDate: "2023-09-06",
  },
  {
    id: "BPS-005",
    name: "Kazeem Iremide",
    class: "Nursery 2",
    gender: "Male",
    dateOfBirth: "2020-01-27",
    guardians: [{ name: "Mr. and Mrs. Kazeem", contactNumber: "+2348000000005" }],
    enrollmentDate: "2023-09-07",
  },
  {
    id: "BPS-006",
    name: "Fakuade Mirabel",
    class: "Nursery 2",
    gender: "Female",
    dateOfBirth: "2020-06-14",
    guardians: [{ name: "Mr. and Mrs. Fakuade", contactNumber: "+2348000000006" }],
    enrollmentDate: "2023-09-07",
  },

  // NURSERY 1
  {
    id: "BPS-007",
    name: "Adebero Ayomide",
    class: "Nursery 1",
    gender: "Female",
    dateOfBirth: "2021-03-10",
    guardians: [{ name: "Mr. and Mrs. Adebero", contactNumber: "+2348000000007" }],
    enrollmentDate: "2023-09-08",
  },
  {
    id: "BPS-008",
    name: "Adedoyin Jedidah",
    class: "Nursery 1",
    gender: "Female",
    dateOfBirth: "2021-07-19",
    guardians: [{ name: "Mr. and Mrs. Adedoyin", contactNumber: "+2348000000008" }],
    enrollmentDate: "2023-09-08",
  },
  {
    id: "BPS-009",
    name: "Adeshida David",
    class: "Nursery 1",
    gender: "Male",
    dateOfBirth: "2021-01-05",
    guardians: [{ name: "Mr. and Mrs. Adeshida", contactNumber: "+2348000000009" }],
    enrollmentDate: "2023-09-09",
  },
  {
    id: "BPS-010",
    name: "Emokpea Louisa",
    class: "Nursery 1",
    gender: "Female",
    dateOfBirth: "2021-05-22",
    guardians: [{ name: "Mr. and Mrs. Emokpea", contactNumber: "+2348000000010" }],
    enrollmentDate: "2023-09-09",
  },
  {
    id: "BPS-011",
    name: "Ohiomah Davina",
    class: "Nursery 1",
    gender: "Female",
    dateOfBirth: "2021-09-15",
    guardians: [{ name: "Mr. and Mrs. Ohiomah", contactNumber: "+2348000000011" }],
    enrollmentDate: "2023-09-10",
  },
  {
    id: "BPS-012",
    name: "Akpan Light",
    class: "Nursery 1",
    gender: "Male",
    dateOfBirth: "2021-02-28",
    guardians: [{ name: "Mr. and Mrs. Akpan", contactNumber: "+2348000000012" }],
    enrollmentDate: "2023-09-10",
  },
  {
    id: "BPS-013",
    name: "Ose-Amen Serahgolden",
    class: "Nursery 1",
    gender: "Female",
    dateOfBirth: "2021-11-11",
    guardians: [{ name: "Mr. and Mrs. Ose-Amen", contactNumber: "+2348000000013" }],
    enrollmentDate: "2023-09-11",
  },

  // PRESCHOOL 2
  {
    id: "BPS-014",
    name: "Onafadeji Zemirah",
    class: "Preschool 2",
    gender: "Female",
    dateOfBirth: "2022-04-12",
    guardians: [{ name: "Mr. and Mrs. Onafadeji", contactNumber: "+2348000000014" }],
    enrollmentDate: "2024-09-05",
  },
  {
    id: "BPS-015",
    name: "Popoola Adekiisha",
    class: "Preschool 2",
    gender: "Female",
    dateOfBirth: "2022-06-25",
    guardians: [{ name: "Mr. and Mrs. Popoola", contactNumber: "+2348000000015" }],
    enrollmentDate: "2024-09-05",
  },
  {
    id: "BPS-016",
    name: "Kareem Jayden",
    class: "Preschool 2",
    gender: "Male",
    dateOfBirth: "2022-01-30",
    guardians: [{ name: "Mr. and Mrs. Kareem", contactNumber: "+2348000000016" }],
    enrollmentDate: "2024-09-06",
  },
  {
    id: "BPS-017",
    name: "Ikejimba Tonia",
    class: "Preschool 2",
    gender: "Female",
    dateOfBirth: "2022-08-14",
    guardians: [{ name: "Mr. and Mrs. Ikejimba", contactNumber: "+2348000000017" }],
    enrollmentDate: "2024-09-06",
  },
  {
    id: "BPS-018",
    name: "Afolabi Ezekiel",
    class: "Preschool 2",
    gender: "Male",
    dateOfBirth: "2022-03-03",
    guardians: [{ name: "Mr. and Mrs. Afolabi", contactNumber: "+2348000000018" }],
    enrollmentDate: "2024-09-07",
  },
  {
    id: "BPS-019",
    name: "Adeshina Khalid",
    class: "Preschool 2",
    gender: "Male",
    dateOfBirth: "2022-05-20",
    guardians: [{ name: "Mr. and Mrs. Adeshina", contactNumber: "+2348000000019" }],
    enrollmentDate: "2024-09-07",
  },
  {
    id: "BPS-020",
    name: "George Angel",
    class: "Preschool 2",
    gender: "Female",
    dateOfBirth: "2022-09-09",
    guardians: [{ name: "Mr. and Mrs. George", contactNumber: "+2348000000020" }],
    enrollmentDate: "2024-09-08",
  },

  // PRESCHOOL 1
  {
    id: "BPS-021",
    name: "Agboola Anita",
    class: "Preschool 1",
    gender: "Female",
    dateOfBirth: "2023-02-15",
    guardians: [{ name: "Mr. and Mrs. Agboola", contactNumber: "+2348000000021" }],
    enrollmentDate: "2025-09-05",
  },
  {
    id: "BPS-022",
    name: "Adeyemo Micah",
    class: "Preschool 1",
    gender: "Male",
    dateOfBirth: "2023-05-10",
    guardians: [{ name: "Mr. and Mrs. Adeyemo", contactNumber: "+2348000000022" }],
    enrollmentDate: "2025-09-05",
  },
  {
    id: "BPS-023",
    name: "Opara Elyon",
    class: "Preschool 1",
    gender: "Female",
    dateOfBirth: "2023-08-22",
    guardians: [{ name: "Mr. and Mrs. Opara", contactNumber: "+2348000000023" }],
    enrollmentDate: "2025-09-06",
  },
  {
    id: "BPS-024",
    name: "Sha Fahiza",
    class: "Preschool 1",
    gender: "Female",
    dateOfBirth: "2023-01-05",
    guardians: [{ name: "Mr. and Mrs. Sha", contactNumber: "+2348000000024" }],
    enrollmentDate: "2025-09-06",
  },
  {
    id: "BPS-025",
    name: "Inegbenose Harry",
    class: "Preschool 1",
    gender: "Male",
    dateOfBirth: "2023-11-12",
    guardians: [{ name: "Mr. and Mrs. Inegbenose", contactNumber: "+2348000000025" }],
    enrollmentDate: "2025-09-07",
  },
  {
    id: "BPS-026",
    name: "Harrison Nathan",
    class: "Preschool 1",
    gender: "Male",
    dateOfBirth: "2023-04-18",
    guardians: [{ name: "Mr. and Mrs. Harrison", contactNumber: "+2348000000026" }],
    enrollmentDate: "2025-09-07",
  },
  {
    id: "BPS-027",
    name: "Eke Star",
    class: "Preschool 1",
    gender: "Female",
    dateOfBirth: "2023-07-30",
    guardians: [{ name: "Mr. and Mrs. Eke", contactNumber: "+2348000000027" }],
    enrollmentDate: "2025-09-08",
  },
  {
    id: "BPS-028",
    name: "Agbonyin Hephzibah",
    class: "Preschool 1",
    gender: "Female",
    dateOfBirth: "2023-10-05",
    guardians: [{ name: "Mr. and Mrs. Agbonyin", contactNumber: "+2348000000028" }],
    enrollmentDate: "2025-09-08",
  },
  {
    id: "BPS-029",
    name: "Oguike Joy",
    class: "Preschool 1",
    gender: "Female",
    dateOfBirth: "2023-12-25",
    guardians: [{ name: "Mr. and Mrs. Oguike", contactNumber: "+2348000000029" }],
    enrollmentDate: "2025-09-09",
  },

  // PLAYGROUP
  {
    id: "BPS-030",
    name: "Fagade Samuel",
    class: "Playgroup",
    gender: "Male",
    dateOfBirth: "2024-02-14",
    guardians: [{ name: "Mr. and Mrs. Fagade", contactNumber: "+2348000000030" }],
    enrollmentDate: "2025-09-10",
  },
  {
    id: "BPS-031",
    name: "Innocent Jotham",
    class: "Playgroup",
    gender: "Male",
    dateOfBirth: "2024-04-01",
    guardians: [{ name: "Mr. and Mrs. Innocent", contactNumber: "+2348000000031" }],
    enrollmentDate: "2025-09-10",
  },
  {
    id: "BPS-032",
    name: "Popoola Adekiisha",
    class: "Playgroup",
    gender: "Female",
    dateOfBirth: "2024-06-15",
    guardians: [{ name: "Mr. and Mrs. Popoola", contactNumber: "+2348000000032" }],
    enrollmentDate: "2025-09-11",
  },
  {
    id: "BPS-033",
    name: "Ayotunde Nabeel",
    class: "Playgroup",
    gender: "Male",
    dateOfBirth: "2024-01-20",
    guardians: [{ name: "Mr. and Mrs. Ayotunde", contactNumber: "+2348000000033" }],
    enrollmentDate: "2025-09-11",
  },
  {
    id: "BPS-034",
    name: "Okonkwo Marvelous",
    class: "Playgroup",
    gender: "Male",
    dateOfBirth: "2024-05-05",
    guardians: [{ name: "Mr. and Mrs. Okonkwo", contactNumber: "+2348000000034" }],
    enrollmentDate: "2025-09-12",
  },
  {
    id: "BPS-035",
    name: "Jejeola Diadem",
    class: "Playgroup",
    gender: "Female",
    dateOfBirth: "2024-03-30",
    guardians: [{ name: "Mr. and Mrs. Jejeola", contactNumber: "+2348000000035" }],
    enrollmentDate: "2025-09-12",
  },
  {
    id: "BPS-036",
    name: "Odunsanya Valera",
    class: "Playgroup",
    gender: "Female",
    dateOfBirth: "2024-07-07",
    guardians: [{ name: "Mr. and Mrs. Odunsanya", contactNumber: "+2348000000036" }],
    enrollmentDate: "2025-09-13",
  },
  {
    id: "BPS-037",
    name: "Lamidi Zoey",
    class: "Playgroup",
    gender: "Female",
    dateOfBirth: "2024-08-20",
    guardians: [{ name: "Mr. and Mrs. Lamidi", contactNumber: "+2348000000037" }],
    enrollmentDate: "2025-09-13",
  },
]

export type Class = {
  id: string
  name: string
  description: string
  ageRange: string
  teacherName: string
  pupilCount: number
  subjects: string[]
}

export const classesData: Class[] = [
  {
    id: "class-001",
    name: "Creche",
    description: "A warm, nurturing environment for your little ones. We focus on sensory play and basic motor skills.",
    ageRange: "3 months - 1.5 years",
    teacherName: "Omotosho Mary",
    pupilCount: 0,
    subjects: ["Sensory Play", "Music", "Tummy Time", "Story Telling"],
  },
  {
    id: "class-002",
    name: "Nursery 1",
    description:
      "Introduction to structured learning. Children learn basics of numbers, alphabets, and social interaction.",
    ageRange: "1.5 - 2 years",
    teacherName: "Adegoke Oluwatosin Elizabeth",
    pupilCount: 7,
    subjects: ["Numeracy", "Literacy", "Art & Craft", "Rhymes", "Nature Talk"],
  },
  {
    id: "class-003",
    name: "Nursery 2",
    description:
      "Building on the foundation. More focus on writing, reading simple words, and understanding the world around them.",
    ageRange: "2-3 years",
    teacherName: "Alexander Anwangabasi Joy",
    pupilCount: 6,
    subjects: ["Numeracy", "Literacy", "Phonics", "General Science", "Handwriting"],
  },
  {
    id: "class-004",
    name: "Playgroup",
    description:
      "An introductory program that helps children adjust to school routines through guided play and social interaction.",
    ageRange: "18 months - 3 years",
    teacherName: "Teniola Feluntoluwa Christiana",
    pupilCount: 8,
    subjects: ["Free Play", "Circle Time", "Music & Movement", "Outdoor Play"],
  },
  {
    id: "class-005",
    name: "Preschool 1",
    description:
      "For children progressing from playgroup. Focused on language development, number sense, and social confidence.",
    ageRange: "3-4 years",
    teacherName: "Akinmade Oluwaferanmi",
    pupilCount: 9,
    subjects: ["Pre-reading", "Pre-writing", "Numbers", "Practical Life", "Rhymes", "Story Time"],
  },
  {
    id: "class-006",
    name: "Preschool 2",
    description:
      "For children preparing to enter Nursery 1. Reinforces pre-academic skills, independence, and classroom routines.",
    ageRange: "4-5 years",
    teacherName: "Damisa Yetunde Halimat",
    pupilCount: 7,
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
    pupilId: "BPS-001",
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
    pupilId: "BPS-008",
    pupilName: "Adedoyin Jedidah",
    class: "Nursery 1",
    term: "Term 2",
    averageScore: 82.3,
    grade: "A",
    date: "2023-03-15",
    status: "Published",
  },
  {
    id: "R003",
    pupilId: "BPS-016",
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
    pupilId: "BPS-006",
    pupilName: "Fakuade Mirabel",
    class: "Nursery 2",
    term: "Term 2",
    averageScore: 91.2,
    grade: "A",
    date: "2023-03-14",
    status: "Published",
  },
  {
    id: "R005",
    pupilId: "BPS-011",
    pupilName: "Ohiomah Davina",
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
    return academicAverage + attendanceScore
}
