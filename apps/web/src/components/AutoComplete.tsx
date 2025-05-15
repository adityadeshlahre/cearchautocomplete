import { parseAsInteger, useQueryState } from "nuqs";
import { useSearchProduct } from "../hooks/useSearchProduct";
import { useEffect, useState } from "react";

const AutoComplete = () => {
  const [query, setQuery] = useQueryState("q");
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10)
  );
  const [skip, setSkip] = useQueryState("skip", parseAsInteger.withDefault(0));
  const [inputValue, setInputValue] = useState(query || "");
  const { products, isLoading, total } = useSearchProduct();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setQuery(inputValue || null);
    }, 400);
    return () => clearTimeout(timeout);
  }, [inputValue]);

  const onLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setSkip(0);
  };

  const onPrevPage = () => {
    setSkip(Math.max((skip || 0) - (limit || 10), 0));
  };

  const onNextPage = () => {
    setSkip(Math.min((skip || 0) + (limit || 10), total - (limit || 10)));
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Type something..."
        value={inputValue}
        className="border-2 border-gray-300 rounded-md p-2"
        onChange={(e) => setInputValue(e.target.value)}
      />

      <div className="mb-2">
        <label>
          Items per page:{" "}
          <select value={limit || 10} onChange={onLimitChange}>
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mb-2">
        <button onClick={onPrevPage} disabled={(skip || 0) === 0}>
          Prev
        </button>
        <button
          onClick={onNextPage}
          disabled={(skip || 0) + (limit || 10) >= total}
        >
          Next
        </button>
      </div>
      {isLoading && <div>Loading...</div>}
      {!isLoading && products.length > 0 && (
        <ul>
          {products.map((p) => (
            <li key={p.id}>{p.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoComplete;
