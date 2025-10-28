import {useState} from 'react'
import {set, unset} from 'sanity'
import {Card, TextInput, Button, Stack, Text} from '@sanity/ui'
import {getProductsBySearch, ProductsResponse} from '../../api/shopify'

type ShopifyProductSelectorProps = {
  value?: {shopifyProductId: string; title?: string}
  onChange: (patch: any) => void
}

export function ShopifyProductSelector({value, onChange}: ShopifyProductSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<ProductsResponse['products']['edges']>([])
  const [loading, setLoading] = useState(false)

  async function handleSearch() {
    setLoading(true)
    const products = await getProductsBySearch(searchTerm)
    setResults(products)
    setLoading(false)
  }

  function handleSelect(product: any) {
    onChange(
      set({
        shopifyProductId: product.id,
        title: product.title,
      }),
    )
  }

  return (
    <Stack space={3}>
      {value ? (
        <Card padding={3} tone="positive" radius={3} shadow={1}>
          <Text size={2}>{value.title}</Text>
          <Text size={1} muted>
            {value.shopifyProductId}
          </Text>
          <Button
            tone="critical"
            text="Remove"
            onClick={() => onChange(unset())}
            style={{marginTop: '0.5rem'}}
          />
        </Card>
      ) : (
        <>
          <TextInput
            placeholder="Search Shopify products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
          />
          <Button
            text={loading ? 'Searching...' : 'Search'}
            disabled={loading || !searchTerm}
            onClick={handleSearch}
          />
          {results.length > 0 && (
            <Stack space={2}>
              {results.map((p) => (
                <Card
                  key={p.id}
                  padding={3}
                  radius={2}
                  shadow={1}
                  onClick={() => handleSelect(p)}
                  style={{cursor: 'pointer'}}
                >
                  <Text weight="semibold">{p.title}</Text>
                  <Text size={1} muted>
                    {p.id}
                  </Text>
                </Card>
              ))}
            </Stack>
          )}
        </>
      )}
    </Stack>
  )
}
