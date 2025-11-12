import { useSearch } from "../context/SearchContext";

interface SearchButtonProps {
  className?: string;
}

const SearchButton = ({ className = "" }: SearchButtonProps) => {
  const { open } = useSearch();

  return (
    <button
      type="button"
      onClick={open}
      className={`flex size-14 rounded-full bg-monday-gray-background items-center justify-center overflow-hidden transition-300 hover:bg-monday-border focus:outline-none focus-visible:ring-2 focus-visible:ring-monday-blue/40 ${className}`}
      aria-label="Open search"
    >
      <img
        src="/assets/images/icons/search-normal-black.svg"
        className="sm:size-6 size-5"
        alt="search"
      />
    </button>
  );
};

export default SearchButton;

