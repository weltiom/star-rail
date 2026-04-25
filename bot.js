const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
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

// Collections للأوامر
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();

// متغيرات عامة
const PREFIX = '!';
const COLORS = {
  primary: '#00FFFF',
  secondary: '#FF00FF',
  success: '#00FF00',
  danger: '#FF0000',
  warning: '#FFFF00',
  info: '#0099FF',
};

// ==================== EVENTS ====================

client.once('ready', () => {
  console.log(`✅ البوت جاهز! تم تسجيل الدخول باسم: ${client.user.tag}`);
  client.user.setActivity('Honkai: Star Rail | !help', { type: 'WATCHING' });
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // معالجة الأوامر
  if (message.content.startsWith(PREFIX)) {
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // الأوامر المدمجة
    await handleCommand(message, commandName, args);
  }
});

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isButton()) {
      await handleButton(interaction);
    } else if (interaction.isStringSelectMenu()) {
      await handleSelectMenu(interaction);
    } else if (interaction.isModalSubmit()) {
      await handleModal(interaction);
    }
  } catch (error) {
    console.error('خطأ في التفاعل:', error);
    if (!interaction.replied) {
      await interaction.reply({ content: '❌ حدث خطأ أثناء معالجة طلبك', ephemeral: true });
    }
  }
});

// ==================== COMMAND HANDLER ====================

async function handleCommand(message, commandName, args) {
  try {
    switch (commandName) {
      case 'help':
        await showHelp(message);
        break;
      case 'character':
      case 'char':
        await showCharacter(message, args);
        break;
      case 'search':
        await searchCharacter(message, args);
        break;
      case 'list':
        await listCharacters(message, args);
        break;
      case 'team':
        await showTeamRecommendation(message, args);
        break;
      case 'relics':
        await showRelics(message, args);
        break;
      case 'lightcone':
      case 'lc':
        await showLightCones(message, args);
        break;
      case 'path':
        await showPath(message, args);
        break;
      case 'element':
      case 'elem':
        await showElement(message, args);
        break;
      case 'compare':
        await compareCharacters(message, args);
        break;
      case 'tier':
        await showTierList(message);
        break;
      case 'stats':
        await showStats(message, args);
        break;
      case 'tip':
        await showTip(message);
        break;
      case 'ping':
        await message.reply(`🏓 Pong! ${client.ws.ping}ms`);
        break;
      default:
        await message.reply('❌ أمر غير معروف. استخدم `!help` للمزيد من المعلومات');
    }
  } catch (error) {
    console.error('خطأ في الأمر:', error);
    await message.reply('❌ حدث خطأ أثناء معالجة الأمر');
  }
}

// ==================== COMMAND FUNCTIONS ====================

async function showHelp(message) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle('📖 قائمة الأوامر - Honkai: Star Rail Guide Bot')
    .setDescription('جميع الأوامر المتاحة في البوت')
    .addFields(
      { name: '🔍 أوامر البحث', value: '`!character <name>` - عرض معلومات الشخصية\n`!search <name>` - البحث عن شخصية\n`!list [path/element]` - عرض قائمة الشخصيات', inline: false },
      { name: '⚔️ أوامر الاستراتيجية', value: '`!team <character>` - أفضل الفرق\n`!compare <char1> <char2>` - مقارنة شخصيتين\n`!tier` - Tier List', inline: false },
      { name: '🎁 أوامر المعدات', value: '`!relics <character>` - أفضل الآثار\n`!lightcone <character>` - أفضل مخاريط الضوء', inline: false },
      { name: '📚 أوامر المعلومات', value: '`!path <path>` - معلومات المسار\n`!element <element>` - معلومات العنصر\n`!stats <character>` - إحصائيات الشخصية', inline: false },
      { name: '💡 أوامر أخرى', value: '`!tip` - نصيحة عشوائية\n`!ping` - اختبر الاتصال', inline: false }
    )
    .setFooter({ text: 'استخدم الأوامر مع أسماء الشخصيات باللغة العربية أو الإنجليزية' });

  await message.reply({ embeds: [embed] });
}

