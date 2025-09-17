"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Activity, DollarSign } from "lucide-react"
import type { TradingInstrument } from "@/lib/trading-instruments"

interface MarketSummaryProps {
  instruments: TradingInstrument[]
}

export function MarketSummary({ instruments }: MarketSummaryProps) {
  const totalInstruments = instruments.length
  const gainers = instruments.filter((i) => i.change > 0).length
  const losers = instruments.filter((i) => i.change < 0).length
  const totalVolume = instruments.reduce((sum, i) => sum + i.volume, 0)
  const avgChange =
    instruments.length > 0 ? instruments.reduce((sum, i) => sum + i.changePercent, 0) / instruments.length : 0

  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) {
      return `${(volume / 1000000000).toFixed(1)}B`
    } else if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`
    }
    return volume.toLocaleString()
  }

  const summaryCards = [
    {
      title: "Total Instruments",
      value: totalInstruments.toString(),
      icon: Activity,
      description: "Active positions",
    },
    {
      title: "Market Movers",
      value: `${gainers}↑ ${losers}↓`,
      icon: avgChange >= 0 ? TrendingUp : TrendingDown,
      description: "Gainers vs Losers",
      trend: avgChange >= 0 ? "positive" : "negative",
    },
    {
      title: "Total Volume",
      value: formatVolume(totalVolume),
      icon: DollarSign,
      description: "Aggregate trading volume",
    },
    {
      title: "Avg Change",
      value: `${avgChange >= 0 ? "+" : ""}${avgChange.toFixed(2)}%`,
      icon: avgChange >= 0 ? TrendingUp : TrendingDown,
      description: "Portfolio performance",
      trend: avgChange >= 0 ? "positive" : "negative",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {summaryCards.map((card, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <card.icon
              className={`h-4 w-4 ${
                card.trend === "positive"
                  ? "text-green-600"
                  : card.trend === "negative"
                    ? "text-red-600"
                    : "text-muted-foreground"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              <span
                className={
                  card.trend === "positive"
                    ? "text-green-600"
                    : card.trend === "negative"
                      ? "text-red-600"
                      : "text-foreground"
                }
              >
                {card.value}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
