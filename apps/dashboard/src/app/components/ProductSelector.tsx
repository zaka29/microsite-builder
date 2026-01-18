'use client'

import {useEffect, useState} from 'react'
import {X} from 'lucide-react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from './ui/select'
import {Button} from './ui/button'
import {Label} from './ui/label'

interface ShopifyProduct {
  id: string
  title: string
  handle: string
}

interface SelectedProduct {
  _key: string
  shopifyProductId: {
    id: string
    title: string
  }
  title?: string
}

interface ProductSelectorProps {
  selectedProducts: SelectedProduct[]
  onChange: (products: SelectedProduct[]) => void
}

export function ProductSelector({selectedProducts, onChange}: ProductSelectorProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string>('')

  useEffect(() => {
    async function fetchProducts() {
      try {
        const {getProducts} = await import('api/shopify')
        const productList = await getProducts()
        setProducts(productList)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleAddProduct = () => {
    if (!selectedId) return

    const product = products.find((p) => p.id === selectedId)
    if (!product) return

    // Check if already added
    if (selectedProducts.some((p) => p.shopifyProductId.id === product.id)) {
      return
    }

    const newProduct: SelectedProduct = {
      _key: crypto.randomUUID(),
      shopifyProductId: {
        id: product.id,
        title: product.title,
      },
    }

    onChange([...selectedProducts, newProduct])
    setSelectedId('')
  }

  const handleRemoveProduct = (key: string) => {
    onChange(selectedProducts.filter((p) => p._key !== key))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label htmlFor="product-select">Add Product</Label>
          <Select value={selectedId} onValueChange={setSelectedId} disabled={loading}>
            <SelectTrigger id="product-select">
              <SelectValue placeholder={loading ? 'Loading products...' : 'Select a product'} />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="button" onClick={handleAddProduct} disabled={!selectedId}>
          Add
        </Button>
      </div>

      {selectedProducts.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Products ({selectedProducts.length})</Label>
          <div className="space-y-2">
            {selectedProducts.map((product) => (
              <div
                key={product._key}
                className="flex items-center justify-between rounded-md border border-input bg-background p-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{product.shopifyProductId.title}</p>
                  <p className="text-xs text-muted-foreground">ID: {product.shopifyProductId.id}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveProduct(product._key)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
