/**
 * Serviço de envio de pacotes para ContaFlux.
 * Gerencia fila de envio, retry e monitoramento.
 */

import { supabase } from "@/lib/supabase";
import type { PacoteContaFlux, TipoPacote, ValidacaoResult } from "./contrato";
import { validarPacote } from "./contrato";

export interface EnvioStatus {
  id: string;
  empresa_id: string;
  tipo_pacote: TipoPacote;
  competencia: string;
  status: "pending" | "sending" | "sent" | "accepted" | "rejected" | "error";
  contaflux_ref: string | null;
  retry_count: number;
  last_error: string | null;
  sent_at: string | null;
  accepted_at: string | null;
  created_at: string;
}

export const contafluxService = {
  /**
   * Prepara e registra um pacote para envio.
   */
  async registrarEnvio(
    empresaId: string,
    pacote: PacoteContaFlux
  ): Promise<{ id: string; validacao: ValidacaoResult }> {
    const validacao = validarPacote(pacote);

    if (!validacao.valido) {
      return { id: "", validacao };
    }

    const { data, error } = await supabase
      .from("contaflux_envios")
      .insert({
        empresa_id: empresaId,
        tipo_pacote: pacote.tipo,
        competencia: pacote.competencia,
        payload_hash: pacote.hash,
        payload_size: JSON.stringify(pacote.dados).length,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) throw error;

    return { id: data.id, validacao };
  },

  /**
   * Lista envios de uma empresa.
   */
  async listarEnvios(empresaId: string): Promise<EnvioStatus[]> {
    const { data, error } = await supabase
      .from("contaflux_envios")
      .select("*")
      .eq("empresa_id", empresaId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return data as EnvioStatus[];
  },

  /**
   * Conta envios por status.
   */
  async contarPorStatus(
    empresaId: string
  ): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from("contaflux_envios")
      .select("status")
      .eq("empresa_id", empresaId);

    if (error) throw error;

    const contagem: Record<string, number> = {};
    for (const row of data) {
      contagem[row.status] = (contagem[row.status] ?? 0) + 1;
    }
    return contagem;
  },

  /**
   * Simula envio (em produção, chamaria a API da ContaFlux).
   */
  async enviar(envioId: string): Promise<void> {
    // Marcar como enviando
    await supabase
      .from("contaflux_envios")
      .update({ status: "sending" })
      .eq("id", envioId);

    // TODO: Em produção, aqui faria POST para API da ContaFlux
    // com retry e backoff exponencial.
    // Por enquanto, marca como enviado.
    await supabase
      .from("contaflux_envios")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
      })
      .eq("id", envioId);
  },
};
