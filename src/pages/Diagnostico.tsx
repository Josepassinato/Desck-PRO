import { useState } from "react";
import { DiagnosticoWizard } from "@/components/diagnostico/DiagnosticoWizard";
import { DiagnosticoResultado } from "@/components/diagnostico/DiagnosticoResultado";
import {
  executarDiagnostico,
  type DadosEmpresaDiagnostico,
  type ResultadoDiagnostico,
} from "@/engine/diagnostico";

export function Diagnostico() {
  const [resultado, setResultado] = useState<ResultadoDiagnostico | null>(null);

  const handleExecutar = (dados: DadosEmpresaDiagnostico) => {
    const result = executarDiagnostico(dados);
    setResultado(result);
  };

  if (resultado) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Resultado do Diagnostico
          </h1>
          <p className="text-muted-foreground">
            Avaliacao multidimensional para migracao de regime tributario
          </p>
        </div>
        <DiagnosticoResultado
          resultado={resultado}
          onVoltar={() => setResultado(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Diagnostico de Migracao
        </h1>
        <p className="text-muted-foreground">
          Preencha os dados da empresa para executar a avaliacao 6-dimensional
        </p>
      </div>
      <DiagnosticoWizard onExecutar={handleExecutar} />
    </div>
  );
}
