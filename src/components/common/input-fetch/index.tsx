import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui";
import { icons } from "lucide-react";
import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

interface InputFetchProps {
  startIcon: keyof typeof icons;
  label: string;
  endpoint: string;
  displayFields?: string[];
  onValueChange?: (value: string | number) => void;
  placeholder?: string;
  debounceMs?: number;
  minChars?: number;
}

interface Option {
  id: number | string;
  [key: string]: any;
}

export function InputFetch({
  startIcon,
  label,
  endpoint,
  displayFields = ['name'],
  onValueChange,
  placeholder = "Digite para buscar...",
  debounceMs = 300,
  minChars = 2
}: InputFetchProps) {
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue] = useDebounce(inputValue, debounceMs);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // React Query para buscar dados
  const { data: options = [], isLoading: loading } = useQuery({
    queryKey: ['input-fetch', endpoint, debouncedValue],
    queryFn: async () => {
      if (debouncedValue.trim().length < minChars) return [];
      
      const response = await api.get(`${endpoint}?search=${encodeURIComponent(debouncedValue)}`);
      const responseData = response.data;
      
      if (responseData && typeof responseData === 'object') {
        if (Array.isArray(responseData.data)) {
          return responseData.data;
        } else if (Array.isArray(responseData)) {
          return responseData;
        }
      }
      return [];
    },
    enabled: debouncedValue.trim().length >= minChars,
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Abre o dropdown quando houver resultados e o input tiver foco
  useEffect(() => {
    if (options.length > 0 && inputValue.trim().length >= minChars) {
      setIsOpen(true);
    } else if (options.length === 0 && !loading) {
      // Opcional: fechar se não houver resultados, mas manter aberto se estiver carregando pode ser melhor UX
      // setIsOpen(false); 
    }
  }, [options, inputValue, minChars, loading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (onValueChange) {
      // Se o usuário limpar o input ou mudar, talvez queiramos limpar o valor selecionado pai
      // Mas aqui estamos passando o valor raw do input por enquanto se necessário
      // onValueChange(value); // Depende da lógica de negócio se deve passar o texto ou só ID
    }
  };

  const handleSelectOption = (option: Option) => {
    const displayText = displayFields
      .map(field => getNestedValue(option, field))
      .filter(Boolean)
      .join(' - ');
    
    setInputValue(displayText);
    setIsOpen(false);
    
    if (onValueChange) {
      onValueChange(option.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const renderOptionContent = (option: Option) => {
    return displayFields.map((field, index) => {
      const value = getNestedValue(option, field);
      
      if (!value) return null;

      return (
        <span key={field} className="block">
          {index === 0 ? (
            <span className="font-medium text-gray-900">{value}</span>
          ) : (
            <span className="text-sm text-gray-500">{value}</span>
          )}
        </span>
      );
    });
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <Input
        startIcon={startIcon}
        label={label}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
            if (inputValue.trim().length >= minChars && options.length > 0) {
                setIsOpen(true);
            }
        }}
        placeholder={placeholder}
        autoComplete="off"
      />
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="px-4 py-3 text-sm text-muted-foreground text-center flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Buscando...
            </div>
          ) : options.length > 0 ? (
            options.map((option: Option) => (
              <div
                key={option.id}
                onClick={() => handleSelectOption(option)}
                className="px-4 py-3 hover:bg-accent hover:text-accent-foreground cursor-pointer transition border-b border-border last:border-b-0"
              >
                {renderOptionContent(option)}
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-muted-foreground text-center">
              Nenhum resultado encontrado
            </div>
          )}
        </div>
      )}
    </div>
  );
}