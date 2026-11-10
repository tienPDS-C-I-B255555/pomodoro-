# Space Focus Pomodoro Application 🚀

Ứng dụng Pomodoro vũ trụ cao cấp với âm thanh tập trung, chuỗi Streak phát sáng, đồng hồ Picture-in-Picture, giao diện đa ngôn ngữ (VI/EN) và quỹ thời gian trong ngày.

---

## 🛠️ CÁCH HOST & CHẠY ỨNG DỤNG

Đây là ứng dụng web tĩnh thuần túy (Static Web App gồm HTML5, CSS3, JavaScript) không cần cài đặt cơ sở dữ liệu server phức tạp. Bạn có thể host dễ dàng theo các cách dưới đây:

### 1. Host trực tiếp trên máy (Localhost)

#### Cách 1.1: Sử dụng Python (Đơn giản nhất)
Mở Terminal / PowerShell tại thư mục này và chạy:
```bash
python -m http.server 8080
```
Sau đó mở trình duyệt truy cập:
👉 **http://localhost:8080**

#### Cách 1.2: Sử dụng VS Code Live Server
1. Cài extension **Live Server** trên VS Code.
2. Nhấp chuột phải vào file `index.html` và chọn **"Open with Live Server"**.

#### Cách 1.3: Sử dụng Node.js (npx serve)
```bash
npx serve . -p 8080
```

#### Cách 1.4: Mở trực tiếp không cần server
Bạn có thể click đúp chuột trực tiếp vào file `index.html` để mở trên bất kỳ trình duyệt nào (Chrome, Edge, Firefox, Brave).

---

### 2. Host miễn phí lên Internet (Online Free Hosting)

#### Cách 2.1: GitHub Pages (Miễn phí vĩnh viễn)
1. Tạo một repository mới trên GitHub (ví dụ: `space-focus`).
2. Tải toàn bộ các file trong thư mục này (`index.html`, `styles.css`, `app.js`, `README.md`) lên nhánh `main`.
3. Vào **Settings** của repository -> mục **Pages**.
4. Tại phần **Build and deployment**, chọn Source là **Deploy from a branch**, Branch: `main`, Folder: `/ (root)`.
5. Bấm **Save**. Sau 1-2 phút bạn sẽ có link web dạng: `https://<ten-user>.github.io/space-focus/`.

#### Cách 2.2: Vercel / Netlify
- **Netlify**: Truy cập [app.netlify.com/drop](https://app.netlify.com/drop), kéo thả cả thư mục này vào ô upload là có ngay link web trong 5 giây.
- **Vercel**: Cài Vercel CLI (`npm i -g vercel`) và gõ lệnh `vercel`, hoặc kết nối qua GitHub repo.
