/**
 * Banana 游乐场组件
 * AI 图像生成交互界面 - 完整版本
 */

import { useState, useRef, useEffect } from "react";
import { BananaModel, ModelQuality, MODEL_MAP, AspectRatio, OutputSize } from "../playgroundTypes";
import { generateImage } from "wasp/client/operations";
import { cn } from "../../client/utils";

export default function BananaPlayground() {
  const [prompt, setPrompt] = useState("");
  const [model] = useState<BananaModel>(BananaModel.IMAGE);
  const [quality, setQuality] = useState<ModelQuality>(ModelQuality.FLASH);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [outputSize, setOutputSize] = useState<OutputSize>("2K");
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [response, setResponse] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [imageObjectUrl, setImageObjectUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Cleanup object URL when component unmounts or when new image is generated
  useEffect(() => {
    return () => {
      if (imageObjectUrl) {
        URL.revokeObjectURL(imageObjectUrl);
      }
    };
  }, [imageObjectUrl]);

  // Compress image by resizing: if max(width, height) > 2000, resize to 1000
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Simple resize: if max dimension > 2000, scale down to 1000
          const maxDimension = Math.max(width, height);
          if (maxDimension > 2000) {
            const scale = 1000 / maxDimension;
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Convert to JPEG with 0.8 quality
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to create blob"));
                return;
              }

              // Convert blob to base64 data URL
              const blobReader = new FileReader();
              blobReader.onloadend = () => {
                resolve(blobReader.result as string);
              };
              blobReader.onerror = () => reject(new Error("Failed to read blob"));
              blobReader.readAsDataURL(blob);
            },
            "image/jpeg",
            0.8
          );
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);

      // Limit to 8 images max to avoid payload issues
      if (fileArray.length + selectedImages.length > 8) {
        alert("最多只能上传 8 张图片 (Maximum 8 images allowed)");
        return;
      }

      try {
        const compressedImages = await Promise.all(
          fileArray.map((file) => compressImage(file))
        );

        setSelectedImages((prev) => [...prev, ...compressedImages]);
      } catch (error) {
        console.error("Failed to compress images:", error);
        alert("Failed to process images. Please try again.");
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClear = () => {
    setPrompt("");
    setResponse(null);
    setSelectedImages([]);
    if (imageObjectUrl) {
      URL.revokeObjectURL(imageObjectUrl);
      setImageObjectUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() && selectedImages.length === 0) return;

    setIsLoading(true);
    setRetryCount(0);
    setResponse(null);
    // Cleanup old object URL
    if (imageObjectUrl) {
      URL.revokeObjectURL(imageObjectUrl);
      setImageObjectUrl(null);
    }

    // Listen for retry events
    let retryAttempt = 0;
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      if (args[0]?.includes("Attempt") && args[0]?.includes("failed")) {
        retryAttempt++;
        setRetryCount(retryAttempt);
      }
      originalConsoleLog(...args);
    };

    try {
      // Get the actual API model name
      const apiModel = MODEL_MAP[model][quality];

      const result = await generateImage({
        model: apiModel,
        prompt,
        images: selectedImages.length > 0 ? selectedImages : undefined,
        aspectRatio,
        // Only include outputSize for Pro quality (Flash doesn't support resolution setting)
        outputSize: quality === ModelQuality.PRO ? outputSize : undefined,
      });

      // The Wasp action returns { imageBase64, model, provider }
      if (result && result.imageBase64) {
        const imageData = result.imageBase64; // This is already a data URL (data:image/...;base64,...)

        // Extract the base64 data
        const match = imageData.match(/data:image\/(\w+);base64,([^)]+)/);
        if (match) {
          const mimeType = match[1];
          const base64Data = match[2];

          // Convert base64 to Blob
          try {
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: `image/${mimeType}` });

            // Create object URL
            const objectUrl = URL.createObjectURL(blob);
            setImageObjectUrl(objectUrl);
            setResponse("IMAGE"); // Set a flag to know we have an image
          } catch (e) {
            console.error("Failed to convert base64 to blob:", e);
            setResponse(`Error processing image: ${e}`);
          }
        } else {
          setResponse(`Error: Invalid image format received`);
        }
      } else {
        setResponse("Error: No image data received from API");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error in handleSubmit:", error);
      setResponse(`**Error:** ${errorMessage}`);
    } finally {
      // Restore console.log
      console.log = originalConsoleLog;
      setIsLoading(false);
      setRetryCount(0);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const ratios: AspectRatio[] = ["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"];

  return (
    <div id="banana-playground" className="bg-background mx-auto max-w-7xl px-6 py-24 lg:px-8">
      {/* 标题 */}
      <div className="mb-12 text-center">
        <h2 className="text-foreground mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Banana 游乐场
        </h2>
        <p className="text-muted-foreground text-lg">
          使用 Gemini 2.5 Flash 体验极速生成，或切换至{" "}
          <span className="text-purple-400 font-semibold">Gemini 3 Pro</span> 获得极致质量
        </p>
      </div>

      <div className="bg-card border-border overflow-hidden rounded-3xl border shadow-2xl">
        {/* Toolbar */}
        <div className="border-border bg-card flex flex-col items-center justify-between gap-4 border-b p-4 md:flex-row">
          <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
            {/* Quality Toggle (Flash/Pro) */}
            <div className="bg-muted border-border flex items-center gap-3 rounded-xl border px-4 py-2">
              <button
                onClick={() => setQuality(ModelQuality.FLASH)}
                className={cn(
                  "flex items-center gap-1.5 text-xs font-medium transition-all",
                  quality === ModelQuality.FLASH
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                ⚡ Flash
              </button>
              <div
                onClick={() =>
                  setQuality(
                    quality === ModelQuality.FLASH ? ModelQuality.PRO : ModelQuality.FLASH
                  )
                }
                className="bg-muted relative h-6 w-12 cursor-pointer rounded-full transition-all"
              >
                <div
                  className={cn(
                    "absolute left-0.5 top-0.5 h-5 w-5 rounded-full transition-all",
                    quality === ModelQuality.PRO
                      ? "translate-x-6 bg-purple-500"
                      : "translate-x-0 bg-primary"
                  )}
                />
              </div>
              <button
                onClick={() => setQuality(ModelQuality.PRO)}
                className={cn(
                  "flex items-center gap-1.5 text-xs font-medium transition-all",
                  quality === ModelQuality.PRO
                    ? "text-purple-400"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                ⭐ Pro
              </button>
            </div>

            {/* Aspect Ratio Selector */}
            <div className="bg-muted border-border flex items-center gap-2 rounded-xl border p-1">
              <span className="text-muted-foreground px-2">📐</span>
              {ratios.map((r) => (
                <button
                  key={r}
                  onClick={() => setAspectRatio(r)}
                  className={cn(
                    "rounded px-2 py-1 text-[10px] font-mono transition-all",
                    aspectRatio === r
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Output Size Selector - Only show for Pro quality */}
            {quality === ModelQuality.PRO && (
              <div className="bg-muted border-border flex items-center gap-2 rounded-xl border p-1">
                <span className="text-muted-foreground px-2 text-[10px]">SIZE</span>
                {(["1K", "2K", "4K"] as OutputSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setOutputSize(size)}
                    className={cn(
                      "rounded px-2 py-1 text-[10px] font-mono transition-all",
                      outputSize === size
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleClear}
            className="hover:bg-accent hover:text-destructive text-muted-foreground hidden rounded-lg p-2 transition-colors md:block"
            title="清空全部"
          >
            🗑️
          </button>
        </div>

        <div className="flex h-[700px] flex-col md:flex-row">
          {/* Input Area */}
          <div className="border-border bg-card flex w-full flex-col border-b p-6 md:w-1/2 md:border-b-0 md:border-r">
            <div className="flex flex-1 flex-col">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="描述你想生成的图像，或询问关于上传图片的问题..."
                className="text-foreground placeholder:text-muted-foreground flex-1 w-full resize-none bg-transparent font-mono text-sm leading-relaxed outline-none"
              />

              {selectedImages.length > 0 && (
                <div className="bg-muted border-border mt-3 rounded-xl border p-3">
                  <div className="flex items-center gap-2 overflow-x-auto">
                    {selectedImages.map((img, index) => (
                      <div key={index} className="group relative flex-shrink-0">
                        <img
                          src={img}
                          alt={`Upload ${index + 1}`}
                          className="border-border h-16 w-16 rounded-lg border object-cover"
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -right-1 -top-1 rounded-full bg-red-500 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <span className="text-white text-xs">×</span>
                        </button>
                      </div>
                    ))}
                    <div className="text-muted-foreground ml-2 flex-shrink-0 text-xs">
                      {selectedImages.length} 张图片
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "rounded-2xl p-4 transition-all",
                  selectedImages.length > 0
                    ? "border-primary/50 bg-primary/10 text-primary border"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
                title="上传图片"
              >
                🖼️
              </button>

              <button
                onClick={handleSubmit}
                disabled={isLoading || (!prompt && selectedImages.length === 0)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 font-bold shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-50",
                  quality === ModelQuality.PRO
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    生成中...
                  </>
                ) : (
                  <>
                    📤 {quality === ModelQuality.PRO ? "Pro 生成" : "Flash 运行"}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output Area */}
          <div className="bg-muted w-full overflow-y-auto p-8 md:w-1/2" ref={resultRef}>
            {!response && !isLoading && (
              <div className="text-muted-foreground flex h-full flex-col items-center justify-center space-y-4">
                <svg
                  className="h-24 w-24 opacity-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm font-medium">输出窗口</p>
              </div>
            )}

            {isLoading && (
              <div className="flex h-full flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div
                    className={cn(
                      "h-12 w-12 animate-spin rounded-full border-2 border-t-transparent",
                      quality === ModelQuality.PRO ? "border-purple-500" : "border-primary"
                    )}
                  ></div>
                </div>
                <p
                  className={cn(
                    "animate-pulse text-sm font-medium",
                    quality === ModelQuality.PRO ? "text-purple-400" : "text-primary"
                  )}
                >
                  正在生成图像...(可能需要 1-2 分钟)
                </p>
                {retryCount > 0 && (
                  <p className="text-muted-foreground text-xs">
                    重试中 (第 {retryCount + 1} 次)...
                  </p>
                )}
              </div>
            )}

            {/* Display generated image using object URL */}
            {response === "IMAGE" && imageObjectUrl && !isLoading && (
              <div className="border-border my-4 overflow-hidden rounded-xl border bg-black shadow-2xl">
                <img
                  src={imageObjectUrl}
                  alt="Generated Image"
                  className="mx-auto h-auto max-h-[600px] w-full object-contain"
                />
              </div>
            )}

            {/* Display text response */}
            {response && response !== "IMAGE" && !isLoading && (
              <div className="text-foreground prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap">{response}</div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
