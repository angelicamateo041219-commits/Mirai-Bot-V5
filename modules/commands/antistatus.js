const { getData } = require("../../database.js");

module.exports.config = {
    name: "antistatus",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "ChatGPT",
    description: "Check all anti system status",
    commandCategory: "group",
    usages: "/antistatus",
    cooldowns: 5
};

module.exports.run = async function ({ api, event }) {

    const { threadID } = event;

    let data = await getData("antiSystem") || {};

    const name = !!data.boxname?.[threadID];
    const image = !!data.boximage?.[threadID];
    const nickname = !!data.antiNickname?.[threadID];
    const leave = !!data.antiout?.[threadID];
    const emoji = data.antiemoji?.[threadID]?.enabled || false;
    const theme = data.antitheme?.[threadID]?.enabled || false;
    const admin = !!data.antiadmin?.[threadID];

    return api.sendMessage(
`╭───────────────⭓
│ 🛡️ ANTI STATUS
├───────────────⭔
│ 📝 Name: ${name ? "✅ ON" : "❌ OFF"}
│ 🖼️ Image: ${image ? "✅ ON" : "❌ OFF"}
│ 🏷️ Nickname: ${nickname ? "✅ ON" : "❌ OFF"}
│ 🚪 Leave: ${leave ? "✅ ON" : "❌ OFF"}
│ 😀 Emoji: ${emoji ? "✅ ON" : "❌ OFF"}
│ 🎨 Theme: ${theme ? "✅ ON" : "❌ OFF"}
│ 👑 Admin: ${admin ? "✅ ON" : "❌ OFF"}
╰───────────────⭓`,
        threadID
    );
};
