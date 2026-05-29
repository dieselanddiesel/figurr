const {
  Client,
  GatewayIntentBits,
  Partials,
  ActivityType
} = require('discord.js');


const ROLE_ID = '1508473350899367976';

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

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('presenceUpdate', async (oldPresence, newPresence) => {
  try {
    if (!newPresence?.member) return;

    const member = newPresence.member;
    const role = member.guild.roles.cache.get(ROLE_ID);

    if (!role) return;

    const activity = newPresence.activities?.find(
      a => a.type === ActivityType.Custom
    );

    const statusText = activity?.state ?? "";

    console.log(`${member.user.tag} status: "${statusText}"`);

    const hasTag = statusText.toLowerCase().includes("/figures");

    if (hasTag && !member.roles.cache.has(ROLE_ID)) {
      await member.roles.add(role);
      console.log(`Gave pic

client.on('messageCreate', async message => {
  try {
    if (message.author.bot) return;

    if (message.content.toLowerCase().includes('pic perms')) {
      await message.channel.send(
        'Set status to "/figures" to get pic perms.'
      );
    }
  } catch (err) {
    console.error('Message Error:', err);
  }
});

// IMPORTANT: use environment variable
client.login(process.env.TOKEN);
