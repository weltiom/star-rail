const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, SlashCommandBuilder, ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// استيراد نظام الترجمة
const i18n = require('./locales/i18n.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

// تحميل البيانات
const charactersData = require('./data/characters.json');
const config = require('./config.js');

// Collections
client.commands = new Collection();
client.slashCommands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.cooldowns = new Collection();

// متغيرات عامة
const PREFIX = config.bot.prefix;
const COLORS = config.colors;

// ==================== LOGGER ====================
class Logger {
  static log(message, type = 'info') {
    const timestamp = new Date().toLocaleString('ar-SA');
    const prefix = {
      'info': '📘',
      'success': '✅',
      'error': '❌',
      'warning': '⚠️',
      'debug': '🔍'
    }[type] || '📘';

    console.log(`[${timestamp}] ${prefix} ${message}`);
  }
}

// ==================== CACHE SYSTEM ====================
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.expiry = new Map();
  }

  set(key, value, ttl = 3600000) {
    this.cache.set(key, value);
    if (ttl) {
      this.expiry.set(key, Date.now() + ttl);
    }
  }

  get(key) {
    if (this.expiry.has(key) && this.expiry.get(key) < Date.now()) {
      this.cache.delete(key);
      this.expiry.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  clear() {
    this.cache.clear();
    this.expiry.clear();
  }
}

const cacheManager = new CacheManager();

// ==================== EVENTS ====================

client.once('ready', () => {
  const readyMessage = i18n.t('bot.ready', { username: client.user.tag });
  Logger.log(readyMessage, 'success');
  client.user.setActivity('Honkai: Star Rail | /help', { type: 'WATCHING' });
  registerSlashCommands();
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith(PREFIX)) {
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    await handleCommand(message, commandName, args);
  }
});

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      await handleSlashCommand(interaction);
    } else if (interaction.isButton()) {
      await handleButton(interaction);
    } else if (interaction.isStringSelectMenu()) {
      await handleSelectMenu(interaction);
    }
  } catch (error) {
    Logger.log(`${i18n.t('bot.errorCommand', { command: interaction.commandName, error: error.message })}`, 'error');
    if (!interaction.replied) {
      await interaction.reply({ content: i18n.t('bot.error'), ephemeral: true });
    }
  }
});

// ==================== SLASH COMMANDS REGISTRATION ====================

