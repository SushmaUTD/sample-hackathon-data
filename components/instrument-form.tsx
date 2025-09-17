"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { TradingInstrument } from "@/lib/trading-instruments"

interface InstrumentFormProps {
  instrument?: TradingInstrument
  onSubmit: (data: any) => void
  onCancel: () => void
  isLoading: boolean
}

export function InstrumentForm({ instrument, onSubmit, onCancel, isLoading }: InstrumentFormProps) {
  const [formData, setFormData] = useState({
    symbol: instrument?.symbol || "",
    name: instrument?.name || "",
    assetClass: instrument?.assetClass || "Equity",
    price: instrument?.price?.toString() || "",
    change: instrument?.change?.toString() || "",
    changePercent: instrument?.changePercent?.toString() || "",
    volume: instrument?.volume?.toString() || "",
    marketCap: instrument?.marketCap?.toString() || "",
    sector: instrument?.sector || "",
    currency: instrument?.currency || "USD",
    exchange: instrument?.exchange || "",
    bid: instrument?.bid?.toString() || "",
    ask: instrument?.ask?.toString() || "",
    spread: instrument?.spread?.toString() || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const submitData = {
      ...formData,
      price: Number.parseFloat(formData.price),
      change: Number.parseFloat(formData.change) || 0,
      changePercent: Number.parseFloat(formData.changePercent) || 0,
      volume: Number.parseInt(formData.volume) || 0,
      marketCap: formData.marketCap ? Number.parseInt(formData.marketCap) : undefined,
      bid: formData.bid ? Number.parseFloat(formData.bid) : undefined,
      ask: formData.ask ? Number.parseFloat(formData.ask) : undefined,
      spread: formData.spread ? Number.parseFloat(formData.spread) : undefined,
    }

    onSubmit(submitData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {instrument ? "Edit Trading Instrument" : "Add New Trading Instrument"}
        </CardTitle>
        <CardDescription>
          {instrument ? "Update the trading instrument details" : "Enter the details for the new trading instrument"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol *</Label>
              <Input
                id="symbol"
                value={formData.symbol}
                onChange={(e) => handleChange("symbol", e.target.value)}
                placeholder="e.g., AAPL, EUR/USD"
                required
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., Apple Inc."
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assetClass">Asset Class *</Label>
              <Select value={formData.assetClass} onValueChange={(value) => handleChange("assetClass", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Equity">Equity</SelectItem>
                  <SelectItem value="Fixed Income">Fixed Income</SelectItem>
                  <SelectItem value="FX">FX</SelectItem>
                  <SelectItem value="Commodity">Commodity</SelectItem>
                  <SelectItem value="Derivative">Derivative</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="exchange">Exchange *</Label>
              <Input
                id="exchange"
                value={formData.exchange}
                onChange={(e) => handleChange("exchange", e.target.value)}
                placeholder="e.g., NYSE, NASDAQ"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="0.00"
                required
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency *</Label>
              <Input
                id="currency"
                value={formData.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
                placeholder="USD"
                required
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="volume">Volume</Label>
              <Input
                id="volume"
                type="number"
                value={formData.volume}
                onChange={(e) => handleChange("volume", e.target.value)}
                placeholder="0"
                className="font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bid">Bid</Label>
              <Input
                id="bid"
                type="number"
                step="0.01"
                value={formData.bid}
                onChange={(e) => handleChange("bid", e.target.value)}
                placeholder="0.00"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ask">Ask</Label>
              <Input
                id="ask"
                type="number"
                step="0.01"
                value={formData.ask}
                onChange={(e) => handleChange("ask", e.target.value)}
                placeholder="0.00"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="spread">Spread</Label>
              <Input
                id="spread"
                type="number"
                step="0.0001"
                value={formData.spread}
                onChange={(e) => handleChange("spread", e.target.value)}
                placeholder="0.0000"
                className="font-mono"
              />
            </div>
          </div>

          {formData.assetClass === "Equity" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <Input
                  id="sector"
                  value={formData.sector}
                  onChange={(e) => handleChange("sector", e.target.value)}
                  placeholder="e.g., Technology"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marketCap">Market Cap</Label>
                <Input
                  id="marketCap"
                  type="number"
                  value={formData.marketCap}
                  onChange={(e) => handleChange("marketCap", e.target.value)}
                  placeholder="0"
                  className="font-mono"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Processing..." : instrument ? "Update Instrument" : "Add Instrument"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
