module.exports.config = {
    name: "kick",
    version: "2.3.0",
    hasPermssion: 0,
    credits: "ChatGPT",
    description: "Kick mentioned member",
    commandCategory: "Group",
    usages: "/kick @mention",
    cooldowns: 5
};

// ── PROTECTED OWNER IDS ─────────────────────────────
const PROTECTED_IDS = [
    "61581773373775",
    "100090348241385"
];

module.exports.run = async function ({
    api,
    event,
    Users
}) {

    const {
        threadID,
        senderID,
        mentions
    } = event;

    const botID = api.getCurrentUserID();
    const threadInfo = await api.getThreadInfo(threadID);

    const isAdmin =
        threadInfo.adminIDs.some(
            admin => admin.id == senderID
        );

    if (!isAdmin) {
        return api.sendMessage(
`╭───────────────⭓
│ ⚠️ ACCESS DENIED
├───────────────⭔
│ Only group admins
│ can use this command.
╰───────────────⭓`,
            threadID
        );
    }

    const mentionID = Object.keys(mentions)[0];

    if (!mentionID) {
        return api.sendMessage(
`╭───────────────⭓
│ ⚠️ INVALID USAGE
├───────────────⭔
│ Please mention
│ a user to kick.
╰───────────────⭓`,
            threadID
        );
    }

    const targetID = String(mentionID);

    // ── PREVENT KICKING BOT ──────────────────────────
    if (targetID === String(botID)) {
        return api.sendMessage(
`╭───────────────⭓
│ 🤖 ACTION BLOCKED
├───────────────⭔
│ You cannot kick
│ the bot.
╰───────────────⭓`,
            threadID
        );
    }

    // ── PROTECTED USERS ──────────────────────────────
    if (PROTECTED_IDS.includes(targetID)) {
        return api.sendMessage(
`╭───────────────⭓
│ 👑 PROTECTED USER
├───────────────⭔
│ You cannot remove
│ this protected user.
╰───────────────⭓`,
            threadID
        );
    }

    const userName = await Users.getNameUser(targetID);

    try {
        await api.removeUserFromGroup(targetID, threadID);

        return api.sendMessage(
`╭───────────────⭓
│ ✅ MEMBER REMOVED
├───────────────⭔
│ 👤 ${userName}
│ has been removed
│ from the group.
╰───────────────⭓`,
            threadID
        );

    } catch (e) {
        console.log(e);

        return api.sendMessage(
`╭───────────────⭓
│ ❌ REMOVE FAILED
├───────────────⭔
│ Make sure the bot
│ is group admin.
╰───────────────⭓`,
            threadID
        );
    }
};
