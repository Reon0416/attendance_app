-- CreateTable
CREATE TABLE `HealthAlertLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeeId` INTEGER NOT NULL,
    `alertType` VARCHAR(191) NOT NULL,
    `totalPoints` INTEGER NOT NULL,
    `loggedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isChecked` BOOLEAN NOT NULL DEFAULT false,

    INDEX `HealthAlertLog_employeeId_loggedAt_idx`(`employeeId`, `loggedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HealthAlertLog` ADD CONSTRAINT `HealthAlertLog_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
