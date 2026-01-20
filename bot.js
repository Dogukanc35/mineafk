const mineflayer = require('mineflayer');
const chalk = require('chalk');
const readline = require('readline');
const fs = require('fs');

// ═══════════════════════════════════════════════════════════
//  MINECRAFT AFK BOT - Cracked/Offline Mode Destekli
//  Minecraft Java Edition 1.21.x
//  Author: Doğukan Gökçeoğlu
//  Tüm ayarlar CMD üzerinden yapılır!
// ═══════════════════════════════════════════════════════════

let bot = null;
let reconnectAttempts = 0;
let antiAfkInterval = null;
let config = {
  server: { host: '', port: 25565, version: '1.21.1' },
  player: { username: '' },
  antiAfk: { enabled: true, intervalMs: 30000 },
  autoReconnect: { enabled: true, delayMs: 5000, maxAttempts: 10 }
};

// Readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Soru sorma fonksiyonu
function ask(question) {
  return new Promise((resolve) => {
    rl.question(chalk.yellow(question), (answer) => {
      resolve(answer.trim());
    });
  });
}

// Konsol log fonksiyonları
const log = {
  info: (msg) => console.log(chalk.cyan('[INFO]') + ' ' + msg),
  success: (msg) => console.log(chalk.green('[SUCCESS]') + ' ' + msg),
  warn: (msg) => console.log(chalk.yellow('[WARN]') + ' ' + msg),
  error: (msg) => console.log(chalk.red('[ERROR]') + ' ' + msg),
  afk: (msg) => console.log(chalk.magenta('[AFK]') + ' ' + msg),
};

// Ekranı temizle
function clearScreen() {
  console.clear();
}

// Banner
function showBanner() {
  clearScreen();
  console.log(chalk.cyan(`
  ╔═══════════════════════════════════════════════════════════════╗
  ║                                                               ║
  ║     ███╗   ███╗██╗███╗   ██╗███████╗ ██████╗██████╗  █████╗   ║
  ║     ████╗ ████║██║████╗  ██║██╔════╝██╔════╝██╔══██╗██╔══██╗  ║
  ║     ██╔████╔██║██║██╔██╗ ██║█████╗  ██║     ██████╔╝███████║  ║
  ║     ██║╚██╔╝██║██║██║╚██╗██║██╔══╝  ██║     ██╔══██╗██╔══██║  ║
  ║     ██║ ╚═╝ ██║██║██║ ╚████║███████╗╚██████╗██║  ██║██║  ██║  ║
  ║     ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝  ║
  ║                                                               ║
  ║              █████╗ ███████╗██╗  ██╗    ██████╗  ██████╗ ████████╗  ║
  ║             ██╔══██╗██╔════╝██║ ██╔╝    ██╔══██╗██╔═══██╗╚══██╔══╝  ║
  ║             ███████║█████╗  █████╔╝     ██████╔╝██║   ██║   ██║     ║
  ║             ██╔══██║██╔══╝  ██╔═██╗     ██╔══██╗██║   ██║   ██║     ║
  ║             ██║  ██║██║     ██║  ██╗    ██████╔╝╚██████╔╝   ██║     ║
  ║             ╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝    ╚═════╝  ╚═════╝    ╚═╝     ║
  ║                                                               ║
  ║         Cracked/Offline Mode Destekli - v1.0.0                ║
  ║         Author: Doğukan Gökçeoğlu                             ║
  ╚═══════════════════════════════════════════════════════════════╝
  `));
}

// Ana menü
async function showMainMenu() {
  console.log(chalk.white('\n  ┌─────────────────────────────────────┐'));
  console.log(chalk.white('  │         ') + chalk.green('ANA MENÜ') + chalk.white('                    │'));
  console.log(chalk.white('  ├─────────────────────────────────────┤'));
  console.log(chalk.white('  │  ') + chalk.cyan('[1]') + chalk.white(' Sunucuya Bağlan              │'));
  console.log(chalk.white('  │  ') + chalk.cyan('[2]') + chalk.white(' Ayarları Göster              │'));
  console.log(chalk.white('  │  ') + chalk.cyan('[3]') + chalk.white(' Ayarları Değiştir            │'));
  console.log(chalk.white('  │  ') + chalk.cyan('[4]') + chalk.white(' Hakkında                     │'));
  console.log(chalk.white('  │  ') + chalk.red('[5]') + chalk.white(' Çıkış                        │'));
  console.log(chalk.white('  └─────────────────────────────────────┘\n'));

  const choice = await ask('  Seçiminiz: ');

  switch (choice) {
    case '1':
      await startConnection();
      break;
    case '2':
      showSettings();
      await showMainMenu();
      break;
    case '3':
      await changeSettings();
      break;
    case '4':
      showAbout();
      await showMainMenu();
      break;
    case '5':
      console.log(chalk.green('\n  Görüşürüz! 👋\n'));
      rl.close();
      process.exit(0);
      break;
    default:
      console.log(chalk.red('\n  Geçersiz seçim!\n'));
      await showMainMenu();
  }
}

