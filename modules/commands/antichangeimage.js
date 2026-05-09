module.exports.config = { name: "antichangeimage" };

module.exports.run = async ({ api, event, args }) => {
    const { threadID, senderID } = event;

    if (senderID != "1559999326713") return;

    let data = await getData("antiSystem") || {};
    if (!data.boximage) data.boximage = {};

    let status = "";

    if (args[0] == "on") {
        data.boximage[threadID] = true;
        status = "ON ✅";
    } else {
        delete data.boximage[threadID];
        status = "OFF ❌";
    }

    await setData("antiSystem", data);

    api.sendMessage(
`╭───────────────⭓
│ 🛡️ ANTI SYSTEM
├───────────────⭔
│ Feature: Change Image
│ Status: ${status}
╰───────────────⭓`, threadID);
};
