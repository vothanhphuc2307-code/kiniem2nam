# Our Little Forever — bản Cloud Sync ♡

Bản này lưu ảnh/video/nhạc/lời chúc trên Supabase, không lưu riêng trong điện thoại. Người mở cùng link sẽ xem chung một album. Người tải nội dung lên phải đăng nhập tài khoản quản trị.

## 1. Tạo nơi lưu trữ đám mây
1. Tạo một project Supabase tại https://supabase.com/dashboard.
2. Mở **SQL Editor → New query**, dán toàn bộ nội dung file `sql/setup.sql`, rồi nhấn **Run**.
3. Trong **Authentication → Users**, nhấn **Add user → Send invitation**, mời email của chính ông. Mở email mời để hoàn tất tài khoản/đặt mật khẩu; sau đó dùng email và mật khẩu đó đăng nhập vào website. Chỉ người có tài khoản được tạo trong Supabase mới đăng nhập để tải ảnh/video, đổi nhạc hoặc sửa lời chúc.
4. Mở **Project Settings → API** (hoặc API Keys), sao chép **Project URL** và **publishable key**. Có thể dùng legacy `anon` public key nếu project vẫn hiển thị loại key đó.
5. Mở `config.js`, dán 2 giá trị vào `supabaseUrl` và `supabaseAnonKey`.

**Không bao giờ dán `service_role` hoặc secret key vào `config.js` hay bất kỳ file nào trong website.** Publishable/anon key được thiết kế để nằm trong trình duyệt; quyền thực tế được khóa bằng RLS trong file SQL.

## 2. Deploy website
- Đưa toàn bộ thư mục `ky-niem-hai-nam-cloud` lên Vercel dưới dạng static site.
- Không cần build command. Đảm bảo `index.html`, `config.js`, và thư mục `sql` đều được đưa lên cùng project (thư mục `sql` dùng làm hướng dẫn, website không cần tải trực tiếp file này).
- Sau deploy, mở link trên điện thoại, nhấn **Quản trị**, đăng nhập bằng tài khoản đã tạo ở bước 1.
- Chọn **Thêm ảnh/video** và chọn nhiều ảnh/video trong thư viện. Khi upload xong, mở link ở máy khác sẽ thấy cùng album.
- Nhấn **Gửi link** để chia sẻ website cho người thương. Người xem không cần đăng nhập.

## 3. Cách hoạt động và quyền riêng tư
- Album, file ảnh/video/nhạc và lời chúc được lưu trên cloud Supabase.
- Ai có link website đều xem được album. Bucket media là public để trình duyệt xem trực tiếp; không đăng ảnh/video riêng tư hoặc nội dung mà hai người không muốn người khác có thể truy cập nếu link/tệp bị chia sẻ tiếp.
- Chỉ người dùng đăng nhập mới được thêm/xóa file và sửa lời chúc. Mỗi tài khoản chỉ xóa được tệp trong thư mục của chính mình.
- Không chia sẻ email/mật khẩu quản trị cho người xem. Có thể tạo thêm user quản trị trong Supabase nếu hai người muốn cùng tải nội dung lên.
- Nhạc không tự phát khi trang mở vì trình duyệt điện thoại thường chặn autoplay; người xem cần chạm nút phát.

## 4. Giới hạn gói miễn phí
- Script đặt giới hạn tối đa **50 MB mỗi tệp**, phù hợp với giới hạn file của Supabase Free tại thời điểm tạo bản này.
- Dung lượng lưu trữ miễn phí là **1 GB** theo quota Storage hiện tại. Nếu album nhiều video, có thể cần nén video hoặc nâng cấp gói.
- Với video dài/nặng, nên nén xuống dưới 50 MB trước khi upload để tránh lỗi và tiết kiệm dung lượng.

## 5. File nhạc
Nhấn dấu **＋** cạnh trình phát nhạc sau khi đăng nhập và chọn file âm thanh mà ông có quyền sử dụng. Bản website không nhúng sẵn file “Love Story — Indila”; chỉ hiển thị tên gợi ý cho tới khi ông tải tệp nhạc lên.

## 6. Nếu album chưa hiện
- Kiểm tra `config.js` đã chứa đúng Project URL và publishable/anon key.
- Kiểm tra đã chạy hết `sql/setup.sql` trong đúng Supabase project.
- Đảm bảo project Supabase còn hoạt động và browser có mạng.
- Mở Developer Console nếu cần xem lỗi chi tiết.
