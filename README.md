# 🎮 Minecraft AFK Bot

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v16+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Minecraft](https://img.shields.io/badge/Minecraft-1.21.x-62B47A?style=for-the-badge&logo=minecraft&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS-lightgrey?style=for-the-badge)

**Minecraft Java Edition için güçlü, interaktif ve kullanımı kolay AFK bot.**

*Cracked/Offline mod desteği ile premium hesap gerektirmez!*

[Kurulum](#-kurulum) •
[Kullanım](#-kullanım) •
[Komutlar](#-komutlar) •
[Özellikler](#-özellikler) •
[Lisans](#-lisans)

</div>

---

## ✨ Özellikler

| Özellik | Açıklama |
|---------|----------|
| 🔓 **Cracked/Offline Mod** | Premium Minecraft hesabı gerektirmez |
| 🛡️ **Anti-AFK Sistemi** | Otomatik zıplama, dönme ve kol sallama ile kick önleme |
| 🔄 **Auto-Reconnect** | Sunucudan atılınca otomatik yeniden bağlanma |
| 🎨 **Renkli CLI Arayüzü** | Kolay anlaşılır, profesyonel konsol tasarımı |
| 💬 **Chat Entegrasyonu** | Sunucu chatini görüntüleme ve mesaj gönderme |
| 🎯 **Entity Etkileşimi** | NPC'lere tıklama, varlıkları listeleme |
| 🖱️ **Mouse Kontrolleri** | Sol/sağ tık simülasyonu |
| 🎒 **Envanter Yönetimi** | Hotbar slotu seçme, envanter görüntüleme |
| 🚶 **Hareket Kontrolleri** | İleri, geri, sola, sağa hareket ve zıplama |
| 📦 **GUI/Menü Desteği** | Sunucu menülerini görüntüleme ve tıklama |

---

## 📋 Gereksinimler

- **Node.js** v16.0.0 veya üzeri
- **npm** (Node.js ile birlikte gelir)

---

## 🚀 Kurulum

### 1. Repoyu Klonlayın

```bash
git clone https://github.com/dogukanc35/mineafk.git
cd mineafk
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Botu Başlatın

```bash
npm start
```

veya

```bash
node bot.js
```

---

## 💻 Kullanım

Bot başlatıldığında interaktif bir menü karşınıza çıkacak:

```
  ┌─────────────────────────────────────┐
  │         ANA MENÜ                    │
  ├─────────────────────────────────────┤
  │  [1] Sunucuya Bağlan              │
  │  [2] Ayarları Göster              │
  │  [3] Ayarları Değiştir            │
  │  [4] Hakkında                     │
  │  [5] Çıkış                        │
  └─────────────────────────────────────┘
```

### Bağlantı Adımları

1. Ana menüden `1` seçeneğini seçin
2. Sunucu IP adresini girin (örn: `play.example.com`)
3. Port numarasını girin (varsayılan: `25565`)
4. Minecraft versiyonunu girin (varsayılan: `1.21.1`)
5. Kullanıcı adınızı girin
6. Anti-AFK ve Auto-Reconnect ayarlarını yapılandırın

---

## ⌨️ Komutlar

Bot bağlandıktan sonra, komutlar `!` ile başlar. Diğer her şey doğrudan sunucu chatine gönderilir.

### 🖱️ Mouse Kontrolleri

| Komut | Açıklama |
|-------|----------|
| `!left` / `!sol` | Sol tık (vur, kol salla) |
| `!right` / `!sag` | Sağ tık (item kullan) |
| `!use` | Eldeki itemi kullan |

### 👾 Entity Kontrolleri

| Komut | Açıklama |
|-------|----------|
| `!entities` | Yakındaki NPC/oyuncuları listele |
| `!click <id>` | Entity'ye sağ tıkla (NPC ile konuş) |
| `!attack <id>` | Entity'ye sol tıkla (vur) |

### 🎒 Envanter

| Komut | Açıklama |
|-------|----------|
| `!slot <0-8>` | Hotbar slotu seç |
| `!inv` | Hotbar'ı göster |

### 🚶 Hareket

| Komut | Açıklama |
|-------|----------|
| `!w` / `!ileri` | İleri git |
| `!s` / `!geri` | Geri git |
| `!a` | Sola git |
| `!d` | Sağa git |
| `!jump` / `!zipla` | Zıpla |
| `!stop` / `!dur` | Tüm hareketleri durdur |
| `!look <yaw> <pitch>` | Bakış yönünü ayarla |

### 📦 GUI/Menü Kontrolleri

| Komut | Açıklama |
|-------|----------|
| `!menu` / `!gui` | Açık pencereyi göster |
| `!wclick <slot>` | Penceredeki slota tıkla |
| `!wfind <isim>` | İsme göre item bul ve tıkla |
| `!wclose` | Pencereyi kapat |

### ⚙️ Diğer

| Komut | Açıklama |
|-------|----------|
| `!status` | Bot durumunu göster (sağlık, konum) |
| `!afk` | Anti-AFK aç/kapa |
| `!say <mesaj>` | Sunucu chatine mesaj gönder |
| `!help` | Tüm komutları listele |
| `!quit` | Botu kapat |

---

## ⚙️ Ayarlar (config.json)

`config.json` dosyası ile varsayılan ayarları özelleştirebilirsiniz:

```json
{
  "server": {
    "host": "play.example.com",
    "port": 25565,
    "version": "1.21.1"
  },
  "player": {
    "username": "BotKullanici"
  },
  "antiAfk": {
    "enabled": true,
    "intervalMs": 30000
  },
  "autoReconnect": {
    "enabled": true,
    "delayMs": 5000,
    "maxAttempts": 10
  }
}
```

### Ayar Açıklamaları

| Ayar | Tip | Açıklama |
|------|-----|----------|
| `server.host` | string | Minecraft sunucu adresi |
| `server.port` | number | Sunucu portu (varsayılan: 25565) |
| `server.version` | string | Minecraft versiyonu |
| `player.username` | string | Bot kullanıcı adı |
| `antiAfk.enabled` | boolean | Anti-AFK sistemi aktif mi |
| `antiAfk.intervalMs` | number | Anti-AFK hareket aralığı (ms) |
| `autoReconnect.enabled` | boolean | Otomatik yeniden bağlanma aktif mi |
| `autoReconnect.delayMs` | number | Yeniden bağlanma gecikmesi (ms) |
| `autoReconnect.maxAttempts` | number | Maksimum yeniden deneme sayısı |

---

## 🔧 Desteklenen Minecraft Versiyonları

- Minecraft Java Edition 1.8.x - 1.21.x
- Varsayılan olarak 1.21.1 için optimize edilmiştir

---

## 📦 Bağımlılıklar

- [mineflayer](https://github.com/PrismarineJS/mineflayer) - Minecraft bot framework
- [chalk](https://github.com/chalk/chalk) - Terminal renklendirme

---

## ⚠️ Sorumluluk Reddi

Bu bot **sadece eğitim amaçlıdır**. Kullanımdan doğabilecek herhangi bir yasaklama veya ceza için sorumluluk kabul edilmez. Sunucu kurallarına uygun şekilde kullanınız.

---

## 🤝 Katkıda Bulunma

Katkılarınızı memnuniyetle karşılıyoruz! Pull request göndermeden önce lütfen:

1. Fork'layın
2. Feature branch oluşturun (`git checkout -b feature/YeniOzellik`)
3. Commit'leyin (`git commit -m 'Yeni özellik eklendi'`)
4. Push'layın (`git push origin feature/YeniOzellik`)
5. Pull Request açın

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

---

## 👤 Geliştirici

**Doğukan Gökçeoğlu**

- GitHub: [@Dogukanc35](https://github.com/Dogukanc35)

---

<div align="center">

⭐ Bu proje işinize yaradıysa yıldız vermeyi unutmayın!

</div>

