const { getData, setData } = require("../../database.js");

module.exports.config = {
    name: "antichangeimage",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "ChatGPT",
    description: "Toggle anti group image change",
    commandCategory: "group",
    usages: "/antichangeimage on/off",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    const { threadID, senderID } = event;

    if (senderID != "61559999326713") return;

    let data = await getData("antiSystem") || {};
    if (!data.boximage) data.boximage = {};

    let status = "❌";

    if (args[0] === "on") {
        data.boximage[threadID] = true;
        status = "ON ✅";
    } else if (args[0] === "off") {
        delete data.boximage[threadID];
        status = "OFF ❌";
    }

    await setData("antiSystem", data);

    api.sendMessage(
`╭───────────────⭓
│ 🛡️ ANTI SYSTEM
├───────────────⭔
│ Feature: Change Image
│ Status: ${status}
╰───────────────⭓`, threadID);
};
