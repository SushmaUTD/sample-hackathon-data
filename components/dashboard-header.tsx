"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Clock, Globe, Plus } from "lucide-react"

interface DashboardHeaderProps {
  onAddInstrument: () => void
  isFormOpen: boolean
}

export function DashboardHeader({ onAddInstrument, isFormOpen }: DashboardHeaderProps) {
  const currentTime = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  const marketStatus = new Date().getHours() >= 9 && new Date().getHours() < 16 ? "OPEN" : "CLOSED"

  return (
    <div className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Goldman Sachs</h1>
                <p className="text-sm text-muted-foreground">Global Markets Division</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4 ml-8">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-sm">NYSE {currentTime}</span>
              </div>
              <Badge
                variant={marketStatus === "OPEN" ? "default" : "secondary"}
                className={marketStatus === "OPEN" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Market {marketStatus}
              </Badge>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Live Data</span>
              </div>
            </div>
          </div>

          <Button onClick={onAddInstrument} disabled={isFormOpen} className="bg-secondary hover:bg-secondary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Instrument
          </Button>
        </div>
      </div>
    </div>
  )
}
