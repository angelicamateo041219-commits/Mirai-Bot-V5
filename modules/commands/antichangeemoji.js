const { getData, setData } = require("../../database.js");

module.exports.config = {
    name: "antichangeemoji",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "ChatGPT",
    description: "Prevent emoji change",
    commandCategory: "group",
    usages: "/antiemoji on/off",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    const { threadID, senderID } = event;

    if (senderID != "61559999326713") return;

    let data = await getData("antiSystem") || {};
    if (!data.emoji) data.emoji = {};

    let status = "❌";

    if (args[0] === "on") {
        const info = await api.getThreadInfo(threadID);
        data.emoji[threadID] = info.emoji;
        status = "ON ✅";
    } else {
        delete data.emoji[threadID];
        status = "OFF ❌";
    }

    await setData("antiSystem", data);

    api.sendMessage(
`╭───────────────⭓
│ 🛡️ ANTI SYSTEM
├───────────────⭔
│ Feature: Change Emoji
│ Status: ${status}
╰───────────────⭓`, threadID);
};