async function showCharacter(message, args) {
  if (args.length === 0) {
    return message.reply('❌ يرجى تحديد اسم الشخصية. مثال: `!character فايرفلاي`');
  }

  const searchName = args.join(' ').toLowerCase();
  const character = charactersData.characters.find(c =>
    c.nameAr.toLowerCase().includes(searchName) ||
    c.nameEn.toLowerCase().includes(searchName)
  );

  if (!character) {
    return message.reply('❌ لم يتم العثور على الشخصية. جرب `!list` لرؤية جميع الشخصيات');
  }

  const embed = new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle(`⭐ ${character.nameAr} (${character.nameEn})`)
    .setDescription(character.description)
    .addFields(
      { name: '📊 المعلومات الأساسية', value: `**الندرة:** ${'⭐'.repeat(character.rarity)}\n**المسار:** ${character.path}\n**العنصر:** ${character.element}\n**الإصدار:** v${character.version}`, inline: true },
      { name: '💪 نقاط القوة', value: character.strengths.map(s => `✅ ${s}`).join('\n'), inline: false },
      { name: '⚠️ نقاط الضعف', value: character.weaknesses.map(w => `❌ ${w}`).join('\n'), inline: false },
      { name: '📈 الإحصائيات', value: `HP: ${character.stats.hp}\nATK: ${character.stats.atk}\nDEF: ${character.stats.def}\nSPD: ${character.stats.spd}`, inline: true },
      { name: '🎯 أفضل الفرق', value: character.bestTeams.map(t => `• ${t}`).join('\n'), inline: false },
      { name: '🔗 أفضل الآثار', value: character.bestRelics.map(r => `• ${r}`).join('\n'), inline: true },
      { name: '💡 أفضل مخاريط الضوء', value: character.bestLightCones.map(lc => `• ${lc}`).join('\n'), inline: true }
    )
    .setFooter({ text: 'استخدم !team, !relics, !lightcone للمزيد من التفاصيل' });

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
        .setLabel('💫 مخاريط الضوء')
        .setStyle(ButtonStyle.Success)
    );

  await message.reply({ embeds: [embed], components: [row] });
}

async function searchCharacter(message, args) {
  if (args.length === 0) {
    return message.reply('❌ يرجى تحديد اسم الشخصية للبحث عنها');
  }

  const searchName = args.join(' ').toLowerCase();
  const results = charactersData.characters.filter(c =>
    c.nameAr.toLowerCase().includes(searchName) ||
    c.nameEn.toLowerCase().includes(searchName)
  );

  if (results.length === 0) {
    return message.reply('❌ لم يتم العثور على نتائج');
  }

  const embed = new EmbedBuilder()
    .setColor(COLORS.info)
    .setTitle(`🔍 نتائج البحث عن "${searchName}"`)
    .setDescription(results.map((c, i) => `${i + 1}. **${c.nameAr}** (${c.nameEn}) - ${'⭐'.repeat(c.rarity)}`).join('\n'))
    .setFooter({ text: `تم العثور على ${results.length} نتيجة` });

  await message.reply({ embeds: [embed] });
}

async function listCharacters(message, args) {
  let characters = charactersData.characters;

  if (args.length > 0) {
    const filter = args.join(' ').toLowerCase();
    characters = characters.filter(c =>
      c.path.toLowerCase().includes(filter) ||
      c.element.toLowerCase().includes(filter)
    );
  }

  const embed = new EmbedBuilder()
    .setColor(COLORS.secondary)
    .setTitle('📋 قائمة الشخصيات')
    .setDescription(characters.map(c => `**${c.nameAr}** (${c.nameEn}) - ${'⭐'.repeat(c.rarity)} | ${c.path} | ${c.element}`).join('\n'))
    .setFooter({ text: `إجمالي الشخصيات: ${characters.length}` });

  await message.reply({ embeds: [embed] });
}

async function showTeamRecommendation(message, args) {
  if (args.length === 0) {
    return message.reply('❌ يرجى تحديد اسم الشخصية. مثال: `!team فايرفلاي`');
  }

  const searchName = args.join(' ').toLowerCase();
  const character = charactersData.characters.find(c =>
    c.nameAr.toLowerCase().includes(searchName) ||
    c.nameEn.toLowerCase().includes(searchName)
  );

  if (!character) {
    return message.reply('❌ لم يتم العثور على الشخصية');
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
    )
    .setFooter({ text: 'استخدم !relics و !lightcone للمزيد من المعلومات' });

  await message.reply({ embeds: [embed] });
}

async function showRelics(message, args) {
  if (args.length === 0) {
    return message.reply('❌ يرجى تحديد اسم الشخصية. مثال: `!relics فايرفلاي`');
  }

  const searchName = args.join(' ').toLowerCase();
  const character = charactersData.characters.find(c =>
    c.nameAr.toLowerCase().includes(searchName) ||
    c.nameEn.toLowerCase().includes(searchName)
  );

  if (!character) {
    return message.reply('❌ لم يتم العثور على الشخصية');
  }

  const relicsInfo = character.bestRelics.map(relicName => {
    const relic = charactersData.relics.find(r => r.nameAr === relicName);
    return relic ? `**${relic.nameAr}**\n${Object.entries(relic.mainStats).map(([slot, stat]) => `• ${slot}: ${stat}`).join('\n')}` : relicName;
  }).join('\n\n');

  const embed = new EmbedBuilder()
    .setColor(COLORS.warning)
    .setTitle(`🎁 أفضل الآثار لـ ${character.nameAr}`)
    .setDescription(relicsInfo)
    .setFooter({ text: 'الإحصائيات الثانوية: ATK, SPD, CRIT Rate, CRIT DMG' });

  await message.reply({ embeds: [embed] });
}

