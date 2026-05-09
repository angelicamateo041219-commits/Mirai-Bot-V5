const { getData, setData } = require("../../database.js");
const bold = require("../../utils/bold");

module.exports.config = {
    name: "anti",
    version: "7.0.0",
    hasPermssion: 1,
    credits: "BraSL + ChatGPT FIXED",
    description: "Anti system (direct commands)",
    commandCategory: "group",
    usages: "/anti <type>",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {

    const { threadID, messageID } = event;

    let dataAnti = await getData("antiSystem");

    if (!dataAnti) {
        dataAnti = {
            boxname: [],
            boximage: [],
            antiNickname: [],
            antiout: {},
            antiemoji: {},
            antitheme: {},
            antiadmin: {}
        };
    }

    const type = args[0]?.toLowerCase();

    // 📌 NO ARG = SHOW MENU
    if (!type) {
        return api.sendMessage(
`╭───────────────⭓
│ 🛡️ ANTI COMMANDS
├───────────────⭔
│ /anti changeName
│ /anti changeImage
│ /anti changeNickname
│ /anti changeEmoji
│ /anti changeTheme
│ /anti leave
│ /anti kickAdmin
│ /anti status
╰───────────────⭓`,
            threadID,
            messageID
        );
    }

    // ────────────────
    // CHANGE NAME
    // ────────────────
    if (type === "changename") {

        const exist = dataAnti.boxname.find(i => i.threadID == threadID);

        if (exist) {
            dataAnti.boxname = dataAnti.boxname.filter(i => i.threadID != threadID);
            api.sendMessage(`☑️ ${bold("Anti name:")} OFF`, threadID);
        } else {
            const info = await api.getThreadInfo(threadID);
            dataAnti.boxname.push({ threadID, name: info.threadName });
            api.sendMessage(`☑️ ${bold("Anti name:")} ON ✅`, threadID);
        }
    }

    // ────────────────
    // CHANGE IMAGE
    // ────────────────
    else if (type === "changeimage") {

        const exist = dataAnti.boximage.find(i => i.threadID == threadID);

        if (exist) {
            dataAnti.boximage = dataAnti.boximage.filter(i => i.threadID != threadID);
            api.sendMessage(`☑️ ${bold("Anti image:")} OFF`, threadID);
        } else {
            dataAnti.boximage.push({ threadID });
            api.sendMessage(`☑️ ${bold("Anti image:")} ON ✅`, threadID);
        }
    }

    // ────────────────
    // CHANGE NICKNAME
    // ────────────────
    else if (type === "changenickname") {

        const exist = dataAnti.antiNickname.find(i => i.threadID == threadID);

        if (exist) {
            dataAnti.antiNickname = dataAnti.antiNickname.filter(i => i.threadID != threadID);
            api.sendMessage(`☑️ ${bold("Anti nickname:")} OFF`, threadID);
        } else {
            const info = await api.getThreadInfo(threadID);
            dataAnti.antiNickname.push({ threadID, data: info.nicknames || {} });
            api.sendMessage(`☑️ ${bold("Anti nickname:")} ON ✅`, threadID);
        }
    }

    // ────────────────
    // EMOJI
    // ────────────────
    else if (type === "changeemoji") {

        const info = await api.getThreadInfo(threadID);
        const emoji = info.emoji || "";

        if (!dataAnti.antiemoji[threadID]) {
            dataAnti.antiemoji[threadID] = { emoji, enabled: true };
        } else {
            dataAnti.antiemoji[threadID].enabled = !dataAnti.antiemoji[threadID].enabled;
        }

        api.sendMessage(
            `☑️ ${bold("Anti emoji:")} ${
                dataAnti.antiemoji[threadID].enabled ? "ON ✅" : "OFF"
            }`,
            threadID
        );
    }

    // ────────────────
    // THEME
    // ────────────────
    else if (type === "changetheme") {

        const info = await api.getThreadInfo(threadID);
        const theme = info.threadTheme?.id || "";

        if (!dataAnti.antitheme[threadID]) {
            dataAnti.antitheme[threadID] = { themeid: theme, enabled: true };
        } else {
            dataAnti.antitheme[threadID].enabled = !dataAnti.antitheme[threadID].enabled;
        }

        api.sendMessage(
            `☑️ ${bold("Anti theme:")} ${
                dataAnti.antitheme[threadID].enabled ? "ON ✅" : "OFF"
            }`,
            threadID
        );
    }

    // ────────────────
    // LEAVE
    // ────────────────
    else if (type === "leave") {

        dataAnti.antiout[threadID] = !dataAnti.antiout[threadID];

        api.sendMessage(
            `☑️ ${bold("Anti leave:")} ${
                dataAnti.antiout[threadID] ? "ON ✅" : "OFF"
            }`,
            threadID
        );
    }

    // ────────────────
    // ADMIN
    // ────────────────
    else if (type === "kickadmin") {

        const info = await api.getThreadInfo(threadID);

        if (!info.adminIDs.some(i => i.id == api.getCurrentUserID())) {
            return api.sendMessage(`❎ ${bold("Bot needs admin.")}`, threadID);
        }

        dataAnti.antiadmin[threadID] = !dataAnti.antiadmin[threadID];

        api.sendMessage(
            `☑️ ${bold("Anti admin:")} ${
                dataAnti.antiadmin[threadID] ? "ON ✅" : "OFF"
            }`,
            threadID
        );
    }

    // ────────────────
    // STATUS
    // ────────────────
    else if (type === "status") {

        return api.sendMessage(
`🛡️ ANTI STATUS

Name: ${dataAnti.boxname.some(i=>i.threadID==threadID) ? "ON" : "OFF"}
Image: ${dataAnti.boximage.some(i=>i.threadID==threadID) ? "ON" : "OFF"}
Nickname: ${dataAnti.antiNickname.some(i=>i.threadID==threadID) ? "ON" : "OFF"}
Leave: ${dataAnti.antiout[threadID] ? "ON" : "OFF"}
Emoji: ${dataAnti.antiemoji[threadID]?.enabled ? "ON" : "OFF"}
Theme: ${dataAnti.antitheme[threadID]?.enabled ? "ON" : "OFF"}
Admin: ${dataAnti.antiadmin[threadID] ? "ON" : "OFF"}`,
            threadID
        );
    }

    else {
        api.sendMessage(`❎ Invalid command`, threadID);
    }

    await setData("antiSystem", dataAnti);
};
