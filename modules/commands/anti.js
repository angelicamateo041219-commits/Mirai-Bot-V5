const { getData, setData } = require("../../database.js");
const bold = require("../../utils/bold");

module.exports.config = {
    name: "anti",
    version: "6.0.0",
    hasPermssion: 1,
    credits: "BraSL + ChatGPT",
    description: "Anti system with Firebase",
    commandCategory: "group",
    usages: "/anti",
    cooldowns: 5
};

// ── MENU ────────────────────────────
function antiMenu() {

    return `╭───────────────⭓
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
to toggle anti system.`;
}

// ── HANDLE REPLY ───────────────────
module.exports.handleReply = async function ({
    api,
    event,
    handleReply
}) {

    try {

        const {
            senderID,
            threadID,
            body
        } = event;

        const {
            author,
            permssion
        } = handleReply;

        // ── CHECK OWNER ─────────────
        if (author != senderID)
            return;

        // ── GET DATABASE ────────────
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

        const num =
            body
            .trim()
            .replace(/[^\d]/g, "");

        // ────────────────────────────
        // 1️⃣ ANTI NAME
        // ────────────────────────────

        if (num === "1") {

            const existing =
                dataAnti.boxname.find(
                    item =>
                    item.threadID == threadID
                );

            if (existing) {

                dataAnti.boxname =
                    dataAnti.boxname.filter(
                        item =>
                        item.threadID != threadID
                    );

                await api.sendMessage(
                    `☑️ ${bold("Anti name:")} OFF`,
                    threadID
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

                await api.sendMessage(
                    `☑️ ${bold("Anti name:")} ON ✅`,
                    threadID
                );
            }
        }

        // ────────────────────────────
        // 2️⃣ ANTI IMAGE
        // ────────────────────────────

        else if (num === "2") {

            const existing =
                dataAnti.boximage.find(
                    item =>
                    item.threadID == threadID
                );

            if (existing) {

                dataAnti.boximage =
                    dataAnti.boximage.filter(
                        item =>
                        item.threadID != threadID
                    );

                await api.sendMessage(
                    `☑️ ${bold("Anti image:")} OFF`,
                    threadID
                );

            } else {

                dataAnti.boximage.push({
                    threadID,
                    enabled: true
                });

                await api.sendMessage(
                    `☑️ ${bold("Anti image:")} ON ✅`,
                    threadID
                );
            }
        }

        // ────────────────────────────
        // 3️⃣ ANTI NICKNAME
        // ────────────────────────────

        else if (num === "3") {

            const existing =
                dataAnti.antiNickname.find(
                    item =>
                    item.threadID == threadID
                );

            if (existing) {

                dataAnti.antiNickname =
                    dataAnti.antiNickname.filter(
                        item =>
                        item.threadID != threadID
                    );

                await api.sendMessage(
                    `☑️ ${bold("Anti nickname:")} OFF`,
                    threadID
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

                await api.sendMessage(
                    `☑️ ${bold("Anti nickname:")} ON ✅`,
                    threadID
                );
            }
        }

        // ────────────────────────────
        // 4️⃣ ANTI LEAVE
        // ────────────────────────────

        else if (num === "4") {

            dataAnti.antiout[threadID] =
                !dataAnti.antiout[threadID];

            await api.sendMessage(
                `☑️ ${bold("Anti leave:")} ${
                    dataAnti.antiout[threadID]
                    ? "ON ✅"
                    : "OFF"
                }`,
                threadID
            );
        }

        // ────────────────────────────
        // 5️⃣ ANTI EMOJI
        // ────────────────────────────

        else if (num === "5") {

            const info =
                await api.getThreadInfo(
                    threadID
                );

            const emoji =
                info.emoji || "";

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

                dataAnti.antiemoji[
                    threadID
                ].emoji = emoji;
            }

            await api.sendMessage(
                `☑️ ${bold("Anti emoji:")} ${
                    dataAnti.antiemoji[threadID]
                    .enabled
                    ? "ON ✅"
                    : "OFF"
                }`,
                threadID
            );
        }

        // ────────────────────────────
        // 6️⃣ ANTI THEME
        // ────────────────────────────

        else if (num === "6") {

            const info =
                await api.getThreadInfo(
                    threadID
                );

            const theme =
                info.threadTheme?.id || "";

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

                dataAnti.antitheme[
                    threadID
                ].themeid = theme;
            }

            await api.sendMessage(
                `☑️ ${bold("Anti theme:")} ${
                    dataAnti.antitheme[threadID]
                    .enabled
                    ? "ON ✅"
                    : "OFF"
                }`,
                threadID
            );
        }

        // ────────────────────────────
        // 7️⃣ ANTI ADMIN
        // ────────────────────────────

        else if (num === "7") {

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
                    threadID
                );
            }

            dataAnti.antiadmin[threadID] =
                !dataAnti.antiadmin[threadID];

            await api.sendMessage(
                `☑️ ${bold("Anti admin:")} ${
                    dataAnti.antiadmin[threadID]
                    ? "ON ✅"
                    : "OFF"
                }`,
                threadID
            );
        }

        // ────────────────────────────
        // 9️⃣ STATUS
        // ────────────────────────────

        else if (num === "9") {

            const aiName =
                dataAnti.boxname.find(
                    item =>
                    item.threadID == threadID
                );

            const aiImage =
                dataAnti.boximage.find(
                    item =>
                    item.threadID == threadID
                );

            const aiNick =
                dataAnti.antiNickname.find(
                    item =>
                    item.threadID == threadID
                );

            await api.sendMessage(

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

                threadID
            );
        }

        // ────────────────────────────
        // INVALID
        // ────────────────────────────

        else {

            await api.sendMessage(
                `❎ ${bold("Invalid option.")}`,
                threadID
            );
        }

        // ── SAVE DATABASE ───────────
        await setData(
            "antiSystem",
            dataAnti
        );

        // ── ADD NEW HANDLE REPLY ────
        global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: event.messageID,
            author: senderID,
            permssion
        });

    } catch (e) {

        console.log(e.stack);
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

        antiMenu(),

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
