import { sqliteTable, text, integer, index, unique } from 'drizzle-orm/sqlite-core';

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

// Pupils Table
export const pupils = sqliteTable('pupils', {
  id: text('id').primaryKey(), // BPS-XXX
  name: text('name').notNull(),
  classId: text('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }), // Linked to class ID/Name
  gender: text('gender').notNull(),
  dateOfBirth: text('date_of_birth').notNull(),
  guardians: text('guardians').notNull(), // JSON string of guardians array
  enrollmentDate: text('enrollment_date').notNull(),
  // Parent Login Fields
  parentPassword: text('parent_password').notNull(), // Hashed
  isFirstLogin: integer('is_first_login', { mode: 'boolean' }).notNull().default(true),
  portalAccess: integer('portal_access', { mode: 'boolean' }).notNull().default(true),
  accessBlockReason: text('access_block_reason'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// Pupil ID Sequence Table
export const pupilIdSequence = sqliteTable('pupil_id_sequence', {
  id: integer('id').primaryKey(), // Single row, ID 1
  currentValue: integer('current_value').notNull().default(0),
});

// Results Table
export const results = sqliteTable('results', {
  id: text('id').primaryKey(),
  studentId: text('student_id').notNull().references(() => pupils.id, { onDelete: 'cascade' }),
  studentName: text('student_name').notNull(),
  classId: text('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
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
}, (table) => {
  return {
    studentIdIdx: index('results_student_id_idx').on(table.studentId),
    classIdIdx: index('results_class_id_idx').on(table.classId),
    createdAtIdx: index('results_created_at_idx').on(table.createdAt),
    statusIdx: index('results_status_idx').on(table.status),
  }
});

// Audit Logs Table
export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  role: text('role').notNull(),
  action: text('action').notNull(), // 'CREATE', 'UPDATE', 'DELETE'
  entity: text('entity').notNull(), // 'Attendance', 'Result', 'Pupil'
  details: text('details'), // JSON string of changes
  timestamp: integer('timestamp').notNull(),
}, (table) => {
  return {
    userIdIdx: index('audit_logs_user_id_idx').on(table.userId),
    timestampIdx: index('audit_logs_timestamp_idx').on(table.timestamp),
  }
});

// Loan Requests Table
export const loanRequests = sqliteTable('loan_requests', {
  id: text('id').primaryKey(),
  staffId: text('staff_id').notNull(),
  staffEmail: text('staff_email'),
  staffName: text('staff_name').notNull(),
  amount: integer('amount').notNull(),
  reason: text('reason').notNull(),
  repaymentPlan: text('repayment_plan'),
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

export const staffAttendance = sqliteTable('staff_attendance', {
  id: text('id').primaryKey(),
  staffEmail: text('staff_email').notNull(),
  date: text('date').notNull(), // YYYY-MM-DD
  time: text('time').notNull(), // HH:MM:SS
  createdAt: integer('created_at').notNull(),
});

// Attendance Table
export const attendance = sqliteTable('attendance', {
  id: text('id').primaryKey(),
  date: text('date').notNull(), // YYYY-MM-DD
  time: text('time').notNull(), // HH:MM:SS
  studentId: text('student_id').notNull().references(() => pupils.id, { onDelete: 'cascade' }),
  studentName: text('student_name').notNull(),
  classId: text('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
  status: text('status').notNull(), // Present, Absent, Late
  markedBy: text('marked_by').notNull(), // Staff ID
  timestamp: integer('timestamp').notNull(),
}, (table) => {
  return {
    studentIdIdx: index('attendance_student_id_idx').on(table.studentId),
    classIdIdx: index('attendance_class_id_idx').on(table.classId),
    dateIdx: index('attendance_date_idx').on(table.date),
    uniqueRecord: unique().on(table.studentId, table.date),
  }
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
}, (table) => {
  return {
    studentIdIdx: index('daily_reports_student_id_idx').on(table.studentId),
    classIdIdx: index('daily_reports_class_id_idx').on(table.classId),
    dateIdx: index('daily_reports_date_idx').on(table.date),
  }
});

export const parentStudentLinks = sqliteTable('parent_student_links', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(), // Clerk User ID
  studentId: text('student_id').notNull(),
  createdAt: integer('created_at').notNull(),
});

// Parent Pupil Links Table (New)
export const parentPupil = sqliteTable('parent_pupil', {
  id: text('id').primaryKey(),
  parentEmail: text('parent_email').notNull(),
  pupilId: text('pupil_id').notNull(),
  createdAt: integer('created_at').notNull(),
});
