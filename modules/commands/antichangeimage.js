module.exports.config = {
    name: "antichangeimage",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "ChatGPT",
    description: "Toggle anti image",
    commandCategory: "group",
    usages: "/antichangeimage on/off",
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

    if (mode === "on") {

        if (data.boximage.some(i => i.threadID == threadID))
            return api.sendMessage("Already ON", threadID);

        data.boximage.push({ threadID });

        api.sendMessage("✅ Anti Image ON", threadID);
    }

    else if (mode === "off") {

        data.boximage = data.boximage.filter(i => i.threadID != threadID);

        api.sendMessage("❌ Anti Image OFF", threadID);
    }

    else {
        api.sendMessage("Use: /antichangeimage on/off", threadID);
    }

    await setData("antiSystem", data);
};
