export interface TradingInstrument {
  id: string
  symbol: string
  name: string
  assetClass: "Equity" | "Fixed Income" | "FX" | "Commodity" | "Derivative"
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
  sector?: string
  currency: string
  exchange: string
  lastUpdated: string
  bid?: number
  ask?: number
  spread?: number
}

// In-memory storage for trading instruments
const instruments: TradingInstrument[] = [
  {
    id: "1",
    symbol: "AAPL",
    name: "Apple Inc.",
    assetClass: "Equity",
    price: 175.43,
    change: 2.15,
    changePercent: 1.24,
    volume: 45678900,
    marketCap: 2800000000000,
    sector: "Technology",
    currency: "USD",
    exchange: "NASDAQ",
    lastUpdated: new Date().toISOString(),
    bid: 175.41,
    ask: 175.45,
    spread: 0.04,
  },
  {
    id: "2",
    symbol: "TSLA",
    name: "Tesla Inc.",
    assetClass: "Equity",
    price: 248.87,
    change: -5.23,
    changePercent: -2.06,
    volume: 89234567,
    marketCap: 790000000000,
    sector: "Automotive",
    currency: "USD",
    exchange: "NASDAQ",
    lastUpdated: new Date().toISOString(),
    bid: 248.85,
    ask: 248.89,
    spread: 0.04,
  },
  {
    id: "3",
    symbol: "EUR/USD",
    name: "Euro US Dollar",
    assetClass: "FX",
    price: 1.0875,
    change: 0.0023,
    changePercent: 0.21,
    volume: 1234567890,
    currency: "USD",
    exchange: "FX",
    lastUpdated: new Date().toISOString(),
    bid: 1.0874,
    ask: 1.0876,
    spread: 0.0002,
  },
  {
    id: "4",
    symbol: "GLD",
    name: "SPDR Gold Trust",
    assetClass: "Commodity",
    price: 185.67,
    change: 1.45,
    changePercent: 0.79,
    volume: 12345678,
    currency: "USD",
    exchange: "NYSE",
    lastUpdated: new Date().toISOString(),
    bid: 185.65,
    ask: 185.69,
    spread: 0.04,
  },
  {
    id: "5",
    symbol: "US10Y",
    name: "10-Year Treasury Note",
    assetClass: "Fixed Income",
    price: 4.325,
    change: -0.025,
    changePercent: -0.57,
    volume: 567890123,
    currency: "USD",
    exchange: "Treasury",
    lastUpdated: new Date().toISOString(),
    bid: 4.324,
    ask: 4.326,
    spread: 0.002,
  },
]

export const getInstruments = (): TradingInstrument[] => {
  return instruments
}

export const getInstrumentById = (id: string): TradingInstrument | undefined => {
  return instruments.find((instrument) => instrument.id === id)
}

export const createInstrument = (instrumentData: Omit<TradingInstrument, "id" | "lastUpdated">): TradingInstrument => {
  const newInstrument: TradingInstrument = {
    ...instrumentData,
    id: Date.now().toString(),
    lastUpdated: new Date().toISOString(),
  }
  instruments.push(newInstrument)
  return newInstrument
}

export const updateInstrument = (id: string, instrumentData: Partial<TradingInstrument>): TradingInstrument | null => {
  const index = instruments.findIndex((instrument) => instrument.id === id)
  if (index === -1) return null

  instruments[index] = {
    ...instruments[index],
    ...instrumentData,
    lastUpdated: new Date().toISOString(),
  }
  return instruments[index]
}

export const deleteInstrument = (id: string): boolean => {
  const index = instruments.findIndex((instrument) => instrument.id === id)
  if (index === -1) return false

  instruments.splice(index, 1)
  return true
}
