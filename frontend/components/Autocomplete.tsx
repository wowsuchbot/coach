'use client';

import { useState, useEffect, useRef } from 'react';

interface AutocompleteProps {
  value: string | number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  endpoint: string;
  labelField?: string;
  valueField?: string;
  filter?: Record<string, string>;
}

export function Autocomplete({
  value,
  onChange,
  placeholder = 'Search...',
  endpoint,
  labelField = 'title',
  valueField = 'id',
  filter
}: AutocompleteProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value && !selectedLabel) {
      fetchSelectedItem();
    }
  }, [value]);

  const fetchSelectedItem = async () => {
    try {
      const res = await fetch(`${endpoint}/${value}`);
      if (res.ok) {
        const item = await res.json();
        setSelectedLabel(item[labelField]);
      }
    } catch (error) {
      console.error('Error fetching item:', error);
    }
  };

  const fetchSuggestions = async (searchQuery: string) => {
    try {
      const res = await fetch(endpoint);
      if (res.ok) {
        let items = await res.json();
        
        // Apply filter if provided
        if (filter) {
          Object.entries(filter).forEach(([key, val]) => {
            items = items.filter((item: any) => item[key] === val);
          });
        }
        
        // Filter by query
        if (searchQuery) {
          items = items.filter((item: any) =>
            item[labelField].toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        setSuggestions(items.slice(0, 5)); // Limit to 5 suggestions
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    setShowSuggestions(true);
    fetchSuggestions(newValue);
  };

  const handleSelectSuggestion = (item: any) => {
    onChange(item[valueField]);
    setSelectedLabel(item[labelField]);
    setQuery('');
    setShowSuggestions(false);
  };

  const handleClear = () => {
    onChange(null);
    setSelectedLabel('');
    setQuery('');
  };

  const handleFocus = () => {
    if (!selectedLabel) {
      setShowSuggestions(true);
      fetchSuggestions(query);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="relative">
      {selectedLabel ? (
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-300">
            {selectedLabel}
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
              {suggestions.map((item) => (
                <li
                  key={item[valueField]}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-700 text-white"
                  onClick={() => handleSelectSuggestion(item)}
                >
                  {item[labelField]}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
