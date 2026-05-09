module.exports.config = {
    name: "antichangenickname",
    version: "1.0.0",
    hasPermssion: 1,
    description: "Anti nickname",
    commandCategory: "group",
    usages: "/antichangenickname on/off",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {

    const { threadID } = event;

    let data = await getData("antiSystem") || {};

    if (!data.antiNickname) data.antiNickname = [];

    const mode = args[0]?.toLowerCase();

    if (mode === "on") {

        if (data.antiNickname.some(i => i.threadID == threadID))
            return api.sendMessage("Already ON", threadID);

        const info = await api.getThreadInfo(threadID);

        data.antiNickname.push({
            threadID,
            data: info.nicknames || {}
        });

        api.sendMessage("✅ Anti Nickname ON", threadID);
    }

    else if (mode === "off") {

        data.antiNickname = data.antiNickname.filter(i => i.threadID != threadID);

        api.sendMessage("❌ Anti Nickname OFF", threadID);
    }

    else {
        api.sendMessage("Use: /antichangenickname on/off", threadID);
    }

    await setData("antiSystem", data);
};
