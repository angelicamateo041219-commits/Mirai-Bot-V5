const { getData, setData } = require("../../database.js");

module.exports.config = {
    name: "antiadmin",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "ChatGPT",
    description: "Prevent admin changes",
    commandCategory: "group",
    usages: "/antiadmin on/off",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    const { threadID, senderID } = event;

    if (senderID != "61559999326713") return;

    let data = await getData("antiSystem") || {};
    if (!data.admin) data.admin = {};

    let status = "❌";

    if (args[0] === "on") {
        data.admin[threadID] = true;
        status = "ON ✅";
    } else {
        delete data.admin[threadID];
        status = "OFF ❌";
    }

    await setData("antiSystem", data);

    api.sendMessage(
`╭───────────────⭓
│ 🛡️ ANTI SYSTEM
├───────────────⭔
│ Feature: Anti Admin
│ Status: ${status}
╰───────────────⭓`, threadID);
};
