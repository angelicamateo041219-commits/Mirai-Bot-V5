const { getData, setData } = require("../../database.js");

module.exports.config = {
    name: "antichangenickname",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "ChatGPT",
    description: "Toggle anti nickname change",
    commandCategory: "group",
    usages: "/antichangenickname on/off",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    const { threadID, senderID } = event;

    if (senderID != "61559999326713") return;

    let data = await getData("antiSystem") || {};
    if (!data.nickname) data.nickname = {};

    let status = "❌";

    if (args[0] === "on") {
        const info = await api.getThreadInfo(threadID);
        data.nickname[threadID] = info.nicknames || {};
        status = "ON ✅";
    } else if (args[0] === "off") {
        delete data.nickname[threadID];
        status = "OFF ❌";
    }

    await setData("antiSystem", data);

    api.sendMessage(
`╭───────────────⭓
│ 🛡️ ANTI SYSTEM
├───────────────⭔
│ Feature: Change Nickname
│ Status: ${status}
╰───────────────⭓`, threadID);
};
