import { createContext, useContext, useState, useCallback, useEffect } from "react";

interface EmpresaContextType {
  selectedEmpresaId: string;
  selectedEmpresaNome: string;
  setEmpresa: (id: string, nome: string) => void;
  clearEmpresa: () => void;
}

const EmpresaContext = createContext<EmpresaContextType | undefined>(undefined);

const STORAGE_KEY = "desckpro-empresa-selecionada";

export function EmpresaProvider({ children }: { children: React.ReactNode }) {
  const [selectedEmpresaId, setSelectedEmpresaId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY + "-id") ?? "";
    } catch {
      return "";
    }
  });

  const [selectedEmpresaNome, setSelectedEmpresaNome] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY + "-nome") ?? "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    try {
      if (selectedEmpresaId) {
        localStorage.setItem(STORAGE_KEY + "-id", selectedEmpresaId);
        localStorage.setItem(STORAGE_KEY + "-nome", selectedEmpresaNome);
      } else {
        localStorage.removeItem(STORAGE_KEY + "-id");
        localStorage.removeItem(STORAGE_KEY + "-nome");
      }
    } catch {
      // ignore
    }
  }, [selectedEmpresaId, selectedEmpresaNome]);

  const setEmpresa = useCallback((id: string, nome: string) => {
    setSelectedEmpresaId(id);
    setSelectedEmpresaNome(nome);
  }, []);

  const clearEmpresa = useCallback(() => {
    setSelectedEmpresaId("");
    setSelectedEmpresaNome("");
  }, []);

  return (
    <EmpresaContext.Provider
      value={{ selectedEmpresaId, selectedEmpresaNome, setEmpresa, clearEmpresa }}
    >
      {children}
    </EmpresaContext.Provider>
  );
}

export function useEmpresaGlobal() {
  const context = useContext(EmpresaContext);
  if (!context) {
    throw new Error("useEmpresaGlobal must be used within EmpresaProvider");
  }
  return context;
}
