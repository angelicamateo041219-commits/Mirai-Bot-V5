const { getData, setData } = require("../../database.js");
const bold = require("../../utils/bold");

module.exports.config = {
    name: "anti",
    version: "7.0.0",
    hasPermssion: 1,
    credits: "BraSL + ChatGPT (Direct Mode)",
    description: "Anti system (direct command)",
    commandCategory: "group",
    usages: "/anti <option>",
    cooldowns: 3
};

module.exports.run = async function ({
    api,
    event,
    args,
    Threads
}) {
    try {

        const { threadID } = event;
        const option = args[0];

        // ── GET DATABASE ────────────
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

        // ── NO ARG (SHOW MENU) ──────
        if (!option) {
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
                threadID
            );
        }

        // ────────────────────────────
        // CHANGE NAME
        // ────────────────────────────
        if (option === "changeName") {

            const exist = dataAnti.boxname.find(x => x.threadID == threadID);

            if (exist) {
                dataAnti.boxname = dataAnti.boxname.filter(x => x.threadID != threadID);
                return api.sendMessage(`☑️ ${bold("Anti name:")} OFF`, threadID);
            }

            const info = await api.getThreadInfo(threadID);
            dataAnti.boxname.push({
                threadID,
                name: info.threadName
            });

            return api.sendMessage(`☑️ ${bold("Anti name:")} ON ✅`, threadID);
        }

        // ────────────────────────────
        // CHANGE IMAGE
        // ────────────────────────────
        if (option === "changeImage") {

            const exist = dataAnti.boximage.find(x => x.threadID == threadID);

            if (exist) {
                dataAnti.boximage = dataAnti.boximage.filter(x => x.threadID != threadID);
                return api.sendMessage(`☑️ ${bold("Anti image:")} OFF`, threadID);
            }

            dataAnti.boximage.push({ threadID, enabled: true });

            return api.sendMessage(`☑️ ${bold("Anti image:")} ON ✅`, threadID);
        }

        // ────────────────────────────
        // CHANGE NICKNAME
        // ────────────────────────────
        if (option === "changeNickname") {

            const exist = dataAnti.antiNickname.find(x => x.threadID == threadID);

            if (exist) {
                dataAnti.antiNickname = dataAnti.antiNickname.filter(x => x.threadID != threadID);
                return api.sendMessage(`☑️ ${bold("Anti nickname:")} OFF`, threadID);
            }

            const info = await api.getThreadInfo(threadID);

            dataAnti.antiNickname.push({
                threadID,
                data: info.nicknames || {}
            });

            return api.sendMessage(`☑️ ${bold("Anti nickname:")} ON ✅`, threadID);
        }

        // ────────────────────────────
        // CHANGE EMOJI
        // ────────────────────────────
        if (option === "changeEmoji") {

            const info = await api.getThreadInfo(threadID);
            const emoji = info.emoji || "";

            if (!dataAnti.antiemoji[threadID]) {
                dataAnti.antiemoji[threadID] = { emoji, enabled: true };
            } else {
                dataAnti.antiemoji[threadID].enabled =
                    !dataAnti.antiemoji[threadID].enabled;
                dataAnti.antiemoji[threadID].emoji = emoji;
            }

            return api.sendMessage(
                `☑️ ${bold("Anti emoji:")} ${dataAnti.antiemoji[threadID].enabled ? "ON ✅" : "OFF"}`,
                threadID
            );
        }

        // ────────────────────────────
        // CHANGE THEME
        // ────────────────────────────
        if (option === "changeTheme") {

            const info = await Threads.getInfo(threadID);
            const theme = info.threadTheme?.id || "";

            if (!dataAnti.antitheme[threadID]) {
                dataAnti.antitheme[threadID] = {
                    themeid: theme,
                    enabled: true
                };
            } else {
                dataAnti.antitheme[threadID].enabled =
                    !dataAnti.antitheme[threadID].enabled;
                dataAnti.antitheme[threadID].themeid = theme;
            }

            return api.sendMessage(
                `☑️ ${bold("Anti theme:")} ${dataAnti.antitheme[threadID].enabled ? "ON ✅" : "OFF"}`,
                threadID
            );
        }

        // ────────────────────────────
        // LEAVE
        // ────────────────────────────
        if (option === "leave") {

            dataAnti.antiout[threadID] =
                !dataAnti.antiout[threadID];

            return api.sendMessage(
                `☑️ ${bold("Anti leave:")} ${dataAnti.antiout[threadID] ? "ON ✅" : "OFF"}`,
                threadID
            );
        }

        // ────────────────────────────
        // ADMIN
        // ────────────────────────────
        if (option === "kickAdmin") {

            const info = await api.getThreadInfo(threadID);

            if (!info.adminIDs.some(i => i.id == api.getCurrentUserID())) {
                return api.sendMessage(
                    `❎ ${bold("Bot needs admin permission.")}`,
                    threadID
                );
            }

            dataAnti.antiadmin[threadID] =
                !dataAnti.antiadmin[threadID];

            return api.sendMessage(
                `☑️ ${bold("Anti admin:")} ${dataAnti.antiadmin[threadID] ? "ON ✅" : "OFF"}`,
                threadID
            );
        }

        // ────────────────────────────
        // STATUS
        // ────────────────────────────
        if (option === "status") {

            const aiName = dataAnti.boxname.find(x => x.threadID == threadID);
            const aiImage = dataAnti.boximage.find(x => x.threadID == threadID);
            const aiNick = dataAnti.antiNickname.find(x => x.threadID == threadID);

            return api.sendMessage(
`╭───────────────⭓
│ 🛡️ ANTI STATUS
├───────────────⭔
│ Name: ${aiName ? "✅ ON" : "❌ OFF"}
│ Image: ${aiImage ? "✅ ON" : "❌ OFF"}
│ Nickname: ${aiNick ? "✅ ON" : "❌ OFF"}
│ Leave: ${dataAnti.antiout[threadID] ? "✅ ON" : "❌ OFF"}
│ Emoji: ${dataAnti.antiemoji[threadID]?.enabled ? "✅ ON" : "❌ OFF"}
│ Theme: ${dataAnti.antitheme[threadID]?.enabled ? "✅ ON" : "❌ OFF"}
│ Admin: ${dataAnti.antiadmin[threadID] ? "✅ ON" : "❌ OFF"}
╰───────────────⭓`,
                threadID
            );
        }

        // ── INVALID ────────────────
        return api.sendMessage(
            `❎ ${bold("Invalid option.")}`,
            threadID
        );

        // ── SAVE (AUTO AFTER EVERY CHANGE) ─
    } catch (e) {
        console.log("ANTI ERROR:", e);
    }
};