async function showLightCones(message, args) {
  if (args.length === 0) {
    return message.reply('❌ يرجى تحديد اسم الشخصية. مثال: `!lightcone فايرفلاي`');
  }

  const searchName = args.join(' ').toLowerCase();
  const character = charactersData.characters.find(c =>
    c.nameAr.toLowerCase().includes(searchName) ||
    c.nameEn.toLowerCase().includes(searchName)
  );

  if (!character) {
    return message.reply('❌ لم يتم العثور على الشخصية');
  }

  const lightConesInfo = character.bestLightCones.map(lcName => {
    const lc = charactersData.lightCones.find(l => l.nameAr === lcName);
    return lc ? `**${lc.nameAr}** ${'⭐'.repeat(lc.rarity)}\n${lc.description}` : lcName;
  }).join('\n\n');

  const embed = new EmbedBuilder()
    .setColor(COLORS.danger)
    .setTitle(`💫 أفضل مخاريط الضوء لـ ${character.nameAr}`)
    .setDescription(lightConesInfo)
    .setFooter({ text: 'استخدم !character للمزيد من المعلومات' });

  await message.reply({ embeds: [embed] });
}

async function showPath(message, args) {
  if (args.length === 0) {
    const paths = charactersData.paths.map(p => `**${p.nameAr}** (${p.nameEn})\n${p.description}`).join('\n\n');
    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setTitle('📚 جميع المسارات')
      .setDescription(paths);
    return await message.reply({ embeds: [embed] });
  }

  const pathName = args.join(' ').toLowerCase();
  const path = charactersData.paths.find(p =>
    p.nameAr.toLowerCase().includes(pathName) ||
    p.nameEn.toLowerCase().includes(pathName)
  );

  if (!path) {
    return message.reply('❌ لم يتم العثور على المسار');
  }

  const pathCharacters = charactersData.characters.filter(c => c.path === path.nameAr);

  const embed = new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle(`📚 المسار: ${path.nameAr}`)
    .setDescription(`${path.description}\n\n**الشخصيات:**\n${pathCharacters.map(c => `• ${c.nameAr}`).join('\n')}`)
    .setFooter({ text: `عدد الشخصيات: ${pathCharacters.length}` });

  await message.reply({ embeds: [embed] });
}

async function showElement(message, args) {
  if (args.length === 0) {
    const elements = charactersData.elements.map(e => `${e.emoji} **${e.nameAr}** (${e.nameEn})`).join('\n');
    const embed = new EmbedBuilder()
      .setColor(COLORS.info)
      .setTitle('🌈 جميع العناصر')
      .setDescription(elements);
    return await message.reply({ embeds: [embed] });
  }

  const elementName = args.join(' ').toLowerCase();
  const element = charactersData.elements.find(e =>
    e.nameAr.toLowerCase().includes(elementName) ||
    e.nameEn.toLowerCase().includes(elementName)
  );

  if (!element) {
    return message.reply('❌ لم يتم العثور على العنصر');
  }

  const elementCharacters = charactersData.characters.filter(c => c.element === element.nameAr);

  const embed = new EmbedBuilder()
    .setColor(COLORS.info)
    .setTitle(`${element.emoji} العنصر: ${element.nameAr}`)
    .setDescription(`**الشخصيات:**\n${elementCharacters.map(c => `• ${c.nameAr}`).join('\n')}`)
    .setFooter({ text: `عدد الشخصيات: ${elementCharacters.length}` });

  await message.reply({ embeds: [embed] });
}

