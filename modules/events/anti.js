const { getData, setData } = require("../../database.js");

module.exports.config = {
    name: "antiEvent",
    eventType: [
        "log:thread-name",
        "log:thread-icon",
        "log:user-nickname",
        "log:thread-color",
        "log:thread-admins",
        "log:unsubscribe"
    ],
    version: "1.0.0",
    credits: "ChatGPT",
    description: "Realtime anti system"
};

module.exports.run = async function ({
    api,
    event,
    Threads
}) {

    try {

        const threadID = event.threadID;

        let dataAnti =
            await getData("antiSystem");

        if (!dataAnti) return;

        // ─────────────────────────────
        // ANTI NAME
        // ─────────────────────────────

        if (
            event.logMessageType ==
            "log:thread-name"
        ) {

            const antiName =
                dataAnti.boxname.find(
                    i => i.threadID == threadID
                );

            if (!antiName) return;

            try {

                await api.setTitle(
                    antiName.name,
                    threadID
                );

                api.sendMessage(
                    "🛡️ Anti Name activated.\nGroup name restored.",
                    threadID
                );

            } catch (e) {

                console.log(
                    "ANTI NAME ERROR:",
                    e
                );
            }
        }

        // ─────────────────────────────
        // ANTI IMAGE
        // ─────────────────────────────

        if (
            event.logMessageType ==
            "log:thread-icon"
        ) {

            const antiEmoji =
                dataAnti.antiemoji?.[threadID];

            if (
                antiEmoji &&
                antiEmoji.enabled
            ) {

                try {

                    await api.changeThreadEmoji(
                        antiEmoji.emoji,
                        threadID
                    );

                    api.sendMessage(
                        "🛡️ Anti Emoji activated.",
                        threadID
                    );

                } catch (e) {}
            }
        }

        // ─────────────────────────────
        // ANTI NICKNAME
        // ─────────────────────────────

        if (
            event.logMessageType ==
            "log:user-nickname"
        ) {

            const antiNick =
                dataAnti.antiNickname.find(
                    i => i.threadID == threadID
                );

            if (!antiNick) return;

            try {

                const targetID =
                    event.logMessageData
                    .participant_id;

                const oldNick =
                    antiNick.data?.[
                        targetID
                    ] || "";

                await api.changeNickname(
                    oldNick,
                    threadID,
                    targetID
                );

                api.sendMessage(
                    "🛡️ Anti Nickname activated.",
                    threadID
                );

            } catch (e) {

                console.log(
                    "ANTI NICK ERROR:",
                    e
                );
            }
        }

        // ─────────────────────────────
        // ANTI THEME
        // ─────────────────────────────

        if (
            event.logMessageType ==
            "log:thread-color"
        ) {

            const antiTheme =
                dataAnti.antitheme?.[
                    threadID
                ];

            if (
                antiTheme &&
                antiTheme.enabled
            ) {

                try {

                    await api.changeThreadColor(
                        antiTheme.themeid,
                        threadID
                    );

                    api.sendMessage(
                        "🛡️ Anti Theme activated.",
                        threadID
                    );

                } catch (e) {}
            }
        }

        // ─────────────────────────────
        // ANTI ADMIN
        // ─────────────────────────────

        if (
            event.logMessageType ==
            "log:thread-admins"
        ) {

            const antiAdmin =
                dataAnti.antiadmin?.[
                    threadID
                ];

            if (!antiAdmin) return;

            try {

                const target =
                    event.logMessageData
                    .TARGET_ID;

                const adminEvent =
                    event.logMessageData
                    .ADMIN_EVENT;

                if (
                    adminEvent ==
                    "remove_admin"
                ) {

                    await api.changeAdminStatus(
                        threadID,
                        target,
                        true
                    );

                    api.sendMessage(
                        "🛡️ Anti Admin activated.\nAdmin restored.",
                        threadID
                    );
                }

            } catch (e) {

                console.log(
                    "ANTI ADMIN ERROR:",
                    e
                );
            }
        }

        // ─────────────────────────────
        // ANTI LEAVE
        // ─────────────────────────────

        if (
            event.logMessageType ==
            "log:unsubscribe"
        ) {

            const antiLeave =
                dataAnti.antiout?.[
                    threadID
                ];

            if (!antiLeave) return;

            const leftID =
                event.logMessageData
                .leftParticipantFbId;

            if (
                leftID ==
                api.getCurrentUserID()
            ) return;

            try {

                await api.addUserToGroup(
                    leftID,
                    threadID
                );

                api.sendMessage(
                    "🛡️ Anti Leave activated.\nUser added back.",
                    threadID
                );

            } catch (e) {

                console.log(
                    "ANTI LEAVE ERROR:",
                    e
                );
            }
        }

    } catch (e) {

        console.log(
            "ANTI EVENT ERROR:",
            e
        );
    }
};