// Bağlantı başlat
async function startConnection() {
  clearScreen();
  console.log(chalk.cyan('\n  ═══════════════════════════════════════'));
  console.log(chalk.cyan('           SUNUCU BAĞLANTI AYARLARI'));
  console.log(chalk.cyan('  ═══════════════════════════════════════\n'));

  // Sunucu IP
  let host = await ask('  Sunucu IP adresi (örn: play.example.com): ');
  if (!host) {
    log.error('Sunucu IP boş olamaz!');
    await showMainMenu();
    return;
  }
  config.server.host = host;

  // Port
  let portInput = await ask('  Port [25565]: ');
  config.server.port = portInput ? parseInt(portInput) : 25565;

  // Versiyon
  let version = await ask('  Minecraft versiyonu [1.21.1]: ');
  config.server.version = version || '1.21.1';

  // Kullanıcı adı
  let username = await ask('  Kullanıcı adı: ');
  if (!username) {
    log.error('Kullanıcı adı boş olamaz!');
    await showMainMenu();
    return;
  }
  config.player.username = username;

  // Anti-AFK
  let antiAfk = await ask('  Anti-AFK aktif mi? (e/h) [e]: ');
  config.antiAfk.enabled = antiAfk.toLowerCase() !== 'h';

  if (config.antiAfk.enabled) {
    let interval = await ask('  Anti-AFK aralığı (saniye) [30]: ');
    config.antiAfk.intervalMs = (interval ? parseInt(interval) : 30) * 1000;
  }

  // Auto Reconnect
  let autoReconnect = await ask('  Otomatik yeniden bağlanma aktif mi? (e/h) [e]: ');
  config.autoReconnect.enabled = autoReconnect.toLowerCase() !== 'h';

  console.log(chalk.green('\n  ✓ Ayarlar kaydedildi!\n'));

  // Bağlantıyı başlat
  await connectToServer();
}

// Ayarları göster
function showSettings() {
  clearScreen();
  console.log(chalk.cyan('\n  ═══════════════════════════════════════'));
  console.log(chalk.cyan('              MEVCUT AYARLAR'));
  console.log(chalk.cyan('  ═══════════════════════════════════════\n'));

  console.log(chalk.white('  ┌─────────────────────────────────────┐'));
  console.log(chalk.white('  │ ') + chalk.yellow('Sunucu:') + chalk.white(`      ${config.server.host || 'Ayarlanmadı'}`.padEnd(24)) + chalk.white('│'));
  console.log(chalk.white('  │ ') + chalk.yellow('Port:') + chalk.white(`        ${config.server.port}`.padEnd(24)) + chalk.white('│'));
  console.log(chalk.white('  │ ') + chalk.yellow('Versiyon:') + chalk.white(`    ${config.server.version}`.padEnd(24)) + chalk.white('│'));
  console.log(chalk.white('  │ ') + chalk.yellow('Kullanıcı:') + chalk.white(`   ${config.player.username || 'Ayarlanmadı'}`.padEnd(24)) + chalk.white('│'));
  console.log(chalk.white('  │ ') + chalk.yellow('Anti-AFK:') + chalk.white(`    ${config.antiAfk.enabled ? 'Aktif' : 'Kapalı'}`.padEnd(24)) + chalk.white('│'));
  console.log(chalk.white('  │ ') + chalk.yellow('Oto-Bağlan:') + chalk.white(`  ${config.autoReconnect.enabled ? 'Aktif' : 'Kapalı'}`.padEnd(24)) + chalk.white('│'));
  console.log(chalk.white('  └─────────────────────────────────────┘\n'));
}

// Ayarları değiştir
async function changeSettings() {
  await startConnection();
}

