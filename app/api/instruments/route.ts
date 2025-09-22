import { type NextRequest, NextResponse } from "next/server"
import { getInstruments, createInstrument } from "@/lib/trading-instruments"

const VALID_CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "CNY", "INR", "BRL"]
const VALID_EXCHANGES = ["NYSE", "NASDAQ", "LSE", "TSE", "FX", "Treasury", "CBOE", "CME", "ICE"]
const VALID_ASSET_CLASSES = ["Equity", "Fixed Income", "FX", "Commodity", "Derivative"]

const validateInstrumentData = (data: any) => {
  const errors: string[] = []

  // Required field validation
  if (!data.symbol?.trim()) {
    errors.push("Symbol is required")
  } else if (!/^[A-Z0-9/\-.]+$/.test(data.symbol.toUpperCase())) {
    errors.push("Symbol must contain only letters, numbers, /, -, and .")
  }

  if (!data.name?.trim()) {
    errors.push("Name is required")
  }

  if (!data.assetClass || !VALID_ASSET_CLASSES.includes(data.assetClass)) {
    errors.push(`Asset class must be one of: ${VALID_ASSET_CLASSES.join(", ")}`)
  }

  if (!data.price || typeof data.price !== "number" || data.price <= 0) {
    errors.push("Price must be a positive number")
  }

  if (!data.currency?.trim() || !VALID_CURRENCIES.includes(data.currency.toUpperCase())) {
    errors.push(`Currency must be one of: ${VALID_CURRENCIES.join(", ")}`)
  }

  if (!data.exchange?.trim() || !VALID_EXCHANGES.includes(data.exchange)) {
    errors.push(`Exchange must be one of: ${VALID_EXCHANGES.join(", ")}`)
  }

  // Optional numeric field validation
  if (data.volume !== undefined && (typeof data.volume !== "number" || data.volume < 0)) {
    errors.push("Volume must be a non-negative number")
  }

  if (data.marketCap !== undefined && (typeof data.marketCap !== "number" || data.marketCap < 0)) {
    errors.push("Market cap must be a non-negative number")
  }

  if (data.bid !== undefined && (typeof data.bid !== "number" || data.bid < 0)) {
    errors.push("Bid must be a non-negative number")
  }

  if (data.ask !== undefined && (typeof data.ask !== "number" || data.ask < 0)) {
    errors.push("Ask must be a non-negative number")
  }

  if (data.spread !== undefined && (typeof data.spread !== "number" || data.spread < 0)) {
    errors.push("Spread must be a non-negative number")
  }

  // Bid/Ask relationship validation
  if (data.bid !== undefined && data.ask !== undefined && data.bid >= data.ask) {
    errors.push("Bid must be less than Ask")
  }

  return errors
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const assetClass = searchParams.get("assetClass")
    const exchange = searchParams.get("exchange")
    const sector = searchParams.get("sector")
    const currency = searchParams.get("currency")
    const symbol = searchParams.get("symbol")

    let instruments = getInstruments()

    // Apply filters
    if (assetClass && assetClass !== "all") {
      instruments = instruments.filter((instrument) => instrument.assetClass === assetClass)
    }
    if (exchange && exchange !== "all") {
      instruments = instruments.filter((instrument) => instrument.exchange === exchange)
    }
    if (sector && sector !== "all") {
      instruments = instruments.filter((instrument) => instrument.sector === sector)
    }
    if (currency && currency !== "all") {
      instruments = instruments.filter((instrument) => instrument.currency === currency)
    }
    if (symbol) {
      instruments = instruments.filter(
        (instrument) =>
          instrument.symbol.toLowerCase().includes(symbol.toLowerCase()) ||
          instrument.name.toLowerCase().includes(symbol.toLowerCase()),
      )
    }

    return NextResponse.json(instruments)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch trading instruments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationErrors = validateInstrumentData(body)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationErrors,
        },
        { status: 400 },
      )
    }

    const existingInstruments = getInstruments()
    const duplicateSymbol = existingInstruments.find(
      (instrument) => instrument.symbol.toUpperCase() === body.symbol.toUpperCase().trim(),
    )

    if (duplicateSymbol) {
      return NextResponse.json(
        {
          error: `An instrument with symbol "${body.symbol.toUpperCase()}" already exists`,
        },
        { status: 409 },
      )
    }

    const normalizedData = {
      ...body,
      symbol: body.symbol.toUpperCase().trim(),
      name: body.name.trim(),
      currency: body.currency.toUpperCase().trim(),
      exchange: body.exchange.trim(),
      sector: body.sector?.trim() || undefined,
    }

    const newInstrument = createInstrument(normalizedData)
    return NextResponse.json(newInstrument, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create trading instrument" }, { status: 500 })
  }
}
