const { Op } = require("sequelize");
const nodeCron = require("node-cron");
const User = require("../models/user");
const db = require(`../util/db`);

exports.monthlySubscription = nodeCron.schedule("59 23 * * *", async ()=> {
//exports.monthlySubscription = nodeCron.schedule("* * * * *", async ()=> {

// console.log(`start cronjob monthlySubscription runining daily.........`);

const userEffected = await db.query(`UPDATE users SET stripeSubscribed='0' WHERE CURDATE() >= date(stripeSubsEndDate)`)
const reulstStr = `Monthly Subscription Expiration checking run daily ===> At ${new Date().toLocaleString()} userEffected=${JSON.stringify(userEffected)}`;
// console.log(reulstStr);
await db.query(`INSERT INTO logs (id ,log ,createdAt ,updatedAt) VALUES (NULL, '${reulstStr}', now(), now())`)


},{scheduled: true,timezone: "America/Los_Angeles"});
