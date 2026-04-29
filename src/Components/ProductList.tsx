type Product = {
  id: number
  name: string
  price: number
  category: string
  quantity: number
  rating: number
  image_link: string
}

type ContentAreaProps = {
  itemList: Product[]
  addToBasket: (productId: number) => void
}
const productImages = import.meta.glob('../Assets/Product_Images/*', {
  eager: true,
  query: '?url',
  import: 'default'
}) as Record<string, string>
export const ProductList = (props: ContentAreaProps) => {
  return (
    <div id="productList">
      {props.itemList.map((item) => {
        const isOutOfStock = item.quantity === 0

        return (
          <div key={item.id} className="product">
            <div className="product-top-bar">
              <h2>{item.name}</h2>
              <p>
                £{item.price.toFixed(2)} ({item.rating}/5)
              </p>
            </div>

            
            />
            <img
              src={productImages[`../Assets/Product_Images/${item.image_link}`]}
              alt={item.name}
            />

            <button
              value={item.id}
              disabled={isOutOfStock}
              onClick={() => props.addToBasket(item.id)}
              style={{
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                opacity: isOutOfStock ? 0.6 : 1
              }}
            >
              {isOutOfStock ? 'Out of stock' : 'Add to basket'}
            </button>
          </div>
        )
      })}
    </div>
  )
}
