-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `auth_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `token_hash` VARCHAR(191) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `revoked_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `auth_sessions_user_id_idx`(`user_id`),
    INDEX `auth_sessions_token_hash_idx`(`token_hash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `client_name` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `projects_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `buildings` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `roof_slope_percent` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `buildings_user_id_idx`(`user_id`),
    INDEX `buildings_project_id_idx`(`project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `modulations` (
    `id` VARCHAR(191) NOT NULL,
    `building_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `order_index` INTEGER NOT NULL,
    `repeat_count` INTEGER NOT NULL,
    `frame_spacing` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `modulations_building_id_idx`(`building_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `frames` (
    `id` VARCHAR(191) NOT NULL,
    `modulation_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `span_list_json` JSON NOT NULL,
    `free_height` DOUBLE NOT NULL,
    `ridge_x` DOUBLE NULL,
    `roof_slope_percent` DOUBLE NOT NULL,
    `influence_width` DOUBLE NOT NULL,
    `minimum_web_height` DOUBLE NULL,
    `has_steel_columns` BOOLEAN NOT NULL,
    `roof_type` ENUM('single_slope', 'double_slope') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `frames_modulation_id_idx`(`modulation_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nodes` (
    `id` VARCHAR(191) NOT NULL,
    `frame_id` VARCHAR(191) NOT NULL,
    `node_key` VARCHAR(191) NOT NULL,
    `x` DOUBLE NOT NULL,
    `y` DOUBLE NOT NULL,
    `gx` INTEGER NULL,
    `gy` INTEGER NULL,
    `gz` INTEGER NULL,
    `support_type` ENUM('none', 'fixed', 'pinned', 'roller', 'simple') NOT NULL DEFAULT 'none',

    INDEX `nodes_frame_id_idx`(`frame_id`),
    UNIQUE INDEX `nodes_frame_id_node_key_key`(`frame_id`, `node_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `members` (
    `id` VARCHAR(191) NOT NULL,
    `frame_id` VARCHAR(191) NOT NULL,
    `member_key` VARCHAR(191) NOT NULL,
    `start_node_id` VARCHAR(191) NOT NULL,
    `end_node_id` VARCHAR(191) NOT NULL,
    `member_type` ENUM('beam', 'column', 'external_column') NOT NULL,
    `kx` DOUBLE NULL,
    `ky` DOUBLE NULL,
    `start_profile_id` VARCHAR(191) NULL,
    `end_profile_id` VARCHAR(191) NULL,
    `length` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `members_frame_id_idx`(`frame_id`),
    UNIQUE INDEX `members_frame_id_member_key_key`(`frame_id`, `member_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profiles` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `profile_type` ENUM('welded', 'cold_formed') NOT NULL,
    `steel_grade` VARCHAR(191) NULL,
    `fy` DOUBLE NOT NULL,
    `fu` DOUBLE NULL,
    `area` DOUBLE NOT NULL,
    `ix` DOUBLE NULL,
    `iy` DOUBLE NULL,
    `rx` DOUBLE NULL,
    `ry` DOUBLE NULL,
    `wx` DOUBLE NULL,
    `wy` DOUBLE NULL,
    `zx` DOUBLE NULL,
    `zy` DOUBLE NULL,
    `it` DOUBLE NULL,
    `j` DOUBLE NULL,
    `cw` DOUBLE NULL,
    `weight_per_length` DOUBLE NULL,
    `raw_dimensions_json` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `load_cases` (
    `id` VARCHAR(191) NOT NULL,
    `frame_id` VARCHAR(191) NOT NULL,
    `case_key` VARCHAR(191) NOT NULL,
    `case_type` VARCHAR(191) NOT NULL,
    `order_index` INTEGER NOT NULL,
    `vertical_left` DOUBLE NOT NULL,
    `vertical_right` DOUBLE NOT NULL,
    `horizontal_left` DOUBLE NOT NULL,
    `horizontal_right` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `load_cases_frame_id_idx`(`frame_id`),
    UNIQUE INDEX `load_cases_frame_id_case_key_key`(`frame_id`, `case_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `analysis_jobs` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NULL,
    `building_id` VARCHAR(191) NOT NULL,
    `frame_id` VARCHAR(191) NULL,
    `status` ENUM('queued', 'running', 'completed', 'failed', 'cancelled') NOT NULL DEFAULT 'queued',
    `progress` INTEGER NOT NULL DEFAULT 0,
    `current_step` VARCHAR(191) NULL,
    `error_code` VARCHAR(191) NULL,
    `error_message` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `started_at` DATETIME(3) NULL,
    `finished_at` DATETIME(3) NULL,

    INDEX `analysis_jobs_user_id_idx`(`user_id`),
    INDEX `analysis_jobs_building_id_idx`(`building_id`),
    INDEX `analysis_jobs_frame_id_idx`(`frame_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `analysis_snapshots` (
    `id` VARCHAR(191) NOT NULL,
    `analysis_job_id` VARCHAR(191) NOT NULL,
    `schema_version` VARCHAR(191) NOT NULL,
    `input_json` JSON NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `analysis_snapshots_analysis_job_id_key`(`analysis_job_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `analysis_results` (
    `id` VARCHAR(191) NOT NULL,
    `analysis_job_id` VARCHAR(191) NOT NULL,
    `schema_version` VARCHAR(191) NOT NULL,
    `summary_json` JSON NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `analysis_results_analysis_job_id_key`(`analysis_job_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member_results` (
    `id` VARCHAR(191) NOT NULL,
    `analysis_job_id` VARCHAR(191) NOT NULL,
    `member_key` VARCHAR(191) NOT NULL,
    `normal_json` JSON NULL,
    `shear_start_json` JSON NULL,
    `shear_end_json` JSON NULL,
    `moment_start_json` JSON NULL,
    `moment_end_json` JSON NULL,
    `displacement_json` JSON NULL,
    `combination_json` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `member_results_analysis_job_id_idx`(`analysis_job_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `support_reactions` (
    `id` VARCHAR(191) NOT NULL,
    `analysis_job_id` VARCHAR(191) NOT NULL,
    `node_key` VARCHAR(191) NOT NULL,
    `case_key` VARCHAR(191) NOT NULL,
    `rx` DOUBLE NULL,
    `ry` DOUBLE NULL,
    `mz` DOUBLE NULL,

    INDEX `support_reactions_analysis_job_id_idx`(`analysis_job_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profile_check_results` (
    `id` VARCHAR(191) NOT NULL,
    `analysis_job_id` VARCHAR(191) NOT NULL,
    `member_key` VARCHAR(191) NOT NULL,
    `ratio_start_elu` DOUBLE NULL,
    `ratio_end_elu` DOUBLE NULL,
    `ratio_compression` DOUBLE NULL,
    `ratio_tension` DOUBLE NULL,
    `ratio_moment_start` DOUBLE NULL,
    `ratio_moment_end` DOUBLE NULL,
    `ratio_shear_start` DOUBLE NULL,
    `ratio_shear_end` DOUBLE NULL,
    `ratio_els` DOUBLE NULL,
    `is_approved` BOOLEAN NULL,
    `details_json` JSON NULL,

    INDEX `profile_check_results_analysis_job_id_idx`(`analysis_job_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `auth_sessions` ADD CONSTRAINT `auth_sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `buildings` ADD CONSTRAINT `buildings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `buildings` ADD CONSTRAINT `buildings_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `modulations` ADD CONSTRAINT `modulations_building_id_fkey` FOREIGN KEY (`building_id`) REFERENCES `buildings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `frames` ADD CONSTRAINT `frames_modulation_id_fkey` FOREIGN KEY (`modulation_id`) REFERENCES `modulations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nodes` ADD CONSTRAINT `nodes_frame_id_fkey` FOREIGN KEY (`frame_id`) REFERENCES `frames`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_frame_id_fkey` FOREIGN KEY (`frame_id`) REFERENCES `frames`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_start_node_id_fkey` FOREIGN KEY (`start_node_id`) REFERENCES `nodes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_end_node_id_fkey` FOREIGN KEY (`end_node_id`) REFERENCES `nodes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_start_profile_id_fkey` FOREIGN KEY (`start_profile_id`) REFERENCES `profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_end_profile_id_fkey` FOREIGN KEY (`end_profile_id`) REFERENCES `profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `load_cases` ADD CONSTRAINT `load_cases_frame_id_fkey` FOREIGN KEY (`frame_id`) REFERENCES `frames`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `analysis_jobs` ADD CONSTRAINT `analysis_jobs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `analysis_jobs` ADD CONSTRAINT `analysis_jobs_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `analysis_jobs` ADD CONSTRAINT `analysis_jobs_building_id_fkey` FOREIGN KEY (`building_id`) REFERENCES `buildings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `analysis_jobs` ADD CONSTRAINT `analysis_jobs_frame_id_fkey` FOREIGN KEY (`frame_id`) REFERENCES `frames`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `analysis_snapshots` ADD CONSTRAINT `analysis_snapshots_analysis_job_id_fkey` FOREIGN KEY (`analysis_job_id`) REFERENCES `analysis_jobs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `analysis_results` ADD CONSTRAINT `analysis_results_analysis_job_id_fkey` FOREIGN KEY (`analysis_job_id`) REFERENCES `analysis_jobs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member_results` ADD CONSTRAINT `member_results_analysis_job_id_fkey` FOREIGN KEY (`analysis_job_id`) REFERENCES `analysis_jobs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `support_reactions` ADD CONSTRAINT `support_reactions_analysis_job_id_fkey` FOREIGN KEY (`analysis_job_id`) REFERENCES `analysis_jobs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile_check_results` ADD CONSTRAINT `profile_check_results_analysis_job_id_fkey` FOREIGN KEY (`analysis_job_id`) REFERENCES `analysis_jobs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
