@echo off
echo 正在启动MinIO服务...
echo 默认访问地址: http://localhost:9000
echo 默认用户名: minioadmin
echo 默认密码: minioadmin

REM 创建数据目录
if not exist "minio-data" mkdir "minio-data"

REM 启动MinIO服务器
minio server minio-data --console-address ":9001"

pause