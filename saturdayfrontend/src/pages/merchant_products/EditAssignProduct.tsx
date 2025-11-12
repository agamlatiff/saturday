import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useFetchMerchant } from "../../hooks/useMerchants";
import { useFetchProduct } from "../../hooks/useProducts";
import { useUpdateMerchantProduct } from "../../hooks/useMerchantProducts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  editAssignMerchantProduct,
  EditAssignMerchantProductFormData,
} from "../../schemas/editAssignMerchantProduct";
import Sidebar from "../../components/Sidebar";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "../../types/types";
import UserProfileCard from "../../components/UserProfileCard";
import { useFetchWarehouse } from "../../hooks/useWarehouses";
import SearchButton from "../../components/SearchButton";

const EditAssignProduct = () => {
  const { merchantId, productId } = useParams<{
    merchantId: string;
    productId: string;
  }>();

  const { data: merchant, isLoading: loadingMerchant } = useFetchMerchant(
    Number(merchantId)
  );

  const { data: product, isLoading: loadingProduct } = useFetchProduct(
    Number(productId)
  );
  const { mutate: updateStock } = useUpdateMerchantProduct();

  const merchantProduct = merchant?.products?.find(
    (product) => product.id === Number(productId)
  );

  const warehouseId = merchantProduct?.pivot?.warehouse_id;

  const { data: warehouse } = useFetchWarehouse(Number(warehouseId));

  const initialStock =
    merchantProduct?.pivot?.stock || product?.merchant_stock || 0;

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<EditAssignMerchantProductFormData>({
    resolver: zodResolver(editAssignMerchantProduct),
    defaultValues: { stock: initialStock },
  });

  useEffect(() => {
    if (merchantProduct) {
      setValue("stock", merchantProduct.pivot?.stock || 0);
    }
  }, [merchantProduct, setValue]);

  const onSubmit = (data: EditAssignMerchantProductFormData) => {
    if (!merchantId || !productId) return;

    setError("root", { type: "server", message: "" });

    updateStock(
      {
        merchant_id: Number(merchantId),
        warehouse_id: Number(warehouseId), // ✅ Pass warehouse_id here
        product_id: Number(productId),
        stock: data.stock,
      },
      {
        onError: (error: AxiosError<ApiErrorResponse>) => {
          if (error.response) {
            const { message, errors } = error.response.data;

            // ✅ Show general API error message at the top
            if (message) {
              setError("root", { type: "server", message });
            }

            // ✅ Display field-specific errors if present
            if (errors) {
              Object.entries(errors).forEach(([key, messages]) => {
                setError(key as keyof EditAssignMerchantProductFormData, {
                  type: "server",
                  message: messages[0],
                });
              });
            }
          }
        },
      }
    );
  };

  if (loadingMerchant || loadingProduct) return <p>Loading details...</p>;
  if (!merchant) return <p> merchant not found...</p>;
  if (!product) return <p> product not found...</p>;
  if (!warehouse) return <p> warehouse not found...</p>;

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
              <h1 className="font-bold text-lg sm:text-2xl">Update Stock Product</h1>
              <Link
                to={`/merchant-products/${merchant.id}`}
                className="flex items-center gap-[6px] text-monday-gray font-semibold"
              >
                <img
                  src="/assets/images/icons/arrow-left-grey.svg"
                  className="size-4 flex shrink-0"
                  alt="icon"
                />
                Merchant Details
              </Link>
            </div>
            <div className="flex items-center flex-nowrap gap-3">
              <SearchButton />
            </div>
          </div>
          <UserProfileCard />
        </div>
        <main className="flex flex-col gap-6 flex-1">
          <div className="flex gap-6 flex-col lg:flex-row">
            <div className="flex flex-col gap-6 w-full">
              <div className="flex flex-col w-full rounded-3xl p-[18px] gap-5 bg-white">
                <h2 className="font-semibold text-xl">Warehouse Details</h2>
                <div className="flex flex-col gap-5 p-[18px] rounded-3xl border-[1.5px] border-monday-border">
                  <div className="flex items-center gap-3">
                    <div className="flex size-16 rounded-2xl bg-monday-background items-center justify-center overflow-hidden">
                      <img
                        src={warehouse.photo}
                        className="size-full object-cover"
                        alt="icon"
                      />
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <p className="font-semibold text-lg">{warehouse.name}</p>
                      <p className="flex items-center gap-1 font-medium text-lg text-monday-gray">
                        <img
                          src="/assets/images/icons/call-grey.svg"
                          className="size-6 flex shrink-0"
                          alt="icon"
                        />
                        <span>{warehouse.phone}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col w-full rounded-3xl p-[18px] gap-5 bg-white"
              >
                <h2 className="font-semibold text-xl">Merchant Details</h2>
                <div className="flex flex-col gap-5 p-[18px] rounded-3xl border-[1.5px] border-monday-border">
                  <div className="flex items-center gap-3">
                    <div className="flex size-16 rounded-2xl bg-monday-background items-center justify-center overflow-hidden">
                      <img
                        src={merchant.photo}
                        className="size-full object-cover"
                        alt="icon"
                      />
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <p className="font-semibold text-lg">{merchant.name}</p>
                      <p className="flex items-center gap-1 font-medium text-lg text-monday-gray">
                        <img
                          src="/assets/images/icons/user-thin-grey.svg"
                          className="size-6 flex shrink-0"
                          alt="icon"
                        />
                        <span>{merchant.keeper.name}</span>
                      </p>
                    </div>
                  </div>
                  <hr className="border-monday-border" />
                  <div className="flex items-center gap-3">
                    <div className="flex size-16 rounded-2xl bg-monday-background items-center justify-center overflow-hidden">
                      <img
                        src={product.thumbnail}
                        className="size-full object-contain"
                        alt="icon"
                      />
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <p className="font-semibold text-xl">{product.name}</p>
                      <p className="font-semibold text-xl text-monday-blue">
                        Rp {product.price.toLocaleString("id")}
                      </p>
                    </div>
                    <div className="flex items-center gap-[6px] shrink-0">
                      <img
                        src="/assets/images/icons/box-black.svg"
                        className="size-6 flex shrink-0"
                        alt="icon"
                      />
                      <p className="font-semibold text-lg text-nowrap">
                        {initialStock} Stock
                      </p>
                    </div>
                  </div>
                </div>
                <h2 className="font-semibold text-xl">Update Stock</h2>
                <label className="group relative">
                  <div className="flex items-center pr-4 absolute transform -translate-y-1/2 top-1/2 left-6 border-r-[1.5px] border-monday-border ">
                    <img
                      src="/assets/images/icons/box-grey.svg"
                      className="flex size-6 shrink-0"
                      alt="icon"
                    />
                  </div>
                  <p className="placeholder font-medium text-monday-gray text-sm absolute -translate-y-1/2 left-[81px] top-[25px] group-has-[:placeholder-shown]:top-[36px] group-focus-within:top-[25px] transition-300">
                    Type a Stock
                  </p>
                  <input
                    type="number"
                    {...register("stock", { valueAsNumber: true })}
                    className="appearance-none w-full h-[72px] font-semibold text-lg rounded-3xl border-[1.5px] border-monday-border pl-20 pr-6 pb-[14.5px] pt-[34.5px] placeholder-shown:pt-[14.5px] focus:border-monday-black transition-300"
                    placeholder=""
                  />
                </label>
                {errors.stock && (
                  <p className="text-red-500">{errors.stock.message}</p>
                )}
                <div className="flex items-center justify-end gap-4">
                  <Link
                    to={`/merchant-products/${merchant.id}`}
                    className="btn btn-red font-semibold"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary font-semibold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
            <div className="flex flex-col w-full h-fit rounded-3xl p-[18px] gap-3 bg-white">
              <p className="font-semibold">Quick Guide to Add Stock Product</p>
              <ul className="flex flex-col gap-4">
                <li className="flex gap-[6px]">
                  <img
                    src="/assets/images/icons/Checklist-green-circle.svg"
                    className="flex size-6 shrink-0"
                    alt="check icon"
                  />
                  <p className="font-medium leading-[140%]">
                    Thoroughly review warehouse and product details to ensure
                    all information is accurate.
                  </p>
                </li>

                <li className="flex gap-[6px]">
                  <img
                    src="/assets/images/icons/Checklist-green-circle.svg"
                    className="flex size-6 shrink-0"
                    alt="check icon"
                  />
                  <p className="font-medium leading-[140%]">
                    Enter the stock quantity precisely to maintain correct
                    inventory records and avoid discrepancies.
                  </p>
                </li>

                <li className="flex gap-[6px]">
                  <img
                    src="/assets/images/icons/Checklist-green-circle.svg"
                    className="flex size-6 shrink-0"
                    alt="check icon"
                  />
                  <p className="font-medium leading-[140%]">
                    Verify merchant and product identifiers (merchant name,
                    product ID/SKU) before updating stock.
                  </p>
                </li>

                <li className="flex gap-[6px]">
                  <img
                    src="/assets/images/icons/Checklist-green-circle.svg"
                    className="flex size-6 shrink-0"
                    alt="check icon"
                  />
                  <p className="font-medium leading-[140%]">
                    Double-check all entries and related fields to ensure
                    completeness prior to saving.
                  </p>
                </li>

                <li className="flex gap-[6px]">
                  <img
                    src="/assets/images/icons/Checklist-green-circle.svg"
                    className="flex size-6 shrink-0"
                    alt="check icon"
                  />
                  <p className="font-medium leading-[140%]">
                    Save changes to apply the update and confirm the inventory
                    reflects the new stock level.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditAssignProduct;
