# 图片资源管理工具 - Image Asset Management Tool

Python 脚本工具，用于批量处理和转换网站图片资源。

## 📦 安装依赖

### 快速开始（推荐）

```bash
cd asset_make

# 运行自动设置脚本
bash setup.sh

# 脚本会自动：
# 1. 检查 Python 版本
# 2. 创建虚拟环境
# 3. 安装所有依赖
```

### 方法 1: 使用虚拟环境（手动）

```bash
cd asset_make

# 创建虚拟环境
python3 -m venv venv

# 激活虚拟环境
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 使用完毕后退出虚拟环境
# deactivate
```

### 方法 2: 系统级安装（Ubuntu/Debian）

```bash
# 注意：包名是 python3-pil，不是 python3-pillow
sudo apt update
sudo apt install python3-pil python3-pil.imagetk

# 验证安装
python3 -c "from PIL import Image; print('Pillow installed successfully')"
```

### 方法 3: 使用 --break-system-packages（不推荐）

```bash
# ⚠️ 仅当你知道你在做什么时使用
pip install -r requirements.txt --break-system-packages
```

**推荐使用快速开始脚本或方法 1（虚拟环境）**，这样不会影响系统 Python 环境。

### PNG to SVG 功能额外依赖

PNG 转 SVG 功能需要系统安装 `potrace`：

```bash
# macOS
brew install potrace

# Ubuntu/Debian
sudo apt-get install potrace

# Windows
# 从 http://potrace.sourceforge.net 下载安装
```

---

## 🚀 功能特性

- ✅ **格式转换**: PNG ↔ JPG ↔ WebP 互转
- ✅ **调整大小**: 等比例缩放或固定尺寸
- ✅ **裁剪图片**: 指定区域裁剪或中心裁剪
- ✅ **批量处理**: 单文件或整个目录批量操作
- ✅ **PNG to SVG**: PNG 图标转矢量 SVG
- ✅ **图片优化**: 压缩减小文件大小
- ✅ **查看信息**: 获取图片详细信息

---

## 📖 使用方法

### 1️⃣ 命令行方式（推荐）

#### 格式转换

```bash
# 单文件转换
python image_processor.py convert logo.png logo.webp

# 批量转换目录中的所有 PNG 为 WebP
python image_processor.py convert-dir ./images png webp

# 递归转换子目录
python image_processor.py convert-dir ./src png webp --recursive

# 输出到指定目录
python image_processor.py convert-dir ./images png webp --output-dir ./output
```

#### 调整大小

```bash
# 等比例缩放到宽度 1200
python image_processor.py resize banner.jpg --width 1200

# 等比例缩放到高度 630
python image_processor.py resize banner.jpg --height 630

# 固定尺寸（不保持宽高比）
python image_processor.py resize icon.png --width 64 --height 64 --no-aspect

# 输出到新文件
python image_processor.py resize banner.jpg --width 1200 --output banner-1200.jpg
```

#### 裁剪图片

```bash
# 裁剪指定区域
python image_processor.py crop photo.png --x 100 --y 100 --width 500 --height 500

# 裁剪并保存到新文件
python image_processor.py crop photo.png --x 100 --y 100 --width 500 --height 500 --output cropped.png
```

#### PNG to SVG

```bash
# PNG 图标转 SVG
python image_processor.py svg icon.png icon.svg

# 调整阈值（0-255，默认 128）
python image_processor.py svg icon.png icon.svg --threshold 150
```

#### 查看图片信息

```bash
python image_processor.py info logo.png
```

输出示例:
```
📊 图片信息:
  path: logo.png
  format: PNG
  mode: RGBA
  size: (800, 200)
  width: 800
  height: 200
  file_size: 45678
  file_size_mb: 0.04
```

#### 优化图片

```bash
# 优化压缩图片
python image_processor.py optimize large-image.jpg

# 指定质量（1-100）
python image_processor.py optimize large-image.jpg --quality 85

# 输出到新文件
python image_processor.py optimize large-image.jpg --output optimized.jpg
```

---

### 2️⃣ Python 脚本方式

```python
from image_processor import ImageProcessor

# 创建处理器实例
processor = ImageProcessor(quality=90)

# 格式转换
processor.convert_format("logo.png", "logo.webp")

# 批量转换目录
processor.batch_convert_directory("./images", "png", "webp")

# 调整大小（保持宽高比）
processor.resize("banner.jpg", width=1200)

# 调整大小（固定尺寸）
processor.resize("icon.png", width=64, height=64, keep_aspect=False)

# 裁剪
processor.crop("photo.png", x=100, y=100, width=500, height=500)

# 中心裁剪
processor.crop_center("photo.png", width=500, height=500)

# PNG to SVG
processor.png_to_svg("icon.png", "icon.svg")

# 批量调整目录中所有图片大小
processor.batch_resize_directory("./images", width=800)

# 查看图片信息
info = processor.get_image_info("logo.png")
print(info)

# 优化图片
processor.optimize("large-image.jpg")
```

---

## 🎯 常见使用场景

### 场景 1: 将所有 PNG Logo 转为 WebP

```bash
# 转换 app/src/client/static/ 目录下的所有 PNG
python image_processor.py convert-dir ../app/src/client/static png webp

# 递归转换所有子目录
python image_processor.py convert-dir ../app/src/client/static png webp --recursive
```

### 场景 2: 统一调整所有 Banner 尺寸为 1200x630

```python
from image_processor import ImageProcessor

processor = ImageProcessor(quality=90)

# 批量调整
banners = ["banner1.jpg", "banner2.png", "banner3.webp"]
for banner in banners:
    processor.resize(banner, width=1200, height=630, keep_aspect=False)
```

### 场景 3: 优化所有图片减小体积

```bash
# 优化单个文件
python image_processor.py optimize public-banner.webp --quality 85

# 批量优化（使用脚本）
for file in ../app/public/*.{png,jpg,webp}; do
    python image_processor.py optimize "$file"
done
```

### 场景 4: 创建多尺寸 Favicon

```python
from image_processor import ImageProcessor

processor = ImageProcessor(quality=100)

# 从原始 Logo 生成多尺寸
sizes = [16, 32, 48, 64, 128, 256]
for size in sizes:
    processor.resize(
        "logo-original.png",
        width=size,
        height=size,
        output_path=f"icon-{size}.png",
        keep_aspect=False
    )
```

### 场景 5: PNG 图标转 SVG

```bash
# 适合简单的单色图标
python image_processor.py svg icon.png icon.svg

# 注意：复杂图片可能效果不佳，建议手动设计 SVG
```

---

## ⚙️ API 参考

### `ImageProcessor` 类

#### 初始化

```python
processor = ImageProcessor(quality=90)
```

**参数**:
- `quality` (int): 输出图片质量，1-100，默认 90

#### 方法

##### `convert_format()`

转换图片格式

```python
convert_format(
    input_path: str,
    output_path: Optional[str] = None,
    target_format: Optional[str] = None
) -> str
```

##### `batch_convert_directory()`

批量转换目录

```python
batch_convert_directory(
    directory: str,
    source_format: str,
    target_format: str,
    recursive: bool = False,
    output_dir: Optional[str] = None
) -> List[str]
```

##### `resize()`

调整图片大小

```python
resize(
    input_path: str,
    width: Optional[int] = None,
    height: Optional[int] = None,
    output_path: Optional[str] = None,
    keep_aspect: bool = True
) -> str
```

##### `crop()`

裁剪图片

```python
crop(
    input_path: str,
    x: int,
    y: int,
    width: int,
    height: int,
    output_path: Optional[str] = None
) -> str
```

##### `crop_center()`

中心裁剪

```python
crop_center(
    input_path: str,
    width: int,
    height: int,
    output_path: Optional[str] = None
) -> str
```

##### `png_to_svg()`

PNG 转 SVG（需要 potrace）

```python
png_to_svg(
    input_path: str,
    output_path: Optional[str] = None,
    colors: int = 8,
    threshold: int = 128
) -> str
```

##### `batch_resize_directory()`

批量调整目录中图片大小

```python
batch_resize_directory(
    directory: str,
    width: Optional[int] = None,
    height: Optional[int] = None,
    output_dir: Optional[str] = None,
    extensions: Optional[List[str]] = None
) -> List[str]
```

##### `get_image_info()`

获取图片信息

```python
get_image_info(path: str) -> dict
```

##### `optimize()`

优化图片

```python
optimize(
    input_path: str,
    output_path: Optional[str] = None
) -> str
```

---

## 📝 支持的格式

- ✅ PNG
- ✅ JPG/JPEG
- ✅ WebP
- ✅ GIF
- ✅ BMP

---

## ⚠️ 注意事项

### 1. JPEG 透明度

JPEG 格式不支持透明度，转换时会自动添加白色背景：

```python
# PNG (透明背景) → JPEG (白色背景)
processor.convert_format("logo.png", "logo.jpg")
```

### 2. PNG to SVG 限制

PNG 转 SVG 使用矢量化技术，适合：
- ✅ 简单的单色或双色图标
- ✅ 清晰的边界和形状
- ❌ 复杂的照片或渐变图片

**推荐做法**：
- 简单图标 → 使用 `png_to_svg()`
- 复杂 Logo → 使用设计软件（Figma/Illustrator）手动创建 SVG

### 3. 质量 vs 文件大小

| 质量 | 用途 | 文件大小 |
|------|------|---------|
| 100 | 原始保存，无损 | 最大 |
| 90 | 网站图片（推荐） | 中等 |
| 80 | 缩略图 | 较小 |
| 60 | 预览图 | 最小 |

### 4. 批量操作建议

批量操作前建议：
1. 先在少量文件上测试
2. 备份原始文件
3. 检查输出结果

---

## 🐛 故障排除

### 问题 1: `ModuleNotFoundError: No module named 'PIL'`

**解决**:
```bash
pip install Pillow
```

### 问题 2: `potrace: command not found`

**解决**:
```bash
# macOS
brew install potrace

# Ubuntu
sudo apt-get install potrace
```

### 问题 3: `Permission denied`

**解决**:
```bash
# 添加执行权限
chmod +x image_processor.py
```

---

## 📚 相关文档

- [BRAND_ASSETS_GUIDE.md](../docs/BRAND_ASSETS_GUIDE.md) - 品牌资源管理指南
- [Pillow 文档](https://pillow.readthedocs.io/)
- [Potrace 官网](http://potrace.sourceforge.net/)

---

## 🎉 总结

这个工具提供了完整的图片处理能力：

1. ✅ **格式转换** - 支持主流格式互转
2. ✅ **批量处理** - 高效处理大量文件
3. ✅ **灵活操作** - resize、crop、optimize
4. ✅ **命令行 + API** - 两种使用方式
5. ✅ **PNG to SVG** - 图标矢量化

配合 `app/src/shared/assets.ts` 集中管理资源路径，可以快速替换和优化网站所有图片资源！
