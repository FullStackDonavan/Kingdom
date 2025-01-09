-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `loginType` VARCHAR(191) NULL DEFAULT 'email',
    `password` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `username` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `stripeCustomerId` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `authToken` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Session_authToken_key`(`authToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subscription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `stripeId` VARCHAR(191) NOT NULL,
    `stripeStatus` VARCHAR(191) NULL,
    `stripePriceId` VARCHAR(191) NULL,
    `quantity` INTEGER NULL,
    `trialEndsAt` DATETIME(3) NULL,
    `endsAt` DATETIME(3) NULL,
    `startDate` DATETIME(3) NOT NULL,
    `lastEventDate` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Subscription_stripeId_key`(`stripeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Verses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `number` INTEGER NOT NULL,
    `text` TEXT NOT NULL,
    `chapterId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chapters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `number` INTEGER NOT NULL,
    `bookId` INTEGER NOT NULL,

    UNIQUE INDEX `Chapters_bookId_number_key`(`bookId`, `number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Books` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `translationId` INTEGER NOT NULL,

    UNIQUE INDEX `Books_name_translationId_key`(`name`, `translationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Translation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `translation` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `license` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Translation_translation_key`(`translation`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HighlightedVerse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `verseId` INTEGER NOT NULL,
    `highlighted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `HighlightedVerse_verseId_userId_key`(`verseId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Verses` ADD CONSTRAINT `Verses_chapterId_fkey` FOREIGN KEY (`chapterId`) REFERENCES `Chapters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chapters` ADD CONSTRAINT `Chapters_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Books`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Books` ADD CONSTRAINT `Books_translationId_fkey` FOREIGN KEY (`translationId`) REFERENCES `Translation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HighlightedVerse` ADD CONSTRAINT `HighlightedVerse_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HighlightedVerse` ADD CONSTRAINT `HighlightedVerse_verseId_fkey` FOREIGN KEY (`verseId`) REFERENCES `Verses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
