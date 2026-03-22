import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { consultarCNPJ } from "@/services/governamental/apiIntegration";
import { formatCNPJ } from "@/components/client-access/formatCNPJ";
import { validateCNPJ } from "@/utils/validators";
import { updateClient } from "@/services/supabase/clientsService";

const formSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  cnpj: z.string()
    .min(14, { message: "CNPJ deve ter 14 dígitos" })
    .refine(val => validateCNPJ(val), { message: "CNPJ inválido" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().optional(),
  address: z.string().optional(),
  regime: z.enum(["lucro_presumido", "simples_nacional", "lucro_real"], { 
    required_error: "Selecione o regime tributário" 
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface ClientFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  client?: any; // Cliente existente para edição
}

export function ClientForm({ onSuccess, onCancel, client }: ClientFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCNPJ, setIsLoadingCNPJ] = useState(false);

  const isEditing = !!client;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: client?.name || "",
      cnpj: client?.cnpj || "",
      email: client?.email || "",
      phone: client?.phone || "",
      address: client?.address || "",
      regime: client?.regime || undefined,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log(`=== ${isEditing ? 'ATUALIZANDO' : 'CADASTRANDO'} CLIENTE ===`);
      console.log("Dados do cliente:", data);
      
      // Preparar dados para inserção/atualização
      const clientData = {
        name: data.name,
        cnpj: data.cnpj,
        email: data.email,
        phone: data.phone || null,
        address: data.address || null,
        regime: data.regime,
        status: "active" as const,
        accounting_firm_id: null
      };
      
      console.log(`Dados preparados para ${isEditing ? 'atualização' : 'inserção'}:`, clientData);
      
      if (isEditing && client) {
        // Atualizar cliente existente
        const success = await updateClient(client.id, clientData);
        
        if (!success) {
          throw new Error("Erro ao atualizar o cliente");
        }
        
        console.log("✅ Cliente atualizado com sucesso");
        
        toast({
          title: "Cliente atualizado com sucesso",
          description: `${data.name} foi atualizado no sistema.`,
        });
        
        if (onSuccess) {
          console.log("Chamando callback de sucesso...");
          onSuccess();
        }
      } else {
        // Criar novo cliente
        const { data: insertedData, error } = await supabase
          .from('accounting_clients')
          .insert([clientData])
          .select();
        
        if (error) {
          console.error("Erro do Supabase:", error);
          throw error;
        }
        
        console.log("Cliente inserido com sucesso:", insertedData);
        
        if (insertedData && insertedData.length > 0) {
          const clientId = insertedData[0].id;
          console.log(`✅ Cliente cadastrado com ID: ${clientId}`);
          
          toast({
            title: "Cliente cadastrado com sucesso",
            description: `${data.name} foi cadastrado e está disponível no sistema.`,
          });
          
          // Limpar formulário apenas se não estivermos editando
          form.reset();
          
          if (onSuccess) {
            console.log("Chamando callback de sucesso...");
            onSuccess();
          }
        } else {
          throw new Error("Nenhum dado foi retornado após a inserção");
        }
      }
    } catch (error: any) {
      console.error(`❌ ERRO ${isEditing ? 'NA ATUALIZAÇÃO' : 'NO CADASTRO'}:`, error);
      toast({
        title: `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} cliente`,
        description: error.message || `Ocorreu um erro ao ${isEditing ? 'atualizar' : 'salvar'} os dados do cliente.`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      console.log(`=== FIM ${isEditing ? 'DA ATUALIZAÇÃO' : 'DO CADASTRO'} ===`);
    }
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCNPJ = formatCNPJ(e.target.value);
    form.setValue("cnpj", formattedCNPJ);
  };

  const handleCNPJBlur = async () => {
    const cnpj = form.getValues("cnpj");
    if (cnpj && validateCNPJ(cnpj)) {
      setIsLoadingCNPJ(true);
      try {
        const resultado = await consultarCNPJ(cnpj.replace(/\D/g, ''));
        if (resultado.sucesso && resultado.dados) {
          if (resultado.dados.nome) {
            form.setValue("name", resultado.dados.nome);
          }
          if (resultado.dados.email) {
            form.setValue("email", resultado.dados.email);
          }
          if (resultado.dados.telefone) {
            form.setValue("phone", resultado.dados.telefone);
          }
          if (resultado.dados.endereco) {
            const enderecoCompleto = `${resultado.dados.endereco}, ${resultado.dados.numero || 'S/N'} - ${resultado.dados.bairro}, ${resultado.dados.cidade}/${resultado.dados.uf} - ${resultado.dados.cep}`;
            form.setValue("address", enderecoCompleto);
          }
          
          toast({
            title: "Dados preenchidos automaticamente",
            description: "As informações da empresa foram obtidas através do CNPJ.",
          });
        }
      } catch (error) {
        console.error("Erro ao consultar CNPJ:", error);
        toast({
          title: "Aviso",
          description: "Não foi possível obter informações automáticas para este CNPJ.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingCNPJ(false);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Empresa *</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome da empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNPJ *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="00.000.000/0000-00" 
                  {...field}
                  onChange={handleCNPJChange}
                  onBlur={handleCNPJBlur}
                  disabled={isLoadingCNPJ}
                />
              </FormControl>
              <FormDescription>
                {isLoadingCNPJ ? "Consultando informações..." : "Digite o CNPJ para preenchimento automático"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input placeholder="empresa@email.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="(11) 99999-9999" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Endereço completo da empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="regime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Regime Tributário *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o regime tributário" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="simples_nacional">Simples Nacional</SelectItem>
                  <SelectItem value="lucro_presumido">Lucro Presumido</SelectItem>
                  <SelectItem value="lucro_real">Lucro Real</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                O regime tributário determinará os cálculos automáticos aplicados para a empresa.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          )}
          {!isEditing && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => form.reset()}
              disabled={isSubmitting}
            >
              Limpar
            </Button>
          )}
          <Button 
            type="submit"
            disabled={isSubmitting || isLoadingCNPJ}
          >
            {isSubmitting 
              ? (isEditing ? "Atualizando..." : "Cadastrando...") 
              : isLoadingCNPJ 
                ? "Carregando..." 
                : (isEditing ? "Atualizar Cliente" : "Cadastrar Cliente")
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}