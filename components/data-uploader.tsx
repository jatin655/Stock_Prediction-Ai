"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download } from "lucide-react"
import type { StockData } from "@/types/stock"
import { sampleStockData } from "@/data/sample-data"

interface DataUploaderProps {
  onDataUpload: (data: StockData[]) => void
}

export default function DataUploader({ onDataUpload }: DataUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const text = await file.text()
      let data: StockData[] = []

      if (file.name.endsWith(".json")) {
        // Parse JSON format
        const jsonData = JSON.parse(text)
        data = Array.isArray(jsonData) ? jsonData : [jsonData]
      } else if (file.name.endsWith(".csv")) {
        // Parse CSV format
        const lines = text.split("\n").filter((line) => line.trim())
        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

        data = lines
          .slice(1)
          .map((line) => {
            const values = line.split(",")
            const dateIndex = headers.findIndex((h) => h.includes("date"))
            const priceIndex = headers.findIndex((h) => h.includes("price") || h.includes("close"))

            return {
              date: values[dateIndex]?.trim() || new Date().toISOString().split("T")[0],
              price: Number.parseFloat(values[priceIndex]?.trim() || "0"),
            }
          })
          .filter((item) => !isNaN(item.price) && item.price > 0)
      }

      if (data.length < 10) {
        throw new Error("Need at least 10 valid data points")
      }

      onDataUpload(data)
    } catch (error) {
      alert("Error parsing file: " + (error as Error).message)
    } finally {
      setIsUploading(false)
    }
  }

  const downloadSampleData = () => {
    const dataStr = JSON.stringify(sampleStockData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "sample-stock-data.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  const useSampleData = () => {
    onDataUpload(sampleStockData)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file-upload">Upload Stock Data</Label>
        <Input id="file-upload" type="file" accept=".json,.csv" onChange={handleFileUpload} disabled={isUploading} />
        <p className="text-xs text-gray-500">Supports JSON and CSV files with date and price columns</p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={useSampleData} className="flex-1 bg-transparent">
          <FileText className="h-4 w-4 mr-2" />
          Use Sample Data
        </Button>
        <Button variant="outline" size="sm" onClick={downloadSampleData} className="flex-1 bg-transparent">
          <Download className="h-4 w-4 mr-2" />
          Download Sample
        </Button>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Data Format</CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-1">
          <p>
            <strong>JSON:</strong> [{"{"}"date": "2024-01-01", "price": 150.25{"}"}]
          </p>
          <p>
            <strong>CSV:</strong> date,price (with headers)
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
