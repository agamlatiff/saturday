import { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSearch } from "../context/SearchContext";
import { navigationSections } from "../config/navigation";

interface SearchResultItem {
  label: string;
  path: string;
  icon?: string;
  section: string;
}

const flattenNavigation = (
  roles: string[],
  query: string
): SearchResultItem[] => {
  const normalizedQuery = query.trim().toLowerCase();

  return navigationSections
    .flatMap((section) => {
      return section.items.flatMap((item) => {
        const matchesRole = item.roles.some((role) => roles.includes(role));
        if (!matchesRole) return [];

        const baseItems: SearchResultItem[] = [];
        if (item.path) {
          baseItems.push({
            label: item.label,
            path: item.path,
            icon: item.iconBlack,
            section: section.section,
          });
        }

        if (item.children) {
          const childItems = item.children.map<SearchResultItem>((child) => ({
            label: child.label,
            path: child.path,
            icon: child.iconBlack,
            section: item.label,
          }));
          baseItems.push(...childItems);
        }

        return baseItems;
      });
    })
    .filter((item) =>
      normalizedQuery
        ? item.label.toLowerCase().includes(normalizedQuery)
        : true
    );
};

const SearchModal = () => {
  const { isOpen, close, query, setQuery } = useSearch();
  const { user } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(
    () => flattenNavigation(user?.roles ?? [], query),
    [user?.roles, query]
  );

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      if (event.key === "Enter") {
        event.preventDefault();
        if (results.length > 0) {
          navigate(results[0].path);
          close();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, navigate, close]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-start justify-center bg-black/30 px-4 py-20 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="flex items-center gap-3 border-b border-monday-border px-6 py-4">
          <img
            src="/assets/images/icons/search-normal-black.svg"
            className="size-5"
            alt="search"
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pages..."
            className="w-full border-none text-lg outline-none"
          />
          <button
            type="button"
            onClick={close}
            className="rounded-full bg-monday-gray-background px-3 py-1 text-sm font-medium text-monday-gray transition-300 hover:bg-monday-border"
          >
            Esc
          </button>
        </div>

        <div className="max-h-[320px] overflow-y-auto px-2 py-3">
          {results.length === 0 ? (
            <p className="px-4 py-8 text-center text-monday-gray">
              No matches found. Try a different keyword.
            </p>
          ) : (
            <ul className="flex flex-col">
              {results.map((item) => (
                <li key={`${item.section}-${item.path}`}>
                  <button
                    type="button"
                    onClick={() => {
                      navigate(item.path);
                      close();
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-300 hover:bg-monday-gray-background focus:bg-monday-gray-background focus:outline-none"
                  >
                    {item.icon && (
                      <span className="flex size-10 items-center justify-center rounded-xl bg-monday-gray-background">
                        <img src={item.icon} alt="" className="size-5" />
                      </span>
                    )}
                    <span className="flex flex-col">
                      <span className="font-semibold text-monday-black">
                        {item.label}
                      </span>
                      <span className="text-sm text-monday-gray">
                        {item.section}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-monday-border px-6 py-3 text-xs text-monday-gray">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-monday-gray-background px-2 py-1 font-semibold">
              Ctrl
            </span>
            <span className="rounded-md bg-monday-gray-background px-2 py-1 font-semibold">
              K
            </span>
            <span>Open search</span>
          </div>
          <span>Press Enter to navigate</span>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SearchModal;