// Hakkında
function showAbout() {
  clearScreen();
  console.log(chalk.cyan('\n  ═══════════════════════════════════════'));
  console.log(chalk.cyan('                 HAKKINDA'));
  console.log(chalk.cyan('  ═══════════════════════════════════════\n'));

  console.log(chalk.white('  Minecraft AFK Bot v1.0.0'));
  console.log(chalk.white('  Cracked/Offline Mode Destekli\n'));
  console.log(chalk.yellow('  Özellikler:'));
  console.log(chalk.white('  • Premium hesap gerektirmez'));
  console.log(chalk.white('  • Otomatik Anti-AFK (zıplama, dönme)'));
  console.log(chalk.white('  • Sunucudan atılınca yeniden bağlanma'));
  console.log(chalk.white('  • Renkli konsol arayüzü'));
  console.log(chalk.white('  • Chat mesajlarını gösterir\n'));
  console.log(chalk.gray('  Author: Doğukan Gökçeoğlu'));
  console.log(chalk.gray('  Sadece eğitim amaçlıdır.\n'));
}

// Sunucuya bağlan
async function connectToServer() {
  clearScreen();
  console.log(chalk.cyan('\n  ═══════════════════════════════════════'));
  console.log(chalk.cyan('            BOT BAĞLANTI DURUMU'));
  console.log(chalk.cyan('  ═══════════════════════════════════════\n'));

  log.info(`Sunucuya bağlanılıyor: ${config.server.host}:${config.server.port}`);
  log.info(`Kullanıcı adı: ${config.player.username}`);
  log.info(`Versiyon: ${config.server.version}`);
  log.info(`Mod: Cracked/Offline\n`);

  createBot();
}

// Bot oluştur
function createBot() {
  bot = mineflayer.createBot({
    host: config.server.host,
    port: config.server.port,
    username: config.player.username,
    version: config.server.version,
    auth: 'offline',
    hideErrors: false,
  });

  // Event handlers
  bot.on('login', onLogin);
  bot.on('spawn', onSpawn);
  bot.on('death', onDeath);
  bot.on('kicked', onKicked);
  bot.on('error', onError);
  bot.on('end', onEnd);
  bot.on('chat', onChat);
  bot.on('health', onHealth);
  bot.on('message', onMessage);
  bot.on('windowOpen', onWindowOpen);
}

// Login eventi
function onLogin() {
  log.success('Sunucuya giriş yapıldı!');
  reconnectAttempts = 0;

  console.log(chalk.gray('\n  ─────────────────────────────────────'));
  console.log(chalk.yellow('  Komutlar:'));
  console.log(chalk.white('  • ') + chalk.cyan('quit') + chalk.white(' - Botu kapat'));
  console.log(chalk.white('  • ') + chalk.cyan('status') + chalk.white(' - Durum bilgisi'));
  console.log(chalk.white('  • ') + chalk.cyan('say <mesaj>') + chalk.white(' - Chat\'e yaz'));
  console.log(chalk.gray('  ─────────────────────────────────────\n'));

  // Komut dinlemeyi başlat
  listenForCommands();
}

