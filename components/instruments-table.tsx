"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, TrendingUp, TrendingDown, Search, RefreshCw } from "lucide-react"
import type { TradingInstrument } from "@/lib/trading-instruments"

interface FilterState {
  assetClass: string
  exchange: string
  sector: string
  currency: string
  symbol: string
}

interface InstrumentsTableProps {
  instruments: TradingInstrument[]
  onEdit: (instrument: TradingInstrument) => void
  onDelete: (id: string) => void
  isLoading: boolean
  onFilter: (filters: FilterState) => void
  onRefresh: () => void
  currentFilters: FilterState
}

export function InstrumentsTable({
  instruments,
  onEdit,
  onDelete,
  isLoading,
  onFilter,
  onRefresh,
  currentFilters,
}: InstrumentsTableProps) {
  const formatPrice = (price: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(price)
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) {
      return `${(volume / 1000000000).toFixed(1)}B`
    } else if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`
    }
    return volume.toLocaleString()
  }

  const formatMarketCap = (marketCap?: number) => {
    if (!marketCap) return "N/A"
    if (marketCap >= 1000000000000) {
      return `$${(marketCap / 1000000000000).toFixed(1)}T`
    } else if (marketCap >= 1000000000) {
      return `$${(marketCap / 1000000000).toFixed(1)}B`
    } else if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(1)}M`
    }
    return `$${marketCap.toLocaleString()}`
  }

  const getAssetClassColor = (assetClass: string) => {
    switch (assetClass) {
      case "Equity":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Fixed Income":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "FX":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "Commodity":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "Derivative":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...currentFilters, [key]: value }
    onFilter(newFilters)
  }

  if (instruments.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-muted-foreground">No trading instruments found</p>
            <p className="text-sm text-muted-foreground mt-1">Add your first instrument to get started</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Trading Instruments</CardTitle>
            <CardDescription>Real-time market data and instrument management</CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="flex flex-wrap gap-3 pt-4 border-t">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search symbols..."
              value={currentFilters.symbol}
              onChange={(e) => handleFilterChange("symbol", e.target.value)}
              className="pl-10 h-9"
            />
          </div>

          <Select value={currentFilters.assetClass} onValueChange={(value) => handleFilterChange("assetClass", value)}>
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="Asset Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="Equity">Equity</SelectItem>
              <SelectItem value="Fixed Income">Fixed Income</SelectItem>
              <SelectItem value="FX">FX</SelectItem>
              <SelectItem value="Commodity">Commodity</SelectItem>
              <SelectItem value="Derivative">Derivative</SelectItem>
            </SelectContent>
          </Select>

          <Select value={currentFilters.exchange} onValueChange={(value) => handleFilterChange("exchange", value)}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Exchange" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Exchanges</SelectItem>
              <SelectItem value="NASDAQ">NASDAQ</SelectItem>
              <SelectItem value="NYSE">NYSE</SelectItem>
              <SelectItem value="FX">FX</SelectItem>
              <SelectItem value="Treasury">Treasury</SelectItem>
            </SelectContent>
          </Select>

          <Select value={currentFilters.sector} onValueChange={(value) => handleFilterChange("sector", value)}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Sector" />
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

          <Select value={currentFilters.currency} onValueChange={(value) => handleFilterChange("currency", value)}>
            <SelectTrigger className="w-[110px] h-9">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
              <SelectItem value="JPY">JPY</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-4 px-4 font-semibold text-sm">Symbol</th>
                <th className="text-left py-4 px-4 font-semibold text-sm">Name</th>
                <th className="text-left py-4 px-4 font-semibold text-sm">Asset Class</th>
                <th className="text-right py-4 px-4 font-semibold text-sm">Price</th>
                <th className="text-right py-4 px-4 font-semibold text-sm">Change</th>
                <th className="text-right py-4 px-4 font-semibold text-sm">Volume</th>
                <th className="text-right py-4 px-4 font-semibold text-sm">Market Cap</th>
                <th className="text-center py-4 px-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {instruments.map((instrument) => (
                <tr key={instrument.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="font-mono font-semibold text-sm">{instrument.symbol}</span>
                      <span className="text-xs text-muted-foreground">{instrument.exchange}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{instrument.name}</span>
                      {instrument.sector && <span className="text-xs text-muted-foreground">{instrument.sector}</span>}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="secondary" className={getAssetClassColor(instrument.assetClass)}>
                      {instrument.assetClass}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-mono font-semibold">
                      {formatPrice(instrument.price, instrument.currency)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {instrument.change >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <div className="flex flex-col items-end">
                        <span
                          className={`font-mono text-sm font-semibold ${
                            instrument.change >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {instrument.change >= 0 ? "+" : ""}
                          {instrument.change.toFixed(2)}
                        </span>
                        <span
                          className={`font-mono text-xs ${
                            instrument.changePercent >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          ({instrument.changePercent >= 0 ? "+" : ""}
                          {instrument.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-mono text-sm">{formatVolume(instrument.volume)}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-mono text-sm">{formatMarketCap(instrument.marketCap)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(instrument)}
                        disabled={isLoading}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(instrument.id)}
                        disabled={isLoading}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
