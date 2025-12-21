// Novo componente: AsyncSelectFetch.tsx (reutilizável)
import { useCallback } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import { api } from "@/services/api"; // Sua API

interface AsyncSelectFetchProps {
  label: string;
  endpoint: string;
  displayFields?: string[];
  onChange: (value: any) => void; // Adaptar para seu handleClientChange
  value?: any;
  placeholder?: string;
  minChars?: number;
}

export function AsyncSelectFetch({
  label,
  endpoint,
  displayFields = ["name"],
  onChange,
  value,
  placeholder = "Digite para buscar...",
  minChars = 2,
}: AsyncSelectFetchProps) {
  const loadOptions = useCallback(async (inputValue: string) => {
    if (inputValue.length < minChars) return [];
    try {
      const response = await api.get(`${endpoint}?search=${encodeURIComponent(inputValue)}`);
      const results = response.data.data || response.data || [];
      return results.map((item: any) => ({
        value: item.id,
        label: displayFields.map(field => item[field]).filter(Boolean).join(" - "),
        data: item, // Armazena o objeto completo
      }));
    } catch (error) {
      console.error("Erro na busca:", error);
      return [];
    }
  }, [endpoint, displayFields, minChars]);

  const handleChange = (selected: any) => {
    if (selected?.__isNew__) {
      // Manual: Cria nova opção
      onChange(selected.label, null); // Passa o texto digitado, null para fullObject
    } else {
      // Da API
      onChange(selected?.value, selected?.data || null);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <AsyncCreatableSelect
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        onChange={handleChange}
        value={value ? { value: value.id || value, label: value.name || value } : null}
        placeholder={placeholder}
        isClearable
        loadingMessage={() => "Buscando..."}
        noOptionsMessage={() => "Nenhum resultado - crie manualmente"}
        formatCreateLabel={(input) => `Usar "${input}" como manual`}
        classNamePrefix="react-select" // Para estilização custom
      />
    </div>
  );
}