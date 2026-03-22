import { useState } from "react";
import {
  Users,
  Shield,
  UserCheck,
  User,
  Trash2,
  Plus,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/auth";
import { useUsers, useUpdateUserRole, useDeleteUser } from "@/hooks/useUsers";
import type { UserRole } from "@/types/auth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const ROLE_CONFIG: Record<
  UserRole,
  { label: string; icon: typeof Shield; className: string }
> = {
  admin: {
    label: "Administrador",
    icon: Shield,
    className: "text-purple-700 bg-purple-100",
  },
  accountant: {
    label: "Contador",
    icon: UserCheck,
    className: "text-blue-700 bg-blue-100",
  },
  client: {
    label: "Cliente",
    icon: User,
    className: "text-gray-700 bg-gray-100",
  },
};

export function AdminUsuarios() {
  const { user: currentUser } = useAuth();
  const { data: users = [], isLoading } = useUsers();
  const updateRoleMutation = useUpdateUserRole();
  const deleteMutation = useDeleteUser();
  const [inviteOpen, setInviteOpen] = useState(false);

  const handleRoleChange = async (userId: string, role: UserRole) => {
    try {
      await updateRoleMutation.mutateAsync({ userId, role });
      toast.success("Perfil atualizado");
    } catch {
      toast.error("Erro ao atualizar perfil");
    }
  };

  const handleDelete = async (userId: string, name: string) => {
    if (userId === currentUser?.id) {
      toast.error("Voce nao pode remover seu proprio usuario");
      return;
    }
    try {
      await deleteMutation.mutateAsync(userId);
      toast.success(`${name} removido`);
    } catch {
      toast.error("Erro ao remover usuario");
    }
  };

  const admins = users.filter((u) => u.role === "admin");
  const accountants = users.filter((u) => u.role === "accountant");
  const clients = users.filter((u) => u.role === "client");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground">
            Gestao de usuarios e permissoes do escritorio
          </p>
        </div>
        <Button onClick={() => setInviteOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Convidar Usuario
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Shield className="mx-auto h-6 w-6 text-purple-600 mb-1" />
            <p className="text-2xl font-bold">{admins.length}</p>
            <p className="text-xs text-muted-foreground">Administradores</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <UserCheck className="mx-auto h-6 w-6 text-blue-600 mb-1" />
            <p className="text-2xl font-bold">{accountants.length}</p>
            <p className="text-xs text-muted-foreground">Contadores</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <User className="mx-auto h-6 w-6 text-gray-600 mb-1" />
            <p className="text-2xl font-bold">{clients.length}</p>
            <p className="text-xs text-muted-foreground">Clientes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equipe</CardTitle>
          <CardDescription>
            {users.length} usuario(s) no escritorio
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Carregando...
            </p>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground mt-2">
                Nenhum usuario encontrado
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {users.map((u) => {
                const config = ROLE_CONFIG[u.role];
                const RoleIcon = config.icon;
                const isCurrentUser = u.id === currentUser?.id;

                return (
                  <div
                    key={u.id}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {u.full_name?.charAt(0)?.toUpperCase() ?? "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {u.full_name}
                        </span>
                        {isCurrentUser && (
                          <span className="text-xs text-muted-foreground">
                            (voce)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <Select
                      value={u.role}
                      onValueChange={(v) =>
                        handleRoleChange(u.id, v as UserRole)
                      }
                      disabled={isCurrentUser}
                    >
                      <SelectTrigger className="w-40 h-8">
                        <div className="flex items-center gap-1.5">
                          <RoleIcon className="h-3 w-3" />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ROLE_CONFIG).map(([role, cfg]) => (
                          <SelectItem key={role} value={role}>
                            {cfg.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!isCurrentUser && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(u.id, u.full_name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <InviteDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
      />
    </div>
  );
}

function InviteDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("accountant");
  const [password, setPassword] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !password) return;

    setIsCreating(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name, role } },
      });

      if (error) throw error;

      if (data.user) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("accounting_firm_id")
          .single();

        await supabase.from("user_profiles").insert({
          id: data.user.id,
          email,
          full_name: name,
          role,
          accounting_firm_id: profile?.accounting_firm_id,
        });
      }

      toast.success(`Convite enviado para ${email}`);
      setEmail("");
      setName("");
      setPassword("");
      setRole("accountant");
      onClose();
    } catch {
      toast.error("Erro ao criar usuario");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convidar Usuario</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nome Completo</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do usuario"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
            />
          </div>
          <div>
            <Label>Senha Temporaria</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha inicial"
            />
          </div>
          <div>
            <Label>Perfil</Label>
            <Select
              value={role}
              onValueChange={(v) => setRole(v as UserRole)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="accountant">Contador</SelectItem>
                <SelectItem value="client">Cliente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isCreating || !email || !name || !password}
            >
              <Mail className="mr-2 h-4 w-4" />
              {isCreating ? "Criando..." : "Criar Usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
