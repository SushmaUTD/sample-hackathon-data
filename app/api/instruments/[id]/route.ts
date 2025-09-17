import { type NextRequest, NextResponse } from "next/server"
import { getInstrumentById, updateInstrument, deleteInstrument } from "@/lib/trading-instruments"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const instrument = getInstrumentById(params.id)

    if (!instrument) {
      return NextResponse.json({ error: "Trading instrument not found" }, { status: 404 })
    }

    return NextResponse.json(instrument)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch trading instrument" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const updatedInstrument = updateInstrument(params.id, body)

    if (!updatedInstrument) {
      return NextResponse.json({ error: "Trading instrument not found" }, { status: 404 })
    }

    return NextResponse.json(updatedInstrument)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update trading instrument" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = deleteInstrument(params.id)

    if (!success) {
      return NextResponse.json({ error: "Trading instrument not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Trading instrument deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete trading instrument" }, { status: 500 })
  }
}
