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


**Rủi ro hệ thống**

- Hệ thống này tin tưởng client, có thể xảy ra các trường hợp idcategory, idpost, idUser không tồn tại khi insert
- Để giải quyết được điều này cần đồng bộ dữ liệu giữa các microservice ( bài toàn khác )

## Thực hiện

+ Sử dụng microservice để các service ít ảnh hưởng đến nhau và ít phải chỉnh sửa

+ Ở các microservice có thể dùng redis để lưu cache 

+ Có 3 microservice userservice, post service, category service


Thiết kế table

**User**
***

|field| descripton|
|--|--|
|_id| Id User|
|username|tên đăng nhập|
|name|tên user|
|isAdmin|Có phải là admin không|
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


## Chạy với docker 

*.env*

![docker](./img/env.png  "docker")


*chạy user-service*

![docker](./img/user.png  "docker")

*chạy post-service*

![docker](./img/post.png  "docker")

*chạy category-service*

![docker](./img/category.png  "docker")

*chạy api-gateway*

![docker](./img/api.png  "docker")

|   Trong đó label apiRouter dùng để định danh service trong api-gateway


**kết quả**

![docker](./img/kq.png  "docker")

**Log api-gateway**

![docker](./img/logapi.png  "docker")



##Implementation

**Header**

|name|description|
|--|--|
| token | Token trả về từ api login |

***

**UserAPI**



1.Đăng ký:

|name|value|description|
|--|--|--|
|method| POST||
|host|127.0.0.1:3000|Base URL|
|route|/api/v1/user/register|địa chỉ route|
|Content-Type|*application/json* hoặc *x-www-form-urlencoded*| Header request|

*Body*

|name|description|
|--|--|
|name| Tên user||
|username|Tên đăng nhập|
|password|Mật khẩu|
|repeatPassword| Nhập lại mật khẩu|
|isAdmin| có phải admin không|

*Ví dụ*

	POST /api/v1/user/register HTTP/1.1
	Host: localhost:3000
	Content-Type: application/json
	
	username=haohao4&name=Ho%C3%A0ng+Tr%E1%BA%A7n+H%E1%BA%A3o+&isAdmin=false&password=12345678&repeatPassword=12345678
	
2.Đăng nhập

|name|value|description|
|--|--|--|
|method| POST||
|host|127.0.0.1:3000|Base URL|
|route| /api/v1/user/login|địa chỉ route|
|Content-Type|*application/json* hoặc *x-www-form-urlencoded*| Header request|

*Body*

|name|description|
|--|--|
|username|Tên đăng nhập|
|password|Mật khẩu|

