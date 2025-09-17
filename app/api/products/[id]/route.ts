import { type NextRequest, NextResponse } from "next/server"
import { getProductById, updateProduct, deleteProduct } from "@/lib/products"

// GET /api/products/[id] - Get a specific product
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = getProductById(params.id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

// PUT /api/products/[id] - Update a specific product
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const updatedProduct = updateProduct(params.id, {
      name: body.name,
      description: body.description,
      price: body.price ? Number.parseFloat(body.price) : undefined,
      category: body.category,
      inStock: body.inStock,
    })

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(updatedProduct)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

// DELETE /api/products/[id] - Delete a specific product
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = deleteProduct(params.id)

    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
