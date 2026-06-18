BEGIN;

CREATE TYPE role AS ENUM ('ADMIN','ALUMNI');
CREATE TYPE course AS ENUM ('BTECH_IT','BTECH_CSBS','BTECH_CSSS');
CREATE TYPE alumnistatus AS ENUM ('ACTIVE','INACTIVE','PENDING');

CREATE TABLE "User" (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role role NOT NULL DEFAULT 'ALUMNI',
  graduation INTEGER,
  company TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE "Alumni" (
  id TEXT PRIMARY KEY,
  "userId" TEXT UNIQUE NOT NULL,
  photo TEXT,
  "fullName" TEXT NOT NULL,
  "enrollmentNumber" TEXT UNIQUE NOT NULL,
  batch TEXT NOT NULL,
  course course NOT NULL,
  phone TEXT,
  email TEXT UNIQUE NOT NULL,
  company TEXT,
  position TEXT,
  skills TEXT[],
  "linkedinUrl" TEXT,
  status alumnistatus NOT NULL DEFAULT 'PENDING',
  "isProfileComplete" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX idx_alumni_batch ON "Alumni"(batch);
CREATE INDEX idx_alumni_course ON "Alumni"(course);
CREATE INDEX idx_alumni_company ON "Alumni"(company);
CREATE INDEX idx_alumni_position ON "Alumni"(position);
CREATE INDEX idx_alumni_enrollmentNumber ON "Alumni"("enrollmentNumber");
CREATE INDEX idx_alumni_email ON "Alumni"(email);

COMMIT;