async function registerSlashCommands() {
  const commands = [
    // أوامر البحث
    new SlashCommandBuilder()
      .setName('character')
      .setDescription(i18n.t('commands.character.description'))
      .addStringOption(option =>
        option.setName('name')
          .setDescription(i18n.t('commands.character.options.name'))
          .setRequired(true)
      ),

    new SlashCommandBuilder()
      .setName('search')
      .setDescription(i18n.t('commands.search.description'))
      .addStringOption(option =>
        option.setName('query')
          .setDescription(i18n.t('commands.search.options.query'))
          .setRequired(true)
      ),

    new SlashCommandBuilder()
      .setName('list')
      .setDescription(i18n.t('commands.list.description'))
      .addStringOption(option =>
        option.setName('filter')
          .setDescription(i18n.t('commands.list.options.filter'))
          .setRequired(false)
      ),

    // أوامر الاستراتيجية
    new SlashCommandBuilder()
      .setName('team')
      .setDescription(i18n.t('commands.team.description'))
      .addStringOption(option =>
        option.setName('character')
          .setDescription(i18n.t('commands.team.options.character'))
          .setRequired(true)
      ),

    new SlashCommandBuilder()
      .setName('compare')
      .setDescription(i18n.t('commands.compare.description'))
      .addStringOption(option =>
        option.setName('character1')
          .setDescription(i18n.t('commands.compare.options.character1'))
          .setRequired(true)
      )
      .addStringOption(option =>
        option.setName('character2')
          .setDescription(i18n.t('commands.compare.options.character2'))
          .setRequired(true)
      ),

    new SlashCommandBuilder()
      .setName('tier')
      .setDescription(i18n.t('commands.tier.description')),

    // أوامر المعدات
    new SlashCommandBuilder()
      .setName('relics')
      .setDescription(i18n.t('commands.relics.description'))
      .addStringOption(option =>
        option.setName('character')
          .setDescription(i18n.t('commands.relics.options.character'))
          .setRequired(true)
      ),

    new SlashCommandBuilder()
      .setName('lightcone')
      .setDescription(i18n.t('commands.lightcone.description'))
      .addStringOption(option =>
        option.setName('character')
          .setDescription(i18n.t('commands.lightcone.options.character'))
          .setRequired(true)
      ),

    // أوامر المعلومات
    new SlashCommandBuilder()
      .setName('path')
      .setDescription(i18n.t('commands.path.description'))
      .addStringOption(option =>
        option.setName('name')
          .setDescription(i18n.t('commands.path.options.name'))
          .setRequired(false)
      ),

    new SlashCommandBuilder()
      .setName('element')
      .setDescription(i18n.t('commands.element.description'))
      .addStringOption(option =>
        option.setName('name')
          .setDescription(i18n.t('commands.element.options.name'))
          .setRequired(false)
      ),

    new SlashCommandBuilder()
      .setName('stats')
      .setDescription(i18n.t('commands.stats.description'))
      .addStringOption(option =>
        option.setName('character')
          .setDescription(i18n.t('commands.stats.options.character'))
          .setRequired(true)
      ),

    // أوامر أخرى
    new SlashCommandBuilder()
      .setName('help')
      .setDescription(i18n.t('commands.help.description')),

    new SlashCommandBuilder()
      .setName('tip')
      .setDescription(i18n.t('commands.tip.description')),

    new SlashCommandBuilder()
      .setName('ai')
      .setDescription(i18n.t('commands.ai.description'))
      .addStringOption(option =>
        option.setName('question')
          .setDescription(i18n.t('commands.ai.options.question'))
          .setRequired(true)
      ),

    new SlashCommandBuilder()
      .setName('daily')
      .setDescription(i18n.t('commands.daily.description')),

    new SlashCommandBuilder()
      .setName('build')
      .setDescription(i18n.t('commands.build.description'))
      .addStringOption(option =>
        option.setName('character')
          .setDescription(i18n.t('commands.build.options.character'))
          .setRequired(true)
      )
      .addStringOption(option =>
        option.setName('type')
          .setDescription(i18n.t('commands.build.options.type'))
          .setRequired(true)
          .addChoices(
            { name: i18n.t('commands.build.types.damage'), value: 'damage' },
            { name: i18n.t('commands.build.types.support'), value: 'support' },
            { name: i18n.t('commands.build.types.tank'), value: 'tank' }
          )
      ),
  ];

  try {
    await client.application.commands.set(commands);
    Logger.log(`تم تسجيل ${commands.length} أوامر Slash بنجاح`, 'success');
  } catch (error) {
    Logger.log(`خطأ في تسجيل الأوامر: ${error.message}`, 'error');
  }
}

// ==================== SLASH COMMAND HANDLER ====================

async function handleSlashCommand(interaction) {
  const { commandName, options } = interaction;

  try {
    await interaction.deferReply();

    switch (commandName) {
      case 'character':
        await showCharacterSlash(interaction, options.getString('name'));
        break;
      case 'search':
        await searchCharacterSlash(interaction, options.getString('query'));
        break;
      case 'list':
        await listCharactersSlash(interaction, options.getString('filter'));
        break;
      case 'team':
        await showTeamSlash(interaction, options.getString('character'));
        break;
      case 'compare':
        await compareCharactersSlash(interaction, options.getString('character1'), options.getString('character2'));
        break;
      case 'tier':
        await showTierListSlash(interaction);
        break;
      case 'relics':
        await showRelicsSlash(interaction, options.getString('character'));
        break;
      case 'lightcone':
        await showLightConesSlash(interaction, options.getString('character'));
        break;
      case 'path':
        await showPathSlash(interaction, options.getString('name'));
        break;
      case 'element':
        await showElementSlash(interaction, options.getString('name'));
        break;
      case 'stats':
        await showStatsSlash(interaction, options.getString('character'));
        break;
      case 'help':
        await showHelpSlash(interaction);
        break;
      case 'tip':
        await showTipSlash(interaction);
        break;
      case 'ai':
        await handleAIQuestion(interaction, options.getString('question'));
        break;
      case 'daily':
        await showDailyChallenge(interaction);
        break;
      case 'build':
        await showBuildRecommendation(interaction, options.getString('character'), options.getString('type'));
        break;
      default:
        await interaction.editReply(i18n.t('bot.unknownCommand'));
    }
  } catch (error) {
    Logger.log(`خطأ في الأمر ${commandName}: ${error.message}`, 'error');
    await interaction.editReply(i18n.t('bot.error'));
  }
}

