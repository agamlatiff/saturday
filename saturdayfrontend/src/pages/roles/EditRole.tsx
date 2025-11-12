import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useFetchRole, useUpdateRole } from "../../hooks/useRoles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RoleFormData, roleSchema } from "../../schemas/roleSchema";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "../../types/types";
import UserProfileCard from "../../components/UserProfileCard";
import SearchButton from "../../components/SearchButton";

const EditRole = () => {
  const { id } = useParams<{ id: string }>();
  const { data: role, isLoading } = useFetchRole(Number(id));
  const { mutate: updateRole, isPending } = useUpdateRole();

  // ✅ React Hook Form Setup
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
  });

  // ✅ Populate form fields when role data is available
  useEffect(() => {
    if (role) {
      setValue("name", role.name);
    }
  }, [role, setValue]);

  const onSubmit = (data: RoleFormData) => {
    updateRole(
      { id: Number(id), ...data },
      {
        onError: (error: AxiosError<ApiErrorResponse>) => {
          if (error.response?.data.errors) {
            Object.entries(error.response.data.errors).forEach(
              ([key, messages]) => {
                setError(key as keyof RoleFormData, {
                  type: "server",
                  message: messages[0],
                });
              }
            );
          }
        },
      }
    );
  };

  if (isLoading) return <p>Loading role details...</p>;

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
              <h1 className="font-bold text-2xl">Edit Role</h1>
              <Link
                to={"/roles"}
                className="flex items-center gap-[6px] text-monday-gray font-semibold"
              >
                <img
                  src="/assets/images/icons/arrow-left-grey.svg"
                  className="size-4 flex shrink-0"
                  alt="icon"
                />
                Manage Roles
              </Link>
            </div>
            <div className="flex items-center flex-nowrap gap-3">
              <SearchButton />
            </div>
          </div>
          <UserProfileCard />
        </div>
        <main className="flex flex-col gap-6 flex-1">
          <div className="flex gap-6 flex-col md:flex-row">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col w-full h-fit rounded-3xl p-[18px] gap-5 bg-white"
            >
              <h2 className="font-semibold text-xl capitalize">
                Complete the form
              </h2>
              <label className="group relative">
                <div className="flex items-center pr-4 absolute transform -translate-y-1/2 top-1/2 left-6 border-r-[1.5px] border-monday-border ">
                  <img
                    src="/assets/images/icons/user-octagon-grey.svg"
                    className="flex size-6 shrink-0"
                    alt="icon"
                  />
                </div>
                <p className="placeholder font-medium text-monday-gray text-sm absolute -translate-y-1/2 left-[81px] top-[25px] group-has-[:placeholder-shown]:top-[36px] group-focus-within:top-[25px] transition-300">
                  Role Name
                </p>
                <input
                  {...register("name")}
                  type="text"
                  className="appearance-none w-full h-[72px] font-semibold text-lg rounded-3xl border-[1.5px] border-monday-border pl-20 pr-6 pb-[14.5px] pt-[34.5px] placeholder-shown:pt-[14.5px] focus:border-monday-black transition-300"
                  placeholder=""
                />
              </label>
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}

              <div className="flex items-center justify-end gap-4">
                <Link to={"/roles"} className="btn btn-red font-semibold">
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary font-semibold">
                  {isPending ? "Saving..." : "Save Role"}
                </button>
              </div>
            </form>
            <div className="flex flex-col w-full h-fit rounded-3xl p-[18px] gap-3 bg-white">
              <p className="font-semibold">Quick Guide to Edit Role</p>
              <ul className="flex flex-col gap-4">
                <li className="flex gap-[6px]">
                  <img
                    src="/assets/images/icons/Checklist-green-circle.svg"
                    className="flex size-6 shrink-0"
                    alt="check icon"
                  />
                  <p className="font-medium leading-[140%]">
                    Clearly define role responsibilities to maintain
                    accountability and clarity.
                  </p>
                </li>

                <li className="flex gap-[6px]">
                  <img
                    src="/assets/images/icons/Checklist-green-circle.svg"
                    className="flex size-6 shrink-0"
                    alt="check icon"
                  />
                  <p className="font-medium leading-[140%]">
                    Assign appropriate permissions — grant users only the access
                    necessary for their assigned role.
                  </p>
                </li>

                <li className="flex gap-[6px]">
                  <img
                    src="/assets/images/icons/Checklist-green-circle.svg"
                    className="flex size-6 shrink-0"
                    alt="check icon"
                  />
                  <p className="font-medium leading-[140%]">
                    Check for duplicate roles to avoid redundancy and maintain
                    clarity in system management.
                  </p>
                </li>

                <li className="flex gap-[6px]">
                  <img
                    src="/assets/images/icons/Checklist-green-circle.svg"
                    className="flex size-6 shrink-0"
                    alt="check icon"
                  />
                  <p className="font-medium leading-[140%]">
                    Use clear, concise, and consistent naming conventions for
                    easier identification.
                  </p>
                </li>

                <li className="flex gap-[6px]">
                  <img
                    src="/assets/images/icons/Checklist-green-circle.svg"
                    className="flex size-6 shrink-0"
                    alt="check icon"
                  />
                  <p className="font-medium leading-[140%]">
                    Review all role details and assigned permissions carefully
                    before saving the new role.
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

export default EditRole;
