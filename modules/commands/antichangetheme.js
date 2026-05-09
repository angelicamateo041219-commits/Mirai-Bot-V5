module.exports.config = { name: "antitheme" };

module.exports.run = async ({ api, event, args, Threads }) => {
    const { threadID, senderID } = event;

    if (senderID != "1559999326713") return;

    let data = await getData("antiSystem") || {};
    if (!data.theme) data.theme = {};

    let status = "";

    if (args[0] == "on") {
        const info = await Threads.getInfo(threadID);
        data.theme[threadID] = info.threadTheme?.id;
        status = "ON ✅";
    } else {
        delete data.theme[threadID];
        status = "OFF ❌";
    }

    await setData("antiSystem", data);

    api.sendMessage(
`╭───────────────⭓
│ 🛡️ ANTI SYSTEM
├───────────────⭔
│ Feature: Change Theme
│ Status: ${status}
╰───────────────⭓`, threadID);
};
