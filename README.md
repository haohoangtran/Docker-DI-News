## Hệ thống tin tức và category

**Bài toán**

Thiết kế hệ thống tin tức
***

**Yêu cầu:**

*Yêu cầu người dùng:*

+ Có thể xem bài viết theo thể loại ( chính trị, xã hội, kinh tế, ...)
+ Có thể xem bài viết theo tác giả
+ Có thể xem các tin mới trong ngày (tất cả, theo thể loại,...)

*Yêu cầu biên tập viên:*

+ Có các quyền như guest
+ Có thể thêm bài viết, chỉnh sửa, xoá bài viết của mình

*Yêu cầu của tổng biên tập:*

+ Có quyền của biên tập viên
+ Có thể thêm, sửa, xoá category

*Yêu cầu hệ thống:*

+ Có thể mở rộng theo chiều ngang khi user tăng nhiều

*Phân tích yêu cầu*

- Người dùng (guest) có thể xem tất cả các bài viết, catagory, nhưng không thể chỉnh sửa
- User ( Biên tập viên ) có thể xem bài viết của mình và biên tập khác nhưng chỉ có thể sửa, xoá bài viết của mình.
- Category chỉ được tạo bởi admin
- Một bài viết có thể không thuộc thể loại nào

## Thực hiện

+ Sử dụng microservice để các service ít ảnh hưởng đến nhau và ít phải chỉnh sửa

+ Ở các microservice dùng redis để lưu cache 

## Sơ đồ 
