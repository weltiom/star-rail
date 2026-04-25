const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, SlashCommandBuilder, ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

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
  Logger.log(`البوت جاهز! تم تسجيل الدخول باسم: ${client.user.tag}`, 'success');
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
    Logger.log(`خطأ في التفاعل: ${error.message}`, 'error');
    if (!interaction.replied) {
      await interaction.reply({ content: '❌ حدث خطأ أثناء معالجة طلبك', ephemeral: true });
    }
  }
});

// ==================== SLASH COMMANDS REGISTRATION ====================

async function registerSlashCommands() {
  const commands = [
    // أوامر البحث
    new SlashCommandBuilder()
      .setName('character')
      .setDescription('عرض معلومات الشخصية')
      .addStringOption(option =>
        option.setName('name')
          .setDescription('اسم الشخصية')
          .setRequired(true)
      ),

    new SlashCommandBuilder()
      .setName('search')
      .setDescription('البحث عن شخصية')
      .addStringOption(option =>
        option.setName('query')
          .setDescription('كلمة البحث')
          .setRequired(true)
      ),

    new SlashCommandBuilder()
      .setName('list')
      .setDescription('عرض قائمة الشخصيات')
      .addStringOption(option =>
        option.setName('filter')
          .setDescription('تصفية حسب المسار أو العنصر')
          .setRequired(false)
      ),

    // أوامر الاستراتيجية
    new SlashCommandBuilder()
      .setName('team')
      .setDescription('أفضل الفرق للشخصية')
      .addStringOption(option =>
        option.setName('character')
          .setDescription('اسم الشخصية')
          .setRequired(true)
      ),

    new SlashCommandBuilder()
      .setName('compare')
      .setDescription('مقارنة شخصيتين')
      .addStringOption(option =>
        option.setName('character1')
          .setDescription('الشخصية الأولى')
          .setRequired(true)
      )
      .addStringOption(option =>
        option.setName('character2')
          .setDescription('الشخصية الثانية')
          .setRequired(true)
      ),

    new SlashCommandBuilder()
      .setName('tier')
      .setDescription('عرض Tier List'),

    // أوامر المعدات
    new SlashCommandBuilder()
      .setName('relics')
      .setDescription('أفضل الآثار')
      .addStringOption(option =>
        option.setName('character')
          .setDescription('اسم الشخصية')
          .setRequired(true)
      ),

    new SlashCommandBuilder()
      .setName('lightcone')
      .setDescription('أفضل مخاريط الضوء')
      .addStringOption(option =>
        option.setName('character')
          .setDescription('اسم الشخصية')
          .setRequired(true)
      ),

    // أوامر المعلومات
    new SlashCommandBuilder()
      .setName('path')
      .setDescription('معلومات المسارات')
      .addStringOption(option =>
        option.setName('name')
          .setDescription('اسم المسار')
          .setRequired(false)
      ),

    new SlashCommandBuilder()
      .setName('element')
      .setDescription('معلومات العناصر')
      .addStringOption(option =>
        option.setName('name')
          .setDescription('اسم العنصر')
          .setRequired(false)
      ),

    new SlashCommandBuilder()
      .setName('stats')
      .setDescription('إحصائيات الشخصية')
      .addStringOption(option =>
        option.setName('character')
          .setDescription('اسم الشخصية')
          .setRequired(true)
      ),

    // أوامر أخرى
    new SlashCommandBuilder()
      .setName('help')
      .setDescription('عرض قائمة الأوامر'),

    new SlashCommandBuilder()
      .setName('tip')
      .setDescription('نصيحة عشوائية'),

    new SlashCommandBuilder()
      .setName('ai')
      .setDescription('اسأل البوت سؤال ذكي')
      .addStringOption(option =>
        option.setName('question')
          .setDescription('السؤال')
          .setRequired(true)
      ),

    new SlashCommandBuilder()
      .setName('daily')
      .setDescription('التحدي اليومي'),

    new SlashCommandBuilder()
      .setName('build')
      .setDescription('نصائح البناء')
      .addStringOption(option =>
        option.setName('character')
          .setDescription('اسم الشخصية')
          .setRequired(true)
      )
      .addStringOption(option =>
        option.setName('type')
          .setDescription('نوع البناء')
          .setRequired(true)
          .addChoices(
            { name: 'ضرر', value: 'damage' },
            { name: 'دعم', value: 'support' },
            { name: 'دفاع', value: 'tank' }
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
        await interaction.editReply('❌ أمر غير معروف');
    }
  } catch (error) {
    Logger.log(`خطأ في الأمر ${commandName}: ${error.message}`, 'error');
    await interaction.editReply('❌ حدث خطأ أثناء معالجة الأمر');
  }
}

// ==================== SLASH COMMAND FUNCTIONS ====================

async function showCharacterSlash(interaction, characterName) {
  const character = charactersData.characters.find(c =>
    c.nameAr.toLowerCase().includes(characterName.toLowerCase()) ||
    c.nameEn.toLowerCase().includes(characterName.toLowerCase())
  );

  if (!character) {
    return await interaction.editReply('❌ لم يتم العثور على الشخصية');
  }

  const embed = new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle(`⭐ ${character.nameAr} (${character.nameEn})`)
    .setDescription(character.description)
    .addFields(
      { name: '📊 المعلومات', value: `**الندرة:** ${'⭐'.repeat(character.rarity)}\n**المسار:** ${character.path}\n**العنصر:** ${character.element}`, inline: true },
      { name: '💪 القوة', value: character.strengths.map(s => `✅ ${s}`).join('\n'), inline: false },
      { name: '⚠️ الضعف', value: character.weaknesses.map(w => `❌ ${w}`).join('\n'), inline: false }
    );

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId(`team_${character.id}`)
        .setLabel('🎯 الفرق')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`relics_${character.id}`)
        .setLabel('🎁 الآثار')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`lightcone_${character.id}`)
        .setLabel('💫 مخاريط')
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
    return await interaction.editReply('❌ لم يتم العثور على نتائج');
  }

  const embed = new EmbedBuilder()
    .setColor(COLORS.info)
    .setTitle(`🔍 نتائج البحث عن "${query}"`)
    .setDescription(results.map((c, i) => `${i + 1}. **${c.nameAr}** (${c.nameEn}) - ${'⭐'.repeat(c.rarity)}`).join('\n'))
    .setFooter({ text: `تم العثور على ${results.length} نتيجة` });

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
    .setTitle('📋 قائمة الشخصيات')
    .setDescription(characters.map(c => `**${c.nameAr}** (${c.nameEn}) - ${'⭐'.repeat(c.rarity)} | ${c.path}`).join('\n'))
    .setFooter({ text: `إجمالي: ${characters.length}` });

  await interaction.editReply({ embeds: [embed] });
}