// ==================== SLASH COMMAND FUNCTIONS ====================

async function showCharacterSlash(interaction, characterName) {
  const character = charactersData.characters.find(c =>
    c.nameAr.toLowerCase().includes(characterName.toLowerCase()) ||
    c.nameEn.toLowerCase().includes(characterName.toLowerCase())
  );

  if (!character) {
    return await interaction.editReply(i18n.t('commands.character.notFound', { name: characterName }));
  }

  const embed = new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle(i18n.t('commands.character.title', { nameAr: character.nameAr, nameEn: character.nameEn }))
    .setDescription(character.description)
    .addFields(
      { 
        name: i18n.t('commands.character.info'), 
        value: `**${i18n.t('commands.character.rarity')}:** ${'⭐'.repeat(character.rarity)}\n**${i18n.t('commands.character.path')}:** ${character.path}\n**${i18n.t('commands.character.element')}:** ${character.element}`, 
        inline: true 
      },
      { 
        name: i18n.t('commands.character.strength'), 
        value: character.strengths.map(s => `✅ ${s}`).join('\n'), 
        inline: false 
      },
      { 
        name: i18n.t('commands.character.weakness'), 
        value: character.weaknesses.map(w => `❌ ${w}`).join('\n'), 
        inline: false 
      }
    );

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId(`team_${character.id}`)
        .setLabel(i18n.t('commands.character.buttons.team'))
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`relics_${character.id}`)
        .setLabel(i18n.t('commands.character.buttons.relics'))
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`lightcone_${character.id}`)
        .setLabel(i18n.t('commands.character.buttons.lightcone'))
        .setStyle(ButtonStyle.Success)
    );

  await interaction.editReply({ embeds: [embed], components: [row] });
}

async function searchCharacterSlash(interaction, query) {
  const results = charactersData.characters.filter(c =>
    c.nameAr.toLowerCase().includes(query.toLowerCase()) ||
    c.nameEn.toLowerCase().includes(query.toLowerCase())
  );

  if (results.length === 0) {
    return await interaction.editReply(i18n.t('commands.search.notFound'));
  }

  const embed = new EmbedBuilder()
    .setColor(COLORS.info)
    .setTitle(i18n.t('commands.search.title', { query }))
    .setDescription(results.map((c, i) => `${i + 1}. **${c.nameAr}** (${c.nameEn}) - ${'⭐'.repeat(c.rarity)}`).join('\n'))
    .setFooter({ text: i18n.t('commands.search.found', { count: results.length }) });

  await interaction.editReply({ embeds: [embed] });
}

async function listCharactersSlash(interaction, filter) {
  let characters = charactersData.characters;

  if (filter) {
    characters = characters.filter(c =>
      c.path.toLowerCase().includes(filter.toLowerCase()) ||
      c.element.toLowerCase().includes(filter.toLowerCase())
    );
  }

  const embed = new EmbedBuilder()
    .setColor(COLORS.secondary)
    .setTitle(i18n.t('commands.list.title'))
    .setDescription(characters.map(c => `**${c.nameAr}** (${c.nameEn}) - ${'⭐'.repeat(c.rarity)} | ${c.path}`).join('\n'))
    .setFooter({ text: i18n.t('commands.list.total', { count: characters.length }) });

  await interaction.editReply({ embeds: [embed] });
}

