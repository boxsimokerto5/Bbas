# Panduan Keystore & GitHub Actions Android Build

Dokumen ini berisi informasi kredensial kunci tanda tangan digital (Release Keystore) yang **dikunci secara permanen (validitas 10.000 hari / ~27 tahun)** untuk aplikasi Block Blast Offline.

---

## 1. Informasi Kunci Tanda Tangan (Permanent Release Keystore)

| Parameter | Nilai |
|---|---|
| **Lokasi File** | `android/app/release.keystore` |
| **Keystore Password** | `blockblast123` |
| **Key Alias** | `blockblast` |
| **Key Password** | `blockblast123` |
| **Validitas** | 10.000 hari (hingga tahun 2054+) |
| **Format** | PKCS#12 (Standar industri Android/Google Play) |
| **SHA-256 Fingerprint** | `B2:9B:D7:DE:CD:BD:4F:B9:9D:3F:98:3C:AC:E8:53:B8:C2:0C:62:87:92:5F:D3:EF:09:61:63:7E:F5:EA:04:45` |

> 🔒 **PENTING**: File `release.keystore` ini sudah tersimpan langsung di dalam folder `android/app/release.keystore` dan dikonfigurasi di `android/app/build.gradle`. Kunci ini tidak akan berubah pada setiap build berikutnya, sehingga aplikasi dapat di-update selamanya di perangkat user atau Google Play Store tanpa kendala *"signatures do not match"*.

---

## 2. GitHub Actions Workflow (`.github/workflows/build-android.yml`)

Workflow GitHub Actions sudah dibuat dan siap digunakan:

### Cara Menjalankan Build di GitHub:
1. Push kode ke branch `main` atau `master`.
2. Atau jalankan secara manual:
   - Buka tab **Actions** di repositori GitHub Anda.
   - Pilih workflow **"Build Android APK & AAB"**.
   - Klik tombol **"Run workflow"** lalu pilih branch `main`.
3. Setelah workflow selesai (~3-5 menit):
   - Klik hasil run workflow tersebut.
   - Di bagian bawah halaman (bagian **Artifacts**), Anda dapat langsung mendownload:
     - **`BlockBlast-Release-APK`**: File `app-release.apk` siap instal langsung di HP Android.
     - **`BlockBlast-Release-AAB`**: File `app-release.aab` siap upload ke Google Play Console.

---

## 3. (Opsional) Menggunakan GitHub Repository Secrets

Secara default, workflow sudah membaca langsung `android/app/release.keystore` bawaan repo. Jika Anda ingin menyimpan keystore di GitHub Secrets:

1. Buka repositori di GitHub $\rightarrow$ **Settings** $\rightarrow$ **Secrets and variables** $\rightarrow$ **Actions**.
2. Klik **"New repository secret"**:
   - `ANDROID_KEYSTORE_BASE64`: Isi dengan seluruh teks di file `KEYSTORE_BASE64.txt`
   - `KEYSTORE_PASSWORD`: `blockblast123`
   - `KEY_ALIAS`: `blockblast`
   - `KEY_PASSWORD`: `blockblast123`
