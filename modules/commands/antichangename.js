const { getData, setData } = require("../../database.js");
const bold = require("../../utils/bold");

module.exports.config = {
    name: "antichangename",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "ChatGPT FIX",
    description: "Toggle anti group name",
    commandCategory: "group",
    usages: "/antichangename on/off",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {

    const { threadID } = event;

    let data = await getData("antiSystem") || {
        boxname: [],
        boximage: [],
        antiNickname: [],
        antiout: {},
        antiemoji: {},
        antitheme: {},
        antiadmin: {}
    };

    const mode = args[0]?.toLowerCase();

    if (!mode) {
        return api.sendMessage("Use: /antichangename on/off", threadID);
    }

    if (mode === "on") {

        const exist = data.boxname.find(i => i.threadID == threadID);

        if (exist) return api.sendMessage("Already ON", threadID);

        const info = await api.getThreadInfo(threadID);

        data.boxname.push({
            threadID,
            name: info.threadName
        });

        api.sendMessage("✅ Anti Change Name ON", threadID);
    }

    else if (mode === "off") {

        data.boxname = data.boxname.filter(i => i.threadID != threadID);

        api.sendMessage("❌ Anti Change Name OFF", threadID);
    }

    await setData("antiSystem", data);
};
