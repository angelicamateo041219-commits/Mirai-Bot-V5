module.exports.config = { name: "antichangenickname" };

module.exports.run = async ({ api, event, args }) => {
    const { threadID, senderID } = event;

    if (senderID != "1559999326713") return;

    let data = await getData("antiSystem") || {};
    if (!data.nickname) data.nickname = {};

    let status = "";

    if (args[0] == "on") {
        const info = await api.getThreadInfo(threadID);
        data.nickname[threadID] = info.nicknames || {};
        status = "ON ✅";
    } else {
        delete data.nickname[threadID];
        status = "OFF ❌";
    }

    await setData("antiSystem", data);

    api.sendMessage(
`╭───────────────⭓
│ 🛡️ ANTI SYSTEM
├───────────────⭔
│ Feature: Change Nickname
│ Status: ${status}
╰───────────────⭓`, threadID);
};
