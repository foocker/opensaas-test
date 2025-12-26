#!/bin/bash
# 图片资源管理工具 - 快速设置脚本

set -e

echo "🚀 图片资源管理工具 - 设置向导"
echo ""

# 检查 Python 版本
if ! command -v python3 &> /dev/null; then
    echo "❌ 未找到 python3，请先安装 Python 3"
    exit 1
fi

PYTHON_VERSION=$(python3 --version | awk '{print $2}')
echo "✅ Python 版本: $PYTHON_VERSION"

# 检查是否已经在虚拟环境中
if [[ "$VIRTUAL_ENV" != "" ]]; then
    echo "✅ 已在虚拟环境中: $VIRTUAL_ENV"
else
    echo ""
    echo "📦 创建虚拟环境..."

    # 创建虚拟环境
    if [ ! -d "venv" ]; then
        python3 -m venv venv
        echo "✅ 虚拟环境创建完成"
    else
        echo "⚠️  虚拟环境已存在，跳过创建"
    fi

    echo ""
    echo "📦 激活虚拟环境..."
    source venv/bin/activate
    echo "✅ 虚拟环境已激活"
fi

echo ""
echo "📦 安装依赖..."
pip install --upgrade pip > /dev/null 2>&1
pip install -r requirements.txt

echo ""
echo "✅ 安装完成！"
echo ""
echo "📝 使用方法："
echo ""
echo "  1. 激活虚拟环境（每次使用前）："
echo "     source venv/bin/activate"
echo ""
echo "  2. 运行命令："
echo "     python image_processor.py convert logo.png logo.webp"
echo "     python image_processor.py resize banner.jpg --width 1200"
echo ""
echo "  3. 退出虚拟环境："
echo "     deactivate"
echo ""
echo "🎯 快速测试："
echo "   python image_processor.py --help"
echo ""
