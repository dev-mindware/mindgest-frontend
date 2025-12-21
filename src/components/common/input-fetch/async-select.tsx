import { useState } from "react";
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
