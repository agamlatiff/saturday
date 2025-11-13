import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useFetchMerchants } from "../../hooks/useMerchants";
import UserProfileCard from "../../components/UserProfileCard";
import React from "react";
import SearchButton from "../../components/SearchButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

const MerchantList = () => {
  const { data: merchants, isPending, isError, error } = useFetchMerchants(); // ✅ Use `isPending`

  if (isPending) return <p>Loading merchants...</p>;
  if (isError) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div id="main-container" className="flex flex-1">
      <Sidebar />
      <div id="Content" className="flex flex-col flex-1 p-6 pt-0">
        <div
          id="Top-Bar"
          className="flex items-center w-full gap-6 mt-[30px] mb-6"
        >
          <div className="flex items-center gap-6 h-[92px] bg-white w-full rounded-3xl p-[18px]">
            <div className="flex flex-col gap-[6px] w-full">
              <h1 className="font-bold sm:text-2xl text-xl">Manage Merchants</h1>
            </div>
            <div className="flex items-center flex-nowrap gap-3">
              <SearchButton />
            </div>
          </div>
          <UserProfileCard />
        </div>
        <main className="flex flex-col gap-6 flex-1">
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
                    src="/assets/images/icons/buildings-2-black.svg"
                    className="size-6 flex shrink-0"
                    alt="icon"
                  />
                  <span className="font-semibold text-2xl">
                    {merchants.length} Total Merchants
                  </span>
                </p>
                <p className="font-semibold text-lg text-monday-gray">
                  View and update your Merchants list here.
                </p>
              </div>
              <Link
                to={"/merchants/add"}
                className="btn btn-primary font-semibold"
              >
                <p className="hidden sm:block">Add New</p>
                <img
                  src="/assets/images/icons/add-square-white.svg"
                  className="flex sixe-6 shrink-0"
                  alt="icon"
                />
              </Link>
            </div>
            <hr className="border-monday-border" />
            <div id="Product-List" className="flex flex-col px-4 gap-5 flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-xl">All Merchants</p>
              </div>

              {merchants.length > 0 ? (
                <div className="flex flex-col gap-5">
                  {merchants.map((merchant) => (
                    <React.Fragment key={merchant.id}>
                      <div className="card flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 w-[326px] shrink-0">
                          <div className="flex size-[86px] rounded-2xl bg-monday-background items-center justify-center overflow-hidden">
                            <img
                              src={merchant.photo}
                              className="size-full object-contain"
                              alt="icon"
                            />
                          </div>
                          <div className="flex flex-col gap-2 flex-1">
                            <p className="font-semibold text-xl w-[228px] truncate">
                              {merchant.name}
                            </p>
                            <p className="flex items-center gap-1 font-medium text-lg text-monday-gray">
                              <img
                                src="/assets/images/icons/user-thin-grey.svg"
                                className="size-6 flex shrink-0"
                                alt="icon"
                              />
                              <span>
                                {merchant.keeper
                                  ? merchant.keeper.name
                                  : "No Keeper"}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className=" items-center w-full justify-center hidden sm:flex gap-2">
                          <img
                            src="/assets/images/icons/bag-black.svg"
                            className="size-6 flex shrink-0"
                            alt="icon"
                          />
                          <p className="font-semibold text-lg text-nowrap">
                            {merchant.products ? merchant.products.length : 0}
                            {"  "}
                            Products
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="xl:hidden flex items-center">
                              <EllipsisVertical />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="xl:hidden block">
                              <DropdownMenuItem>
                                <Link
                                  to={`/merchant-products/${merchant.id}`}
                                  className="btn btn-primary-opacity min-w-[130px] font-semibold"
                                >
                                  Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link
                                  to={`/merchants/edit/${merchant.id}`}
                                  className="btn btn-black min-w-[130px] font-semibold"
                                >
                                  <img
                                    src="/assets/images/icons/edit-white.svg"
                                    className="flex size-6 shrink-0"
                                    alt="icon"
                                  />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <div className=" items-center gap-2 hidden xl:flex">
                            <Link
                              to={`/merchant-products/${merchant.id}`}
                              className="btn btn-primary-opacity min-w-[130px] font-semibold"
                            >
                              Details
                            </Link>
                            <Link
                              to={`/merchants/edit/${merchant.id}`}
                              className="btn btn-black min-w-[130px] font-semibold"
                            >
                              <img
                                src="/assets/images/icons/edit-white.svg"
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
          </section>
        </main>
      </div>
    </div>
  );
};

export default MerchantList;
