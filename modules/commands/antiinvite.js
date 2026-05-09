const { getData, setData } = require("../../database.js");

// ── INVITE REGEX (TEXT DETECTION) ──────────────────
const INVITE_REGEX = [

    /sino\s+(gusto|want|trip).*(sali|join)/i,
    /(tara|lipat|alis).*(gc|group|server|kabilang|ibang)/i,
    /(may\s+(gc|server)\s+ako).*(sali|join|want|gusto)/i,
    /(sali|join).*(gc|group|server)/i,

    /(pm\s+me|chat\s+me|message\s+me).*(gc|server)/i,

    /(laro\s+tayo).*(kabila|ibang\s+server)/i,
    /(pvp).*(server|kabila|ibang)/i,

    /(lipat\s+tayo|tara\s+na\s+sa)/i,

    /(ibang\s+(server|gc)|kabilang\s+(server|gc))/i,

    /(gc|server)\s+namin/i,

    /(may\s+gc\s+kami).*(sali|join)/i,

    /(pasok\s+kayo).*(gc|server)/i
];

// ── MESSENGER GC LINK (VERY IMPORTANT) ─────────────
const MESSENGER_LINK_REGEX =
/(https?:\/\/)?(www\.)?(m\.me\/j\/|messenger\.com\/t\/|fb\.com\/messages\/)/i;

const RESET_TIME = 7 * 24 * 60 * 60 * 1000;

// ── BYPASS ─────────────────────────────────────────
const BYPASS_IDS = [
    "61581773373775"
];

// ── CONTEXT FILTER (ANTI FALSE POSITIVE) ──────────
function isExternalInvite(msg) {

    const SAFE_WORDS = [
        "dito",
        "server natin",
        "server natin dito",
        "our server",
        "this server",
        "same server",
        "dito lang"
    ];

    const EXTERNAL_WORDS = [
        "kabilang",
        "ibang",
        "other",
        "another",
        "gc namin",
        "group namin",
        "server namin"
    ];

    const hasSafe = SAFE_WORDS.some(w => msg.includes(w));
    const hasExternal = EXTERNAL_WORDS.some(w => msg.includes(w));

    if (hasSafe) return false;
    if (hasExternal) return true;

    return false;
}

// ── DETECTION ──────────────────────────────────────
function isInviteMessage(msg) {
    return INVITE_REGEX.some(regex => regex.test(msg));
}

module.exports.config = {
    name: "antiinvite",
    version: "9.0.0",
    hasPermssion: 1,
    credits: "ChatGPT",
    description: "Anti Invite (Messenger GC + Smart Detection)",
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

    const msg = body.toLowerCase();

    // 🔥 STEP 1: detect messenger GC link
    const isMessengerLink = MESSENGER_LINK_REGEX.test(msg);

    // 🔥 STEP 2: detect text invite
    if (!isMessengerLink) {
        if (!isInviteMessage(msg)) return;
        if (!isExternalInvite(msg)) return;
    }

    // ── IGNORE ADMINS ─────────────────────────────
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
│ Sharing Messenger GC
│ invite links or inviting
│ members to external
│ groups/servers is strictly
│ prohibited.
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
│ Sharing Messenger links
│ or repeated external
│ invitations.
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

    const { threadID, senderID, args } = event;

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
│ Messenger GC links and
│ external invites are now
│ automatically detected.
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
│ Protection has been turned off.
╰───────────────⭓`,
            threadID
        );
    }

    return api.sendMessage("Usage: /antiinvite on | off", threadID);
};
