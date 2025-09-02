"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, File, Trash2, Copy, Check } from "lucide-react"
import { useDropzone } from "react-dropzone"

interface MediaFile {
  id: string
  filename: string
  originalName: string
  size: number
  mimeType: string
  url: string
  uploadedAt: string
}

export function MediaManager() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true)
    setMessage(null)

    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/admin/media/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }

        return response.json()
      })

      const uploadedFiles = await Promise.all(uploadPromises)
      setFiles((prev) => [...uploadedFiles, ...prev])
      setMessage({
        type: "success",
        text: `Successfully uploaded ${uploadedFiles.length} file(s)`,
      })
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Upload failed",
      })
    } finally {
      setIsUploading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp", ".svg"],
      "application/pdf": [".pdf"],
      "text/*": [".txt", ".md"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const deleteFile = async (fileId: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return

    try {
      const response = await fetch(`/api/admin/media/${fileId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setFiles((prev) => prev.filter((file) => file.id !== fileId))
        setMessage({ type: "success", text: "File deleted successfully" })
      } else {
        setMessage({ type: "error", text: "Failed to delete file" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while deleting" })
    }
  }

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to copy URL" })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const isImage = (mimeType: string) => mimeType.startsWith("image/")

  return (
    <div className="space-y-6">
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-lg mb-2">Drag & drop files here, or click to select</p>
                <p className="text-sm text-muted-foreground">Supports images, PDFs, and text files up to 10MB</p>
              </div>
            )}
          </div>

          {isUploading && (
            <div className="mt-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Uploading files...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Media Library */}
      <Card>
        <CardHeader>
          <CardTitle>Media Library ({files.length} files)</CardTitle>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No files uploaded yet. Upload some files to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {files.map((file) => (
                <Card key={file.id} className="overflow-hidden">
                  <div className="aspect-square bg-muted/50 flex items-center justify-center">
                    {isImage(file.mimeType) ? (
                      <img
                        src={file.url || "/placeholder.svg"}
                        alt={file.originalName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-center">
                        <File className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">{file.mimeType}</p>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm line-clamp-1" title={file.originalName}>
                        {file.originalName}
                      </h4>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      <div className="flex items-center space-x-1">
                        <Input value={file.url} readOnly className="text-xs h-8" />
                        <Button size="sm" variant="outline" onClick={() => copyUrl(file.url)} className="h-8 w-8 p-0">
                          {copiedUrl === file.url ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteFile(file.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
