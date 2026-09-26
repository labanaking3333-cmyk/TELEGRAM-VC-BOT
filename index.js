/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🚫 COPYRIGHT & AUTHORSHIP WARNING 🚫
  
  Developer: @Dev_Null_X (Telegram)
  Brand: Node.js India Developers 🇮🇳
  YouTube: https://www.youtube.com/@Dev_Null_X
  
  WARNING: Removing or modifying this authorship header is a 
  violation of the developer's rights. This script is protected 
  under the @Dev_Null_X Open-Source License.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const fs = require("fs");
const config = require("./config.js");
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// 🔥 CORE PROTECTION: Identity check function
const _0x_dev_null_identity = () => {
    const brand = "@Dev_Null_X";
    if (brand !== "@Dev_Null_X") { 
        console.error("❌ ILLEGAL MODIFICATION DETECTED: PLEASE RE-DOWNLOAD FROM @Dev_Null_X");
        process.exit(1); 
    }
    return brand;
};

app.get('/', (req, res) => {
  res.send(`${_0x_dev_null_identity()} VC Bot is running safely! 🚀`);
});

app.listen(port, () => {
  console.log(`[⚡] System active on port ${port} \vert{} Brand:${_0x_dev_null_identity()}`);
});

const { apiId, apiHash, botToken, adminId, sessionFile, joinDelay } = config;
 
if (!fs.existsSync(sessionFile)) fs.writeFileSync(sessionFile, "[]");
let savedSessions = JSON.parse(fs.readFileSync(sessionFile));
let clients = [];
let pendingLogins = {};
let pendingRequests = {}; // Step tracking for /sendrequest

// ADMIN SYSTEM SETUP
const adminFile = "./admins.json";
let adminList = [];

if (fs.existsSync(adminFile)) {
    adminList = JSON.parse(fs.readFileSync(adminFile));
} else {
    adminList = adminId.toString().split(',').map(id => id.trim());
    fs.writeFileSync(adminFile, JSON.stringify(adminList));
}

let lastLoginTime = 0; 
const LOGIN_COOLDOWN = 10 * 1000;

