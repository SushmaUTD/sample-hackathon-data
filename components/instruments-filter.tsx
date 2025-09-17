"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, RefreshCw } from "lucide-react"

interface FilterState {
  assetClass: string
  exchange: string
  sector: string
  currency: string
  symbol: string
}

interface InstrumentsFilterProps {
  onFilter: (filters: FilterState) => void
  onRefresh: () => void
  isLoading?: boolean
}

export function InstrumentsFilter({ onFilter, onRefresh, isLoading }: InstrumentsFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    assetClass: "all",
    exchange: "all",
    sector: "all",
    currency: "all",
    symbol: "",
  })

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
  }

  const handleApplyFilters = () => {
    onFilter(filters)
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      assetClass: "all",
      exchange: "all",
      sector: "all",
      currency: "all",
      symbol: "",
    }
    setFilters(clearedFilters)
    onFilter(clearedFilters)
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5" />
          Market Data Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="symbol-search">Symbol/Name Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="symbol-search"
                placeholder="Search symbols or names..."
                value={filters.symbol}
                onChange={(e) => handleFilterChange("symbol", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="asset-class">Asset Class</Label>
            <Select value={filters.assetClass} onValueChange={(value) => handleFilterChange("assetClass", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select asset class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Asset Classes</SelectItem>
                <SelectItem value="Equity">Equity</SelectItem>
                <SelectItem value="Fixed Income">Fixed Income</SelectItem>
                <SelectItem value="FX">FX</SelectItem>
                <SelectItem value="Commodity">Commodity</SelectItem>
                <SelectItem value="Derivative">Derivative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="exchange">Exchange</Label>
            <Select value={filters.exchange} onValueChange={(value) => handleFilterChange("exchange", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select exchange" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exchanges</SelectItem>
                <SelectItem value="NASDAQ">NASDAQ</SelectItem>
                <SelectItem value="NYSE">NYSE</SelectItem>
                <SelectItem value="FX">FX</SelectItem>
                <SelectItem value="Treasury">Treasury</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sector">Sector</Label>
            <Select value={filters.sector} onValueChange={(value) => handleFilterChange("sector", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Automotive">Automotive</SelectItem>
                <SelectItem value="Financial">Financial</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Energy">Energy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={filters.currency} onValueChange={(value) => handleFilterChange("currency", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Currencies</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="JPY">JPY</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={handleApplyFilters} className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Apply Filters
          </Button>
          <Button variant="outline" onClick={handleClearFilters}>
            Clear All
          </Button>
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
