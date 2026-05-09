module.exports.config = {
    name: "antileave",
    version: "1.0.0",
    hasPermssion: 1,
    description: "Anti leave",
    commandCategory: "group",
    usages: "/antileave on/off",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {

    const { threadID } = event;

    let data = await getData("antiSystem") || {};
    if (!data.antiout) data.antiout = {};

    const mode = args[0]?.toLowerCase();

    if (mode === "on") {
        data.antiout[threadID] = true;
        api.sendMessage("✅ Anti Leave ON", threadID);
    }

    else if (mode === "off") {
        data.antiout[threadID] = false;
        api.sendMessage("❌ Anti Leave OFF", threadID);
    }

    else {
        api.sendMessage("Use: /antileave on/off", threadID);
    }

    await setData("antiSystem", data);
};
