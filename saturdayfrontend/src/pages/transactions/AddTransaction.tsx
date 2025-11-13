import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import StepOne from "./components/StepOne";
import StepTwo from "./components/StepTwo";
import StepThree from "./components/StepThree";
import UserProfileCard from "../../components/UserProfileCard";
import ProductModal from "./components/ProductModal";
import { Link } from "react-router-dom";
import SearchButton from "../../components/SearchButton";

const AddTransaction = () => {
  const [step, setStep] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const steps = [
    {
      label: "Customer Detail",
      iconActive: "/assets/images/icons/tick-square-blue.svg",
      iconInactive: "/assets/images/icons/tick-square-grey.svg",
    },
    {
      label: "Assign Products",
      iconActive: "/assets/images/icons/tick-square-blue.svg",
      iconInactive: "/assets/images/icons/tick-square-grey.svg",
    },
    {
      label: "Review Transaction",
      iconActive: "/assets/images/icons/tick-square-blue.svg",
      iconInactive: "/assets/images/icons/tick-square-grey.svg",
    },
  ];

  const ProgressBar = ({ step }: { step: number }) => {
    return (
      <div className="flex justify-between relative w-full h-auto sm:h-[127px] rounded-3xl p-[18px] bg-white">
        {steps.map((item, index) => {
          const isDone = step > index + 1;
          const isActive = step === index + 1;

          return (
            <div
              key={index}
              className="relative flex flex-col gap-2 sm:gap-3 items-center text-center w-full"
            >
              <img
                src={
                  isDone
                    ? "/assets/images/icons/tick-square-checked-blue.svg"
                    : isActive
                    ? item.iconActive
                    : item.iconInactive
                }
                className="size-6 sm:size-8"
                alt="icon"
              />

              <div className="flex flex-col gap-1">
                <p className="font-medium text-xs sm:text-sm text-monday-gray">
                  Step {index + 1}
                </p>
                <p className="font-semibold text-sm sm:text-lg hidden sm:block">
                  {item.label}
                </p>
              </div>

              {/* Render line to next step - only show if not the last step */}
              {index < steps.length - 1 && (
                <div className="absolute top-[28px] sm:top-[34px] left-[50%] h-[3px] w-full sm:max-w-[calc(100%-32px)] sm:max-w-none max-w-full">
                  <img
                    src={
                      isDone
                        ? "/assets/images/icons/Line-blue.svg"
                        : isActive
                        ? "/assets/images/icons/line-half-blue.svg"
                        : "/assets/images/icons/Line-grey.svg"
                    }
                    className="size-full object-cover"
                    alt="line"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

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
            className="flex items-center w-full gap-6 mt-[30px] mb-6 lg:flex-row"
          >
            <div className="flex items-center gap-6 h-[92px] bg-white w-full rounded-3xl p-[18px]">
              <div className="flex flex-col gap-[6px] w-full">
                <h1 className="font-bold text-xl sm:text-2xl">
                  Add New Transaction
                </h1>
                <Link
                  to={"/transactions"}
                  className="flex items-center gap-[6px] text-monday-gray font-semibold"
                >
                  <img
                    src="/assets/images/icons/arrow-left-grey.svg"
                    className="size-4 flex shrink-0"
                    alt="icon"
                  />
                  Manage Transactions
                </Link>
              </div>
              <div className="flex items-center flex-nowrap gap-3">
                <SearchButton />
              </div>
            </div>
            <UserProfileCard />
          </div>

          <main className="flex flex-col gap-6 flex-1">
            <ProgressBar step={step} />

            {step === 1 && <StepOne handleNextStep={() => setStep(2)} />}

            {step === 2 && (
              <StepTwo
                handleNextStep={() => setStep(3)}
                handlePrevStep={() => setStep(1)}
                handleOpenModal={() => setIsModalOpen(true)} // tambahan ini
              />
            )}
            {step === 3 && <StepThree handlePrevStep={() => setStep(2)} />}
          </main>
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default AddTransaction;
