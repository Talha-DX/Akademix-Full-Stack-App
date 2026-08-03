-- Add fields used by the password-reset flow. They are nullable so existing
-- accounts do not require a reset token when this migration is applied.
ALTER TABLE "User"
  ADD COLUMN "resetToken" TEXT,
  ADD COLUMN "resetTokenExpiry" TIMESTAMP(3);
