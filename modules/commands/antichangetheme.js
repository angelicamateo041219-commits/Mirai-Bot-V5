const { getData, setData } = require("../../database.js");

module.exports.config = {
    name: "antichangetheme",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "ChatGPT",
    description: "Prevent theme change",
    commandCategory: "group",
    usages: "/antitheme on/off",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args, Threads }) => {
    const { threadID, senderID } = event;

    if (senderID != "61559999326713") return;

    let data = await getData("antiSystem") || {};
    if (!data.theme) data.theme = {};

    let status = "❌";

    if (args[0] === "on") {
        const info = await Threads.getInfo(threadID);
        data.theme[threadID] = info.threadTheme?.id;
        status = "ON ✅";
    } else {
        delete data.theme[threadID];
        status = "OFF ❌";
    }

    await setData("antiSystem", data);

    api.sendMessage(
`╭───────────────⭓
│ 🛡️ ANTI SYSTEM
├───────────────⭔
│ Feature: Change Theme
│ Status: ${status}
╰───────────────⭓`, threadID);
};
