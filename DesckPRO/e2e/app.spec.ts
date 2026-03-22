import { test, expect } from "@playwright/test";

test.describe("DesckPRO — Fluxos Criticos", () => {
  test("pagina de login renderiza corretamente", async ({ page }) => {
    await page.goto("/login");

    // Logo e titulo
    await expect(page.locator("text=DesckPRO")).toBeVisible();
    await expect(
      page.locator("text=Diagnostico de migracao fiscal")
    ).toBeVisible();

    // Campos de formulario
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText("Entrar");
  });

  test("login com credenciais invalidas mostra erro", async ({ page }) => {
    await page.goto("/login");

    await page.locator("#email").fill("teste@invalido.com");
    await page.locator("#password").fill("senhaerrada123");
    await page.locator('button[type="submit"]').click();

    // Botao muda para loading
    await expect(page.locator('button[type="submit"]')).toHaveText(
      "Entrando..."
    );

    // Mensagem de erro aparece (toast)
    await expect(page.locator('[data-sonner-toast]')).toBeVisible({
      timeout: 10000,
    });
  });

  test("rota protegida redireciona para login", async ({ page }) => {
    await page.goto("/empresas");
    // Sem auth, deve redirecionar para /login
    await page.waitForURL("**/login", { timeout: 5000 });
    await expect(page.locator("text=DesckPRO")).toBeVisible();
  });

  test("rota /admin/usuarios redireciona sem auth", async ({ page }) => {
    await page.goto("/admin/usuarios");
    await page.waitForURL("**/login", { timeout: 5000 });
  });

  test("rota inexistente redireciona para home/login", async ({ page }) => {
    await page.goto("/pagina-que-nao-existe");
    // Deve redirecionar — para login (sem auth) ou home (com auth)
    await page.waitForURL(/\/(login)?$/, { timeout: 5000 });
  });

  test("formulario de login tem acessibilidade basica", async ({ page }) => {
    await page.goto("/login");

    // Labels associadas aos inputs
    const emailLabel = page.locator('label[for="email"]');
    await expect(emailLabel).toBeVisible();
    await expect(emailLabel).toHaveText("Email");

    const passwordLabel = page.locator('label[for="password"]');
    await expect(passwordLabel).toBeVisible();
    await expect(passwordLabel).toHaveText("Senha");

    // Inputs tem autocomplete
    await expect(page.locator("#email")).toHaveAttribute(
      "autocomplete",
      "email"
    );
    await expect(page.locator("#password")).toHaveAttribute(
      "autocomplete",
      "current-password"
    );
  });

  test("formulario nao submete com campos vazios (HTML validation)", async ({
    page,
  }) => {
    await page.goto("/login");

    // Tenta submeter sem preencher
    await page.locator('button[type="submit"]').click();

    // Deve permanecer na pagina de login (HTML required previne submit)
    await expect(page).toHaveURL(/\/login/);
  });
});
