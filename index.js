const {
  Client,
  GatewayIntentBits,
  Partials,
  ActivityType
} = require("discord.js");

const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Web server listening on port ${PORT}`);
});

const ROLE_ID = "1508473350899367976";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.GuildMember]
});

// prevents spam + lag
const lastStatus = new Map();

process.on("unhandledRejection", err => {
  console.error("Unhandled Rejection:", err);
});

process.on("uncaughtException", err => {
  console.error("Uncaught Exception:", err);
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("presenceUpdate", async (oldPresence, newPresence) => {
  try {
    if (!newPresence?.member) return;

    const member = newPresence.member;
    const role = member.guild.roles.cache.get(ROLE_ID);

    if (!role) return;

    const activity = newPresence.activities?.find(
      a => a.type === ActivityType.Custom
    );

    const statusText = activity?.state || "";

    // prevent repeated triggers (VERY IMPORTANT)
    if (lastStatus.get(member.id) === statusText) return;
    lastStatus.set(member.id, statusText);

    const hasTag = statusText.toLowerCase().includes("/figures");

    if (hasTag && !member.roles.cache.has(ROLE_ID)) {
      try {
        await member.roles.add(role);
      } catch (err) {
        console.error("Add role failed:", err.message);
      }
    }

    if (!hasTag && member.roles.cache.has(ROLE_ID)) {
      try {
        await member.roles.remove(role);
      } catch (err) {
        console.error("Remove role failed:", err.message);
      }
    }

  } catch (err) {
    console.error("Presence error:", err);
  }
});

client.on("messageCreate", async (message) => {
  try {
    if (message.author.bot) return;

    if (message.content.toLowerCase() === "pic perms") {
      message.channel.send("Set status to '/figures' to get pic perms.");
    }
  } catch (err) {
    console.error("Message error:", err);
  }
});

client.login(process.env.TOKEN);