async function showTeamSlash(interaction, characterName) {
  const character = charactersData.characters.find(c =>
    c.nameAr.toLowerCase().includes(characterName.toLowerCase()) ||
    c.nameEn.toLowerCase().includes(characterName.toLowerCase())
  );

  if (!character) {
    return await interaction.editReply(i18n.t('commands.team.notFound'));
  }

  const embed = new EmbedBuilder()
    .setColor(COLORS.success)
    .setTitle(i18n.t('commands.team.title', { character: character.nameAr }))
    .addFields(
      character.bestTeams.map((team, i) => ({
        name: i18n.t('commands.team.teamNumber', { number: i + 1 }),
        value: `\`${team}\``,
        inline: false
      }))
    );

  await interaction.editReply({ embeds: [embed] });
}

async function compareCharactersSlash(interaction, char1Name, char2Name) {
  const char1 = charactersData.characters.find(c =>
    c.nameAr.toLowerCase().includes(char1Name.toLowerCase()) ||
    c.nameEn.toLowerCase().includes(char1Name.toLowerCase())
  );

  const char2 = charactersData.characters.find(c =>
    c.nameAr.toLowerCase().includes(char2Name.toLowerCase()) ||
    c.nameEn.toLowerCase().includes(char2Name.toLowerCase())
  );

  if (!char1 || !char2) {
    return await interaction.editReply(i18n.t('bot.notFound'));
  }

  const embed = new EmbedBuilder()
    .setColor(COLORS.secondary)
    .setTitle(i18n.t('commands.compare.title', { char1: char1.nameAr, char2: char2.nameAr }))
    .addFields(
      { name: i18n.t('commands.compare.stats.hp'), value: `${char1.stats.hp} ${i18n.t('commands.compare.stats.vs')} ${char2.stats.hp}`, inline: true },
      { name: i18n.t('commands.compare.stats.atk'), value: `${char1.stats.atk} ${i18n.t('commands.compare.stats.vs')} ${char2.stats.atk}`, inline: true },
      { name: i18n.t('commands.compare.stats.def'), value: `${char1.stats.def} ${i18n.t('commands.compare.stats.vs')} ${char2.stats.def}`, inline: true },
      { name: i18n.t('commands.compare.stats.spd'), value: `${char1.stats.spd} ${i18n.t('commands.compare.stats.vs')} ${char2.stats.spd}`, inline: true },
      { name: i18n.t('commands.compare.stats.path'), value: `${char1.path} ${i18n.t('commands.compare.stats.vs')} ${char2.path}`, inline: true },
      { name: i18n.t('commands.compare.stats.element'), value: `${char1.element} ${i18n.t('commands.compare.stats.vs')} ${char2.element}`, inline: true }
    );

  await interaction.editReply({ embeds: [embed] });
}

async function showTierListSlash(interaction) {
  const tierList = {
    [i18n.t('commands.tier.sTier')]: charactersData.characters.filter(c => c.rarity === 5).slice(0, 3),
    [i18n.t('commands.tier.aTier')]: charactersData.characters.filter(c => c.rarity === 5).slice(3),
    [i18n.t('commands.tier.bTier')]: charactersData.characters.filter(c => c.rarity === 4),
  };

  let description = '';
  for (const [tier, characters] of Object.entries(tierList)) {
    description += `**${tier}**\n${characters.map(c => `• ${c.nameAr}`).join('\n')}\n\n`;
  }

  const embed = new EmbedBuilder()
    .setColor(COLORS.warning)
    .setTitle(i18n.t('commands.tier.title'))
    .setDescription(description);

  await interaction.editReply({ embeds: [embed] });
}

async function showRelicsSlash(interaction, characterName) {
  const character = charactersData.characters.find(c =>
    c.nameAr.toLowerCase().includes(characterName.toLowerCase()) ||
    c.nameEn.toLowerCase().includes(characterName.toLowerCase())
  );

  if (!character) {
    return await interaction.editReply(i18n.t('commands.relics.notFound'));
  }

  const relicsInfo = character.bestRelics.map(relicName => {
    const relic = charactersData.relics.find(r => r.nameAr === relicName);
    return relic ? `**${relic.nameAr}**\n${Object.entries(relic.mainStats).map(([slot, stat]) => `• ${slot}: ${stat}`).join('\n')}` : relicName;
  }).join('\n\n');

  const embed = new EmbedBuilder()
    .setColor(COLORS.warning)
    .setTitle(i18n.t('commands.relics.title', { character: character.nameAr }))
    .setDescription(relicsInfo);

  await interaction.editReply({ embeds: [embed] });
}

