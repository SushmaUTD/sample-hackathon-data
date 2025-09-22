"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { MarketSummary } from "@/components/market-summary"
import { InstrumentForm } from "@/components/instrument-form"
import { InstrumentsTable } from "@/components/instruments-table"
import { Toaster } from "@/components/ui/toaster"
import type { TradingInstrument } from "@/lib/trading-instruments"
import { useToast } from "@/hooks/use-toast"

interface FilterState {
  assetClass: string
  exchange: string
  sector: string
  currency: string
  symbol: string
}

export default function TradingDashboard() {
  const [instruments, setInstruments] = useState<TradingInstrument[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingInstrument, setEditingInstrument] = useState<TradingInstrument | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentFilters, setCurrentFilters] = useState<FilterState>({
    assetClass: "all",
    exchange: "all",
    sector: "all",
    currency: "all",
    symbol: "",
  })
  const { toast } = useToast()

  const fetchInstruments = async (filters?: FilterState) => {
    setIsLoading(true)
    try {
      const filtersToUse = filters || currentFilters
      const params = new URLSearchParams()

      Object.entries(filtersToUse).forEach(([key, value]) => {
        if (value && value !== "all") {
          params.append(key, value)
        }
      })

      const url = `/api/instruments${params.toString() ? `?${params.toString()}` : ""}`
      const response = await fetch(url)

      if (response.ok) {
        const data = await response.json()
        setInstruments(data)
        toast({
          title: "Data Refreshed",
          description: `Found ${data.length} trading instruments`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch trading instruments",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilter = (filters: FilterState) => {
    setCurrentFilters(filters)
    fetchInstruments(filters)
  }

  const handleRefresh = () => {
    fetchInstruments()
  }

  useEffect(() => {
    fetchInstruments()
  }, [])

  // Create instrument
  const handleCreate = async (instrumentData: any) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/instruments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(instrumentData),
      })

      if (response.ok) {
        await fetchInstruments()
        setShowForm(false)
        toast({
          title: "Success",
          description: "Trading instrument added successfully",
        })
      } else {
        const errorData = await response.json()
        let errorMessage = "Failed to add trading instrument"

        if (response.status === 400 && errorData.details) {
          // Validation errors
          errorMessage = errorData.details.join(", ")
        } else if (response.status === 409) {
          // Duplicate symbol error
          errorMessage = errorData.error
        } else if (errorData.error) {
          errorMessage = errorData.error
        }

        throw new Error(errorMessage)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add trading instrument",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Update instrument
  const handleUpdate = async (instrumentData: any) => {
    if (!editingInstrument) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/instruments/${editingInstrument.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(instrumentData),
      })

      if (response.ok) {
        await fetchInstruments()
        setEditingInstrument(null)
        toast({
          title: "Success",
          description: "Trading instrument updated successfully",
        })
      } else {
        const errorData = await response.json()
        let errorMessage = "Failed to update trading instrument"

        if (response.status === 400 && errorData.details) {
          errorMessage = errorData.details.join(", ")
        } else if (errorData.error) {
          errorMessage = errorData.error
        }

        throw new Error(errorMessage)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update trading instrument",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Delete instrument
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this trading instrument?")) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/instruments/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchInstruments()
        toast({
          title: "Success",
          description: "Trading instrument removed successfully",
        })
      } else {
        throw new Error("Failed to delete instrument")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove trading instrument",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (instrument: TradingInstrument) => {
    setEditingInstrument(instrument)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingInstrument(null)
  }

  const handleAddInstrument = () => {
    setShowForm(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onAddInstrument={handleAddInstrument} isFormOpen={showForm || !!editingInstrument} />

      <div className="container mx-auto px-6 py-6">
        <MarketSummary instruments={instruments} />

        <div className="space-y-6">
          <InstrumentsTable
            instruments={instruments}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
            onFilter={handleFilter}
            onRefresh={handleRefresh}
            currentFilters={currentFilters}
          />
        </div>

        {(showForm || editingInstrument) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <InstrumentForm
                instrument={editingInstrument || undefined}
                onSubmit={editingInstrument ? handleUpdate : handleCreate}
                onCancel={handleCancel}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}
      </div>

      <Toaster />
    </div>
  )
}
