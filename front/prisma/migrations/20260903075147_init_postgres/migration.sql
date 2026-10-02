-- CreateTable
CREATE TABLE "PostSkeleton" (
    "id" TEXT NOT NULL,
    "repo_name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "commits" TEXT NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PostSkeleton_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Posts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "readTime" INTEGER NOT NULL,
    "cover" TEXT,
    "mainPage" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "lang" TEXT NOT NULL DEFAULT 'en',
    "type" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostContent" (
    "id" TEXT NOT NULL,
    "text" TEXT,
    "image" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "postsId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "image" TEXT,
    "description_ru" TEXT,
    "description_en" TEXT,
    "order" INTEGER,
    "isDeveloping" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eyebrow_en" TEXT,
    "eyebrow_ru" TEXT,
    "facts_en" TEXT[],
    "facts_ru" TEXT[],

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectBlock" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "title_en" TEXT NOT NULL DEFAULT '',
    "title_ru" TEXT NOT NULL DEFAULT '',
    "text_en" TEXT NOT NULL DEFAULT '',
    "text_ru" TEXT NOT NULL DEFAULT '',
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectImage" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT NOT NULL,
    "caption_en" TEXT NOT NULL DEFAULT '',
    "caption_ru" TEXT NOT NULL DEFAULT '',
    "isWide" BOOLEAN NOT NULL DEFAULT false,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectLink" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "label_en" TEXT NOT NULL DEFAULT '',
    "label_ru" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeHero" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "lang" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeHero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeAvailability" (
    "id" TEXT NOT NULL,
    "lang" TEXT NOT NULL DEFAULT 'en',
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT '',
    "facts" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeAbout" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'main',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeAbout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeAboutText" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "lang" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "homeAboutId" TEXT NOT NULL,

    CONSTRAINT "HomeAboutText_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeExperience" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPresent" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER,
    "company_en" TEXT NOT NULL,
    "company_ru" TEXT NOT NULL,
    "position_en" TEXT NOT NULL,
    "position_ru" TEXT NOT NULL,
    "responsibilities_en" TEXT NOT NULL,
    "responsibilities_ru" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeSkill" (
    "id" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettingsSeo" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'main',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SettingsSeo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettingsSeoContent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "lang" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "settingsSeoId" TEXT,

    CONSTRAINT "SettingsSeoContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettingsContacts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SettingsContacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettingsScripts" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "innerHTML" TEXT NOT NULL,
    "async" BOOLEAN NOT NULL,
    "body" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SettingsScripts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ExperienceStack" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ExperienceStack_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProjectStack" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectStack_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Posts_slug_key" ON "Posts"("slug");

-- CreateIndex
CREATE INDEX "PostContent_postsId_idx" ON "PostContent"("postsId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "ProjectBlock_projectId_idx" ON "ProjectBlock"("projectId");

-- CreateIndex
CREATE INDEX "ProjectImage_projectId_idx" ON "ProjectImage"("projectId");

-- CreateIndex
CREATE INDEX "ProjectLink_projectId_idx" ON "ProjectLink"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "HomeHero_lang_key" ON "HomeHero"("lang");

-- CreateIndex
CREATE UNIQUE INDEX "HomeAvailability_lang_key" ON "HomeAvailability"("lang");

-- CreateIndex
CREATE UNIQUE INDEX "HomeAbout_key_key" ON "HomeAbout"("key");

-- CreateIndex
CREATE UNIQUE INDEX "HomeAboutText_lang_key" ON "HomeAboutText"("lang");

-- CreateIndex
CREATE INDEX "HomeAboutText_homeAboutId_idx" ON "HomeAboutText"("homeAboutId");

-- CreateIndex
CREATE UNIQUE INDEX "SettingsSeo_key_key" ON "SettingsSeo"("key");

-- CreateIndex
CREATE UNIQUE INDEX "SettingsSeoContent_lang_key" ON "SettingsSeoContent"("lang");

-- CreateIndex
CREATE INDEX "SettingsSeoContent_settingsSeoId_idx" ON "SettingsSeoContent"("settingsSeoId");

-- CreateIndex
CREATE INDEX "_ExperienceStack_B_index" ON "_ExperienceStack"("B");

-- CreateIndex
CREATE INDEX "_ProjectStack_B_index" ON "_ProjectStack"("B");

-- AddForeignKey
ALTER TABLE "PostContent" ADD CONSTRAINT "PostContent_postsId_fkey" FOREIGN KEY ("postsId") REFERENCES "Posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectBlock" ADD CONSTRAINT "ProjectBlock_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectImage" ADD CONSTRAINT "ProjectImage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectLink" ADD CONSTRAINT "ProjectLink_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeAboutText" ADD CONSTRAINT "HomeAboutText_homeAboutId_fkey" FOREIGN KEY ("homeAboutId") REFERENCES "HomeAbout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettingsSeoContent" ADD CONSTRAINT "SettingsSeoContent_settingsSeoId_fkey" FOREIGN KEY ("settingsSeoId") REFERENCES "SettingsSeo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExperienceStack" ADD CONSTRAINT "_ExperienceStack_A_fkey" FOREIGN KEY ("A") REFERENCES "HomeExperience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExperienceStack" ADD CONSTRAINT "_ExperienceStack_B_fkey" FOREIGN KEY ("B") REFERENCES "HomeSkill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectStack" ADD CONSTRAINT "_ProjectStack_A_fkey" FOREIGN KEY ("A") REFERENCES "HomeSkill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectStack" ADD CONSTRAINT "_ProjectStack_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