async function showLightConesSlash(interaction, characterName) {
  const character = charactersData.characters.find(c =>
    c.nameAr.toLowerCase().includes(characterName.toLowerCase()) ||
    c.nameEn.toLowerCase().includes(characterName.toLowerCase())
  );

  if (!character) {
    return await interaction.editReply(i18n.t('commands.lightcone.notFound'));
  }

  const lightConesInfo = character.bestLightCones.map(lcName => {
    const lc = charactersData.lightCones.find(l => l.nameAr === lcName);
    return lc ? `**${lc.nameAr}** ${'⭐'.repeat(lc.rarity)}\n${lc.description}` : lcName;
  }).join('\n\n');

  const embed = new EmbedBuilder()
    .setColor(COLORS.danger)
    .setTitle(i18n.t('commands.lightcone.title', { character: character.nameAr }))
    .setDescription(lightConesInfo);

  await interaction.editReply({ embeds: [embed] });
}

async function showPathSlash(interaction, pathName) {
  if (!pathName) {
    const paths = charactersData.paths.map(p => `**${p.nameAr}** (${p.nameEn})\n${p.description}`).join('\n\n');
    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setTitle(i18n.t('commands.path.allPaths'))
      .setDescription(paths);
    return await interaction.editReply({ embeds: [embed] });
  }

  const path = charactersData.paths.find(p =>
    p.nameAr.toLowerCase().includes(pathName.toLowerCase()) ||
    p.nameEn.toLowerCase().includes(pathName.toLowerCase())
  );

  if (!path) {
    return await interaction.editReply(i18n.t('commands.path.notFound'));
  }

  const pathCharacters = charactersData.characters.filter(c => c.path === path.nameAr);

  const embed = new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle(i18n.t('commands.path.title', { name: path.nameAr }))
    .setDescription(`${path.description}\n\n**${i18n.t('commands.path.characters')}:**\n${pathCharacters.map(c => `• ${c.nameAr}`).join('\n')}`)
    .setFooter({ text: i18n.t('commands.path.characterCount', { count: pathCharacters.length }) });

  await interaction.editReply({ embeds: [embed] });
}

async function showElementSlash(interaction, elementName) {
  if (!elementName) {
    const elements = charactersData.elements.map(e => `${e.emoji} **${e.nameAr}** (${e.nameEn})`).join('\n');
    const embed = new EmbedBuilder()
      .setColor(COLORS.info)
      .setTitle(i18n.t('commands.element.allElements'))
      .setDescription(elements);
    return await interaction.editReply({ embeds: [embed] });
  }

  const element = charactersData.elements.find(e =>
    e.nameAr.toLowerCase().includes(elementName.toLowerCase()) ||
    e.nameEn.toLowerCase().includes(elementName.toLowerCase())
  );

  if (!element) {
    return await interaction.editReply(i18n.t('commands.element.notFound'));
  }

  const elementCharacters = charactersData.characters.filter(c => c.element === element.nameAr);

  const embed = new EmbedBuilder()
    .setColor(COLORS.info)
    .setTitle(i18n.t('commands.element.title', { emoji: element.emoji, name: element.nameAr }))
    .setDescription(`**${i18n.t('commands.element.characters')}:**\n${elementCharacters.map(c => `• ${c.nameAr}`).join('\n')}`)
    .setFooter({ text: i18n.t('commands.element.characterCount', { count: elementCharacters.length }) });

  await interaction.editReply({ embeds: [embed] });
}

