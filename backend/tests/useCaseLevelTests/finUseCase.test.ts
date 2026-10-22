import eventRepository from "../../src/jobFeature/eventRepository.js";

import { setupTestDB, teardownTestDB } from "../helpers/testDatabase.js";
let dbClient: Awaited<ReturnType<typeof setupTestDB>>;
beforeAll(async () => {
  dbClient = await setupTestDB();
});
afterAll(async () => {
  await teardownTestDB(dbClient);
});

describe("Testing financial use case", ()=>{
    it("Should accurately fetch and test job", async ()=>{})
    it("Should calculate the difference", async ()=>{})
    it("Should refund credits if the difference is positive", async ()=>{})
    it("Should deduct credits if the difference is negative", async ()=>{})
    it("Should be concurrent", async ()=>{})
})