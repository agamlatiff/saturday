import { useParams, Link } from "react-router-dom";
import { useFetchMerchant } from "../../hooks/useMerchants";
import Sidebar from "../../components/Sidebar";
import React, { useState } from "react";
import { useFetchProduct } from "../../hooks/useProducts";
import UserProfileCard from "../../components/UserProfileCard";
import SearchButton from "../../components/SearchButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

const MerchantProductList = () => {
  const { id } = useParams<{ id: string }>(); // Get Merchant ID from URL
  const { data: merchant, isPending } = useFetchMerchant(Number(id)); // ✅ Use `isPending`

  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const { data: selectedProduct } = useFetchProduct(selectedProductId || 0);

  if (isPending) return <p>Loading merchant products...</p>;
  if (!merchant) return <p> merchant not found...</p>;

  return (
    <>
      <div id="main-container" className="flex flex-1">
        <Sidebar />
        <div id="Content" className="flex flex-col flex-1 p-6 pt-0">
          <div
            id="Top-Bar"
            className="flex items-center w-full gap-6 mt-[30px] mb-6"
          >
            <div className="flex items-center gap-6 h-[92px] bg-white w-full rounded-3xl p-[18px]">
              <div className="flex flex-col gap-[6px] w-full">
                <h1 className="font-bold text-2xl">Merchant Details</h1>
                <Link
                  to={`/merchants`}
                  className="flex items-center gap-[6px] text-monday-gray font-semibold"
                >
                  <img
                    src="/assets/images/icons/arrow-left-grey.svg"
                    className="size-4 flex "
                    alt="icon"
                  />
                  Manage Merchants
                </Link>
              </div>
              <div className="flex items-center flex-nowrap gap-3">
                <SearchButton />
              </div>
            </div>
            <UserProfileCard />
          </div>
          <main className="flex flex-col gap-6 flex-1">
            <section
              id="Warehouse-Info"
              className="flex items-center justify-between rounded-3xl p-[18px] gap-3 bg-white flex-row"
            >
              <div className="flex size-16 rounded-2xl bg-monday-background items-center justify-center overflow-hidden">
                <img
                  src={merchant.photo}
                  className="size-full object-contain"
                  alt="icon"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <p className="font-semibold text-xl">{merchant.name}</p>
                <p className="flex items-center gap-1 font-medium text-lg text-monday-gray">
                  <img
                    src="/assets/images/icons/call-grey.svg"
                    className="size-6 flex "
                    alt="icon"
                  />
                  <span>{merchant.phone}</span>
                </p>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <p className="flex items-center gap-1 font-medium text-monday-gray">
                  <img
                    src="/assets/images/icons/user-grey.svg"
                    className="size-4 flex "
                    alt="icon"
                  />
                  <span>Keeper Name:</span>
                </p>
                <p className="font-semibold text-lg">{merchant.keeper.name}</p>
              </div>
              <Link
                to={`/merchants/edit/${merchant.id}`}
                className="btn btn-black w-[160px] font-semibold text-nowrap"
              >
                Edit Merchant
              </Link>
            </section>
            <section
              id="Products"
              className="flex flex-col gap-6 flex-1 rounded-3xl p-[18px] px-0 bg-white w-full"
            >
              <div
                id="Header"
                className="flex items-center justify-between px-[18px]"
              >
                <div className="flex flex-col gap-[6px]">
                  <p className="flex items-center gap-[6px]">
                    <img
                      src="/assets/images/icons/buildings-2-black.svg"
                      className="size-6 flex "
                      alt="icon"
                    />
                    <span className="font-semibold text-2xl">
                      {merchant.products.length} Total Products
                    </span>
                  </p>
                  <p className="font-semibold text-lg text-monday-gray">
                    View and update your Product Warehouses list here.
                  </p>
                </div>
                <Link
                  to={`/merchant-products/${id}/assign`}
                  className="btn btn-primary font-semibold"
                >
                  <p className="hidden md:block">Assign a Products</p>
                  <img
                    src="/assets/images/icons/add-square-white.svg"
                    className="flex sixe-6 "
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

                {merchant.products.length > 0 ? (
                  <div className="flex flex-col gap-5">
                    {merchant.products.map((product) => (
                      <React.Fragment key={product.id}>
                        <div className="card flex items-center justify-between gap-6">
                          <div className="flex items-center gap-3 w-[220px] md:w-[260px] ">
                            <div className="flex size-[86px] rounded-2xl bg-monday-background items-center justify-center overflow-hidden">
                              <img
                                src={product.thumbnail}
                                className="size-full object-contain"
                                alt="icon"
                              />
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                              <p className="font-semibold text-xl w-[162px] truncate">
                                {product.name}
                              </p>
                              <p className="font-semibold text-xl text-monday-blue">
                                Rp {product.price.toLocaleString("id")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-[6px] md:w-[154px] ">
                            <img
                              src="/assets/images/icons/box-black.svg"
                              className="size-6 flex "
                              alt="icon"
                            />
                            <p className="font-semibold text-lg text-nowrap w-[124px] truncate">
                              {product.pivot?.stock} Stock
                            </p>
                          </div>
                          <div className="md:flex items-center gap-[6px] hidden md:w-[154px] ">
                            <img
                              src={product.category.photo}
                              className="size-6 flex "
                              alt="icon"
                            />
                            <p className="font-semibold text-lg text-nowrap w-[124px] truncate ">
                              {product.category.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger className="xl:hidden flex items-center">
                                <EllipsisVertical />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="xl:hidden block">
                                <DropdownMenuItem>
                                  <button
                                    onClick={() => {
                                      setSelectedProductId(product.id);
                                    }}
                                    className="btn btn-primary-opacity min-w-[130px] font-semibold"
                                  >
                                    Details
                                  </button>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Link
                                    to={`/merchant-products/${id}/edit-assign/${product.id}`}
                                    className="btn btn-black min-w-[130px] font-semibold"
                                  >
                                    Add Stock
                                  </Link>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <div className=" items-center gap-2 hidden xl:flex">
                              <button
                                onClick={() => {
                                  setSelectedProductId(product.id);
                                }}
                                className="btn btn-primary-opacity min-w-[130px] font-semibold"
                              >
                                Details
                              </button>
                              <Link
                                to={`/merchant-products/${id}/edit-assign/${product.id}`}
                                className="btn btn-black min-w-[130px] font-semibold"
                              >
                                Add Stock
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
            </section>
          </main>
        </div>
      </div>
      {selectedProductId && selectedProduct && (
        <div className="modal flex flex-1 items-center justify-center h-full fixed top-0 w-full">
          <div
            onClick={() => setSelectedProductId(null)}
            className="absolute w-full h-full bg-[#292D32B2] cursor-pointer"
          />
          <div className="relative flex flex-col w-[406px]  rounded-3xl p-[18px] gap-5 bg-white">
            <div className="modal-header flex items-center justify-between">
              <p className="font-semibold text-xl">Product Details</p>
              <button
                onClick={() => setSelectedProductId(null)}
                className="flex size-14 rounded-full items-center justify-center bg-monday-gray-background"
              >
                <img
                  src="/assets/images/icons/close-circle-black.svg"
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
                      src={selectedProduct.category.photo}
                      className="size-6 flex "
                      alt="icon"
                    />
                    {selectedProduct.name}
                  </p>
                  <p className="font-bold text-lg">
                    {selectedProduct.category.name}
                  </p>
                  <p className="font-semibold text-[17px] text-monday-blue">
                    Rp {selectedProduct.price.toLocaleString("id")}
                  </p>
                </div>
                <div className="flex size-[100px] rounded-2xl bg-monday-gray-background items-center justify-center overflow-hidden">
                  <img
                    src={selectedProduct.thumbnail}
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
                  {selectedProduct.about}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MerchantProductList;
