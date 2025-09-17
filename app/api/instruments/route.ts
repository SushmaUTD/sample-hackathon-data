import { type NextRequest, NextResponse } from "next/server"
import { getInstruments, createInstrument } from "@/lib/trading-instruments"

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

    // Validate required fields
    const requiredFields = ["symbol", "name", "assetClass", "price", "currency", "exchange"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const newInstrument = createInstrument(body)
    return NextResponse.json(newInstrument, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create trading instrument" }, { status: 500 })
  }
}
