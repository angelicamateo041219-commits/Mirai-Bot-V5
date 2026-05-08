module.exports.config = {
    name: "leaveNoti",
    eventType: ["log:unsubscribe"],
    version: "5.0.0",
    credits: "Ranz | ChatGPT Fixed",
    description: "Notify when a user leaves the group with image + nickname"
};

module.exports.run = async function ({
    api,
    event,
    Users
}) {

    try {

        const fs = require("fs-extra");
        const axios = require("axios");
        const path = require("path");
        const moment = require("moment-timezone");

        const { threadID } = event;

        const leftID =
            event.logMessageData.leftParticipantFbId;

        // ignore bot leave
        if (
            leftID ==
            api.getCurrentUserID()
        ) return;

        // anti duplicate
        if (!global.leaveCooldown)
            global.leaveCooldown =
                new Set();

        const cooldownKey =
            `${threadID}_${leftID}`;

        if (
            global.leaveCooldown.has(
                cooldownKey
            )
        ) return;

        global.leaveCooldown.add(
            cooldownKey
        );

        setTimeout(() => {

            global.leaveCooldown.delete(
                cooldownKey
            );

        }, 3000);

        // get thread info
        const threadInfo =
            await api.getThreadInfo(
                threadID
            );

        // time
        const time =
            moment
            .tz("Asia/Manila")
            .format(
                "hh:mm A • MMM D YYYY"
            );

        // nickname
        const nickname =
            threadInfo.nicknames?.[
                leftID
            ] || null;

        // real name
        const realName =
            global.data.userName.get(
                leftID
            ) ||
            await Users.getNameUser(
                leftID
            );

        // final display name
        const name =
            nickname
            ? `${realName} (${nickname})`
            : realName;

        // remover name
        const authorName =
            event.author == leftID
            ? null
            : await Users.getNameUser(
                event.author
            );

        // status
        const status =
            event.author == leftID
            ? "Left the group"
            : `Removed by ${authorName}`;

        // message
        const msg =
`╭───────────────⭓
│ 👋 MEMBER LEFT
├───────────────⭔
│ 👤 Name: ${name}
│ 📌 Status: ${status}
│ 🕒 Time: ${time}
╰───────────────⭓`;

        // image api
        const imageURL =
`https://betadash-api-swordslush-production.up.railway.app/rip?userid=${leftID}`;

        // cache folder
        const cacheDir =
            path.join(
                __dirname,
                "cache"
            );

        fs.ensureDirSync(
            cacheDir
        );

        // image path
        const filePath =
            path.join(
                cacheDir,
                `leave_${leftID}.png`
            );

        try {

            // download image
            const response =
                await axios({
                    url: imageURL,
                    method: "GET",
                    responseType: "stream",
                    timeout: 20000
                });

            await new Promise(
                (resolve, reject) => {

                    const writer =
                        fs.createWriteStream(
                            filePath
                        );

                    response.data.pipe(
                        writer
                    );

                    writer.on(
                        "finish",
                        resolve
                    );

                    writer.on(
                        "error",
                        reject
                    );
                }
            );

            // send with image
            return api.sendMessage(
                {
                    body: msg,
                    attachment:
                        fs.createReadStream(
                            filePath
                        )
                },
                threadID,
                () => {

                    if (
                        fs.existsSync(
                            filePath
                        )
                    ) {

                        fs.unlinkSync(
                            filePath
                        );
                    }
                }
            );

        } catch (e) {

            console.log(
                "LEAVE IMAGE ERROR:",
                e.message
            );

            // fallback text only
            return api.sendMessage(
                msg,
                threadID
            );
        }

    } catch (e) {

        console.log(
            "[leaveNoti]",
            e
        );
    }
};
