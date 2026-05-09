const { getData, setData } = require("../../database.js");

module.exports.config = {
    name: "antiadmin",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "ChatGPT",
    description: "Toggle anti admin change",
    commandCategory: "group",
    usages: "/antiadmin on/off",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {

    const { threadID } = event;

    let data = await getData("antiSystem") || {
        antiadmin: {}
    };

    if (!data.antiadmin) data.antiadmin = {};

    const mode = args[0]?.toLowerCase();

    // ── CHECK BOT ADMIN ──
    const info = await api.getThreadInfo(threadID);

    if (!info.adminIDs.some(i => i.id == api.getCurrentUserID())) {
        return api.sendMessage("❎ Bot needs admin permission.", threadID);
    }

    // ── TURN ON ──
    if (mode === "on") {

        data.antiadmin[threadID] = true;

        api.sendMessage("✅ Anti Admin Change ON", threadID);
    }

    // ── TURN OFF ──
    else if (mode === "off") {

        data.antiadmin[threadID] = false;

        api.sendMessage("❌ Anti Admin Change OFF", threadID);
    }

    // ── INVALID ──
    else {

        api.sendMessage("Use: /antiadmin on/off", threadID);
    }

    await setData("antiSystem", data);
};
