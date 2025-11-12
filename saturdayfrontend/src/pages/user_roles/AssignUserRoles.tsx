import { useState } from "react";

import { useFetchUsers } from "../../hooks/useUsers";
import { useFetchRoles } from "../../hooks/useRoles";
import Sidebar from "../../components/Sidebar";
import { useAssignUserRole } from "../../hooks/useAssignRoles";
import UserProfileCard from "../../components/UserProfileCard";
import { Link } from "react-router-dom";
import SearchButton from "../../components/SearchButton";

const AssignUserRole = () => {
  const { data: users, isPending: loadingUsers } = useFetchUsers();
  const { data: roles, isPending: loadingRoles } = useFetchRoles();
  const {
    mutate: assignRole,
    isPending: isAssigning,
    error,
  } = useAssignUserRole();

  const [userId, setUserId] = useState("");
  const [roleId, setRoleId] = useState("");

  const handleAssignRole = () => {
    if (!userId || !roleId) return;
    assignRole({ user_id: Number(userId), role_id: Number(roleId) });
  };

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
              <h1 className="font-bold text-xl md:text-2xl">
                Assign Role to User
              </h1>
              <Link
                to={"/users"}
                className="flex items-center gap-[6px] text-monday-gray font-semibold"
              >
                <img
                  src="/assets/images/icons/arrow-left-grey.svg"
                  className="size-4 flex shrink-0"
                  alt="icon"
                />
                User Roles
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
            <div className="flex flex-col w-full h-fit rounded-3xl p-[18px] gap-5 bg-white">
              <h2 className="font-semibold text-xl capitalize">
                Complete the form
              </h2>

              {error && <p className="text-red-500">{error.message}</p>}

              <label className="group relative rounded-3xl border-[1.5px] border-monday-border focus-within:border-monday-black transition-300 overflow-hidden">
                <div className="flex items-center pr-4 absolute transform -translate-y-1/2 top-1/2 left-6 border-r-[1.5px] border-monday-border ">
                  <img
                    src="/assets/images/icons/profile-circle-grey.svg"
                    className="flex size-6 shrink-0"
                    alt="icon"
                  />
                </div>
                <p className="placeholder font-medium text-monday-gray text-sm absolute -translate-y-1/2 left-[81px] top-[25px] group-has-[:invalid]:top-[36px] group-focus-within:top-[25px] transition-300">
                  Select User Id
                </p>

                {loadingUsers ? (
                  <p>Loading users...</p>
                ) : (
                  <select
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    disabled={loadingUsers}
                    className="appearance-none w-full h-[72px] font-semibold text-lg outline-none pl-20 pr-6 pb-[14.5px] pt-[32px]"
                  >
                    <option value="">Select role</option>

                    {users?.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                )}
                <img
                  src="/assets/images/icons/arrow-down-grey.svg"
                  className="absolute transform -translate-y-1/2 top-1/2 right-6 size-6"
                  alt="icon"
                />
              </label>

              <label className="group relative rounded-3xl border-[1.5px] border-monday-border focus-within:border-monday-black transition-300 overflow-hidden">
                <div className="flex items-center pr-4 absolute transform -translate-y-1/2 top-1/2 left-6 border-r-[1.5px] border-monday-border ">
                  <img
                    src="/assets/images/icons/profile-tick-grey.svg"
                    className="flex size-6 shrink-0"
                    alt="icon"
                  />
                </div>
                <p className="placeholder font-medium text-monday-gray text-sm absolute -translate-y-1/2 left-[81px] top-[25px] group-has-[:invalid]:top-[36px] group-focus-within:top-[25px] transition-300">
                  Select Role ID
                </p>
                <select
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  disabled={loadingRoles}
                  className="appearance-none w-full h-[72px] font-semibold text-lg outline-none pl-20 pr-6 pb-[14.5px] pt-[32px]"
                >
                  <option value="">Select role</option>

                  {roles?.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <img
                  src="/assets/images/icons/arrow-down-grey.svg"
                  className="absolute transform -translate-y-1/2 top-1/2 right-6 size-6"
                  alt="icon"
                />
              </label>
              <div className="flex items-center justify-end gap-4">
                <Link to={"/users"} className="btn btn-red font-semibold">
                  Cancel
                </Link>

                <button
                  className="btn btn-primary font-semibold"
                  onClick={handleAssignRole}
                  disabled={isAssigning}
                >
                  {isAssigning ? "Assigning..." : "Save data"}
                </button>
              </div>
            </div>
            <div className="flex flex-col h-fit rounded-3xl p-[18px] gap-3 bg-white">
              <p className="font-semibold">
                Quick Guide to Assign Role To User
              </p>
              <ul className="flex flex-col gap-4">
                <li className="flex gap-[6px]">
                  <img
                    src="/assets/images/icons/Checklist-green-circle.svg"
                    className="flex size-6 shrink-0"
                    alt="check icon"
                  />
                  <p className="font-medium leading-[140%]">
                    Select the correct username from the list to ensure the role
                    is assigned to the intended user.
                  </p>
                </li>

                <li className="flex gap-[6px]">
                  <img
                    src="/assets/images/icons/Checklist-green-circle.svg"
                    className="flex size-6 shrink-0"
                    alt="check icon"
                  />
                  <p className="font-medium leading-[140%]">
                    Choose the most appropriate role based on the user’s
                    responsibilities and access needs.
                  </p>
                </li>

                <li className="flex gap-[6px]">
                  <img
                    src="/assets/images/icons/Checklist-green-circle.svg"
                    className="flex size-6 shrink-0"
                    alt="check icon"
                  />
                  <p className="font-medium leading-[140%]">
                    Review all details and permissions carefully to prevent
                    accidental over- or under-privileging.
                  </p>
                </li>

                <li className="flex gap-[6px]">
                  <img
                    src="/assets/images/icons/Checklist-green-circle.svg"
                    className="flex size-6 shrink-0"
                    alt="check icon"
                  />
                  <p className="font-medium leading-[140%]">
                    Avoid assigning duplicate or conflicting roles that could
                    cause redundancy or access issues.
                  </p>
                </li>

                <li className="flex gap-[6px]">
                  <img
                    src="/assets/images/icons/Checklist-green-circle.svg"
                    className="flex size-6 shrink-0"
                    alt="check icon"
                  />
                  <p className="font-medium leading-[140%]">
                    Confirm the assignment and save changes only after verifying
                    the user and role are correct.
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

export default AssignUserRole;
