
“AES là chuẩn mã hóa đối xứng theo khối (block cipher) rất phổ biến hiện nay. Nó hoạt động trên các khối dữ liệu 128-bit và sử dụng nhiều vòng biến đổi (round) để tạo ra hai tính chất quan trọng: confusion (tính rối) và diffusion (tính khuếch tán). Nhờ đó, mối quan hệ giữa state ban đầu, key và state được mã hoá trở nên cực kỳ phức tạp, giúp bảo mật cao.”

“Trong demo này, mình tập trung vào AES-128.
Mình chỉ hiển thị một block đầu tiên (16 byte) và trình bày chi tiết luồng của một round để dễ theo dõi từng bước biến đổi.

Lưu ý quan trọng:

Phần matrix state ở giữa chỉ dùng để minh họa cơ chế từng bước cho 1 round

Còn output ciphertext bên phải được tính bằng thư viện CryptoJS thực tế (AES-ECB với padding PKCS#7)

3) Các trường input
“Trước tiên, bạn có thể nhập:

Plaintext (hoặc ciphertext nếu decrypt)
AES Key dưới dạng hex 32 ký tự (tương đương 128-bit)
Chọn chế độ Encrypt hoặc Decrypt.

Demo sẽ tự động xử lý và hiển thị kết quả ngay lập tức.”

4) Giải thích các phần chính trên giao diện 

“Ở giữa màn hình là Data Path – hiển thị chuỗi các bước biến đổi của AES.
Với Encrypt, luồng sẽ là:
Input → AddRoundKey (Round 0) → SubBytes → ShiftRows → MixColumns → AddRoundKey (Round 1).
Decrypt thì đi ngược lại với các phép toán nghịch đảo tương ứng.
Bây giờ mình sẽ đi từng bước một trên state hiện tại để các bạn dễ hình dung:”
Từng bước chi tiết (nói chậm, chỉ vào màn hình):

Input / Block Load

“Đầu tiên, hệ thống lấy 16 byte đầu tiên của input (nếu plaintext ngắn hơn sẽ zero-pad), sau đó sắp xếp vào ma trận state 4x4 theo cột.

Công thức: state[r,c] = block[4*c + r].

Đây chính là trạng thái ban đầu trước mọi biến đổi.”

AddRoundKey (Round 0)

“Bước này XOR từng byte của state với byte tương ứng của round key 0.

Kết quả: dữ liệu đã được trộn khóa ngay từ đầu, nhưng chưa có sự khuếch tán giữa các byte.”

SubBytes (Non-linearity)

“Mỗi byte trong state sẽ đi qua bảng S-box (một bảng thay thế cố định).

Công thức: state[r,c] = SBox[state[r,c]].

Đây là bước phi tuyến tính (non-linear), giúp phá vỡ mọi quan hệ tuyến tính đơn giản giữa input và output, tăng tính confusion.”

ShiftRows (Row Offsets)

“Chúng ta xoay vòng trái từng hàng của ma trận:
Hàng 0 giữ nguyên (xoay 0)
Hàng 1 xoay 1 vị trí
Hàng 2 xoay 2 vị trí
Hàng 3 xoay 3 vị trí.
Nhờ đó, các byte được dàn sang các cột khác nhau, chuẩn bị cho bước khuếch tán mạnh tiếp theo.”

MixColumns (Diffusion)

“Bước này trộn lẫn 4 byte trong cùng một cột bằng phép toán đại số trên trường hữu hạn GF(2^8).
Mỗi cột được nhân với một ma trận cố định của AES (hệ số 2, 3, 1, 1).
Kết quả: một byte đầu ra sẽ phụ thuộc vào cả 4 byte đầu vào của cột đó → diffusion rất mạnh.”

AddRoundKey (Round 1)
“Cuối cùng, lại XOR state với round key số 1.

