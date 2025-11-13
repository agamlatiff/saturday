import { useState } from "react";
import { useTransaction } from "../../../context/TransactionContext";
import { useMyMerchantProfile } from "../../../hooks/useMerchants";

const ProductModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { cart, setCart } = useTransaction();

  const { data: merchant } = useMyMerchantProfile();

  const [selectedProducts, setSelectedProducts] = useState<{
    [key: number]: number;
  }>({});

  if (!isOpen) return null;

  // Check if any products have been selected (quantity > 0)
  const hasSelectedProducts = Object.values(selectedProducts).some(
    (qty) => qty > 0
  );

  const updateQuantity = (productId: number, delta: number) => {
    setSelectedProducts((prev) => {
      const currentQuantity = prev[productId] || 0;
      const newQuantity = Math.max(0, currentQuantity + delta);

      // If quantity is 0, remove the product from selectedProducts
      if (newQuantity === 0) {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      }

      return {
        ...prev,
        [productId]: newQuantity,
      };
    });
  };

  const handleAddToCart = () => {
    const updatedCart = [...cart];

    Object.entries(selectedProducts).forEach(([productId, quantity]) => {
      const mp = merchant?.products.find((mp) => mp.id === Number(productId));

      const product = mp;

      if (product) {
        const existing = updatedCart.find((item) => item.id === product.id);

        const sub_total = product.price * quantity;

        if (existing) {
          existing.quantity += quantity;
          existing.sub_total = existing.price * existing.quantity;
        } else {
          // updatedCart.push({ ...product, quantity, sub_total });
          updatedCart.push({
            id: product.id,
            name: product.name,
            category: product.category.name,
            price: product.price,
            thumbnail: product.thumbnail,
            quantity,
            sub_total,
          });
        }
      }
    });

    setCart(updatedCart);
    onClose();
  };

  return (
    <div
      id="Assign-Products-Modal"
      className="modal flex flex-1 items-center justify-center h-full fixed top-0 w-full z-50 py-4 sm:py-10"
    >
      <div
        onClick={onClose}
        className="backdrop absolute w-full h-full bg-[#292D32B2] cursor-pointer"
      />
      <div className="relative flex flex-col flex-1 w-full max-w-[1200px] h-full max-h-[90vh] sm:max-h-[752px] shrink-0 rounded-3xl p-[18px] gap-5 bg-white mx-4">
        <div className="modal-header flex items-center justify-between">
          <p className="font-semibold text-lg sm:text-xl">Assign Products</p>
          <button
            onClick={onClose}
            className="flex size-12 sm:size-14 rounded-full items-center justify-center bg-monday-gray-background hover:bg-monday-border transition-300"
          >
            <img
              src="/assets/images/icons/close-circle-black.svg"
              className="size-5 sm:size-6"
              alt="icon"
            />
          </button>
        </div>
        <div className="modal-content flex flex-1 overflow-y-auto overscroll-contain hide-scrollbar">
          <div className="flex flex-col gap-5 w-full">
            {merchant?.products.map((product) => {
              const quantity = selectedProducts[product.id] || 0;
              const subTotal = quantity * product.price;
              const availableStock = product.pivot?.stock ?? 0;

              // Check if product already exists in cart
              const existingCartItem = cart.find(
                (item) => item.id === product.id
              );
              const cartQuantity = existingCartItem?.quantity || 0;

              // Calculate remaining stock considering what's already in cart
              const remainingStock = availableStock - cartQuantity;

              // Check if quantity is at maximum (remaining stock)
              const isAtMaxStock = quantity >= remainingStock;
              const isAtMinQuantity = quantity <= 0;

              return (
                <div
                  key={product.id}
                  className="card-assign flex flex-col rounded-3xl border border-monday-border p-4 gap-5"
                >
                  <div className="flex items-center justify-between gap-3 sm:gap-6 flex-col sm:flex-row">
                    <div className="flex items-center gap-3 w-full sm:w-[270px] shrink-0">
                      <div className="flex size-[86px] rounded-2xl bg-monday-background items-center justify-center overflow-hidden shrink-0">
                        <img
                          src={product.thumbnail}
                          className="size-full object-contain"
                          alt="icon"
                        />
                      </div>
                      <div className="flex flex-col gap-2 flex-1 min-w-0">
                        <p className="font-semibold text-lg sm:text-xl truncate">
                          {product.name}
                        </p>
                        <p className="price font-semibold text-lg sm:text-xl text-monday-blue">
                          Rp {product.price.toLocaleString("id")}
                        </p>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center gap-[6px] w-[154px] shrink-0">
                      <img
                        src={product.category.photo}
                        className="size-6 flex shrink-0"
                        alt="icon"
                      />
                      <p className="font-semibold text-base sm:text-lg text-nowrap truncate">
                        {product.category.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-[6px] w-full sm:w-[154px] shrink-0">
                      <img
                        src="/assets/images/icons/box-black.svg"
                        className="size-5 sm:size-6 flex shrink-0"
                        alt="icon"
                      />
                      <p className="stock font-semibold text-base sm:text-lg text-nowrap truncate">
                        {product.pivot?.stock ?? 0} Stock
                      </p>
                    </div>
                    <div className="flex items-center rounded-2xl p-3 sm:p-4 gap-2 sm:gap-3 bg-monday-blue/10 text-monday-blue w-full sm:w-auto justify-between sm:justify-center">
                      <button
                        onClick={() => updateQuantity(product.id, -1)}
                        type="button"
                        className="minus flex size-5 sm:size-6 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                        disabled={isAtMinQuantity}
                      >
                        <img
                          src="/assets/images/icons/minus-square-blue.svg"
                          className="size-full"
                          alt="icon"
                        />
                      </button>
                      <p className="amount min-w-12 font-medium text-lg sm:text-[22px] text-center">
                        {selectedProducts[product.id] || 0}
                      </p>
                      <button
                        onClick={() => updateQuantity(product.id, 1)}
                        type="button"
                        className="plus flex size-5 sm:size-6 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                        disabled={isAtMaxStock || remainingStock <= 0}
                      >
                        <img
                          src="/assets/images/icons/add-square-blue-fill.svg"
                          className="size-full"
                          alt="icon"
                        />
                      </button>
                    </div>
                  </div>
                  <hr className="border-monday-border" />
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-1 font-semibold text-base sm:text-lg text-monday-gray">
                      <img
                        src="/assets/images/icons/money-grey.svg"
                        className="size-5 sm:size-6 flex shrink-0"
                        alt="icon"
                      />
                      Subtotal:
                    </p>
                    <p className="subtotal font-semibold text-lg sm:text-xl text-monday-blue">
                      Rp {subTotal.toLocaleString("id")}
                    </p>
                  </div>
                </div>
              );
            })}
            {(!merchant?.products || merchant.products.length === 0) && (
              <div
                id="Empty-State"
                className="py-20 flex flex-col flex-1 items-center justify-center rounded-[20px] border-dashed border-2 border-monday-gray gap-6"
              >
                <img
                  src="/assets/images/icons/document-text-grey.svg"
                  className="size-[52px]"
                  alt="icon"
                />
                <p className="font-semibold text-monday-gray">
                  Oops, it looks like there's no data yet.
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 flex-row">
          <button
            onClick={onClose}
            className="btn btn-red font-semibold w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={handleAddToCart}
            type="submit"
            className="btn btn-primary font-semibold w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!hasSelectedProducts}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
