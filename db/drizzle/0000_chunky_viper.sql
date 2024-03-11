PRAGMA foreign_keys = ON;

CREATE TABLE `chapters` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`seriesId` text NOT NULL,
	`currentLaneId` integer,
	`assignedUserId` text,
	`shortName` text NOT NULL,
	`targetLanguage` text NOT NULL,
	`fullName` text,
	`originalName` text,
	`links` text,
	FOREIGN KEY (`seriesId`) REFERENCES `series`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`currentLaneId`) REFERENCES `seriesLanes`(`id`) ON UPDATE cascade ON DELETE set null,
	FOREIGN KEY (`assignedUserId`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE set null
) WITHOUT ROWID;

CREATE TABLE `defaultLanes` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`libraryId` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`sortOrder` integer NOT NULL,
	`autoAssignUserId` text,
	`notifyUserIds` text,
	FOREIGN KEY (`libraryId`) REFERENCES `libraries`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`autoAssignUserId`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE set null
) WITHOUT ROWID;

CREATE TABLE `favorites` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`userId` text NOT NULL,
	`seriesId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`seriesId`) REFERENCES `series`(`id`) ON UPDATE cascade ON DELETE cascade
) WITHOUT ROWID;

CREATE TABLE `libraries` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`name` text NOT NULL,
	`alias` text
) WITHOUT ROWID;

CREATE TABLE `series` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`libraryId` text NOT NULL,
	`name` text NOT NULL,
	`alias` text,
	`description` text,
	`links` text,
	FOREIGN KEY (`libraryId`) REFERENCES `libraries`(`id`) ON UPDATE cascade ON DELETE cascade
) WITHOUT ROWID;

CREATE TABLE `seriesLanes` (
	`id` integer PRIMARY KEY NOT NULL,
	`seriesId` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`sortOrder` integer NOT NULL,
	`autoAssignUserId` text,
	`notifyUserIds` text,
	FOREIGN KEY (`seriesId`) REFERENCES `series`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`autoAssignUserId`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE set null
) WITHOUT ROWID;

CREATE TABLE `users` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`libraryId` text NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`profileImage` blob,
	`isActive` integer DEFAULT false NOT NULL,
	`isAdmin` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`libraryId`) REFERENCES `libraries`(`id`) ON UPDATE cascade ON DELETE cascade
) WITHOUT ROWID;

CREATE UNIQUE INDEX `chapters_seriesId_shortName_unique` ON `chapters` (`seriesId`,`shortName`);
CREATE UNIQUE INDEX `defaultLanes_libraryId_sortOrder_unique` ON `defaultLanes` (`libraryId`,`sortOrder`);
CREATE UNIQUE INDEX `libraries_alias_unique` ON `libraries` (`alias`);
CREATE UNIQUE INDEX `series_libraryId_alias_unique` ON `series` (`libraryId`,`alias`);
CREATE UNIQUE INDEX `seriesLanes_seriesId_sortOrder_unique` ON `seriesLanes` (`seriesId`,`sortOrder`);
CREATE UNIQUE INDEX `users_libraryId_email_unique` ON `users` (`libraryId`,`email`);