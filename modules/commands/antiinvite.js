const { getData, setData } = require("../../database.js");

// ── NORMALIZE TEXT (ANTI-SPAM FORMAT) ─────────────
function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

// ── INVITE REGEX (UPGRADED) ───────────────────────
const INVITE_REGEX = [

    /sino\s*(gusto|want|trip)?.*(sali|join)/i,
    /(sali|join).*(gc|group|server)/i,

    /(pm|chat|message).*(ako|me).*(sali|join|gc|server)/i,
    /pm\s*(nyo|mo|lang)?\s*(ako)?.*(sali|join|gc|server)/i,

    /(tara|lipat|alis).*(gc|group|server|kabilang|ibang)/i,

    /(may\s+(gc|server)).*(sali|join|want|gusto)/i,

    /(laro|pvp).*(kabila|ibang|server)/i,
    /pvp.*(kabila|ibang)/i,

    /(kabila|kabilang)/i,

    /(gc|server)\s+namin/i,
    /(may\s+gc\s+kami).*(sali|join)/i,

    /(pasok\s+kayo).*(gc|server)/i,

    /(sali|join).*(barkada|craft|server)/i,

    /(sumali|join).*(kami|namin)?/i
];

// ── MESSENGER GC LINK ─────────────────────────────
const MESSENGER_LINK_REGEX =
/(https?:\/\/)?(www\.)?(m\.me\/j\/|messenger\.com\/t\/|fb\.com\/messages\/)/i;

const RESET_TIME = 7 * 24 * 60 * 60 * 1000;

// ── BYPASS ─────────────────────────────────────────
const BYPASS_IDS = [
    "61581773373775"
];

// ── CONTEXT FILTER (SMART) ───────────────────────
function isExternalInvite(msg) {

    const SAFE_WORDS = [
        "dito",
        "server natin",
        "team",
        "event",
        "palaro",
        "our server",
        "this server",
        "same server"
    ];

    const hasSafe = SAFE_WORDS.some(w => msg.includes(w));

    if (hasSafe) return false;

    return true; // allow detection if regex triggered
}

// ── DETECT FUNCTION ───────────────────────────────
function isInviteMessage(msg) {
    return INVITE_REGEX.some(regex => regex.test(msg));
}

module.exports.config = {
    name: "antiinvite",
    version: "11.0.0",
    hasPermssion: 1,
    credits: "ChatGPT",
    description: "Ultra Anti Invite System",
    commandCategory: "Group",
    usages: "/antiinvite on/off",
    cooldowns: 5
};

// ── HANDLE CHAT ───────────────────────────────────
module.exports.handleEvent = async function ({ api, event }) {

    const { threadID, senderID, body } = event;
    if (!body) return;

    if (BYPASS_IDS.includes(String(senderID))) return;

    const threadData = await getData(`antiinvite_${threadID}`) || {};
    if (!threadData.enabled) return;

    const msg = normalizeText(body);

    // 🔥 detect messenger link
    const isMessengerLink = MESSENGER_LINK_REGEX.test(body.toLowerCase());

    // 🔥 detection logic
    if (!isMessengerLink) {
        if (!isInviteMessage(msg)) return;
        if (!isExternalInvite(msg)) return;
    }

    // ── CHECK ADMIN ───────────────────────────────
    const threadInfo = await api.getThreadInfo(threadID);
    const isAdmin = threadInfo.adminIDs.some(a => a.id == senderID);
    if (isAdmin) return;

    // ── USER DATA ─────────────────────────────────
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
│ Inviting members to
│ external groups or
│ sharing GC links is
│ strictly prohibited.
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
│ Repeated invitations
│ or sharing GC links.
╰───────────────⭓`,
                threadID
            );
        } catch (e) {
            console.log(e);
        }
    }
};

// ── COMMAND (FIXED) ───────────────────────────────
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

        return api.sendMessage(
`╭───────────────⭓
│ ✅ ANTI-INVITE ENABLED
├───────────────⭔
│ Advanced protection is ON.
│
│ Messenger GC links and
│ invite messages are blocked.
╰───────────────⭓`,
            threadID
        );
    }

    if (option === "off") {
        await setData(`antiinvite_${threadID}`, { enabled: false });

        return api.sendMessage(
`╭───────────────⭓
│ ❌ ANTI-INVITE DISABLED
├───────────────⭔
│ Protection turned off.
╰───────────────⭓`,
            threadID
        );
    }

    return api.sendMessage("Usage: /antiinvite on | off", threadID);
};
