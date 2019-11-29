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

## Sơ đồ

![Design](./img/anh.jpg  "Sơ đồ")



## Thực hiện

+ Sử dụng microservice để các service ít ảnh hưởng đến nhau và ít phải chỉnh sửa

+ Ở các microservice dùng redis để lưu cache

+ Có 3 microservice userservice, post service, category service


Thiết kế table

**User**
***

|field| descripton|
|--|--|
|_id| Id User|
|username|tên đăng nhập|
|name|tên user|
|isAdmin|Có phải là tổng biên tập không|
|password|Mật khẩu user|
|createTime| Thời gian tạo bản ghi|

Ví dụ (json):

	{
	    "_id" : ObjectId("5ddce267ea485f1ed7bc2f37"),
	    "username" : "haohao4",
	    "name" : "Hoàng Trần Hảo ",
	    "isAdmin" : false,
	    "password" : "12345678",
	    "createTime" : ISODate("2019-11-26T08:29:24.738+0000")
	}

**Category**
***

|field| description|
|--|--|
|_id| Id Category|
|name|Tên của thể loại (unique)
|displayName| Tên sẽ được hiển thị cho user|
|createBy| Người tạo, tham chiếu đến bảng user|
|description|Chú thích|
|createTime|Thời gian tạo|


Ví dụ (json):

	{
	    "_id" : ObjectId("5ddddab59843d511f40cad0d"),
	    "name" : "xahoi",
	    "displayName" : "Xã hội",
	    "createBy" : "5ddce267ea485f1ed7bc2f37",
	    "description" : "",
	    "createTime" : ISODate("2019-11-27T02:08:23.549+0000")
	}

**Post**
***
|field| description|
|--|--|
|_id| Id Post|
|name|Tên bài post|
|categories|Danh sách thể loại của bài post|
|title| Tiêu đề|
|content| Nội dung|
|owner| Người tạo, tham chiếu đến bảng user|
|description|Chú thích|
|createTime|Thời gian tạo|


Ví dụ (json):

	{
	    "_id" : ObjectId("5ddddd62bdc5a0144c9d7119"),
	    "name" : "chinhtri",
	    "content" : "Tin chinh tri",
	    "categories" : [
		ObjectId("5ddddab99843d511f40cad0e")
	    ],
	    "title":"Test",
	    "owner" : ObjectId("5ddce267ea485f1ed7bc2f37"),
	    "description" : "",
	    "createTime" : ISODate("2019-11-27T02:19:26.696+0000")
	}





