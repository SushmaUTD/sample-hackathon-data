import { type NextRequest, NextResponse } from "next/server"
import { getAllProducts, createProduct } from "@/lib/products"

// GET /api/products - Get all products
export async function GET() {
  try {
    const products = getAllProducts()
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Basic validation
    if (!body.name || !body.price) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 })
    }

    const newProduct = createProduct({
      name: body.name,
      description: body.description || "",
      price: Number.parseFloat(body.price),
      category: body.category || "Uncategorized",
      inStock: body.inStock !== undefined ? body.inStock : true,
    })

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
