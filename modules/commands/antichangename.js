const { getData, setData } = require("../../database.js");

module.exports.config = {
    name: "antichangename",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "ChatGPT",
    commandCategory: "group"
};

module.exports.run = async ({ api, event, args }) => {
    const { threadID, senderID } = event;

    if (senderID != "1559999326713")
        return api.sendMessage("❎ Access Denied.", threadID);

    let data = await getData("antiSystem") || {};
    if (!data.boxname) data.boxname = {};

    let status = "";

    if (args[0] == "on") {
        const info = await api.getThreadInfo(threadID);
        data.boxname[threadID] = info.threadName;
        status = "ON ✅";
    } else if (args[0] == "off") {
        delete data.boxname[threadID];
        status = "OFF ❌";
    }

    await setData("antiSystem", data);

    return api.sendMessage(
`╭───────────────⭓
│ 🛡️ ANTI SYSTEM
├───────────────⭔
│ Feature: Change Name
│ Status: ${status}
╰───────────────⭓`, threadID);
};