async function init() {
    _0x_dev_null_identity(); // Initial Security Check
    
    console.log("\x1b[36m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\x1b[32m%s\x1b[0m", "🚀  SYSTEM BOOTING: " + _0x_dev_null_identity() + " VC MANAGER ");
    console.log("\x1b[33m%s\x1b[0m", "🇮🇳  NODE.JS INDIA DEVELOPERS HUB ACTIVE     ");
    console.log("\x1b[36m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    for (const sessionStr of savedSessions) {
        try {
            const client = new TelegramClient(new StringSession(sessionStr), apiId, apiHash, { connectionRetries: 5 });
            await client.connect();
            clients.push(client);
        } catch (e) { console.log("⚠️ Failed session."); }
    }

    const botClient = new TelegramClient(new StringSession(""), apiId, apiHash, { connectionRetries: 5 });
    await botClient.start({ botAuthToken: botToken });
    console.log(`🤖 Control Bot Online! Credit: ${_0x_dev_null_identity()}`);

    botClient.addEventHandler(async (event) => {
        const message = event.message;
        if (!message || !message.text) return;

        const senderId = message.senderId ? message.senderId.toString() : "unknown";
        
        if (!adminList.includes(senderId)) {
            return message.reply({ message: `⛔ Access Denied! Only ${_0x_dev_null_identity()} and admins can control me.` });
        }

        const text = message.text.trim();
        const args = text.split(" ");
        const command = args[0].toLowerCase();

        // --- HANDLER FOR LINK INPUT AFTER /sendrequest OR /request ---
        if (pendingRequests[senderId]) {
            delete pendingRequests[senderId];
            const targetLink = text;
            
            if (!targetLink.includes("t.me/")) {
                return message.reply({ message: "❌ अमान्य लिंक! कृपया सही टेलीग्राम लिंक भेजें।" });
            }

            await message.reply({ message: `⏳ सभी ${clients.length} अकाउंट्स से रिक्वेस्ट भेजी जा रही है...` });

            let success = 0;
            let failed = 0;

            for (let i = 0; i < clients.length; i++) {
                try {
                    // Exported/Imported Invite request handler
                    let hash = targetLink.split("/").pop().replace("+", "").replace("joinchat/", "").trim();
                    
                    await clients[i].invoke(
                        new Api.messages.ImportChatInvite({
                            hash: hash
                        })
                    );
                    success++;
                } catch (e) {
                    if (e.message.includes("USER_ALREADY_PARTICIPANT")) {
                        success++;
                    } else if (e.message.includes("INVITE_REQUEST_SENT")) {
                        success++;
                    } else {
                        console.log(`❌ Account ${i + 1} Error:`, e.message);
                        failed++;
                    }
                }
                await new Promise(r => setTimeout(r, joinDelay));
            }

            return message.reply({ 
                message: `✅ **टास्क पूरा हुआ!**\n\n🎯 **टारगेट:** \`${targetLink}\`\n🎉 **सफल:** ${success}\n❌ **असफल:** ${failed}\n\n🛡️ Powered by ${_0x_dev_null_identity()}` 
            });
        }

        // --- COMMAND: /START ---
        if (command === "/start") {
            await message.reply({ 
                message: `👋 Welcome Boss! I am ${_0x_dev_null_identity()} VC Manager.\n\n` +
                         "🛠 **Admin Commands:**\n" +
                         "🔹 `/login +91xxxx` - Add Account\n" +
                         "🔹 `/otp 12 345` - Verify OTP\n" +
                         "🔹 `/pass password` - 2FA Login\n" +
                         "🔹 `/sendrequest` - Send Private Join Request\n" +
                         "🔹 `/joinvc [link]` - Join All to VC\n" +
                         "🔹 `/leavevc` - Leave All VC\n" +
                         "🔹 `/addadmin [ID]` - Add New Admin\n" +
                         "🔹 `/stats` - Check Active Accounts\n\n" +
                         "🇮🇳 **Developed by @Dev_Null_X**",
                file: "https://files.catbox.moe/dkxoeu.jpg"
            });
        }

        // --- COMMAND: /SENDREQUEST & /REQUEST ---
        else if (command === "/sendrequest" || command === "/request") {
            // Check if link is passed directly in command (e.g. /request https://t.me/+xyz)
            if (args[1]) {
                const targetLink = args[1];
                await message.reply({ message: `⏳ सभी ${clients.length} अकाउंट्स से रिक्वेस्ट भेजी जा रही है...` });

                let success = 0;
                let failed = 0;

                for (let i = 0; i < clients.length; i++) {
                    try {
                        let hash = targetLink.split("/").pop().replace("+", "").replace("joinchat/", "").trim();
                        await clients[i].invoke(
                            new Api.messages.ImportChatInvite({ hash: hash })
                        );
                        success++;
                    } catch (e) {
                        if (e.message.includes("USER_ALREADY_PARTICIPANT") || e.message.includes("INVITE_REQUEST_SENT")) {
                            success++;
                        } else {
                            failed++;
                        }
                    }
                    await new Promise(r => setTimeout(r, joinDelay));
                }

                return message.reply({ 
                    message: `✅ **टास्क पूरा हुआ!**\n\n🎉 **सफल:** ${success}\n❌ **असफल:** ${failed}` 
                });
            } else {
                // Wait for user to send link in next message
                pendingRequests[senderId] = true;
                await message.reply({ message: "🔗 **कृपया प्राइवेट चैनल की लिंक भेजें:**" });
            }
        }

        // --- COMMAND: /ADDADMIN ---
        else if (command === "/addadmin") {
            const newAdmin = args[1];
            if (!newAdmin) return message.reply({ message: "⚠️ Usage: `/addadmin 123456789`" });
            if (adminList.includes(newAdmin)) return message.reply({ message: "⚠️ Already an admin." });

            adminList.push(newAdmin);
            fs.writeFileSync(adminFile, JSON.stringify(adminList));
            await message.reply({ message: `✅ New admin authorized: \`${newAdmin}\`` });
        }

        // --- COMMAND: /LOGIN ---
        else if (command === "/login") {
            const phone = args[1];
            if (!phone) return message.reply({ message: "⚠️ Usage: `/login +91xxxxxxx`" });

            const currentTime = Date.now();
            if (currentTime - lastLoginTime < LOGIN_COOLDOWN) {
                const timeLeft = Math.ceil((LOGIN_COOLDOWN - (currentTime - lastLoginTime)) / 1000);
                return message.reply({ message: `⏳ Security Cool-down! Please wait ${timeLeft}s.` });
            }

            if (pendingLogins[senderId]) return message.reply({ message: "⚠️ Login already in progress." });

            await message.reply({ message: "📡 Connecting to Telegram Servers..." });
            const tempClient = new TelegramClient(new StringSession(""), apiId, apiHash, { connectionRetries: 1 });
            pendingLogins[senderId] = { client: tempClient, phone: phone };

            tempClient.start({
                phoneNumber: phone,
                phoneCode: async () => {
                    await message.reply({ message: `📩 OTP Sent to ${phone}.\nReply: \`/otp 12 345\`` });
                    pendingLogins[senderId].otpPromise = new Promise(resolve => pendingLogins[senderId].resolveOtp = resolve);
                    return await pendingLogins[senderId].otpPromise;
                },
                password: async () => {
                    await message.reply({ message: "🔐 2FA Detected. Reply: \`/pass your_password\`" });
                    pendingLogins[senderId].passPromise = new Promise(resolve => pendingLogins[senderId].resolvePass = resolve);
                    return await pendingLogins[senderId].passPromise;
                }
            }).then(async () => {
                await saveAccount(tempClient, message);
            }).catch(async (err) => {
                await message.reply({ message: "❌ Login Failed: " + err.message });
                delete pendingLogins[senderId];
            });
        }

        // --- COMMAND: /OTP ---
        else if (command === "/otp") {
            const otp = args.slice(1).join("").replace(/[^0-9]/g, ''); 
            const data = pendingLogins[senderId];
            if (!data || !data.resolveOtp) return message.reply({ message: "❌ Use /login first." });
            data.resolveOtp(otp); 
        }

        else if (command === "/pass") {
            const pass = args[1];
            if (pendingLogins[senderId]?.resolvePass) {
                await message.reply({ message: "⏳ Verifying Password..." });
                pendingLogins[senderId].resolvePass(pass);
            }
        }
        
        // --- COMMAND: /JOINVC ---
        else if (command === "/joinvc") {
            const target = args[1];
            if (!target) return message.reply({ message: "⚠️ Usage: `/joinvc https://t.me/group`" });
            
            await message.reply({ message: `⚡ Deploying ${clients.length} accounts by ${_0x_dev_null_identity()}...` });
            let targetStr = target.replace("https://t.me/", "").replace("@", "").trim();

            for (let i = 0; i < clients.length; i++) {
                try {
                    let chatEntity = await clients[i].getEntity(targetStr);
                    let callObject;
                    
                    try {
                        const full = await clients[i].invoke(new Api.channels.GetFullChannel({ channel: chatEntity }));
                        callObject = full.fullChat.call;
                    } catch (e) {
                        const full = await clients[i].invoke(new Api.messages.GetFullChat({ chatId: chatEntity.id }));
                        callObject = full.fullChat.call;
                    }

                    if (!callObject) throw new Error("No active VC found.");

                    const randomSsrc = Math.floor(Math.random() * 100000000);
                    const me = await clients[i].getMe();

                    const joinParams = {
                        call: callObject,
                        joinAs: me,
                        params: new Api.DataJSON({ data: JSON.stringify({ ssrc: randomSsrc }) }),
                        muted: true
                    };

                    await clients[i].invoke(new Api.phone.JoinGroupCall(joinParams));
                    
                    if (clients[i].vcInterval) clearInterval(clients[i].vcInterval);
                    clients[i].vcInterval = setInterval(async () => {
                        try { await clients[i].invoke(new Api.phone.JoinGroupCall(joinParams)); } catch (e) {} 
                    }, 50 * 1000); 

                    await new Promise(r => setTimeout(r, joinDelay)); 
                } catch (e) { console.log(`❌ Account ${i+1} failed: ${e.message}`); }
            }
            await message.reply({ message: "✅ Process Completed by @Dev_Null_X!" });
        }
        
        // --- COMMAND: /LEAVEVC ---
        else if (command === "/leavevc") {
            await message.reply({ message: `📤 Removing ${clients.length} accounts from VC...` });
            
            for (let i = 0; i < clients.length; i++) {
                try {
                    if (clients[i].vcInterval) {
                        clearInterval(clients[i].vcInterval);
                        clients[i].vcInterval = null;
                    }

                    await clients[i].invoke(new Api.phone.LeaveGroupCall({
                        call: clients[i].currentCall,
                        source: 0
                    }));
                    
                } catch (e) {
                    console.log(`❌ Account ${i+1} leave error: ${e.message}`);
                }
            }
            await message.reply({ message: "✅ All accounts have left the Voice Chat! \n🛡️ Powered by @Dev_Null_X" });
        }

        // --- COMMAND: /STATS ---
        else if (command === "/stats") {
            await message.reply({ message: `📊 **${_0x_dev_null_identity()} System Stats**\n\n✅ **Active Accounts:** ${clients.length}\n🇮🇳 **Region:** India\n🛡 **Status:** Secured` });
        }
        
    }, new NewMessage({ incoming: true }));
}

async function saveAccount(client, message) {
    const sessionStr = client.session.save();
    savedSessions.push(sessionStr);
    fs.writeFileSync(sessionFile, JSON.stringify(savedSessions));
    clients.push(client);
    lastLoginTime = Date.now();
    
    await message.reply({ message: `✅ Account linked to ${_0x_dev_null_identity()} successfully!` });
    if (message.senderId) delete pendingLogins[message.senderId.toString()];
}

init().catch(console.error);
