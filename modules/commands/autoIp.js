module.exports.config = {
    name: "autoIp",
    version: "1.4.0",
    hasPermssion: 0,
    credits: "ChatGPT",
    description: "Auto reply server IP when someone types ip",
    commandCategory: "Auto",
    usages: "ip",
    cooldowns: 2
};

// ── IGNORED UID ─────────────────────
const IGNORED_UIDS = [
    "100090348241385"
];

module.exports.handleEvent = async function ({
    api,
    event
}) {

    const {
        body,
        threadID,
        messageID,
        senderID
    } = event;

    if (!body) return;

    // ignore bot's own messages
    if (
        senderID ==
        api.getCurrentUserID()
    ) return;

    // ignore specific uid
    if (
        IGNORED_UIDS.includes(
            String(senderID)
        )
    ) return;

    const text =
        body.toLowerCase().trim();

    // detect "ip" only as separate word
    const hasIp =
        /\bip\b/.test(text);

    if (!hasIp)
        return;

    return api.sendMessage(
`Choose the server that gives you the best ping:
🇵🇭 PH 🇸🇬 SG 🇭🇰 HK

━━━━━━━━━━━━━━━
🎮 BARKADA CRAFT SMP
━━━━━━━━━━━━━━━

📡 SERVER IPs

🇵🇭 PH SERVER
┃ JAVA IP: barkadacraftsmp.ph1-mczie.fun:4090
┃ BEDROCK IP: barkadacraftsmp.ph1-mczie.fun
┃ PORT: 4090

🇸🇬 SG SERVER
┃ JAVA IP: barkadacraftsmp.sg1-mczie.fun:4090
┃ BEDROCK IP: barkadacraftsmp.sg1-mczie.fun
┃ PORT: 4090

🇭🇰 HK SERVER
┃ JAVA IP: barkadacraftsmp.hk-mczie.fun:4090
┃ BEDROCK IP: barkadacraftsmp.hk-mczie.fun
┃ PORT: 4090

━━━━━━━━━━━━━━━
✅ Piliin ang pinaka smooth at hindi lag para sayo!
⚔️🔥 See you in-game!`,
        threadID,
        messageID
    );
};

module.exports.run = async function () {};