// Komut dinle - HER ŞEY CHAT'E GİDER!
function listenForCommands() {
  console.log(chalk.green('\n  ════════════════════════════════════════════════════'));
  console.log(chalk.green('  CHAT MODU AKTİF - Yazdığın her şey sunucuya gider!'));
  console.log(chalk.green('  ════════════════════════════════════════════════════'));
  console.log(chalk.yellow('\n  Bot Komutları (! ile başla):'));
  console.log(chalk.white('  • ') + chalk.cyan('!help') + chalk.white('       - Tüm komutları göster'));
  console.log(chalk.white('  • ') + chalk.cyan('!entities') + chalk.white('   - Yakındaki NPC/oyuncuları listele'));
  console.log(chalk.white('  • ') + chalk.cyan('!click <id>') + chalk.white(' - Bir entity\'ye sağ tıkla'));
  console.log(chalk.white('  • ') + chalk.cyan('!left') + chalk.white('       - Sol tık (vur)'));
  console.log(chalk.white('  • ') + chalk.cyan('!right') + chalk.white('      - Sağ tık (kullan)'));
  console.log(chalk.white('  • ') + chalk.cyan('!slot <0-8>') + chalk.white(' - Hotbar slotu seç'));
  console.log(chalk.gray('\n  Diğer her şey direkt sunucuya gönderilir.\n'));
  console.log(chalk.gray('  ─────────────────────────────────────────────────────\n'));

  rl.on('line', (input) => {
    const trimmedInput = input.trim();

    if (!trimmedInput) return;

    // Bot komutları (! ile başlar)
    if (trimmedInput.startsWith('!')) {
      const parts = trimmedInput.substring(1).split(' ');
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);

      switch (cmd) {
        case 'quit':
        case 'exit':
          log.warn('Bot kapatılıyor...');
          stopAntiAfk();
          if (bot) bot.quit();
          setTimeout(() => process.exit(0), 1000);
          break;
        case 'status':
          showBotStatus();
          break;
        case 'afk':
          toggleAntiAfk();
          break;
        case 'help':
          showChatHelp();
          break;
        case 'say':
        case 'chat':
        case 'yaz':
          if (args.length > 0) {
            const message = args.join(' ');
            if (bot) {
              bot.chat(message);
              log.success(`Chat'e gönderildi: ${message}`);
            } else {
              log.error('Bot bağlı değil!');
            }
          } else {
            log.error('Kullanım: !say <mesaj>');
          }
          break;
        // MOUSE KONTROLLERI
        case 'left':
        case 'sol':
          doLeftClick();
          break;
        case 'right':
        case 'sag':
          doRightClick();
          break;
        case 'use':
        case 'kullan':
          doUseItem();
          break;
        // ENTITY KONTROLLERI
        case 'entities':
        case 'npc':
        case 'list':
          listNearbyEntities();
          break;
        case 'click':
        case 'tikla':
          if (args[0]) {
            clickEntity(parseInt(args[0]));
          } else {
            log.error('Kullanım: !click <entity_id>');
          }
          break;
        case 'attack':
        case 'vur':
          if (args[0]) {
            attackEntity(parseInt(args[0]));
          } else {
            log.error('Kullanım: !attack <entity_id>');
          }
          break;
        // HOTBAR SLOT
        case 'slot':
          if (args[0] !== undefined) {
            selectSlot(parseInt(args[0]));
          } else {
            log.error('Kullanım: !slot <0-8>');
          }
          break;
        // HAREKET KONTROLLERI
        case 'w':
        case 'ileri':
          moveForward();
          break;
        case 's':
        case 'geri':
          moveBackward();
          break;
        case 'a':
        case 'sol':
          moveLeft();
          break;
        case 'd':
        case 'sag':
          moveRight();
          break;
        case 'jump':
        case 'zipla':
          doJump();
          break;
        case 'stop':
        case 'dur':
          stopMoving();
          break;
        // LOOK
        case 'look':
        case 'bak':
          if (args[0] && args[1]) {
            lookAt(parseFloat(args[0]), parseFloat(args[1]));
          } else {
            log.error('Kullanım: !look <yaw> <pitch>');
          }
          break;
        // INVENTORY
        case 'inv':
        case 'envanter':
          showInventory();
          break;
        // GUI/WINDOW KONTROLLERI
        case 'menu':
        case 'gui':
        case 'window':
          showCurrentWindow();
          break;
        case 'wclick':
        case 'wc':
          if (args[0] !== undefined) {
            windowClickSlot(parseInt(args[0]));
          } else {
            log.error('Kullanım: !wclick <slot_numarası>');
          }
          break;
        case 'wfind':
        case 'wf':
          if (args[0]) {
            windowClickByName(args.join(' '));
          } else {
            log.error('Kullanım: !wfind <item_adı> (örn: !wfind grass_block)');
          }
          break;
        case 'wclose':
        case 'kapat':
          closeWindow();
          break;
        default:
          log.warn(`Bilinmeyen komut: !${cmd}`);

      }
    } else {
      // Diğer her şey sunucuya gönderilir
      if (bot) {
        bot.chat(trimmedInput);
        console.log(chalk.green(`[SEN] ${trimmedInput}`));
      } else {
        log.error('Bot bağlı değil!');
      }
    }
  });
}

// ═══════════════════════════════════════════════════════
//  MOUSE KONTROLLERI
// ═══════════════════════════════════════════════════════

function doLeftClick() {
  if (!bot) return log.error('Bot bağlı değil!');
  bot.swingArm();
  log.info('Sol tık yapıldı (kol sallandı)');
}

function doRightClick() {
  if (!bot) return log.error('Bot bağlı değil!');
  bot.activateItem();
  log.info('Sağ tık yapıldı (item kullanıldı)');
}

function doUseItem() {
  if (!bot) return log.error('Bot bağlı değil!');
  bot.activateItem();
  setTimeout(() => bot.deactivateItem(), 100);
  log.info('Item kullanıldı');
}

// ═══════════════════════════════════════════════════════
//  ENTITY KONTROLLERI
// ═══════════════════════════════════════════════════════

