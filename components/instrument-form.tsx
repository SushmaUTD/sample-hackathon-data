"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { TradingInstrument } from "@/lib/trading-instruments"

interface InstrumentFormProps {
  instrument?: TradingInstrument
  onSubmit: (data: any) => void
  onCancel: () => void
  isLoading: boolean
}

interface ValidationErrors {
  [key: string]: string
}

const VALID_CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "CNY", "INR", "BRL"]
const VALID_EXCHANGES = ["NYSE", "NASDAQ", "LSE", "TSE", "FX", "Treasury", "CBOE", "CME", "ICE"]

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

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [submitError, setSubmitError] = useState<string>("")

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    // Required field validation
    if (!formData.symbol.trim()) {
      newErrors.symbol = "Symbol is required"
    } else if (!/^[A-Z0-9/\-.]+$/.test(formData.symbol.toUpperCase())) {
      newErrors.symbol = "Symbol must contain only letters, numbers, /, -, and ."
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.price) {
      newErrors.price = "Price is required"
    } else if (Number.parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0"
    }

    if (!formData.currency.trim()) {
      newErrors.currency = "Currency is required"
    } else if (!VALID_CURRENCIES.includes(formData.currency.toUpperCase())) {
      newErrors.currency = `Currency must be one of: ${VALID_CURRENCIES.join(", ")}`
    }

    if (!formData.exchange.trim()) {
      newErrors.exchange = "Exchange is required"
    } else if (!VALID_EXCHANGES.includes(formData.exchange)) {
      newErrors.exchange = `Exchange must be one of: ${VALID_EXCHANGES.join(", ")}`
    }

    // Numeric field validation
    if (formData.volume && Number.parseInt(formData.volume) < 0) {
      newErrors.volume = "Volume cannot be negative"
    }

    if (formData.marketCap && Number.parseInt(formData.marketCap) < 0) {
      newErrors.marketCap = "Market cap cannot be negative"
    }

    if (formData.bid && Number.parseFloat(formData.bid) < 0) {
      newErrors.bid = "Bid cannot be negative"
    }

    if (formData.ask && Number.parseFloat(formData.ask) < 0) {
      newErrors.ask = "Ask cannot be negative"
    }

    if (formData.spread && Number.parseFloat(formData.spread) < 0) {
      newErrors.spread = "Spread cannot be negative"
    }

    // Bid/Ask relationship validation
    if (formData.bid && formData.ask) {
      const bidValue = Number.parseFloat(formData.bid)
      const askValue = Number.parseFloat(formData.ask)
      if (bidValue >= askValue) {
        newErrors.bid = "Bid must be less than Ask"
        newErrors.ask = "Ask must be greater than Bid"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError("")

    if (!validateForm()) {
      return
    }

    const submitData = {
      ...formData,
      symbol: formData.symbol.toUpperCase().trim(),
      name: formData.name.trim(),
      currency: formData.currency.toUpperCase().trim(),
      exchange: formData.exchange.trim(),
      sector: formData.sector.trim(),
      price: Number.parseFloat(formData.price),
      change: Number.parseFloat(formData.change) || 0,
      changePercent: Number.parseFloat(formData.changePercent) || 0,
      volume: Number.parseInt(formData.volume) || 0,
      marketCap: formData.marketCap ? Number.parseInt(formData.marketCap) : undefined,
      bid: formData.bid ? Number.parseFloat(formData.bid) : undefined,
      ask: formData.ask ? Number.parseFloat(formData.ask) : undefined,
      spread: formData.spread ? Number.parseFloat(formData.spread) : undefined,
    }

    try {
      await onSubmit(submitData)
    } catch (error: any) {
      setSubmitError(error.message || "Failed to save instrument")
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
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
        {submitError && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{submitError}</AlertDescription>
          </Alert>
        )}

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
                className={`font-mono ${errors.symbol ? "border-red-500" : ""}`}
              />
              {errors.symbol && <p className="text-sm text-red-600">{errors.symbol}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., Apple Inc."
                required
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
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
              <Select value={formData.exchange} onValueChange={(value) => handleChange("exchange", value)}>
                <SelectTrigger className={errors.exchange ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select exchange" />
                </SelectTrigger>
                <SelectContent>
                  {VALID_EXCHANGES.map((exchange) => (
                    <SelectItem key={exchange} value={exchange}>
                      {exchange}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.exchange && <p className="text-sm text-red-600">{errors.exchange}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="0.00"
                required
                className={`font-mono ${errors.price ? "border-red-500" : ""}`}
              />
              {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency *</Label>
              <Select value={formData.currency} onValueChange={(value) => handleChange("currency", value)}>
                <SelectTrigger className={`font-mono ${errors.currency ? "border-red-500" : ""}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VALID_CURRENCIES.map((currency) => (
                    <SelectItem key={currency} value={currency} className="font-mono">
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.currency && <p className="text-sm text-red-600">{errors.currency}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="volume">Volume</Label>
              <Input
                id="volume"
                type="number"
                min="0"
                value={formData.volume}
                onChange={(e) => handleChange("volume", e.target.value)}
                placeholder="0"
                className={`font-mono ${errors.volume ? "border-red-500" : ""}`}
              />
              {errors.volume && <p className="text-sm text-red-600">{errors.volume}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bid">Bid</Label>
              <Input
                id="bid"
                type="number"
                step="0.01"
                min="0"
                value={formData.bid}
                onChange={(e) => handleChange("bid", e.target.value)}
                placeholder="0.00"
                className={`font-mono ${errors.bid ? "border-red-500" : ""}`}
              />
              {errors.bid && <p className="text-sm text-red-600">{errors.bid}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ask">Ask</Label>
              <Input
                id="ask"
                type="number"
                step="0.01"
                min="0"
                value={formData.ask}
                onChange={(e) => handleChange("ask", e.target.value)}
                placeholder="0.00"
                className={`font-mono ${errors.ask ? "border-red-500" : ""}`}
              />
              {errors.ask && <p className="text-sm text-red-600">{errors.ask}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="spread">Spread</Label>
              <Input
                id="spread"
                type="number"
                step="0.0001"
                min="0"
                value={formData.spread}
                onChange={(e) => handleChange("spread", e.target.value)}
                placeholder="0.0000"
                className={`font-mono ${errors.spread ? "border-red-500" : ""}`}
              />
              {errors.spread && <p className="text-sm text-red-600">{errors.spread}</p>}
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
                  min="0"
                  value={formData.marketCap}
                  onChange={(e) => handleChange("marketCap", e.target.value)}
                  placeholder="0"
                  className={`font-mono ${errors.marketCap ? "border-red-500" : ""}`}
                />
                {errors.marketCap && <p className="text-sm text-red-600">{errors.marketCap}</p>}
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