async function showTeamSlash(interaction, characterName) {
  const character = charactersData.characters.find(c =>
    c.nameAr.toLowerCase().includes(characterName.toLowerCase()) ||
    c.nameEn.toLowerCase().includes(characterName.toLowerCase())
  );

  if (!character) {
    return await interaction.editReply('❌ لم يتم العثور على الشخصية');
  }

  const embed = new EmbedBuilder()
    .setColor(COLORS.success)
    .setTitle(`🎯 أفضل الفرق لـ ${character.nameAr}`)
    .addFields(
      character.bestTeams.map((team, i) => ({
        name: `الفريق ${i + 1}`,
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
    return await interaction.editReply('❌ لم يتم العثور على إحدى الشخصيات');
  }

  const embed = new EmbedBuilder()
    .setColor(COLORS.secondary)
    .setTitle(`⚔️ مقارنة: ${char1.nameAr} vs ${char2.nameAr}`)
    .addFields(
      { name: '📊 HP', value: `${char1.stats.hp} vs ${char2.stats.hp}`, inline: true },
      { name: '⚔️ ATK', value: `${char1.stats.atk} vs ${char2.stats.atk}`, inline: true },
      { name: '🛡️ DEF', value: `${char1.stats.def} vs ${char2.stats.def}`, inline: true },
      { name: '💨 SPD', value: `${char1.stats.spd} vs ${char2.stats.spd}`, inline: true },
      { name: '🎯 المسار', value: `${char1.path} vs ${char2.path}`, inline: true },
      { name: '🌈 العنصر', value: `${char1.element} vs ${char2.element}`, inline: true }
    );

  await interaction.editReply({ embeds: [embed] });
}

async function showTierListSlash(interaction) {
  const tierList = {
    'S Tier': charactersData.characters.filter(c => c.rarity === 5).slice(0, 3),
    'A Tier': charactersData.characters.filter(c => c.rarity === 5).slice(3),
    'B Tier': charactersData.characters.filter(c => c.rarity === 4),
  };

  let description = '';
  for (const [tier, characters] of Object.entries(tierList)) {
    description += `**${tier}**\n${characters.map(c => `• ${c.nameAr}`).join('\n')}\n\n`;
  }

  const embed = new EmbedBuilder()
    .setColor(COLORS.warning)
    .setTitle('🏆 Tier List')
    .setDescription(description);

  await interaction.editReply({ embeds: [embed] });
}

async function showRelicsSlash(interaction, characterName) {
  const character = charactersData.characters.find(c =>
    c.nameAr.toLowerCase().includes(characterName.toLowerCase()) ||
    c.nameEn.toLowerCase().includes(characterName.toLowerCase())
  );

  if (!character) {
    return await interaction.editReply('❌ لم يتم العثور على الشخصية');
  }

  const relicsInfo = character.bestRelics.map(relicName => {
    const relic = charactersData.relics.find(r => r.nameAr === relicName);
    return relic ? `**${relic.nameAr}**\n${Object.entries(relic.mainStats).map(([slot, stat]) => `• ${slot}: ${stat}`).join('\n')}` : relicName;
  }).join('\n\n');

  const embed = new EmbedBuilder()
    .setColor(COLORS.warning)
    .setTitle(`🎁 أفضل الآثار لـ ${character.nameAr}`)
    .setDescription(relicsInfo);

  await interaction.editReply({ embeds: [embed] });
}

async function showLightConesSlash(interaction, characterName) {
  const character = charactersData.characters.find(c =>
    c.nameAr.toLowerCase().includes(characterName.toLowerCase()) ||
    c.nameEn.toLowerCase().includes(characterName.toLowerCase())
  );

  if (!character) {
    return await interaction.editReply('❌ لم يتم العثور على الشخصية');
  }

  const lightConesInfo = character.bestLightCones.map(lcName => {
    const lc = charactersData.lightCones.find(l => l.nameAr === lcName);
    return lc ? `**${lc.nameAr}** ${'⭐'.repeat(lc.rarity)}\n${lc.description}` : lcName;
  }).join('\n\n');

  const embed = new EmbedBuilder()
    .setColor(COLORS.danger)
    .setTitle(`💫 أفضل مخاريط الضوء لـ ${character.nameAr}`)
    .setDescription(lightConesInfo);

  await interaction.editReply({ embeds: [embed] });
}

async function showPathSlash(interaction, pathName) {
  if (!pathName) {
    const paths = charactersData.paths.map(p => `**${p.nameAr}** (${p.nameEn})\n${p.description}`).join('\n\n');
    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setTitle('📚 جميع المسارات')
      .setDescription(paths);
    return await interaction.editReply({ embeds: [embed] });
  }

  const path = charactersData.paths.find(p =>
    p.nameAr.toLowerCase().includes(pathName.toLowerCase()) ||
    p.nameEn.toLowerCase().includes(pathName.toLowerCase())
  );

  if (!path) {
    return await interaction.editReply('❌ لم يتم العثور على المسار');
  }

  const pathCharacters = charactersData.characters.filter(c => c.path === path.nameAr);

  const embed = new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle(`📚 المسار: ${path.nameAr}`)
    .setDescription(`${path.description}\n\n**الشخصيات:**\n${pathCharacters.map(c => `• ${c.nameAr}`).join('\n')}`)
    .setFooter({ text: `عدد الشخصيات: ${pathCharacters.length}` });

  await interaction.editReply({ embeds: [embed] });
}

async function showElementSlash(interaction, elementName) {
  if (!elementName) {
    const elements = charactersData.elements.map(e => `${e.emoji} **${e.nameAr}** (${e.nameEn})`).join('\n');
    const embed = new EmbedBuilder()
      .setColor(COLORS.info)
      .setTitle('🌈 جميع العناصر')
      .setDescription(elements);
    return await interaction.editReply({ embeds: [embed] });
  }

  const element = charactersData.elements.find(e =>
    e.nameAr.toLowerCase().includes(elementName.toLowerCase()) ||
    e.nameEn.toLowerCase().includes(elementName.toLowerCase())
  );

  if (!element) {
    return await interaction.editReply('❌ لم يتم العثور على العنصر');
  }

  const elementCharacters = charactersData.characters.filter(c => c.element === element.nameAr);

  const embed = new EmbedBuilder()
    .setColor(COLORS.info)
    .setTitle(`${element.emoji} العنصر: ${element.nameAr}`)
    .setDescription(`**الشخصيات:**\n${elementCharacters.map(c => `• ${c.nameAr}`).join('\n')}`)
    .setFooter({ text: `عدد الشخصيات: ${elementCharacters.length}` });

  await interaction.editReply({ embeds: [embed] });
}

async function showStatsSlash(interaction, characterName) {
  const character = charactersData.characters.find(c =>
    c.nameAr.toLowerCase().includes(characterName.toLowerCase()) ||
    c.nameEn.toLowerCase().includes(characterName.toLowerCase())
  );

  if (!character) {
    return await interaction.editReply('❌ لم يتم العثور على الشخصية');
  }

  const embed = new EmbedBuilder()
    .setColor(COLORS.success)
    .setTitle(`📊 إحصائيات ${character.nameAr}`)
    .addFields(
      { name: 'HP', value: character.stats.hp.toString(), inline: true },
      { name: 'ATK', value: character.stats.atk.toString(), inline: true },
      { name: 'DEF', value: character.stats.def.toString(), inline: true },
      { name: 'SPD', value: character.stats.spd.toString(), inline: true },
      { name: 'CRIT Rate', value: `${(character.stats.critRate * 100).toFixed(1)}%`, inline: true },
      { name: 'CRIT DMG', value: `${(character.stats.critDmg * 100).toFixed(1)}%`, inline: true }
    );

  await interaction.editReply({ embeds: [embed] });
}

async function showHelpSlash(interaction) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle('📖 قائمة الأوامر')
    .addFields(
      { name: '🔍 البحث', value: '`/character` - معلومات الشخصية\n`/search` - البحث\n`/list` - القائمة', inline: false },
      { name: '⚔️ الاستراتيجية', value: '`/team` - أفضل الفرق\n`/compare` - مقارنة\n`/tier` - Tier List', inline: false },
      { name: '🎁 المعدات', value: '`/relics` - الآثار\n`/lightcone` - مخاريط الضوء', inline: false },
      { name: '📚 المعلومات', value: '`/path` - المسارات\n`/element` - العناصر\n`/stats` - الإحصائيات', inline: false },
      { name: '🎮 أخرى', value: '`/ai` - سؤال ذكي\n`/daily` - التحدي اليومي\n`/build` - نصائح البناء\n`/tip` - نصيحة', inline: false }
    );

  await interaction.editReply({ embeds: [embed] });
}

async function showTipSlash(interaction) {
  const tips = charactersData.tips;
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  const embed = new EmbedBuilder()
    .setColor(COLORS.info)
    .setTitle('💡 نصيحة عشوائية')
    .setDescription(randomTip);

  await interaction.editReply({ embeds: [embed] });
}

async function handleAIQuestion(interaction, question) {
  // نظام ذكي بسيط للإجابة على الأسئلة
  const aiResponses = {
    'أفضل شخصية': 'أفضل شخصية تعتمد على احتياجاتك! لكن فايرفلاي وروان مي من الخيارات الممتازة جداً.',
    'أفضل فريق': 'فريق قوي: فايرفلاي + روان مي + سباركل + جينج يوان',
    'كيف أبني': 'استخدم `/build` لنصائح البناء المتخصصة لكل شخصية',
    'أين أفرم': 'استخدم الكهوف الصعبة للآثار والمواقع المختلفة للمواد',
  };

  let response = 'سؤال جيد! ';
  
  for (const [key, value] of Object.entries(aiResponses)) {
    if (question.toLowerCase().includes(key.toLowerCase())) {
      response = value;
      break;
    }
  }

  if (response === 'سؤال جيد! ') {
    response += 'جرب استخدام الأوامر الأخرى للحصول على معلومات أكثر تفصيلاً!';
  }

  const embed = new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle('🤖 الإجابة الذكية')
    .setDescription(`**السؤال:** ${question}\n\n**الإجابة:** ${response}`);

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
    .setTitle('🎯 التحدي اليومي')
    .addFields(
      { name: challenge.name, value: challenge.desc, inline: false },
      { name: '🎁 المكافأة', value: `${challenge.reward} نقطة`, inline: true }
    );

  await interaction.editReply({ embeds: [embed] });
}

async function showBuildRecommendation(interaction, characterName, buildType) {
  const character = charactersData.characters.find(c =>
    c.nameAr.toLowerCase().includes(characterName.toLowerCase()) ||
    c.nameEn.toLowerCase().includes(characterName.toLowerCase())
  );

  if (!character) {
    return await interaction.editReply('❌ لم يتم العثور على الشخصية');
  }

  const builds = {
    'damage': {
      name: 'بناء الضرر',
      stats: 'ATK% > CRIT Rate > CRIT DMG > SPD',
      relics: 'استخدم آثار الضرر',
      priority: 'الأولوية: CRIT Rate و CRIT DMG'
    },
    'support': {
      name: 'بناء الدعم',
      stats: 'ATK% > SPD > Effect Hit Rate',
      relics: 'استخدم آثار الدعم',
      priority: 'الأولوية: SPD والتأثيرات'
    },
    'tank': {
      name: 'بناء الدفاع',
      stats: 'DEF% > HP% > SPD',
      relics: 'استخدم آثار الحفاظ',
      priority: 'الأولوية: DEF و HP'
    }
  };

  const build = builds[buildType];

  const embed = new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle(`🔨 ${build.name} لـ ${character.nameAr}`)
    .addFields(
      { name: '📊 الإحصائيات', value: build.stats, inline: false },
      { name: '🎁 الآثار', value: build.relics, inline: false },
      { name: '🎯 الأولوية', value: build.priority, inline: false }
    );

  await interaction.editReply({ embeds: [embed] });
}

// ==================== BUTTON HANDLER ====================

async function handleButton(interaction) {
  const [action, characterId] = interaction.customId.split('_');

  const character = charactersData.characters.find(c => c.id === parseInt(characterId));
  if (!character) {
    return interaction.reply({ content: '❌ لم يتم العثور على الشخصية', ephemeral: true });
  }

  if (action === 'team') {
    const embed = new EmbedBuilder()
      .setColor(COLORS.success)
      .setTitle(`🎯 أفضل الفرق لـ ${character.nameAr}`)
      .addFields(
        character.bestTeams.map((team, i) => ({
          name: `الفريق ${i + 1}`,
          value: `\`${team}\``,
          inline: false
        }))
      );
    await interaction.reply({ embeds: [embed], ephemeral: true });
  } else if (action === 'relics') {
    const relicsInfo = character.bestRelics.join('\n');
    const embed = new EmbedBuilder()
      .setColor(COLORS.warning)
      .setTitle(`🎁 أفضل الآثار لـ ${character.nameAr}`)
      .setDescription(relicsInfo);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  } else if (action === 'lightcone') {
    const lightConesInfo = character.bestLightCones.join('\n');
    const embed = new EmbedBuilder()
      .setColor(COLORS.danger)
      .setTitle(`💫 أفضل مخاريط الضوء لـ ${character.nameAr}`)
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
        await message.reply(`🏓 Pong! ${client.ws.ping}ms`);
        break;
      default:
        await message.reply('💡 استخدم `/` للأوامر الحديثة!');
    }
  } catch (error) {
    Logger.log(`خطأ في الأمر: ${error.message}`, 'error');
    await message.reply('❌ حدث خطأ');
  }
}

async function showHelp(message) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle('📖 قائمة الأوامر')
    .setDescription('استخدم `/` للأوامر الحديثة (Slash Commands)');

  await message.reply({ embeds: [embed] });
}

// ==================== LOGIN ====================

client.login(process.env.DISCORD_TOKEN);
Logger.log('جاري محاولة الاتصال بـ Discord...', 'info');
