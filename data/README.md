# Dữ liệu tĩnh của dashboard (index.html tải các file này bằng thẻ <script src>)

Mỗi file định nghĩa 1 hằng số cùng tên (`const T10 = ...`). Dạng nén `__z("...")` = base64(zlib(JSON)).

| File | Nội dung | Tháng |
|---|---|---|
| T9.js, T9CH.js | Sell-out theo SS / theo kênh Off-On | T9 |
| T10.js, T10CH.js | Sell-out theo SS / theo kênh Off-On | T10 |
| T11.js | T11, T11CH, T11_META (tab Tháng 11) | T11 (chưa có dữ liệu) |
| DATA.js, FUNDRAW.js, SO8T.js, SOEXCL.js | MCP/Active/SO/PC theo SS | T7 – T10 |
| MBS78_DATA.js | Hội viên Doanh nhân | T7 – T9 |
| HV10.js | Hội viên Doanh nhân | T10 |
| CATD.js, DDK.js | Ngành hàng; cấp ĐDKD | T9 – T10 |
| ON7.js | Kênh On 7 loại hình | T7 – T10 |
| AP9.js, APQ.js | AP thực hiện 9 tháng; chỉ tiêu AP Quý 4 | – |
| GROWTH.js, G9.js, G9SS.js, G9W.js | Tăng trưởng 10T | – |

Cập nhật dữ liệu mới: ghi lại đúng file tương ứng, rồi đổi số `?v=` trong index.html để trình duyệt tải bản mới.
