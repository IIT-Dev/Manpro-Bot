# Manpro-Bot

Bot LINE untuk notify Manpro ketika ada project baru.

ID: [@489wuzql](https://line.me/R/ti/p/%40489wuzql)

## Commands

`/mb subscribe`: Subscribe notifikasi dari bot

`/mb unsubscribe`: Unsubscribe notifikasi dari bot

## Development Notes

Tata cara untuk memperbarui webhook:

1. Gunakan layanan sesuai pilihan (dapat menggunakan [DigitalOcean](https://www.digitalocean.com/) (berbayar), [Render](https://render.com/) (gratis), [Fly.io](https://fly.io) (gratis), atau layanan lain)

2. Pasang environment variables sesuai pada `.env.example`, namun ganti LINE_CHANNEL_SECRET dan LINE_CHANNEL_ACCESS_TOKEN sesuai akun Manpro Bot di [Line Developers Console](https://developers.line.biz/)

	![Channel Secret](/docs/1686195464069.jpg)

	![Access Token](/docs/1686195499594.jpg)

3. Saat deployment sukses, pasang URL hasil deployment pada Webhook URL di Line Developers Console dengan menambah `/api/client/line` di belakangnya, lakukan Verify.

	![](/docs/Screenshot%202023-06-08%20103701.png)

4. Pasang juga URL tersebut di repository website Inkubator IT dengan menambah `/api/project_request` di belakangnya sesuai [commit ini](https://github.com/IIT-Dev/InkubatorIT-Frontend-2019/commit/adb0521ed57d007849360ff3ff1c46f94f3e31f0#diff-b0cb0fcdee3f998ace60e06795f20dbd09fef3031693148977ece2ba7d89ec7f).