async function showStatsSlash(interaction, characterName) {
  const character = charactersData.characters.find(c =>
    c.nameAr.toLowerCase().includes(characterName.toLowerCase()) ||
    c.nameEn.toLowerCase().includes(characterName.toLowerCase())
  );

  if (!character) {
    return await interaction.editReply(i18n.t('commands.stats.notFound'));
  }

  const embed = new EmbedBuilder()
    .setColor(COLORS.success)
    .setTitle(i18n.t('commands.stats.title', { character: character.nameAr }))
    .addFields(
      { name: i18n.t('commands.stats.hp'), value: character.stats.hp.toString(), inline: true },
      { name: i18n.t('commands.stats.atk'), value: character.stats.atk.toString(), inline: true },
      { name: i18n.t('commands.stats.def'), value: character.stats.def.toString(), inline: true },
      { name: i18n.t('commands.stats.spd'), value: character.stats.spd.toString(), inline: true },
      { name: i18n.t('commands.stats.critRate'), value: `${(character.stats.critRate * 100).toFixed(1)}%`, inline: true },
      { name: i18n.t('commands.stats.critDmg'), value: `${(character.stats.critDmg * 100).toFixed(1)}%`, inline: true }
    );

  await interaction.editReply({ embeds: [embed] });
}

async function showHelpSlash(interaction) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle(i18n.t('commands.help.title'))
    .addFields(
      { name: i18n.t('commands.help.search'), value: '`/character` - معلومات الشخصية\n`/search` - البحث\n`/list` - القائمة', inline: false },
      { name: i18n.t('commands.help.strategy'), value: '`/team` - أفضل الفرق\n`/compare` - مقارنة\n`/tier` - Tier List', inline: false },
      { name: i18n.t('commands.help.equipment'), value: '`/relics` - الآثار\n`/lightcone` - مخاريط الضوء', inline: false },
      { name: i18n.t('commands.help.information'), value: '`/path` - المسارات\n`/element` - العناصر\n`/stats` - الإحصائيات', inline: false },
      { name: i18n.t('commands.help.other'), value: '`/ai` - سؤال ذكي\n`/daily` - التحدي اليومي\n`/build` - نصائح البناء\n`/tip` - نصيحة', inline: false }
    );

  await interaction.editReply({ embeds: [embed] });
}

async function showTipSlash(interaction) {
  const randomTip = i18n.random('tips');

  const embed = new EmbedBuilder()
    .setColor(COLORS.info)
    .setTitle(i18n.t('commands.tip.title'))
    .setDescription(randomTip);

  await interaction.editReply({ embeds: [embed] });
}

async function handleAIQuestion(interaction, question) {
  const aiResponses = {
    'أفضل شخصية': 'aiResponses.bestCharacter',
    'أفضل فريق': 'aiResponses.bestTeam',
    'كيف أبني': 'aiResponses.howToBuild',
    'أين أفرم': 'aiResponses.whereTofarm',
  };

  let responseKey = 'aiResponses.generalTip';
  
  for (const [key, value] of Object.entries(aiResponses)) {
    if (question.toLowerCase().includes(key.toLowerCase())) {
      responseKey = value;
      break;
    }
  }

  const response = i18n.t(responseKey);

  const embed = new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle(i18n.t('commands.ai.title'))
    .setDescription(`**${i18n.t('commands.ai.question')}:** ${question}\n\n**${i18n.t('commands.ai.answer')}:** ${response}`);

  await interaction.editReply({ embeds: [embed] });
}

async function showDailyChallenge(interaction) {
  const today = new Date().getDate();
  const challenges = [
    { name: 'تحدي الضرر', desc: 'استخدم شخصية من الدمار لتحقيق أقصى ضرر', reward: '100' },
    { name: 'تحدي الدعم', desc: 'استخدم فريق بدون دعم', reward: '150' },
    { name: 'تحدي العنصر', desc: 'استخدم فريق من عنصر واحد', reward: '120' },
  ];

  const challenge = challenges[today % challenges.length];

  const embed = new EmbedBuilder()
    .setColor(COLORS.warning)
    .setTitle(i18n.t('commands.daily.title'))
    .addFields(
      { name: challenge.name, value: challenge.desc, inline: false },
      { name: i18n.t('commands.daily.reward'), value: `${challenge.reward} ${i18n.t('commands.daily.points')}`, inline: true }
    );

  await interaction.editReply({ embeds: [embed] });
}

