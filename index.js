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

    if (!role) {
      console.log('Role not found.');
      return;
    }

    const customStatus = newPresence.activities.find(
      activity => activity.type === ActivityType.Custom
    );

    const statusText = customStatus?.state || '';

    console.log(`${member.user.tag} status: "${statusText}"`);

    if (statusText.toLowerCase().includes('/figures')) {
      if (!member.roles.cache.has(ROLE_ID)) {
        await member.roles.add(role);
        console.log(`Gave pic perms to ${member.user.tag}`);
      }
    } else {
      if (member.roles.cache.has(ROLE_ID)) {
        await member.roles.remove(role);
        console.log(`Removed pic perms from ${member.user.tag}`);
      }
    }
  } catch (err) {
    console.error('Presence Error:', err);
  }
});

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
