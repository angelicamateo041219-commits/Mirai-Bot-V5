const { getData, setData } = require("../../database.js");
const bold = require("../../utils/bold");

module.exports.config = {
    name: "anti",
    version: "5.0.0",
    hasPermssion: 1,
    credits: "BraSL + ChatGPT",
    description: "Anti change group settings with Firebase",
    commandCategory: "group",
    usages: "/anti",
    cooldowns: 5
};

// ── HANDLE REPLY ─────────────────────
module.exports.handleReply = async function ({
    api,
    event,
    handleReply,
    Threads
}) {

    try {

        const {
            senderID,
            threadID,
            messageID
        } = event;

        const {
            author,
            permssion
        } = handleReply;

        // ── CHECK OWNER ──────────────
        if (author != senderID)
            return api.sendMessage(
                `❎ ${bold("This is not your command.")}`,
                threadID,
                messageID
            );

        // ── GET DATABASE ─────────────
        let dataAnti =
            await getData("antiSystem");

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

        const numbers =
            event.body
            .split(" ")
            .filter(i => !isNaN(i));

        for (const num of numbers) {

            switch (num) {

                // ── ANTI NAME ─────────
                case "1": {

                    if (permssion < 1)
                        return api.sendMessage(
                            `🔒 ${bold("Permission required.")}`,
                            threadID,
                            messageID
                        );

                    const existing =
                        dataAnti.boxname.find(
                            item =>
                            item.threadID === threadID
                        );

                    if (existing) {

                        dataAnti.boxname =
                            dataAnti.boxname.filter(
                                item =>
                                item.threadID !== threadID
                            );

                        api.sendMessage(
                            `☑️ ${bold("Anti name:")} OFF`,
                            threadID,
                            messageID
                        );

                    } else {

                        const info =
                            await api.getThreadInfo(
                                threadID
                            );

                        dataAnti.boxname.push({
                            threadID,
                            name: info.threadName
                        });

                        api.sendMessage(
                            `☑️ ${bold("Anti name:")} ON ✅`,
                            threadID,
                            messageID
                        );
                    }

                    break;
                }

                // ── ANTI IMAGE ────────
                case "2": {

                    if (permssion < 1)
                        return api.sendMessage(
                            `🔒 ${bold("Permission required.")}`,
                            threadID,
                            messageID
                        );

                    const existing =
                        dataAnti.boximage.find(
                            item =>
                            item.threadID === threadID
                        );

                    if (existing) {

                        dataAnti.boximage =
                            dataAnti.boximage.filter(
                                item =>
                                item.threadID !== threadID
                            );

                        api.sendMessage(
                            `☑️ ${bold("Anti image:")} OFF`,
                            threadID,
                            messageID
                        );

                    } else {

                        dataAnti.boximage.push({
                            threadID,
                            url: ""
                        });

                        api.sendMessage(
                            `☑️ ${bold("Anti image:")} ON ✅`,
                            threadID,
                            messageID
                        );
                    }

                    break;
                }

                // ── ANTI NICKNAME ─────
                case "3": {

                    if (permssion < 1)
                        return api.sendMessage(
                            `🔒 ${bold("Permission required.")}`,
                            threadID,
                            messageID
                        );

                    const existing =
                        dataAnti.antiNickname.find(
                            item =>
                            item.threadID === threadID
                        );

                    if (existing) {

                        dataAnti.antiNickname =
                            dataAnti.antiNickname.filter(
                                item =>
                                item.threadID !== threadID
                            );

                        api.sendMessage(
                            `☑️ ${bold("Anti nickname:")} OFF`,
                            threadID,
                            messageID
                        );

                    } else {

                        const info =
                            await api.getThreadInfo(
                                threadID
                            );

                        dataAnti.antiNickname.push({
                            threadID,
                            data: info.nicknames || {}
                        });

                        api.sendMessage(
                            `☑️ ${bold("Anti nickname:")} ON ✅`,
                            threadID,
                            messageID
                        );
                    }

                    break;
                }

                // ── ANTI LEAVE ────────
                case "4": {

                    dataAnti.antiout[threadID] =
                        !dataAnti.antiout[threadID];

                    api.sendMessage(
                        `☑️ ${bold("Anti leave:")} ${
                            dataAnti.antiout[threadID]
                            ? "ON ✅"
                            : "OFF"
                        }`,
                        threadID,
                        messageID
                    );

                    break;
                }

                // ── ANTI EMOJI ────────
                case "5": {

                    let emoji = "";

                    try {

                        const info =
                            await api.getThreadInfo(
                                threadID
                            );

                        emoji = info.emoji || "";

                    } catch (e) {}

                    if (!dataAnti.antiemoji[threadID]) {

                        dataAnti.antiemoji[threadID] = {
                            emoji,
                            enabled: true
                        };

                    } else {

                        dataAnti.antiemoji[
                            threadID
                        ].enabled =
                            !dataAnti.antiemoji[
                                threadID
                            ].enabled;

                        if (
                            dataAnti.antiemoji[
                                threadID
                            ].enabled
                        ) {

                            dataAnti.antiemoji[
                                threadID
                            ].emoji = emoji;
                        }
                    }

                    api.sendMessage(
                        `☑️ ${bold("Anti emoji:")} ${
                            dataAnti.antiemoji[threadID]
                            .enabled
                            ? "ON ✅"
                            : "OFF"
                        }`,
                        threadID,
                        messageID
                    );

                    break;
                }

                // ── ANTI THEME ────────
                case "6": {

                    let theme = "";

                    try {

                        const info =
                            await Threads.getInfo(
                                threadID
                            );

                        theme =
                            info.threadTheme?.id || "";

                    } catch (e) {}

                    if (!dataAnti.antitheme[threadID]) {

                        dataAnti.antitheme[threadID] = {
                            themeid: theme,
                            enabled: true
                        };

                    } else {

                        dataAnti.antitheme[
                            threadID
                        ].enabled =
                            !dataAnti.antitheme[
                                threadID
                            ].enabled;

                        if (
                            dataAnti.antitheme[
                                threadID
                            ].enabled
                        ) {

                            dataAnti.antitheme[
                                threadID
                            ].themeid = theme;
                        }
                    }

                    api.sendMessage(
                        `☑️ ${bold("Anti theme:")} ${
                            dataAnti.antitheme[threadID]
                            .enabled
                            ? "ON ✅"
                            : "OFF"
                        }`,
                        threadID,
                        messageID
                    );

                    break;
                }

                // ── ANTI ADMIN ────────
                case "7": {

                    const info =
                        await api.getThreadInfo(
                            threadID
                        );

                    if (
                        !info.adminIDs.some(
                            item =>
                            item.id ==
                            api.getCurrentUserID()
                        )
                    ) {

                        return api.sendMessage(
                            `❎ ${bold("Bot needs admin permission.")}`,
                            threadID,
                            messageID
                        );
                    }

                    dataAnti.antiadmin[threadID] =
                        !dataAnti.antiadmin[threadID];

                    api.sendMessage(
                        `☑️ ${bold("Anti admin:")} ${
                            dataAnti.antiadmin[threadID]
                            ? "ON ✅"
                            : "OFF"
                        }`,
                        threadID,
                        messageID
                    );

                    break;
                }

                // ── STATUS ────────────
                case "9": {

                    const aiName =
                        dataAnti.boxname.find(
                            item =>
                            item.threadID === threadID
                        );

                    const aiImage =
                        dataAnti.boximage.find(
                            item =>
                            item.threadID === threadID
                        );

                    const aiNick =
                        dataAnti.antiNickname.find(
                            item =>
                            item.threadID === threadID
                        );

                    return api.sendMessage(

`╭───────────────⭓
│ 🛡️ ANTI STATUS
├───────────────⭔
│ 1️⃣ Name:
│ ${aiName ? "✅ ON" : "❌ OFF"}
│
│ 2️⃣ Image:
│ ${aiImage ? "✅ ON" : "❌ OFF"}
│
│ 3️⃣ Nickname:
│ ${aiNick ? "✅ ON" : "❌ OFF"}
│
│ 4️⃣ Leave:
│ ${dataAnti.antiout[threadID] ? "✅ ON" : "❌ OFF"}
│
│ 5️⃣ Emoji:
│ ${dataAnti.antiemoji[threadID]?.enabled ? "✅ ON" : "❌ OFF"}
│
│ 6️⃣ Theme:
│ ${dataAnti.antitheme[threadID]?.enabled ? "✅ ON" : "❌ OFF"}
│
│ 7️⃣ Admin:
│ ${dataAnti.antiadmin[threadID] ? "✅ ON" : "❌ OFF"}
╰───────────────⭓`,

                        threadID,
                        messageID
                    );
                }

                default:
                    api.sendMessage(
                        `❎ ${bold("Invalid option.")}`,
                        threadID,
                        messageID
                    );
            }
        }

        // ── SAVE DATABASE ───────────
        await setData(
            "antiSystem",
            dataAnti
        );

    } catch (e) {

        console.log(
            "ANTI HANDLE ERROR:",
            e
        );
    }
};

// ── COMMAND ─────────────────────────
module.exports.run = async function ({
    api,
    event,
    permssion
}) {

    const {
        threadID,
        messageID,
        senderID
    } = event;

    return api.sendMessage(

`╭───────────────⭓
│ 🛡️ ANTI SYSTEM
├───────────────⭔
│ 1️⃣ Anti Name
│ 2️⃣ Anti Image
│ 3️⃣ Anti Nickname
│ 4️⃣ Anti Leave
│ 5️⃣ Anti Emoji
│ 6️⃣ Anti Theme
│ 7️⃣ Anti Admin
│
│ 9️⃣ Check Status
╰───────────────⭓

💬 Reply with number
to toggle anti system.`,

        threadID,

        (err, info) => {

            if (err)
                return api.sendMessage(
                    `❌ Error.`,
                    threadID
                );

            global.client.handleReply.push({
                name: module.exports.config.name,
                messageID: info.messageID,
                author: senderID,
                permssion
            });

        },

        messageID
    );
};