async function showBuildRecommendation(interaction, characterName, buildType) {
  const character = charactersData.characters.find(c =>
    c.nameAr.toLowerCase().includes(characterName.toLowerCase()) ||
    c.nameEn.toLowerCase().includes(characterName.toLowerCase())
  );

  if (!character) {
    return await interaction.editReply(i18n.t('commands.build.notFound'));
  }

  const builds = {
    'damage': {
      name: i18n.t('commands.build.types.damage'),
      stats: 'ATK% > CRIT Rate > CRIT DMG > SPD',
      relics: 'استخدم آثار الضرر',
      priority: 'الأولوية: CRIT Rate و CRIT DMG'
    },
    'support': {
      name: i18n.t('commands.build.types.support'),
      stats: 'ATK% > SPD > Effect Hit Rate',
      relics: 'استخدم آثار الدعم',
      priority: 'الأولوية: SPD والتأثيرات'
    },
    'tank': {
      name: i18n.t('commands.build.types.tank'),
      stats: 'DEF% > HP% > SPD',
      relics: 'استخدم آثار الحفاظ',
      priority: 'الأولوية: DEF و HP'
    }
  };

  const build = builds[buildType];

  const embed = new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle(i18n.t('commands.build.title', { buildType: build.name, character: character.nameAr }))
    .addFields(
      { name: i18n.t('commands.build.stats'), value: build.stats, inline: false },
      { name: i18n.t('commands.build.relics'), value: build.relics, inline: false },
      { name: i18n.t('commands.build.priority'), value: build.priority, inline: false }
    );

  await interaction.editReply({ embeds: [embed] });
}

// ==================== BUTTON HANDLER ====================

async function handleButton(interaction) {
  const [action, characterId] = interaction.customId.split('_');

  const character = charactersData.characters.find(c => c.id === parseInt(characterId));
  if (!character) {
    return interaction.reply({ content: i18n.t('bot.notFound'), ephemeral: true });
  }

  if (action === 'team') {
    const embed = new EmbedBuilder()
      .setColor(COLORS.success)
      .setTitle(i18n.t('commands.team.title', { character: character.nameAr }))
      .addFields(
        character.bestTeams.map((team, i) => ({
          name: i18n.t('commands.team.teamNumber', { number: i + 1 }),
          value: `\`${team}\``,
          inline: false
        }))
      );
    await interaction.reply({ embeds: [embed], ephemeral: true });
  } else if (action === 'relics') {
    const relicsInfo = character.bestRelics.join('\n');
    const embed = new EmbedBuilder()
      .setColor(COLORS.warning)
      .setTitle(i18n.t('commands.relics.title', { character: character.nameAr }))
      .setDescription(relicsInfo);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  } else if (action === 'lightcone') {
    const lightConesInfo = character.bestLightCones.join('\n');
    const embed = new EmbedBuilder()
      .setColor(COLORS.danger)
      .setTitle(i18n.t('commands.lightcone.title', { character: character.nameAr }))
      .setDescription(lightConesInfo);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
}

async function handleSelectMenu(interaction) {
  await interaction.reply({ content: 'تم اختيار: ' + interaction.values.join(', '), ephemeral: true });
}

// ==================== LEGACY COMMAND HANDLER ====================

async function handleCommand(message, commandName, args) {
  try {
    switch (commandName) {
      case 'help':
        await showHelp(message);
        break;
      case 'ping':
        await message.reply(i18n.t('commands.ping.pong', { ping: client.ws.ping }));
        break;
      default:
        await message.reply('💡 استخدم `/` للأوامر الحديثة!');
    }
  } catch (error) {
    Logger.log(`خطأ في الأمر: ${error.message}`, 'error');
    await message.reply(i18n.t('bot.error'));
  }
}

async function showHelp(message) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle(i18n.t('commands.help.title'))
    .setDescription('استخدم `/` للأوامر الحديثة (Slash Commands)');

  await message.reply({ embeds: [embed] });
}

// ==================== LOGIN ====================

client.login(process.env.DISCORD_TOKEN);
Logger.log('جاري محاولة الاتصال بـ Discord...', 'info');