async function compareCharacters(message, args) {
  if (args.length < 2) {
    return message.reply('❌ يرجى تحديد شخصيتين للمقارنة. مثال: `!compare فايرفلاي روان مي`');
  }

  const char1Name = args[0].toLowerCase();
  const char2Name = args.slice(1).join(' ').toLowerCase();

  const char1 = charactersData.characters.find(c =>
    c.nameAr.toLowerCase().includes(char1Name) ||
    c.nameEn.toLowerCase().includes(char1Name)
  );

  const char2 = charactersData.characters.find(c =>
    c.nameAr.toLowerCase().includes(char2Name) ||
    c.nameEn.toLowerCase().includes(char2Name)
  );

  if (!char1 || !char2) {
    return message.reply('❌ لم يتم العثور على إحدى الشخصيات');
  }

  const embed = new EmbedBuilder()
    .setColor(COLORS.secondary)
    .setTitle(`⚔️ مقارنة: ${char1.nameAr} vs ${char2.nameAr}`)
    .addFields(
      { name: '📊 الإحصائيات', value: `**${char1.nameAr}**\nHP: ${char1.stats.hp}\nATK: ${char1.stats.atk}\nDEF: ${char1.stats.def}\nSPD: ${char1.stats.spd}`, inline: true },
      { name: '⠀', value: `**${char2.nameAr}**\nHP: ${char2.stats.hp}\nATK: ${char2.stats.atk}\nDEF: ${char2.stats.def}\nSPD: ${char2.stats.spd}`, inline: true },
      { name: '🎯 المسار', value: `${char1.path} vs ${char2.path}`, inline: true },
      { name: '🌈 العنصر', value: `${char1.element} vs ${char2.element}`, inline: true }
    );

  await message.reply({ embeds: [embed] });
}

async function showTierList(message) {
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
    .setTitle('🏆 Tier List - أفضل الشخصيات')
    .setDescription(description)
    .setFooter({ text: 'بناءً على القوة والاستخدامية العامة' });

  await message.reply({ embeds: [embed] });
}

async function showStats(message, args) {
  if (args.length === 0) {
    return message.reply('❌ يرجى تحديد اسم الشخصية. مثال: `!stats فايرفلاي`');
  }

  const searchName = args.join(' ').toLowerCase();
  const character = charactersData.characters.find(c =>
    c.nameAr.toLowerCase().includes(searchName) ||
    c.nameEn.toLowerCase().includes(searchName)
  );

  if (!character) {
    return message.reply('❌ لم يتم العثور على الشخصية');
  }

  const embed = new EmbedBuilder()
    .setColor(COLORS.success)
    .setTitle(`📊 إحصائيات ${character.nameAr}`)
    .addFields(
      { name: 'HP (الصحة)', value: `${character.stats.hp}`, inline: true },
      { name: 'ATK (الهجوم)', value: `${character.stats.atk}`, inline: true },
      { name: 'DEF (الدفاع)', value: `${character.stats.def}`, inline: true },
      { name: 'SPD (السرعة)', value: `${character.stats.spd}`, inline: true },
      { name: 'CRIT Rate (معدل الضربة الحرجة)', value: `${(character.stats.critRate * 100).toFixed(1)}%`, inline: true },
      { name: 'CRIT DMG (ضرر الضربة الحرجة)', value: `${(character.stats.critDmg * 100).toFixed(1)}%`, inline: true }
    );

  await message.reply({ embeds: [embed] });
}

async function showTip(message) {
  const tips = charactersData.tips;
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  const embed = new EmbedBuilder()
    .setColor(COLORS.info)
    .setTitle('💡 نصيحة عشوائية')
    .setDescription(randomTip);

  await message.reply({ embeds: [embed] });
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
    const relicsInfo = character.bestRelics.map(relicName => {
      const relic = charactersData.relics.find(r => r.nameAr === relicName);
      return relic ? `**${relic.nameAr}**\n${Object.entries(relic.mainStats).map(([slot, stat]) => `• ${slot}: ${stat}`).join('\n')}` : relicName;
    }).join('\n\n');

    const embed = new EmbedBuilder()
      .setColor(COLORS.warning)
      .setTitle(`🎁 أفضل الآثار لـ ${character.nameAr}`)
      .setDescription(relicsInfo);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  } else if (action === 'lightcone') {
    const lightConesInfo = character.bestLightCones.map(lcName => {
      const lc = charactersData.lightCones.find(l => l.nameAr === lcName);
      return lc ? `**${lc.nameAr}** ${'⭐'.repeat(lc.rarity)}\n${lc.description}` : lcName;
    }).join('\n\n');

    const embed = new EmbedBuilder()
      .setColor(COLORS.danger)
      .setTitle(`💫 أفضل مخاريط الضوء لـ ${character.nameAr}`)
      .setDescription(lightConesInfo);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
}

async function handleSelectMenu(interaction) {
  // معالج القوائم المنسدلة
  await interaction.reply({ content: 'تم اختيار: ' + interaction.values.join(', '), ephemeral: true });
}

async function handleModal(interaction) {
  // معالج النماذج
  await interaction.reply({ content: 'تم استقبال النموذج', ephemeral: true });
}

// ==================== LOGIN ====================

client.login(process.env.DISCORD_TOKEN);
