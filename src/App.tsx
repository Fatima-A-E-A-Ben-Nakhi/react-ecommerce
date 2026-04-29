import { useState, useEffect, useMemo } from 'react'
import { ProductList } from './Components/ProductList'
import itemList from './Assets/random_products_175.json'
import logoImage from './Assets/Logo.png'
import basketImage from './Assets/shopping-basket.png'
import './e-commerce-stylesheet.css'

type Product = {
  id: number
  name: string
  price: number
  category: string
  quantity: number
  rating: number
  image_link: string
}

type BasketItem = Product & {
  basketQuantity: number
}

type SortOption = 'AtoZ' | 'ZtoA' | '£LtoH' | '£HtoL' | '*LtoH' | '*HtoL'

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchedProducts, setSearchedProducts] = useState<Product[]>(itemList)
  const [sortOption, setSortOption] = useState<SortOption>('AtoZ')
  const [inStockOnly, setInStockOnly] = useState<boolean>(false)
  const [basketItems, setBasketItems] = useState<BasketItem[]>([])

  useEffect(() => {
    updateSearchedProducts()
  }, [searchTerm, sortOption, inStockOnly])

  function sortProducts(products: Product[]): Product[] {
    const sortedProducts = [...products]

    switch (sortOption) {
      case 'ZtoA':
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name))
        break
      case '£LtoH':
        sortedProducts.sort((a, b) => a.price - b.price)
        break
      case '£HtoL':
        sortedProducts.sort((a, b) => b.price - a.price)
        break
      case '*LtoH':
        sortedProducts.sort((a, b) => a.rating - b.rating)
        break
      case '*HtoL':
        sortedProducts.sort((a, b) => b.rating - a.rating)
        break
      default:
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return sortedProducts
  }

  function updateSearchedProducts() {
    let holderList: Product[] = itemList.filter((product: Product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (inStockOnly) {
      holderList = holderList.filter((product: Product) => product.quantity > 0)
    }

    setSearchedProducts(sortProducts(holderList))
  }

  function showBasket() {
    const shoppingArea = document.getElementById('shopping-area')
    if (shoppingArea) {
      shoppingArea.style.display = 'block'
    }
  }

  function hideBasket() {
    const shoppingArea = document.getElementById('shopping-area')
    if (shoppingArea) {
      shoppingArea.style.display = 'none'
    }
  }

  function addToBasket(productId: number) {
    const selectedProduct = itemList.find((product: Product) => product.id === productId)

    if (!selectedProduct || selectedProduct.quantity === 0) {
      return
    }

    setBasketItems((currentBasketItems) => {
      const existingBasketItem = currentBasketItems.find(
        (basketItem) => basketItem.id === productId
      )

      if (existingBasketItem) {
        return currentBasketItems.map((basketItem) =>
          basketItem.id === productId
            ? { ...basketItem, basketQuantity: basketItem.basketQuantity + 1 }
            : basketItem
        )
      }

      return [...currentBasketItems, { ...selectedProduct, basketQuantity: 1 }]
    })
  }

  function removeFromBasket(productId: number) {
    setBasketItems((currentBasketItems) =>
      currentBasketItems
        .map((basketItem) =>
          basketItem.id === productId
            ? { ...basketItem, basketQuantity: basketItem.basketQuantity - 1 }
            : basketItem
        )
        .filter((basketItem) => basketItem.basketQuantity > 0)
    )
  }

  const resultsIndicatorText = useMemo(() => {
    if (searchTerm.trim() === '') {
      return searchedProducts.length === 1
        ? '1 Product'
        : `${searchedProducts.length} Products`
    }

    if (searchedProducts.length === 0) return 'No search results found'
    if (searchedProducts.length === 1) return '1 Result'

    return `${searchedProducts.length} Results`
  }, [searchTerm, searchedProducts])

  const basketTotal = useMemo(
    () => basketItems.reduce((total, item) => total + item.price * item.basketQuantity, 0),
    [basketItems]
  )

  return (
    <div id="container">
      <div id="logo-bar">
        <div id="logo-area">
          <img src={logoImage} alt="Website logo" />
        </div>

        <div id="shopping-icon-area">
          <img
            id="shopping-icon"
            onClick={showBasket}
            src={basketImage}
            alt="Shopping basket"
          />
        </div>

        <div id="shopping-area">
          <div id="exit-area">
            <p id="exit-icon" onClick={hideBasket}>
              x
            </p>
          </div>

          {basketItems.length === 0 ? (
            <p>Your basket is empty</p>
          ) : (
            <>
              {basketItems.map((basketItem) => (
                <div
                  key={basketItem.id}
                  className="shopping-row"
                  style={{
                    width: '100%',
                    minHeight: '34px',
                    height: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    marginBottom: '6px'
                  }}
                >
                  <div
                    className="shopping-information"
                    style={{
                      height: 'auto',
                      flexGrow: 1
                    }}
                  >
                    <p style={{ margin: 0 }}>
                      {basketItem.name} (£{basketItem.price.toFixed(2)}) -{' '}
                      {basketItem.basketQuantity}
                    </p>
                  </div>

                  <button
                    className="shopping-remove"
                    onClick={() => removeFromBasket(basketItem.id)}
                    style={{
                      width: '70px',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <p style={{ marginTop: '10px', fontWeight: 'bold' }}>
                Total: £{basketTotal.toFixed(2)}
              </p>
            </>
          )}
        </div>
      </div>

      <div id="search-bar">
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div id="control-area">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
          >
            <option value="AtoZ">By name (A - Z)</option>
            <option value="ZtoA">By name (Z - A)</option>
            <option value="£LtoH">By price (low - high)</option>
            <option value="£HtoL">By price (high - low)</option>
            <option value="*LtoH">By rating (low - high)</option>
            <option value="*HtoL">By rating (high - low)</option>
          </select>

          <input
            id="inStock"
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
          />
          <label htmlFor="inStock">In stock</label>
        </div>
      </div>

      <p id="results-indicator">{resultsIndicatorText}</p>

      <ProductList itemList={searchedProducts} addToBasket={addToBasket} />
    </div>
  )
}

export default App