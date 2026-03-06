CREATE TABLE `attendance` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`time` text NOT NULL,
	`student_id` text NOT NULL,
	`student_name` text NOT NULL,
	`class_id` text NOT NULL,
	`status` text NOT NULL,
	`marked_by` text NOT NULL,
	`timestamp` integer NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `pupils`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `attendance_student_id_idx` ON `attendance` (`student_id`);--> statement-breakpoint
CREATE INDEX `attendance_class_id_idx` ON `attendance` (`class_id`);--> statement-breakpoint
CREATE INDEX `attendance_date_idx` ON `attendance` (`date`);--> statement-breakpoint
CREATE UNIQUE INDEX `attendance_student_id_date_unique` ON `attendance` (`student_id`,`date`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`role` text NOT NULL,
	`action` text NOT NULL,
	`entity` text NOT NULL,
	`details` text,
	`timestamp` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `audit_logs_user_id_idx` ON `audit_logs` (`user_id`);--> statement-breakpoint
CREATE INDEX `audit_logs_timestamp_idx` ON `audit_logs` (`timestamp`);--> statement-breakpoint
CREATE TABLE `classes` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`age_range` text,
	`capacity` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `daily_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`student_id` text NOT NULL,
	`class_id` text NOT NULL,
	`content` text NOT NULL,
	`submitted_by` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `daily_reports_student_id_idx` ON `daily_reports` (`student_id`);--> statement-breakpoint
CREATE INDEX `daily_reports_class_id_idx` ON `daily_reports` (`class_id`);--> statement-breakpoint
CREATE INDEX `daily_reports_date_idx` ON `daily_reports` (`date`);--> statement-breakpoint
CREATE TABLE `loan_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`staff_id` text NOT NULL,
	`staff_email` text,
	`staff_name` text NOT NULL,
	`amount` integer NOT NULL,
	`reason` text NOT NULL,
	`repayment_plan` text,
	`status` text DEFAULT 'Pending' NOT NULL,
	`approved_by` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `parent_pupil` (
	`id` text PRIMARY KEY NOT NULL,
	`parent_email` text NOT NULL,
	`pupil_id` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `parent_student_links` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`student_id` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pupils` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`class_id` text NOT NULL,
	`gender` text NOT NULL,
	`date_of_birth` text NOT NULL,
	`guardians` text NOT NULL,
	`enrollment_date` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `results` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`student_name` text NOT NULL,
	`class_id` text NOT NULL,
	`term` text NOT NULL,
	`academic_year` text NOT NULL,
	`subjects` text NOT NULL,
	`total_score` integer NOT NULL,
	`average_score` integer NOT NULL,
	`grade` text NOT NULL,
	`teacher_comment` text,
	`head_teacher_comment` text,
	`status` text DEFAULT 'Draft' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `pupils`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `results_student_id_idx` ON `results` (`student_id`);--> statement-breakpoint
CREATE INDEX `results_class_id_idx` ON `results` (`class_id`);--> statement-breakpoint
CREATE INDEX `results_created_at_idx` ON `results` (`created_at`);--> statement-breakpoint
CREATE INDEX `results_status_idx` ON `results` (`status`);--> statement-breakpoint
CREATE TABLE `staff_assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`class_id` text NOT NULL,
	`staff_email` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `staff_attendance` (
	`id` text PRIMARY KEY NOT NULL,
	`staff_email` text NOT NULL,
	`date` text NOT NULL,
	`time` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`first_name` text,
	`last_name` text,
	`role` text DEFAULT 'org:parent' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
