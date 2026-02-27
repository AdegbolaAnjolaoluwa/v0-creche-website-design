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
