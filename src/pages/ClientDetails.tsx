import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, Mail, FileText, Edit, Loader2 } from 'lucide-react';
import { fetchClientById } from '@/services/supabase/clientsService';
import { AccountingClient } from '@/lib/supabase';
import { ClientForm } from '@/components/clients/ClientForm';

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAccountant } = useAuth();
  const { toast } = useToast();
  const [client, setClient] = useState<AccountingClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/clientes');
      return;
    }

    const loadClient = async () => {
      try {
        setIsLoading(true);
        const clientData = await fetchClientById(id);
        
        if (!clientData) {
          setError('Cliente não encontrado');
          toast({
            title: 'Erro',
            description: 'Cliente não encontrado',
            variant: 'destructive'
          });
          return;
        }
        
        setClient(clientData);
      } catch (error) {
        console.error('Erro ao carregar cliente:', error);
        setError('Erro ao carregar dados do cliente');
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os dados do cliente',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadClient();
  }, [id, navigate, toast]);

  const handleBack = () => {
    navigate('/clientes');
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    toast({
      title: 'Sucesso',
      description: 'Cliente atualizado com sucesso!',
    });
    // Recarregar os dados do cliente
    if (id) {
      fetchClientById(id).then(clientData => {
        if (clientData) {
          setClient(clientData);
        }
      });
    }
  };

  if (!isAuthenticated || !isAccountant) {
    navigate('/login');
    return null;
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando dados do cliente...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !client) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Cliente não encontrado</h3>
              <p className="text-muted-foreground text-center">
                O cliente solicitado não foi encontrado ou você não tem permissão para visualizá-lo.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{client.name}</h1>
              <p className="text-muted-foreground">Detalhes do cliente</p>
            </div>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? 'Cancelar Edição' : 'Editar Cliente'}
          </Button>
        </div>

        {isEditing ? (
          <Card>
            <CardHeader>
              <CardTitle>Editar Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <ClientForm
                client={client}
                onSuccess={handleEditSuccess}
                onCancel={() => setIsEditing(false)}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Informações da Empresa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nome</label>
                  <p className="text-sm">{client.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">CNPJ</label>
                  <p className="text-sm">{client.cnpj}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Regime Tributário</label>
                  <div className="mt-1">
                    <Badge variant="outline">
                      {client.regime === "lucro_presumido" && "Lucro Presumido"}
                      {client.regime === "simples_nacional" && "Simples Nacional"}
                      {client.regime === "lucro_real" && "Lucro Real"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge className={client.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {client.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{client.email}</p>
                </div>
                {client.phone && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                    <p className="text-sm">{client.phone}</p>
                  </div>
                )}
                {client.address && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Endereço</label>
                    <p className="text-sm">{client.address}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informações Adicionais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Data de Cadastro</label>
                    <p className="text-sm">
                      {new Date(client.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Última Atualização</label>
                    <p className="text-sm">
                      {new Date(client.updated_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientDetails;