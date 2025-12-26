#!/usr/bin/env python3
"""
图片资源管理工具 - Image Asset Management Tool

功能 (Features):
- 格式转换 (Format conversion): PNG ↔ JPG ↔ WebP
- 图片操作 (Image operations): resize, crop
- 批量处理 (Batch processing): 单文件或整个目录
- PNG to SVG 转换 (if possible with vectorization)

依赖 (Dependencies):
pip install Pillow cairosvg potrace

使用示例 (Usage Examples):
    # 单文件转换
    processor = ImageProcessor()
    processor.convert_format("logo.png", "logo.webp")

    # 批量转换目录
    processor.batch_convert_directory("./images", "png", "webp")

    # 调整大小
    processor.resize("banner.jpg", width=1200, height=630)

    # 裁剪
    processor.crop("photo.png", x=100, y=100, width=500, height=500)

    # PNG 转 SVG (矢量化)
    processor.png_to_svg("icon.png", "icon.svg")
"""

import os
import sys
from pathlib import Path
from typing import Optional, Tuple, List
from PIL import Image
import subprocess


class ImageProcessor:
    """图片处理类 - Image Processing Class"""

    # 支持的格式
    SUPPORTED_FORMATS = {"png", "jpg", "jpeg", "webp", "gif", "bmp"}

    def __init__(self, quality: int = 90):
        """
        初始化图片处理器

        Args:
            quality: 输出质量 (1-100)，默认 90
        """
        self.quality = quality

    def _validate_path(self, path: str) -> Path:
        """验证并返回 Path 对象"""
        p = Path(path)
        if not p.exists():
            raise FileNotFoundError(f"文件不存在: {path}")
        return p

    def _get_format(self, path: Path) -> str:
        """获取文件格式"""
        ext = path.suffix.lower().lstrip(".")
        if ext == "jpg":
            ext = "jpeg"
        return ext

    def _validate_format(self, format_str: str):
        """验证格式是否支持"""
        fmt = format_str.lower()
        if fmt not in self.SUPPORTED_FORMATS:
            raise ValueError(f"不支持的格式: {format_str}. 支持: {self.SUPPORTED_FORMATS}")
        return fmt

    # ==================== 格式转换 ====================

    def convert_format(
        self,
        input_path: str,
        output_path: Optional[str] = None,
        target_format: Optional[str] = None
    ) -> str:
        """
        转换图片格式

        Args:
            input_path: 输入文件路径
            output_path: 输出文件路径（可选，默认替换扩展名）
            target_format: 目标格式（可选，从 output_path 推断）

        Returns:
            输出文件路径

        Examples:
            convert_format("logo.png", "logo.webp")
            convert_format("photo.jpg", target_format="png")
        """
        input_p = self._validate_path(input_path)

        # 确定目标格式
        if output_path:
            output_p = Path(output_path)
            fmt = self._get_format(output_p)
        elif target_format:
            fmt = self._validate_format(target_format)
            output_p = input_p.with_suffix(f".{fmt}")
        else:
            raise ValueError("必须提供 output_path 或 target_format")

        # 打开并转换
        with Image.open(input_p) as img:
            # 处理透明度
            if fmt == "jpeg" and img.mode in ("RGBA", "LA", "P"):
                # JPEG 不支持透明度，转换为白色背景
                background = Image.new("RGB", img.size, (255, 255, 255))
                if img.mode == "P":
                    img = img.convert("RGBA")
                background.paste(img, mask=img.split()[-1] if img.mode == "RGBA" else None)
                img = background

            # 保存
            save_kwargs = {"quality": self.quality}
            if fmt == "webp":
                save_kwargs["method"] = 6  # 最佳压缩
            elif fmt == "png":
                save_kwargs["optimize"] = True

            img.save(output_p, format=fmt.upper(), **save_kwargs)

        print(f"✅ 转换完成: {input_p} → {output_p}")
        return str(output_p)

    def batch_convert_directory(
        self,
        directory: str,
        source_format: str,
        target_format: str,
        recursive: bool = False,
        output_dir: Optional[str] = None
    ) -> List[str]:
        """
        批量转换目录中的图片

        Args:
            directory: 源目录
            source_format: 源格式（如 "png"）
            target_format: 目标格式（如 "webp"）
            recursive: 是否递归子目录
            output_dir: 输出目录（默认覆盖原文件）

        Returns:
            转换后的文件路径列表

        Examples:
            batch_convert_directory("./images", "png", "webp")
            batch_convert_directory("./src", "jpg", "webp", recursive=True)
        """
        dir_p = Path(directory)
        if not dir_p.is_dir():
            raise NotADirectoryError(f"不是目录: {directory}")

        src_fmt = self._validate_format(source_format)
        tgt_fmt = self._validate_format(target_format)

        # 查找文件
        pattern = f"**/*.{src_fmt}" if recursive else f"*.{src_fmt}"
        files = list(dir_p.glob(pattern))

        if not files:
            print(f"⚠️  未找到 {src_fmt} 文件")
            return []

        print(f"📁 找到 {len(files)} 个 {src_fmt} 文件")

        # 转换
        output_paths = []
        for file_p in files:
            if output_dir:
                out_p = Path(output_dir) / file_p.with_suffix(f".{tgt_fmt}").name
                out_p.parent.mkdir(parents=True, exist_ok=True)
            else:
                out_p = file_p.with_suffix(f".{tgt_fmt}")

            try:
                result = self.convert_format(str(file_p), str(out_p))
                output_paths.append(result)
            except Exception as e:
                print(f"❌ 转换失败 {file_p}: {e}")

        print(f"✅ 批量转换完成: {len(output_paths)}/{len(files)} 成功")
        return output_paths

    # ==================== 调整大小 ====================

    def resize(
        self,
        input_path: str,
        width: Optional[int] = None,
        height: Optional[int] = None,
        output_path: Optional[str] = None,
        keep_aspect: bool = True
    ) -> str:
        """
        调整图片大小

        Args:
            input_path: 输入文件
            width: 目标宽度
            height: 目标高度
            output_path: 输出文件（默认覆盖）
            keep_aspect: 保持宽高比

        Returns:
            输出文件路径

        Examples:
            resize("banner.jpg", width=1200)  # 保持宽高比
            resize("icon.png", width=64, height=64)  # 固定尺寸
        """
        input_p = self._validate_path(input_path)
        output_p = Path(output_path) if output_path else input_p

        if not width and not height:
            raise ValueError("必须提供 width 或 height")

        with Image.open(input_p) as img:
            orig_w, orig_h = img.size

            # 计算新尺寸
            if keep_aspect:
                if width and not height:
                    height = int(orig_h * (width / orig_w))
                elif height and not width:
                    width = int(orig_w * (height / orig_h))
                else:
                    # 两者都提供，选择较小的缩放比例
                    ratio = min(width / orig_w, height / orig_h)
                    width = int(orig_w * ratio)
                    height = int(orig_h * ratio)
            else:
                width = width or orig_w
                height = height or orig_h

            # 调整大小（使用高质量重采样）
            resized = img.resize((width, height), Image.Resampling.LANCZOS)

            # 保存
            fmt = self._get_format(output_p)
            save_kwargs = {"quality": self.quality}
            if fmt == "png":
                save_kwargs["optimize"] = True

            resized.save(output_p, **save_kwargs)

        print(f"✅ 调整大小完成: {orig_w}x{orig_h} → {width}x{height}")
        return str(output_p)

    # ==================== 裁剪 ====================

    def crop(
        self,
        input_path: str,
        x: int,
        y: int,
        width: int,
        height: int,
        output_path: Optional[str] = None
    ) -> str:
        """
        裁剪图片

        Args:
            input_path: 输入文件
            x: 左上角 x 坐标
            y: 左上角 y 坐标
            width: 裁剪宽度
            height: 裁剪高度
            output_path: 输出文件（默认覆盖）

        Returns:
            输出文件路径

        Examples:
            crop("photo.png", x=100, y=100, width=500, height=500)
        """
        input_p = self._validate_path(input_path)
        output_p = Path(output_path) if output_path else input_p

        with Image.open(input_p) as img:
            # 验证裁剪区域
            if x < 0 or y < 0:
                raise ValueError("坐标不能为负数")
            if x + width > img.width or y + height > img.height:
                raise ValueError(f"裁剪区域超出图片范围 {img.size}")

            # 裁剪
            cropped = img.crop((x, y, x + width, y + height))

            # 保存
            fmt = self._get_format(output_p)
            save_kwargs = {"quality": self.quality}
            if fmt == "png":
                save_kwargs["optimize"] = True

            cropped.save(output_p, **save_kwargs)

        print(f"✅ 裁剪完成: ({x},{y}) {width}x{height}")
        return str(output_p)

    def crop_center(
        self,
        input_path: str,
        width: int,
        height: int,
        output_path: Optional[str] = None
    ) -> str:
        """
        从中心裁剪图片

        Args:
            input_path: 输入文件
            width: 裁剪宽度
            height: 裁剪高度
            output_path: 输出文件

        Returns:
            输出文件路径
        """
        input_p = self._validate_path(input_path)

        with Image.open(input_p) as img:
            img_w, img_h = img.size

            # 计算中心坐标
            x = (img_w - width) // 2
            y = (img_h - height) // 2

            if x < 0 or y < 0:
                raise ValueError(f"裁剪尺寸 {width}x{height} 大于图片尺寸 {img_w}x{img_h}")

            return self.crop(input_path, x, y, width, height, output_path)

    # ==================== PNG to SVG ====================

    def png_to_svg(
        self,
        input_path: str,
        output_path: Optional[str] = None,
        colors: int = 8,
        threshold: int = 128
    ) -> str:
        """
        将 PNG 转换为 SVG（矢量化）

        ⚠️ 注意：此功能需要安装 potrace
        - macOS: brew install potrace
        - Ubuntu: sudo apt-get install potrace
        - Windows: 从 http://potrace.sourceforge.net 下载

        Args:
            input_path: 输入 PNG 文件
            output_path: 输出 SVG 文件
            colors: 颜色数量（用于减少复杂度）
            threshold: 黑白阈值（0-255）

        Returns:
            输出文件路径

        Examples:
            png_to_svg("logo.png", "logo.svg")
        """
        input_p = self._validate_path(input_path)
        output_p = Path(output_path) if output_path else input_p.with_suffix(".svg")

        # 检查 potrace 是否安装
        try:
            subprocess.run(
                ["potrace", "--version"],
                capture_output=True,
                check=True
            )
        except (subprocess.CalledProcessError, FileNotFoundError):
            raise RuntimeError(
                "potrace 未安装。请安装:\n"
                "  macOS: brew install potrace\n"
                "  Ubuntu: sudo apt-get install potrace\n"
                "  Windows: http://potrace.sourceforge.net"
            )

        # 转换为单色 BMP（potrace 需要）
        temp_bmp = input_p.with_suffix(".bmp")
        with Image.open(input_p) as img:
            # 转换为灰度
            gray = img.convert("L")

            # 二值化
            bw = gray.point(lambda x: 255 if x > threshold else 0, mode="1")

            # 保存为 BMP
            bw.save(temp_bmp, "BMP")

        try:
            # 使用 potrace 转换
            subprocess.run(
                [
                    "potrace",
                    str(temp_bmp),
                    "-s",  # SVG 输出
                    "-o", str(output_p),
                ],
                check=True,
                capture_output=True
            )

            print(f"✅ PNG → SVG 转换完成: {output_p}")
            print(f"⚠️  注意: 矢量化适合简单图标，复杂图片可能效果不佳")

        finally:
            # 清理临时文件
            if temp_bmp.exists():
                temp_bmp.unlink()

        return str(output_p)

    # ==================== 批量操作 ====================

    def batch_resize_directory(
        self,
        directory: str,
        width: Optional[int] = None,
        height: Optional[int] = None,
        output_dir: Optional[str] = None,
        extensions: Optional[List[str]] = None
    ) -> List[str]:
        """
        批量调整目录中图片大小

        Args:
            directory: 源目录
            width: 目标宽度
            height: 目标高度
            output_dir: 输出目录（默认覆盖）
            extensions: 文件扩展名列表（默认所有支持格式）

        Returns:
            处理后的文件路径列表
        """
        dir_p = Path(directory)
        if not dir_p.is_dir():
            raise NotADirectoryError(f"不是目录: {directory}")

        # 默认所有支持格式
        exts = extensions or list(self.SUPPORTED_FORMATS)

        # 查找文件
        files = []
        for ext in exts:
            files.extend(dir_p.glob(f"*.{ext}"))

        if not files:
            print(f"⚠️  未找到图片文件")
            return []

        print(f"📁 找到 {len(files)} 个图片文件")

        # 处理
        output_paths = []
        for file_p in files:
            if output_dir:
                out_p = Path(output_dir) / file_p.name
                out_p.parent.mkdir(parents=True, exist_ok=True)
            else:
                out_p = file_p

            try:
                result = self.resize(
                    str(file_p),
                    width=width,
                    height=height,
                    output_path=str(out_p)
                )
                output_paths.append(result)
            except Exception as e:
                print(f"❌ 处理失败 {file_p}: {e}")

        print(f"✅ 批量调整完成: {len(output_paths)}/{len(files)} 成功")
        return output_paths

    # ==================== 工具方法 ====================

    def get_image_info(self, path: str) -> dict:
        """
        获取图片信息

        Returns:
            包含图片信息的字典
        """
        p = self._validate_path(path)

        with Image.open(p) as img:
            return {
                "path": str(p),
                "format": img.format,
                "mode": img.mode,
                "size": img.size,
                "width": img.width,
                "height": img.height,
                "file_size": p.stat().st_size,
                "file_size_mb": round(p.stat().st_size / 1024 / 1024, 2),
            }

    def optimize(self, input_path: str, output_path: Optional[str] = None) -> str:
        """
        优化图片（减小文件大小）

        Args:
            input_path: 输入文件
            output_path: 输出文件（默认覆盖）

        Returns:
            输出文件路径
        """
        input_p = self._validate_path(input_path)
        output_p = Path(output_path) if output_path else input_p

        original_size = input_p.stat().st_size

        with Image.open(input_p) as img:
            fmt = self._get_format(input_p)

            if fmt == "png":
                img.save(output_p, "PNG", optimize=True, quality=self.quality)
            elif fmt in ("jpeg", "jpg"):
                img.save(output_p, "JPEG", optimize=True, quality=self.quality)
            elif fmt == "webp":
                img.save(output_p, "WebP", optimize=True, quality=self.quality, method=6)
            else:
                img.save(output_p, quality=self.quality)

        new_size = output_p.stat().st_size
        reduction = (1 - new_size / original_size) * 100

        print(f"✅ 优化完成: {original_size/1024:.1f}KB → {new_size/1024:.1f}KB (减少 {reduction:.1f}%)")
        return str(output_p)


# ==================== CLI 命令行工具 ====================

def main():
    """命令行入口"""
    import argparse

    parser = argparse.ArgumentParser(
        description="图片资源管理工具 - Image Asset Management Tool",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例 (Examples):
  # 格式转换
  python image_processor.py convert logo.png logo.webp
  python image_processor.py convert-dir ./images png webp

  # 调整大小
  python image_processor.py resize banner.jpg --width 1200
  python image_processor.py resize icon.png --width 64 --height 64

  # 裁剪
  python image_processor.py crop photo.png --x 100 --y 100 --width 500 --height 500

  # PNG to SVG
  python image_processor.py svg icon.png icon.svg

  # 查看信息
  python image_processor.py info logo.png

  # 优化
  python image_processor.py optimize large-image.jpg
        """
    )

    subparsers = parser.add_subparsers(dest="command", help="命令")

    # convert
    p_convert = subparsers.add_parser("convert", help="转换图片格式")
    p_convert.add_argument("input", help="输入文件")
    p_convert.add_argument("output", help="输出文件")
    p_convert.add_argument("--quality", type=int, default=90, help="质量 (1-100)")

    # convert-dir
    p_convert_dir = subparsers.add_parser("convert-dir", help="批量转换目录")
    p_convert_dir.add_argument("directory", help="目录路径")
    p_convert_dir.add_argument("source_format", help="源格式 (png, jpg, webp)")
    p_convert_dir.add_argument("target_format", help="目标格式 (png, jpg, webp)")
    p_convert_dir.add_argument("--recursive", action="store_true", help="递归子目录")
    p_convert_dir.add_argument("--output-dir", help="输出目录")
    p_convert_dir.add_argument("--quality", type=int, default=90, help="质量 (1-100)")

    # resize
    p_resize = subparsers.add_parser("resize", help="调整图片大小")
    p_resize.add_argument("input", help="输入文件")
    p_resize.add_argument("--width", type=int, help="宽度")
    p_resize.add_argument("--height", type=int, help="高度")
    p_resize.add_argument("--output", help="输出文件")
    p_resize.add_argument("--no-aspect", action="store_true", help="不保持宽高比")
    p_resize.add_argument("--quality", type=int, default=90, help="质量 (1-100)")

    # crop
    p_crop = subparsers.add_parser("crop", help="裁剪图片")
    p_crop.add_argument("input", help="输入文件")
    p_crop.add_argument("--x", type=int, required=True, help="左上角 X 坐标")
    p_crop.add_argument("--y", type=int, required=True, help="左上角 Y 坐标")
    p_crop.add_argument("--width", type=int, required=True, help="宽度")
    p_crop.add_argument("--height", type=int, required=True, help="高度")
    p_crop.add_argument("--output", help="输出文件")
    p_crop.add_argument("--quality", type=int, default=90, help="质量 (1-100)")

    # svg
    p_svg = subparsers.add_parser("svg", help="PNG 转 SVG")
    p_svg.add_argument("input", help="输入 PNG 文件")
    p_svg.add_argument("output", help="输出 SVG 文件")
    p_svg.add_argument("--threshold", type=int, default=128, help="黑白阈值 (0-255)")

    # info
    p_info = subparsers.add_parser("info", help="查看图片信息")
    p_info.add_argument("input", help="输入文件")

    # optimize
    p_optimize = subparsers.add_parser("optimize", help="优化图片")
    p_optimize.add_argument("input", help="输入文件")
    p_optimize.add_argument("--output", help="输出文件")
    p_optimize.add_argument("--quality", type=int, default=90, help="质量 (1-100)")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    processor = ImageProcessor(quality=getattr(args, "quality", 90))

    try:
        if args.command == "convert":
            processor.convert_format(args.input, args.output)

        elif args.command == "convert-dir":
            processor.batch_convert_directory(
                args.directory,
                args.source_format,
                args.target_format,
                recursive=args.recursive,
                output_dir=args.output_dir
            )

        elif args.command == "resize":
            processor.resize(
                args.input,
                width=args.width,
                height=args.height,
                output_path=args.output,
                keep_aspect=not args.no_aspect
            )

        elif args.command == "crop":
            processor.crop(
                args.input,
                x=args.x,
                y=args.y,
                width=args.width,
                height=args.height,
                output_path=args.output
            )

        elif args.command == "svg":
            processor.png_to_svg(args.input, args.output)

        elif args.command == "info":
            info = processor.get_image_info(args.input)
            print("\n📊 图片信息:")
            for key, value in info.items():
                print(f"  {key}: {value}")

        elif args.command == "optimize":
            processor.optimize(args.input, args.output)

    except Exception as e:
        print(f"❌ 错误: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
