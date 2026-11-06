# Ramada Niğde Instagram fotoğraf arşivi

Bu iş akışı yalnızca `@ramadabywyndhamnigde` hesabının **herkese açık** gönderilerini, Instaloader kullanarak, giriş yapmadan incelemeyi dener.

## Çalıştırma

1. Deponun **Actions** sekmesine girin.
2. **Instagram photo gallery - Ramada Nigde** iş akışını açın.
3. **Run workflow** düğmesine basın (varsayılan: son 12 gönderi).
4. İş tamamlanınca açılan çalışmanın **Artifacts** bölümündeki `ramada-nigde-instagram-gallery` arşivini indirin.
5. ZIP içindeki `manifest.json` dosyası gönderilerin bağlantılarını, indirilen görselleri ve olası erişim hatasını listeler.

İş akışı dosyası ilk kez eklendiğinde, `push` tetikleyicisi de otomatik çalıştırmayı dener. Başarılı bir çalışmada fotoğraflar ZIP olarak saklanır; fotoğraflar Git deposuna commit edilmez. Artifact saklama süresi üç gündür.

**Sınırlar:** Instagram oturum açılmasını zorunlu kılabilir, hız sınırı uygulayabilir veya GitHub sunucularından yapılan istekleri engelleyebilir. Bu durumda `manifest.json` ve Actions günlüklerindeki hata mesajını kontrol edin. Bu araç engelleri aşmaz; özel profillere erişmez. Yalnızca fotoğraflar hedeflenir; video içerikleri atlanır. Görselleri web sitelerinde tekrar yayımlamadan önce gerekli kullanım izinlerini alın.

Kod: `scripts/download_instagram_gallery.py` ve `.github/workflows/instagram-gallery.yml`.
