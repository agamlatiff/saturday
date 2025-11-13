import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useFetchProduct, useFetchProducts } from "../../hooks/useProducts";
import React, { useState } from "react";
import UserProfileCard from "../../components/UserProfileCard";
import SearchButton from "../../components/SearchButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "../../../components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

const ProductList = () => {
  const { data: products, isPending, isError, error } = useFetchProducts();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const { data: selectedProduct } = useFetchProduct(selectedProductId || 0);
  if (isPending) return <p>Loading products...</p>;
  if (isError)
    return (
      <p className="text-red-500">Error fetching products: {error.message}</p>
    );

  return (
    <>
      <div id="main-container" className="lg:flex flex-1">
        <Sidebar />
        <div
          id="Content"
          className="flex flex-col flex-1 p-6 pt-0 overflow-hidden"
        >
          <div
            id="Top-Bar"
            className="flex items-center w-full gap-6 mt-[30px] mb-6"
          >
            <div className="flex items-center gap-6 h-[92px] bg-white w-full rounded-3xl p-[18px]">
              <div className="flex flex-col gap-[6px] w-full">
                <h1 className="font-bold text-2xl">Manage Products</h1>
              </div>
              <div className="flex items-center flex-nowrap gap-3">
                <SearchButton />
              </div>
            </div>
            <UserProfileCard />
          </div>
          <main className="flex flex-col gap-6 flex-1 w-full">
            <section
              id="Products"
              className="flex flex-col gap-6 flex-1 rounded-3xl p-[18px] px-0 bg-white"
            >
              <div
                id="Header"
                className="flex items-center justify-between px-[18px]"
              >
                <div className="flex flex-col gap-[6px]">
                  <p className="flex items-center gap-[6px]">
                    <img
                      src="assets/images/icons/bag-black.svg"
                      className="size-6 flex shrink-0"
                      alt="icon"
                    />
                    <span className="font-semibold text-2xl">
                      {products.length || 0} Total Products
                    </span>
                  </p>
                  <p className="font-semibold text-lg text-monday-gray">
                    View and update your product list here.
                  </p>
                </div>
                <Link
                  to="/products/add"
                  className="btn btn-primary font-semibold"
                >
                  <p className="hidden sm:block">Add New</p>
                  <img
                    src="assets/images/icons/add-square-white.svg"
                    className="flex sixe-6 shrink-0"
                    alt="icon"
                  />
                </Link>
              </div>
              <hr className="border-monday-border" />
              <div
                id="Product-List"
                className="flex flex-col px-4 gap-5 flex-1"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-xl">All Products</p>
                </div>

                {products.length > 0 ? (
                  <div className="flex flex-col  gap-5">
                    {products.map((product) => (
                      <React.Fragment key={product.id}>
                        <div className="card flex items-center justify-between gap-3 ">
                          <div className="flex items-center gap-3 w-full max-w-[380px] min-w-0">
                            <div className="flex size-[86px] rounded-2xl bg-monday-background items-center justify-center overflow-hidden">
                              <img
                                src={product.thumbnail}
                                className="size-full object-contain"
                                alt="icon"
                              />
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                              <p className="font-semibold text-xl w-[282px] truncate">
                                {product.name}
                              </p>
                              <p className="font-semibold text-xl text-monday-blue">
                                Rp {product.price.toLocaleString("id")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-[6px] ">
                            <img
                              src={product.category.photo}
                              className="size-6 shrink-0 flex "
                              alt="icon"
                            />
                            <p className="font-semibold text-lg text-nowrap w-[70px] sm:w-[100px] md:w-[124px] truncate">
                              {product.category.name}
                            </p>
                          </div>


                          <div className="flex items-center gap-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger className="xl:hidden flex items-center">
                                <EllipsisVertical />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>
                                  <button
                                    onClick={() => {
                                      setSelectedProductId(product.id);
                                    }}
                                    className="btn btn-primary-opacity font-semibold"
                                  >
                                    Details
                                  </button>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Link
                                    to={`/products/edit/${product.id}`}
                                    className="btn btn-black font-semibold"
                                  >
                                    <img
                                      src="assets/images/icons/edit-white.svg"
                                      className="flex size-6 shrink-0"
                                      alt="icon"
                                    />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <div className=" items-center gap-4 hidden xl:flex">
                              <button
                                onClick={() => {
                                  setSelectedProductId(product.id);
                                }}
                                className="btn btn-primary-opacity font-semibold"
                              >
                                Details
                              </button>
                              <Link
                                to={`/products/edit/${product.id}`}
                                className="btn btn-black font-semibold"
                              >
                                <img
                                  src="assets/images/icons/edit-white.svg"
                                  className="flex size-6 shrink-0"
                                  alt="icon"
                                />
                                Edit
                              </Link>
                            </div>
                          </div>
                        </div>
                        <hr className="border-monday-border last:hidden" />
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <div
                    id="Empty-State"
                    className="py-20  flex flex-col flex-1 items-center justify-center rounded-[20px] border-dashed border-2 border-monday-gray gap-6"
                  >
                    <img
                      src="assets/images/icons/document-text-grey.svg"
                      className="size-[52px]"
                      alt="icon"
                    />
                    <p className="font-semibold text-monday-gray">
                      Oops, it looks like there's no data yet.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>

      {selectedProductId && selectedProduct && (
        <div className="modal flex flex-1 items-center justify-center h-full fixed top-0 w-full ">
          <div
            onClick={() => setSelectedProductId(null)}
            className="absolute w-full h-full bg-[#292D32B2] cursor-pointer "
          />
          <div className="relative flex flex-col  max-w-[406px] rounded-3xl p-[18px] gap-5 bg-white w-full">
            <div className="modal-header flex items-center justify-between">
              <p className="font-semibold text-xl">Product Details</p>
              <button
                onClick={() => setSelectedProductId(null)}
                className="flex size-14 rounded-full items-center justify-center bg-monday-gray-background"
              >
                <img
                  src="assets/images/icons/close-circle-black.svg"
                  className="size-6"
                  alt="icon"
                />
              </button>
            </div>
            <div className="modal-content flex flex-col rounded-3xl border border-monday-border p-4 gap-5">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <p className="flex items-center gap-[6px] font-semibold text-lg">
                    <img
                      src={selectedProduct?.category?.photo}
                      className="size-6 flex shrink-0"
                      alt="icon"
                    />
                    {selectedProduct?.name}
                  </p>
                  <p className="font-bold text-lg">
                    {selectedProduct?.category?.name}
                  </p>
                  <p className="font-semibold text-[17px] text-monday-blue">
                    Rp{" "}
                    {selectedProduct &&
                    typeof selectedProduct.price === "number"
                      ? `Rp ${selectedProduct.price.toLocaleString("id")}`
                      : "Harga tidak tersedia"}
                  </p>
                </div>
                <div className="flex size-[100px] rounded-2xl bg-monday-gray-background items-center justify-center overflow-hidden">
                  <img
                    src={selectedProduct?.thumbnail}
                    className="size-full object-contain"
                    alt="icon"
                  />
                </div>
              </div>
              <hr className="border-monday-border" />
              <div>
                <p className="font-medium text-sm text-monday-gray">
                  Product About
                </p>
                <p className="font-semibold leading-[160%]">
                  {selectedProduct?.about}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductList;
