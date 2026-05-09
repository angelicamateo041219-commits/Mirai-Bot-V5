const { getData, setData } = require("../../database.js");

// ── NORMALIZE TEXT ────────────────────────────────
function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

// ── INVITE REGEX (BALANCED) ───────────────────────
const INVITE_REGEX = [

    // sino gusto sumali
    /sino\s*(gusto|want)?.*(sali|join)/i,

    // join gc/server
    /(sali|join).*(gc|group|server)/i,

    // pm invite
    /(pm|chat|message).*(ako|me).*(sali|join|gc|server)/i,
    /pm\s*(nyo|mo)?.*(sali|join)/i,

    // tara / lipat
    /(tara|lipat|alis).*(gc|group|server|kabilang|ibang)/i,

    // may server ako
    /(may\s+(gc|server)).*(sali|join|want|gusto)/i,

    // pvp redirect
    /(pvp|laro).*(kabila|ibang|server)/i,

    // gc namin
    /(gc|server)\s+namin/i,

    // join without gc word
    /(sumali|join).*(kami|namin)/i
];

// ── MESSENGER LINK ───────────────────────────────
const MESSENGER_LINK_REGEX =
/(https?:\/\/)?(www\.)?(m\.me\/j\/|messenger\.com\/t\/|fb\.com\/messages\/)/i;

const RESET_TIME = 7 * 24 * 60 * 60 * 1000;

// ── BYPASS ───────────────────────────────────────
const BYPASS_IDS = [
    "61581773373775"
];

// ── DETECT FUNCTION ──────────────────────────────
function isInviteMessage(msg) {
    return INVITE_REGEX.some(regex => regex.test(msg));
}

module.exports.config = {
    name: "antiinvite",
    version: "12.0.0",
    hasPermssion: 1,
    credits: "ChatGPT FIXED",
    description: "Stable Anti Invite",
    commandCategory: "Group",
    usages: "/antiinvite on/off",
    cooldowns: 5
};

// ── HANDLE CHAT ──────────────────────────────────
module.exports.handleEvent = async function ({ api, event }) {

    const { threadID, senderID, body } = event;
    if (!body) return;

    if (BYPASS_IDS.includes(String(senderID))) return;

    const threadData = await getData(`antiinvite_${threadID}`) || {};
    if (!threadData.enabled) return;

    const msg = normalizeText(body);

    // 🔥 Messenger link (priority)
    const isMessengerLink = MESSENGER_LINK_REGEX.test(body.toLowerCase());

    // 🔥 Text detection
    if (!isMessengerLink) {
        if (!isInviteMessage(msg)) return;
    }

    // ── CHECK ADMIN ───────────────────────────────
    const threadInfo = await api.getThreadInfo(threadID);
    const isAdmin = threadInfo.adminIDs.some(a => a.id == senderID);
    if (isAdmin) return;

    // ── USER DATA ────────────────────────────────
    let userData = await getData(`antiinvite_warn_${threadID}_${senderID}`) || {
        count: 0,
        lastWarn: 0
    };

    if (Date.now() - userData.lastWarn > RESET_TIME) {
        userData.count = 0;
    }

    userData.count++;
    userData.lastWarn = Date.now();

    await setData(`antiinvite_warn_${threadID}_${senderID}`, userData);

    const name = await api.getUserInfo(senderID)
        .then(u => u[senderID].name);

    // ── WARNING ───────────────────────────────────
    if (userData.count === 1) {
        return api.sendMessage(
`╭───────────────⭓
│ ⚠️ WARNING NOTICE
├───────────────⭔
│ Dear ${name},
│
│ Inviting members to other
│ groups or sharing GC links
│ is strictly prohibited.
│
│ 📜 GC Rule No. 4
│
│ 🚫 Next violation will
│ result in removal.
│
│ ⏳ Warning resets in 7 days
╰───────────────⭓`,
            threadID
        );
    }

    // ── KICK ──────────────────────────────────────
    if (userData.count >= 2) {
        try {
            await api.removeUserFromGroup(senderID, threadID);

            await setData(`antiinvite_warn_${threadID}_${senderID}`, null);

            return api.sendMessage(
`╭───────────────⭓
│ ❌ REMOVAL NOTICE
├───────────────⭔
│ ${name} has been removed
│ from the group.
│
│ Reason:
│ Repeated invite attempts.
╰───────────────⭓`,
                threadID
            );
        } catch (e) {
            console.log(e);
        }
    }
};

// ── COMMAND ───────────────────────────────────────
module.exports.run = async function ({ api, event }) {

    const { threadID, senderID, body } = event;
    const args = body.split(" ").slice(1);

    const threadInfo = await api.getThreadInfo(threadID);
    const isAdmin = threadInfo.adminIDs.some(a => a.id == senderID);

    if (!isAdmin) {
        return api.sendMessage("⚠️ Admins only.", threadID);
    }

    const option = args[0];

    if (option === "on") {
        await setData(`antiinvite_${threadID}`, { enabled: true });

        return api.sendMessage("✅ Anti-invite enabled.", threadID);
    }

    if (option === "off") {
        await setData(`antiinvite_${threadID}`, { enabled: false });

        return api.sendMessage("❌ Anti-invite disabled.", threadID);
    }

    return api.sendMessage("Usage: /antiinvite on | off", threadID);
};
