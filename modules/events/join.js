const { getData } = require("../../database.js");

module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "3.0.0",
  credits: "Kim Joseph DG Bien + ChatGPT + Jaylord La Peña",
  description: "Join Notification with welcome image and optional video",
  dependencies: {
    "fs-extra": "",
    "request": "",
    "axios": ""
  }
};

module.exports.run = async function ({
  api,
  event,
  Users
}) {

  const request = require("request");
  const fs = require("fs-extra");
  const axios = require("axios");
  const path = require("path");

  try {

    const {
      threadID,
      logMessageData
    } = event;

    // ── FIX ─────────────────────────
    if (
      !logMessageData ||
      !logMessageData.addedParticipants
    ) return;

    const addedParticipants =
      logMessageData.addedParticipants;

    // ── BOT ADDED ──────────────────
    if (
      addedParticipants.some(
        p =>
          p.userFbId ==
          api.getCurrentUserID()
      )
    ) {

      api.changeNickname(
        `[ ${global.config.PREFIX} ] • ${global.config.BOTNAME || "Mirai Bot"}`,
        threadID,
        api.getCurrentUserID()
      );

      return api.sendMessage(
`👋 Hello Everyone!

🤖 I'm ${global.config.BOTNAME || "Mirai Bot"}
⌨️ Prefix: ${global.config.PREFIX}
📖 Type ${global.config.PREFIX}help to see commands!`,
        threadID
      );
    }

    // ── THREAD INFO ────────────────
    const threadInfo =
      await api.getThreadInfo(
        threadID
      );

    const threadName =
      threadInfo.threadName ||
      "Group Chat";

    const participantIDs =
      threadInfo.participantIDs || [];

    const totalMembers =
      participantIDs.length;

    // ── VIDEO TOGGLE ───────────────
    const videoConfig =
      await getData(
        `welcomeVideo/${threadID}`
      );

    const videoEnabled =
      videoConfig?.enabled || false;

    const cacheDir =
      path.join(
        __dirname,
        "cache"
      );

    fs.ensureDirSync(cacheDir);

    // ── LOOP USERS ─────────────────
    for (const user of addedParticipants) {

      const userID =
        user.userFbId;

      if (
        userID ==
        api.getCurrentUserID()
      ) continue;

      const userName =
        user.fullName ||
        "Friend";

      // ── SAVE USER DATA ───────────
      if (
        !global.data.allUserID.includes(
          String(userID)
        )
      ) {

        await Users.createData(
          userID,
          {
            name: userName,
            data: {}
          }
        );

        global.data.allUserID.push(
          String(userID)
        );
      }

      // ── IMAGE API ────────────────
      const imgApi =
`https://betadash-api-swordslush-production.up.railway.app/welcome?name=${encodeURIComponent(userName)}&userid=${userID}&threadname=${encodeURIComponent(threadName)}&members=${totalMembers}`;

      const imgPath =
        path.join(
          cacheDir,
          `welcome_${userID}.png`
        );

      // ── DOWNLOAD IMAGE ───────────
      try {

        await new Promise(
          (resolve, reject) => {

            request(imgApi)
              .pipe(
                fs.createWriteStream(
                  imgPath
                )
              )
              .on(
                "close",
                resolve
              )
              .on(
                "error",
                reject
              );
          }
        );

      } catch (e) {

        console.log(
          "WELCOME IMAGE ERROR:",
          e.message
        );

        continue;
      }

      // ── SEND WELCOME ─────────────
      await new Promise(
        resolve => {

          api.sendMessage(
            {
              body:
`👋 Welcome ${userName}!

🎉 Welcome to ${threadName}
🔢 You are member #${totalMembers}`,

              mentions: [
                {
                  tag: userName,
                  id: userID
                }
              ],

              attachment:
                fs.existsSync(imgPath)
                  ? fs.createReadStream(
                      imgPath
                    )
                  : null
            },

            threadID,

            () => {

              if (
                fs.existsSync(
                  imgPath
                )
              ) {

                fs.unlinkSync(
                  imgPath
                );
              }

              resolve();
            }
          );
        }
      );

      // ── VIDEO DISABLED ───────────
      if (!videoEnabled)
        continue;

      // ── WAIT ─────────────────────
      await new Promise(
        r =>
          setTimeout(r, 3000)
      );

      try {

        const videoApi =
`https://betadash-shoti-yazky.vercel.app/shotizxx?apikey=shipazu`;

        const res =
          await axios.get(
            videoApi,
            {
              timeout: 15000
            }
          );

        const videoUrl =
          res?.data?.shotiurl;

        if (!videoUrl)
          continue;

        const videoPath =
          path.join(
            cacheDir,
            `welcome_${userID}.mp4`
          );

        const videoStream =
          await axios({
            url: videoUrl,
            method: "GET",
            responseType: "stream",
            timeout: 30000
          });

        await new Promise(
          (resolve, reject) => {

            const writer =
              fs.createWriteStream(
                videoPath
              );

            videoStream.data.pipe(
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

        await new Promise(
          resolve => {

            api.sendMessage(
              {
                body:
`🎥 Welcome video for ${userName}!`,

                attachment:
                  fs.createReadStream(
                    videoPath
                  )
              },

              threadID,

              () => {

                if (
                  fs.existsSync(
                    videoPath
                  )
                ) {

                  fs.unlinkSync(
                    videoPath
                  );
                }

                resolve();
              }
            );
          }
        );

      } catch (e) {

        console.log(
          "WELCOME VIDEO ERROR:",
          e.message
        );
      }
    }

  } catch (e) {

    console.log(
      "JOIN NOTI ERROR:",
      e
    );
  }
};
