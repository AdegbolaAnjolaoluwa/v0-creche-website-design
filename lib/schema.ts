import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Users Table (Synced with Clerk via Webhooks mostly, but good for local joins)
export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // Clerk ID
  email: text('email').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  role: text('role').notNull().default('org:parent'), // org:admin, org:staff, org:parent
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// Results Table
export const results = sqliteTable('results', {
  id: text('id').primaryKey(),
  studentId: text('student_id').notNull(),
  studentName: text('student_name').notNull(),
  classId: text('class_id').notNull(),
  term: text('term').notNull(), // Term 1, Term 2, Term 3
  academicYear: text('academic_year').notNull(),
  subjects: text('subjects').notNull(), // JSON string of subjects and scores
  totalScore: integer('total_score').notNull(),
  averageScore: integer('average_score').notNull(),
  grade: text('grade').notNull(),
  teacherComment: text('teacher_comment'),
  headTeacherComment: text('head_teacher_comment'),
  status: text('status').notNull().default('Draft'), // Draft, Published
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// Classes Table
export const classes = sqliteTable('classes', {
  id: text('id').primaryKey(),
  name: text('name').notNull(), // Creche, Nursery 1, etc.
  description: text('description'),
  ageRange: text('age_range'),
  capacity: integer('capacity'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// Loan Requests Table
export const loanRequests = sqliteTable('loan_requests', {
  id: text('id').primaryKey(),
  staffId: text('staff_id').notNull(),
  staffEmail: text('staff_email'),
  staffName: text('staff_name').notNull(),
  amount: integer('amount').notNull(),
  reason: text('reason').notNull(),
  status: text('status').notNull().default('Pending'), // Pending, Approved, Rejected
  approvedBy: text('approved_by'), // Admin ID
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// Staff Assignments Table
export const staffAssignments = sqliteTable('staff_assignments', {
  id: text('id').primaryKey(),
  classId: text('class_id').notNull(),
  staffEmail: text('staff_email').notNull(), // Using email to link for now as IDs might change
  createdAt: integer('created_at').notNull(),
});

// Attendance Table
export const attendance = sqliteTable('attendance', {
  id: text('id').primaryKey(),
  date: text('date').notNull(), // YYYY-MM-DD
  studentId: text('student_id').notNull(),
  studentName: text('student_name').notNull(),
  classId: text('class_id').notNull(),
  status: text('status').notNull(), // Present, Absent, Late
  markedBy: text('marked_by').notNull(), // Staff ID/Email
  timestamp: integer('timestamp').notNull(),
});

// Daily Reports Table
export const dailyReports = sqliteTable('daily_reports', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  studentId: text('student_id').notNull(),
  classId: text('class_id').notNull(),
  content: text('content').notNull(), // JSON string of the report data
  submittedBy: text('submitted_by').notNull(),
  createdAt: integer('created_at').notNull(),
});

// Pupils Table
export const pupils = sqliteTable('pupils', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  classId: text('class_id').notNull(), // Linked to class ID/Name
  gender: text('gender').notNull(),
  dateOfBirth: text('date_of_birth').notNull(),
  guardians: text('guardians').notNull(), // JSON string of guardians array
  enrollmentDate: text('enrollment_date').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});
