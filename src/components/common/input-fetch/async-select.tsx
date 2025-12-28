

import { useState } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import { api } from "@/services/api";
import { useDebounce } from "use-debounce";

interface Option {
  value: string | number;
  label: string;
  data?: any;
  __isNew__?: boolean;
}

interface AsyncCreatableSelectProps {
  endpoint: string;
  label: string;
  placeholder?: string;
  value: Option | null;
  onChange: (option: Option | null) => void;
  displayFields?: string[];
  minChars?: number;
  formatCreateLabel?: (inputValue: string) => string;
  className?: string;
  error?: string;
}

export function AsyncCreatableSelectField({
  endpoint,
  label,
  placeholder = "Digite para buscar...",
  value,
  onChange,
  displayFields = ["name"],
  minChars = 2,
  formatCreateLabel = (inputValue) => `Criar "${inputValue}"`,
  className,
  error,
}: AsyncCreatableSelectProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [loadOptions] = useDebounce(async (inputValue: string) => {
    if (inputValue.length < minChars) {
      return [];
    }

    setIsLoading(true);
    try {
      const response = await api.get(
        `${endpoint}?search=${encodeURIComponent(inputValue)}`
      );

      const data = Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : [];

      return data.map((item: any) => ({
        value: item.id,
        label: displayFields
          .map((field) => getNestedValue(item, field))
          .filter(Boolean)
          .join(" - "),
        data: item,
      }));
    } catch (error) {
      console.error("Erro ao buscar opções:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, 300);

  const getNestedValue = (obj: any, path: string): any => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  const handleCreate = (inputValue: string) => {
    const newOption: Option = {
      value: inputValue,
      label: inputValue,
      __isNew__: true,
    };
    onChange(newOption);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-foreground mb-1">
        {label}
      </label>

      <AsyncCreatableSelect
        cacheOptions
        defaultOptions
        value={value}
        loadOptions={loadOptions}
        onChange={onChange}
        onCreateOption={handleCreate}
        placeholder={placeholder}
        isLoading={isLoading}
        formatCreateLabel={formatCreateLabel}
        noOptionsMessage={({ inputValue }) =>
          inputValue.length < minChars
            ? `Digite pelo menos ${minChars} caracteres`
            : "Nenhum resultado encontrado"
        }
        loadingMessage={() => "Buscando..."}
        isClearable
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: "37px",
            height: "37px",
            borderRadius: "6.5px",
            borderColor: error
              ? "var(--destructive)"
              : state.isFocused
              ? "var(--ring)"
              : "var(--border)",
            backgroundColor: "var(--background)",
            boxShadow: state.isFocused
              ? error
                ? "0 0 0 1px var(--destructive)"
                : "0 0 0 1px var(--ring)"
              : "none",
            transition: "all 0.2s",
            "&:hover": {
              borderColor: error ? "var(--destructive)" : "var(--ring)",
            },
          }),

          valueContainer: (base) => ({
            ...base,
            padding: "0 12px",
          }),

          input: (base) => ({
            ...base,
            color: "var(--foreground)",
          }),

          placeholder: (base) => ({
            ...base,
            color: "var(--muted-foreground)",
          }),

          singleValue: (base) => ({
            ...base,
            color: "var(--foreground)",
          }),

          menu: (base) => ({
            ...base,
            borderRadius: "var(--radius)",
            backgroundColor: "var(--card)",
            boxShadow: "var(--shadow-lg)",
            overflow: "hidden",
          }),

          menuList: (base) => ({
            ...base,
            padding: "4px",
          }),

          option: (base, state) => ({
            ...base,
            borderRadius: "var(--radius-sm)",
            backgroundColor: state.isSelected
              ? "var(--primary)"
              : state.isFocused
              ? "var(--accent)"
              : "transparent",
            color: state.isSelected
              ? "var(--primary-foreground)"
              : "var(--foreground)",
            cursor: "pointer",
            padding: "10px 12px",
            ":active": {
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
            },
          }),

          dropdownIndicator: (base, state) => ({
            ...base,
            color: "var(--muted-foreground)",
            ":hover": {
              color: "var(--foreground)",
            },
          }),

          clearIndicator: (base) => ({
            ...base,
            color: "var(--muted-foreground)",
            ":hover": {
              color: "var(--foreground)",
            },
          }),

          indicatorSeparator: (base) => ({
            ...base,
            backgroundColor: "var(--border)",
          }),

          loadingIndicator: (base) => ({
            ...base,
            color: "var(--primary)",
          }),

          noOptionsMessage: (base) => ({
            ...base,
            color: "var(--muted-foreground)",
          }),
        }}
        className="react-select-container"
        classNamePrefix="react-select"
      />

      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
      {value?.__isNew__ && (
        <p className="mt-1 text-sm text-amber-600">
          ⚠️ Novo registro - preencha os dados adicionais
        </p>
      )}
    </div>
  );
}
/* import { useState } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import { api } from "@/services/api";
import { useDebounce } from "use-debounce";

interface Option {
  value: string | number;
  label: string;
  data?: any; // Dados completos do objeto da API
  __isNew__?: boolean;
}

interface AsyncCreatableSelectProps {
  endpoint: string;
  label: string;
  placeholder?: string;
  value: Option | null;
  onChange: (option: Option | null) => void;
  displayFields?: string[];
  minChars?: number;
  formatCreateLabel?: (inputValue: string) => string;
  className?: string;
  error?: string;
}

export function AsyncCreatableSelectField({
  endpoint,
  label,
  placeholder = "Digite para buscar...",
  value,
  onChange,
  displayFields = ["name"],
  minChars = 2,
  formatCreateLabel = (inputValue) => `Criar "${inputValue}"`,
  className,
  error,
}: AsyncCreatableSelectProps) {
  const [isLoading, setIsLoading] = useState(false);

  // const [debounceSearch] = useDebounce(search, 400);

  // Função para buscar opções na API
  const [loadOptions] = useDebounce(async (inputValue: string) => {
    if (inputValue.length < minChars) {
      return [];
    }

    setIsLoading(true);
    try {
      const response = await api.get(
        `${endpoint}?search=${encodeURIComponent(inputValue)}`
      );

      // Adapta a resposta da API para o formato do react-select
      const data = Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : [];

      return data.map((item: any) => ({
        value: item.id,
        label: displayFields
          .map((field) => getNestedValue(item, field))
          .filter(Boolean)
          .join(" - "),
        data: item, // Mantém os dados completos para uso posterior
      }));
    } catch (error) {
      console.error("Erro ao buscar opções:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, 300);

  // Função auxiliar para acessar propriedades aninhadas
  const getNestedValue = (obj: any, path: string): any => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  // Função chamada quando o usuário cria uma nova opção
  const handleCreate = (inputValue: string) => {
    const newOption: Option = {
      value: inputValue,
      label: inputValue,
      __isNew__: true,
    };
    onChange(newOption);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <AsyncCreatableSelect
        cacheOptions
        defaultOptions
        value={value}
        loadOptions={loadOptions}
        onChange={onChange}
        onCreateOption={handleCreate}
        placeholder={placeholder}
        isLoading={isLoading}
        formatCreateLabel={formatCreateLabel}
        noOptionsMessage={({ inputValue }) =>
          inputValue.length < minChars
            ? `Digite pelo menos ${minChars} caracteres`
            : "Nenhum resultado encontrado"
        }
        loadingMessage={() => "Buscando..."}
        styles={{
          control: (base, state) => ({
            ...base,
            borderColor: error
              ? "#ef4444"
              : state.isFocused
              ? "#3b82f6"
              : "#d1d5db",
            boxShadow: state.isFocused
              ? error
                ? "0 0 0 1px #ef4444"
                : "0 0 0 1px #3b82f6"
              : "none",
            "&:hover": {
              borderColor: error ? "#ef4444" : "#9ca3af",
            },
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
              ? "#3b82f6"
              : state.isFocused
              ? "#dbeafe"
              : "white",
            color: state.isSelected ? "white" : "#111827",
            cursor: "pointer",
          }),
        }}
        className="react-select-container"
        classNamePrefix="react-select"
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {value?.__isNew__ && (
        <p className="mt-1 text-sm text-amber-600">
          ⚠️ Novo registro - preencha os dados adicionais
        </p>
      )}
    </div>
  );
}
 */