function listNearbyEntities() {
  if (!bot) return log.error('Bot bağlı değil!');

  const entities = Object.values(bot.entities);
  const nearby = entities
    .filter(e => e.position && bot.entity.position.distanceTo(e.position) < 20)
    .filter(e => e.id !== bot.entity.id)
    .sort((a, b) => bot.entity.position.distanceTo(a.position) - bot.entity.position.distanceTo(b.position));

  console.log(chalk.cyan('\n  ╔════════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan('  ║              YAKIN ENTİTYLER (20 blok)                     ║'));
  console.log(chalk.cyan('  ╠════════════════════════════════════════════════════════════╣'));

  if (nearby.length === 0) {
    console.log(chalk.white('  ║  Yakında entity bulunamadı.                                ║'));
  } else {
    nearby.slice(0, 15).forEach(e => {
      const dist = bot.entity.position.distanceTo(e.position).toFixed(1);
      const name = e.username || e.displayName || e.name || e.type || 'Bilinmeyen';
      const line = `  ║  ID: ${String(e.id).padEnd(5)} | ${name.padEnd(20)} | ${dist}m`;
      console.log(chalk.white(line.padEnd(61)) + chalk.cyan('║'));
    });
  }

  console.log(chalk.cyan('  ╚════════════════════════════════════════════════════════════╝'));
  console.log(chalk.gray('  Kullanım: !click <id> ile sağ tıkla, !attack <id> ile vur\n'));
}

function clickEntity(entityId) {
  if (!bot) return log.error('Bot bağlı değil!');

  const entity = bot.entities[entityId];
  if (!entity) {
    log.error(`Entity bulunamadı: ${entityId}`);
    return;
  }

  const name = entity.username || entity.displayName || entity.name || entity.type || 'Entity';

  // Entity'ye bak
  bot.lookAt(entity.position.offset(0, entity.height || 1, 0), true, () => {
    // Sağ tık ile etkileşim
    bot.activateEntity(entity);
    log.success(`${name} (ID: ${entityId}) ile etkileşime girildi (sağ tık)`);
  });
}

function attackEntity(entityId) {
  if (!bot) return log.error('Bot bağlı değil!');

  const entity = bot.entities[entityId];
  if (!entity) {
    log.error(`Entity bulunamadı: ${entityId}`);
    return;
  }

  const name = entity.username || entity.displayName || entity.name || entity.type || 'Entity';

  bot.lookAt(entity.position.offset(0, entity.height || 1, 0), true, () => {
    bot.attack(entity);
    log.success(`${name} (ID: ${entityId}) 'e vuruldu (sol tık)`);
  });
}

// ═══════════════════════════════════════════════════════
//  HOTBAR / SLOT
// ═══════════════════════════════════════════════════════

function selectSlot(slot) {
  if (!bot) return log.error('Bot bağlı değil!');

  if (slot < 0 || slot > 8) {
    log.error('Slot 0-8 arasında olmalı!');
    return;
  }

  bot.setQuickBarSlot(slot);
  const item = bot.inventory.slots[bot.quickBarSlot + 36];
  const itemName = item ? item.name : 'Boş';
  log.info(`Slot ${slot} seçildi: ${itemName}`);
}

function showInventory() {
  if (!bot) return log.error('Bot bağlı değil!');

  console.log(chalk.cyan('\n  ╔════════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan('  ║                      HOTBAR                                ║'));
  console.log(chalk.cyan('  ╠════════════════════════════════════════════════════════════╣'));

  for (let i = 0; i < 9; i++) {
    const item = bot.inventory.slots[i + 36];
    const current = i === bot.quickBarSlot ? '→' : ' ';
    const itemName = item ? `${item.name} x${item.count}` : 'Boş';
    const line = `  ║ ${current}[${i}] ${itemName}`;
    console.log(chalk.white(line.padEnd(61)) + chalk.cyan('║'));
  }

  console.log(chalk.cyan('  ╚════════════════════════════════════════════════════════════╝\n'));
}

// ═══════════════════════════════════════════════════════
//  GUI / WINDOW KONTROLLERI (Sunucu Menüleri)
// ═══════════════════════════════════════════════════════

let currentWindow = null;

function showCurrentWindow() {
  if (!bot) return log.error('Bot bağlı değil!');

  const window = bot.currentWindow;
  if (!window) {
    log.warn('Açık pencere yok! Önce bir NPC\'ye tıkla veya bir şey aç.');
    return;
  }

  console.log(chalk.cyan('\n  ╔════════════════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan(`  ║  AÇIK PENCERE: ${(window.title || 'Menü').toString().substring(0, 45).padEnd(45)}     ║`));
  console.log(chalk.cyan('  ╠════════════════════════════════════════════════════════════════════╣'));
  console.log(chalk.yellow('  ║  SLOT  │  İTEM ADI                          │  ADET              ║'));
  console.log(chalk.cyan('  ╠════════════════════════════════════════════════════════════════════╣'));

  const slots = window.slots;
  let hasItems = false;

  for (let i = 0; i < slots.length; i++) {
    const item = slots[i];
    if (item) {
      hasItems = true;
      const slotStr = String(i).padEnd(5);
      const itemName = (item.displayName || item.name || 'Bilinmeyen').substring(0, 35).padEnd(35);
      const count = String(item.count).padEnd(5);
      console.log(chalk.white(`  ║  ${slotStr} │  ${itemName} │  x${count}         ║`));
    }
  }

  if (!hasItems) {
    console.log(chalk.gray('  ║  Pencerede item bulunamadı.                                       ║'));
  }

  console.log(chalk.cyan('  ╚════════════════════════════════════════════════════════════════════╝'));
  console.log(chalk.gray('  Kullanım: !wclick <slot> veya !wfind <item_adı>\n'));
}

function windowClickSlot(slot) {
  if (!bot) return log.error('Bot bağlı değil!');

  const window = bot.currentWindow;
  if (!window) {
    log.error('Açık pencere yok!');
    return;
  }

  const item = window.slots[slot];
  const itemName = item ? (item.displayName || item.name) : 'Boş slot';

  try {
    bot.clickWindow(slot, 0, 0); // Sol tık
    log.success(`Slot ${slot} tıklandı: ${itemName}`);
  } catch (err) {
    log.error(`Tıklama hatası: ${err.message}`);
  }
}

function windowClickByName(searchName) {
  if (!bot) return log.error('Bot bağlı değil!');

  const window = bot.currentWindow;
  if (!window) {
    log.error('Açık pencere yok!');
    return;
  }

  const searchLower = searchName.toLowerCase();

  for (let i = 0; i < window.slots.length; i++) {
    const item = window.slots[i];
    if (item) {
      const itemName = (item.displayName || item.name || '').toLowerCase();
      const itemId = (item.name || '').toLowerCase();

      if (itemName.includes(searchLower) || itemId.includes(searchLower)) {
        log.info(`"${searchName}" bulundu: Slot ${i} - ${item.displayName || item.name}`);
        try {
          bot.clickWindow(i, 0, 0);
          log.success(`Slot ${i} tıklandı!`);
        } catch (err) {
          log.error(`Tıklama hatası: ${err.message}`);
        }
        return;
      }
    }
  }

  log.error(`"${searchName}" adlı item bulunamadı! !menu ile listeye bak.`);
}

function closeWindow() {
  if (!bot) return log.error('Bot bağlı değil!');

  if (bot.currentWindow) {
    bot.closeWindow(bot.currentWindow);
    log.info('Pencere kapatıldı.');
  } else {
    log.warn('Açık pencere yok.');
  }
}

// Pencere açıldığında otomatik bildirim
function onWindowOpen(window) {
  const title = window.title ? window.title.toString() : 'Menü';

  console.log(chalk.green('\n  ╔════════════════════════════════════════════════════════════════════╗'));
  console.log(chalk.green(`  ║  🎮 PENCERE AÇILDI: ${title.substring(0, 45).padEnd(45)}    ║`));
  console.log(chalk.green('  ╚════════════════════════════════════════════════════════════════════╝'));

  // Kısa bir gecikme ile içeriği göster (sunucu itemleri yüklesin)
  setTimeout(() => {
    showCurrentWindow();
  }, 300);
}

// ═══════════════════════════════════════════════════════
//  HAREKET KONTROLLERI
// ═══════════════════════════════════════════════════════

function moveForward() {
  if (!bot) return log.error('Bot bağlı değil!');
  bot.setControlState('forward', true);
  log.info('İleri gidiliyor... (!stop ile dur)');
}

function moveBackward() {
  if (!bot) return log.error('Bot bağlı değil!');
  bot.setControlState('back', true);
  log.info('Geri gidiliyor... (!stop ile dur)');
}

function moveLeft() {
  if (!bot) return log.error('Bot bağlı değil!');
  bot.setControlState('left', true);
  log.info('Sola gidiliyor... (!stop ile dur)');
}

function moveRight() {
  if (!bot) return log.error('Bot bağlı değil!');
  bot.setControlState('right', true);
  log.info('Sağa gidiliyor... (!stop ile dur)');
}

function doJump() {
  if (!bot) return log.error('Bot bağlı değil!');
  bot.setControlState('jump', true);
  setTimeout(() => bot.setControlState('jump', false), 300);
  log.info('Zıplandı!');
}

function stopMoving() {
  if (!bot) return log.error('Bot bağlı değil!');
  bot.clearControlStates();
  log.info('Tüm hareketler durduruldu.');
}

function lookAt(yaw, pitch) {
  if (!bot) return log.error('Bot bağlı değil!');
  bot.look(yaw, pitch, true);
  log.info(`Bakış yönü: yaw=${yaw}, pitch=${pitch}`);
}

// Anti-AFK aç/kapa
function toggleAntiAfk() {
  if (config.antiAfk.enabled) {
    config.antiAfk.enabled = false;
    stopAntiAfk();
    log.info('Anti-AFK KAPATILDI');
  } else {
    config.antiAfk.enabled = true;
    startAntiAfk();
    log.info('Anti-AFK AÇILDI');
  }
}

// Chat yardımı
function showChatHelp() {
  console.log(chalk.cyan('\n  ╔═══════════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan('  ║                    KOMUT LİSTESİ                              ║'));
  console.log(chalk.cyan('  ╠═══════════════════════════════════════════════════════════════╣'));
  console.log(chalk.yellow('  ║ MOUSE KONTROLLER:                                             ║'));
  console.log(chalk.white('  ║   !left / !sol      - Sol tık (vur, kol salla)                ║'));
  console.log(chalk.white('  ║   !right / !sag     - Sağ tık (item kullan)                   ║'));
  console.log(chalk.white('  ║   !use              - Eldeki itemi kullan                     ║'));
  console.log(chalk.cyan('  ╠═══════════════════════════════════════════════════════════════╣'));
  console.log(chalk.yellow('  ║ ENTITY KONTROLLER:                                            ║'));
  console.log(chalk.white('  ║   !entities         - Yakındaki NPC/oyuncuları listele        ║'));
  console.log(chalk.white('  ║   !click <id>       - Entity\'ye sağ tıkla (NPC ile konuş)     ║'));
  console.log(chalk.white('  ║   !attack <id>      - Entity\'ye sol tıkla (vur)              ║'));
  console.log(chalk.cyan('  ╠═══════════════════════════════════════════════════════════════╣'));
  console.log(chalk.yellow('  ║ ENVANTER:                                                     ║'));
  console.log(chalk.white('  ║   !slot <0-8>       - Hotbar slotu seç                        ║'));
  console.log(chalk.white('  ║   !inv              - Hotbar\'ı göster                         ║'));
  console.log(chalk.cyan('  ╠═══════════════════════════════════════════════════════════════╣'));
  console.log(chalk.yellow('  ║ HAREKET:                                                      ║'));
  console.log(chalk.white('  ║   !w / !ileri       - İleri git                               ║'));
  console.log(chalk.white('  ║   !s / !geri        - Geri git                                ║'));
  console.log(chalk.white('  ║   !a / !d           - Sol/Sağ git                             ║'));
  console.log(chalk.white('  ║   !jump / !zipla    - Zıpla                                   ║'));
  console.log(chalk.white('  ║   !stop / !dur      - Tüm hareketleri durdur                  ║'));
  console.log(chalk.cyan('  ╠═══════════════════════════════════════════════════════════════╣'));
  console.log(chalk.yellow('  ║ DİĞER:                                                        ║'));
  console.log(chalk.white('  ║   !status           - Bot durumu (sağlık, konum)              ║'));
  console.log(chalk.white('  ║   !afk              - Anti-AFK aç/kapa                        ║'));
  console.log(chalk.white('  ║   !quit             - Botu kapat                              ║'));
  console.log(chalk.cyan('  ╠═══════════════════════════════════════════════════════════════╣'));
  console.log(chalk.gray('  ║ Chat\'e yazmak için direkt yaz (! olmadan)                     ║'));
  console.log(chalk.cyan('  ╚═══════════════════════════════════════════════════════════════╝\n'));
}


// Bot durumu
function showBotStatus() {
  if (bot && bot.entity) {
    console.log(chalk.cyan('\n  ╔════════════════════════════════════╗'));
    console.log(chalk.cyan('  ║          BOT DURUMU                ║'));
    console.log(chalk.cyan('  ╠════════════════════════════════════╣'));
    console.log(chalk.white(`  ║ Sağlık: ${bot.health}/20`.padEnd(37)) + chalk.cyan('║'));
    console.log(chalk.white(`  ║ Açlık: ${bot.food}/20`.padEnd(37)) + chalk.cyan('║'));
    console.log(chalk.white(`  ║ X: ${Math.floor(bot.entity.position.x)}`.padEnd(37)) + chalk.cyan('║'));
    console.log(chalk.white(`  ║ Y: ${Math.floor(bot.entity.position.y)}`.padEnd(37)) + chalk.cyan('║'));
    console.log(chalk.white(`  ║ Z: ${Math.floor(bot.entity.position.z)}`.padEnd(37)) + chalk.cyan('║'));
    console.log(chalk.cyan('  ╚════════════════════════════════════╝\n'));
  } else {
    log.warn('Bot henüz bağlı değil.');
  }
}

// Spawn eventi
function onSpawn() {
  log.success(`${config.player.username} dünyaya spawn oldu!`);
  log.info(`Konum: X:${Math.floor(bot.entity.position.x)} Y:${Math.floor(bot.entity.position.y)} Z:${Math.floor(bot.entity.position.z)}`);

  if (config.antiAfk.enabled) {
    startAntiAfk();
  }
}

// Ölüm eventi
function onDeath() {
  log.warn('Oyuncu öldü! Otomatik respawn...');
  setTimeout(() => {
    if (bot) {
      bot.chat('/respawn');
    }
  }, 1000);
}

// Kick eventi
function onKicked(reason) {
  log.error(`Sunucudan atıldı! Sebep: ${reason}`);
  stopAntiAfk();
}

// Hata eventi
function onError(err) {
  log.error(`Hata: ${err.message}`);
}

// Bağlantı kapandı
function onEnd() {
  log.warn('Sunucu bağlantısı kesildi!');
  stopAntiAfk();

  if (config.autoReconnect.enabled) {
    if (reconnectAttempts < config.autoReconnect.maxAttempts) {
      reconnectAttempts++;
      log.info(`Yeniden bağlanma ${reconnectAttempts}/${config.autoReconnect.maxAttempts} - ${config.autoReconnect.delayMs / 1000}s sonra...`);
      setTimeout(createBot, config.autoReconnect.delayMs);
    } else {
      log.error('Maksimum deneme aşıldı.');
      console.log(chalk.yellow('\n  Menüye dönmek için ENTER\'a basın...'));
      rl.once('line', async () => {
        showBanner();
        await showMainMenu();
      });
    }
  }
}

// Chat eventi
function onChat(username, message) {
  if (username !== bot.username) {
    console.log(chalk.gray(`[CHAT] <${username}> ${message}`));
  }
}

// Mesaj eventi (sistem mesajları)
function onMessage(jsonMsg) {
  const msg = jsonMsg.toString();
  if (msg && !msg.includes(config.player.username)) {
    // Sistem mesajlarını göster
  }
}

// Sağlık eventi
function onHealth() {
  if (bot.health <= 5) {
    log.warn(`Düşük sağlık! HP: ${bot.health}/20`);
  }
}

// Anti-AFK sistemi
function startAntiAfk() {
  log.afk(`Anti-AFK başlatıldı! (${config.antiAfk.intervalMs / 1000}s aralık)`);

  antiAfkInterval = setInterval(() => {
    if (bot && bot.entity) {
      performAntiAfkAction();
    }
  }, config.antiAfk.intervalMs);
}

function stopAntiAfk() {
  if (antiAfkInterval) {
    clearInterval(antiAfkInterval);
    antiAfkInterval = null;
  }
}

function performAntiAfkAction() {
  const actions = ['jump', 'rotate', 'swing', 'sneak'];
  const action = actions[Math.floor(Math.random() * actions.length)];

  switch (action) {
    case 'jump':
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 100);
      log.afk('Zıplama');
      break;
    case 'rotate':
      const yaw = (Math.random() * 2 - 1) * Math.PI;
      bot.look(yaw, 0, false);
      log.afk('Dönme');
      break;
    case 'swing':
      bot.swingArm();
      log.afk('Kol sallama');
      break;
    case 'sneak':
      bot.setControlState('sneak', true);
      setTimeout(() => bot.setControlState('sneak', false), 500);
      log.afk('Eğilme');
      break;
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  log.warn('\nBot kapatılıyor...');
  stopAntiAfk();
  if (bot) bot.quit();
  rl.close();
  process.exit(0);
});

// BAŞLAT
showBanner();
showMainMenu();
