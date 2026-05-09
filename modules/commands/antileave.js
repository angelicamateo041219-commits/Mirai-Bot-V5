module.exports.config = { name: "antileave" };

module.exports.run = async ({ api, event, args }) => {
    const { threadID, senderID } = event;

    if (senderID != "1559999326713") return;

    let data = await getData("antiSystem") || {};
    if (!data.leave) data.leave = {};

    let status = "";

    if (args[0] == "on") {
        data.leave[threadID] = true;
        status = "ON ✅";
    } else {
        delete data.leave[threadID];
        status = "OFF ❌";
    }

    await setData("antiSystem", data);

    api.sendMessage(
`╭───────────────⭓
│ 🛡️ ANTI SYSTEM
├───────────────⭔
│ Feature: Anti Leave
│ Status: ${status}
╰───────────────⭓`, threadID);
};