*Ví dụ*

	POST /api/v1/user/login HTTP/1.1
	Host: localhost:3000
	Content-Type: application/json
	Cache-Control: no-cache

	username=haohao4&password=12345678`

**CategoryAPI**

1.Thêm mới

|name|value|description|
|--|--|--|
|method| POST||
|host|127.0.0.1:3000|Base URL|
|route| /api/v1/category/add|địa chỉ route|
|Content-Type|*application/json* hoặc *x-www-form-urlencoded*| Header request|
|token|****|Token của user, thêm vào header|

*Body*

|name|description|
|--|--|
|name|Tên thể loại (định danh)|
|displayName|Tên hiển thị (Có thể multi language)|

*Ví dụ*


	POST /api/v1/category/add HTTP/1.1
	Host: localhost:3000
	token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSG_DoG5nIFRy4bqnbiBI4bqjbyAiLCJ1c2VybmFtZSI6Imhhb2hhbzQiLCJjcmVhdGVUaW1lIjoiMjAxOS0xMS0yNlQwODoyOToyNC43MzhaIiwiX2lkIjoiNWRkY2UyNjdlYTQ4NWYxZWQ3YmMyZjM3IiwiaWF0IjoxNTc0ODE5MTA3LCJleHAiOjE1NzQ5MDU1MDd9.Au5CwlTIqR2AQfLZLMcw_3Bp8Eyvz59pWpOOuqR54W8
	Content-Type: application/x-www-form-urlencoded
	Cache-Control: no-cache

	name=xahoi&displayName=X%C3%A3+h%E1%BB%99i
	
	
2.Lấy category theo ID

|name|value|description|
|--|--|--|
|method| GET||
|host|127.0.0.1:3000|Base URL|
|route|/api/v1/category/:id|địa chỉ route|
|Content-Type|*application/json* hoặc *x-www-form-urlencoded*| Header request|

*Ví dụ*

``5dddd85bd71b400ef0d1ab4a là id catagory``


	GET /api/v1/category/5dddd85bd71b400ef0d1ab4a HTTP/1.1
	Host: localhost:3000
	Content-Type: application/x-www-form-urlencoded
	Cache-Control: no-cache

	

	
3.Xoá category 

|name|value|description|
|--|--|--|
|method| DELETE||
|host|127.0.0.1:3000|Base URL|
|route|/api/v1/category/:id|địa chỉ route|
|Content-Type|*application/json* hoặc *x-www-form-urlencoded*| Header request|
|token|****|Token của user, thêm vào header|

*Ví dụ*

``5ddddab59843d511f40cad0d là id category``

	DELETE /api/v1/category/5ddddab59843d511f40cad0d HTTP/1.1
	Host: localhost:3000
	token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSG_DoG5nIFRy4bqnbiBI4bqjbyAiLCJ1c2VybmFtZSI6Imhhb2hhbzQiLCJjcmVhdGVUaW1lIjoiMjAxOS0xMS0yNlQwODoyOToyNC43MzhaIiwiX2lkIjoiNWRkY2UyNjdlYTQ4NWYxZWQ3YmMyZjM3IiwiaWF0IjoxNTc0ODE5MTA3LCJleHAiOjE1NzQ5MDU1MDd9.Au5CwlTIqR2AQfLZLMcw_3Bp8Eyvz59pWpOOuqR54W8
	Content-Type: application/x-www-form-urlencoded
	Cache-Control: no-cache

**PostAPI**


	
1.Thêm mới

|name|value|description|
|--|--|--|
|method| POST||
|host|127.0.0.1:3000|Base URL|
|route| /api/v1/post/add|địa chỉ route|
|Content-Type|*application/json* hoặc *x-www-form-urlencoded*| Header request|
|token|****|Token của user, thêm vào header|

*Body*

|name|description|
|--|--|
|name|Tên bài viết (định danh)|
|content|Nội dung bài viết|
|categories|Mảng các thể loại của bài viết|
|title|Tiêu đề của bài viết|

*Ví dụ*



	POST /api/v1/post/add HTTP/1.1
	Host: localhost:3000
	token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSG_DoG5nIFRy4bqnbiBI4bqjbyAiLCJ1c2VybmFtZSI6Imhhb2hhbzQiLCJjcmVhdGVUaW1lIjoiMjAxOS0xMS0yNlQwODoyOToyNC43MzhaIiwiX2lkIjoiNWRkY2UyNjdlYTQ4NWYxZWQ3YmMyZjM3IiwiaWF0IjoxNTc0ODE5MTA3LCJleHAiOjE1NzQ5MDU1MDd9.Au5CwlTIqR2AQfLZLMcw_3Bp8Eyvz59pWpOOuqR54W8
	Content-Type: application/x-www-form-urlencoded
	Cache-Control: no-cache

	name=xahoi&content=Tin+xa+hoi&categories=5ddddab59843d511f40cad0d&title=tin+xa+hoi+moi 

2.Lấy Post theo id

|name|value|description|
|--|--|--|
|method| GET||
|host|127.0.0.1:3000|Base URL|
|route|/api/v1/post/:id|địa chỉ route|
|Content-Type|*application/json* hoặc *x-www-form-urlencoded*| Header request|

*Ví dụ*

``5ddddbaa52b22212ed4c0896 là id post``

	GET /api/v1/post/5ddddbaa52b22212ed4c0896 HTTP/1.1
	Host: localhost:3000
	Content-Type: application/x-www-form-urlencoded
	Cache-Control: no-cache

3.Lấy post theo IDUser

|name|value|description|
|--|--|--|
|method| GET||
|host|127.0.0.1:3000|Base URL|
|route|/api/v1/post/getByUser/:id|địa chỉ route|
|Content-Type|*application/json* hoặc *x-www-form-urlencoded*| Header request|

*Ví dụ*

``5ddce267ea485f1ed7bc2f37 là id user``

	GET /api/v1/post/getByUser/5ddce267ea485f1ed7bc2f37 HTTP/1.1
	Host: localhost:3000
	Content-Type: application/x-www-form-urlencoded
	Cache-Control: no-cache

4.Xoá post theo id

|name|value|description|
|--|--|--|
|method| DELETE||
|host|127.0.0.1:3000|Base URL|
|route|/api/v1/post/:id|địa chỉ route|
|Content-Type|*application/json* hoặc *x-www-form-urlencoded*| Header request|
|token|****|Token của user, thêm vào header|

*Ví dụ*

``5ddddbaa52b22212ed4c0896 là id post``

	DELETE /api/v1/post/5ddddbaa52b22212ed4c0896 HTTP/1.1
	Host: localhost:3000
	token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSG_DoG5nIFRy4bqnbiBI4bqjbyAiLCJ1c2VybmFtZSI6Imhhb2hhbzQiLCJjcmVhdGVUaW1lIjoiMjAxOS0xMS0yNlQwODoyOToyNC43MzhaIiwiX2lkIjoiNWRkY2UyNjdlYTQ4NWYxZWQ3YmMyZjM3IiwiaWF0IjoxNTc0ODE5MTA3LCJleHAiOjE1NzQ5MDU1MDd9.Au5CwlTIqR2AQfLZLMcw_3Bp8Eyvz59pWpOOuqR54W8
	Content-Type: application/x-www-form-urlencoded
	Cache-Control: no-cache

5.Lấy post  theo ID Category

|name|value|description|
|--|--|--|
|method| GET||
|host|127.0.0.1:3000|Base URL|
|route|/api/v1/post/getByCategory/:id|địa chỉ route|
|Content-Type|*application/json* hoặc *x-www-form-urlencoded*| Header request|

``5ddddab99843d511f40cad0e là id category``


	GET /api/v1/post/getByCategory/5ddddab99843d511f40cad0e HTTP/1.1
	Host: localhost:3000
	Content-Type: application/x-www-form-urlencoded
	Cache-Control: no-cache
## Mở rộng

Bài toán đã được chia thành các microservice không phụ thuộc lẫn nhau (DB, env, OS, ...), dễ dàng cho việc mở rộng thêm tính năng








