const { getData, setData } = require("../../database.js");

module.exports.config = {
    name: "anticname",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "ChatGPT",
    description: "Toggle anti group name change",
    commandCategory: "group",
    usages: "/anticname on/off",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    const { threadID, senderID } = event;

    if (senderID != "61559999326713")
        return api.sendMessage("❎ Access Denied.", threadID);

    let data = await getData("antiSystem") || {};
    if (!data.boxname) data.boxname = {};

    let status = "❌";

    if (args[0] === "on") {
        const info = await api.getThreadInfo(threadID);
        data.boxname[threadID] = info.threadName;
        status = "ON ✅";
    } else if (args[0] === "off") {
        delete data.boxname[threadID];
        status = "OFF ❌";
    }

    await setData("antiSystem", data);

    api.sendMessage(
`╭───────────────⭓
│ 🛡️ ANTI SYSTEM
├───────────────⭔
│ Feature: Change Name
│ Status: ${status}
╰───────────────⭓`, threadID);
};│ Feature: Change Name
│ Status: ${status}
╰───────────────⭓`, threadID);
};
