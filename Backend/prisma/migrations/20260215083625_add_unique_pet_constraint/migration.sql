/*
  Warnings:

  - A unique constraint covering the columns `[userId,name,species]` on the table `pets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "pets_userId_name_species_key" ON "pets"("userId", "name", "species");
