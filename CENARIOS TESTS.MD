ARTE 2 — Matriz de Cenários de Manipulação
Aqui está cada cenário possível, o que acontece, o risco e como o sistema corrigido lida.
🔴 Cenário 1: Atacante apaga o cookie refresh_token
EtapaO que aconteceAntesUtilizador logado em /dashboardAçãoBrowser apaga cookie refresh_token (DevTools)Próximo requestMiddleware: hasRefreshToken = false → não autenticadoResultadoRedirect para /auth/login?from=/dashboardRisco⚪ Nenhum — é só logout forçadoUXTela de login normal

🔴 Cenário 2: Atacante apaga apenas o access_token, mantém refresh_token
EtapaO que aconteceAçãoApaga só access_token no DevToolsMiddlewareVê refresh_token válido → autenticado, deixa passarClienteFaz request à API → 401 (sem access token)Interceptor axiosDetecta 401 → chama /auth/refresh com refresh token → recebe novo access token → atualiza cookie → retenta request originalResultado✅ Tudo funciona transparente, utilizador nem notaRisco⚪ Nenhum

🟠 Cenário 3: Atacante muda o role no cookie de CASHIER para ADMIN
EtapaO que aconteceAçãoEdita cookie user_role no DevTools: CASHIER → ADMINMiddlewareisValidRole("ADMIN") ✅ → role aceita para redirectTenta acessar /admin/dashboardMiddleware deixa passar (tem refresh token)AuthProvideruseFetchUser busca /auth/me no backendBackendRetorna o user REAL com role CASHIER (não confia no cookie)RouteProtectorallowed=["ADMIN"] mas user.role === "CASHIER" → unauthorizedResultadoRedirect para /unauthorizedRisco⚪ Zero, desde que o backend valide o role no /auth/me⚠️ ImportanteNunca confiar no cookie de role para autorização. Sempre do backend.

🔴 Cenário 4: Atacante coloca role inválido "SUPERUSER" ou string lixo
EtapaO que aconteceAçãoEdita cookie user_role para SUPERUSERMiddlewareisValidRole("SUPERUSER") ❌LógicaTem refresh token mas role inválido → limpa todos os cookies + redirect para loginResultadoLogout forçado, vai para /auth/loginRisco⚪ Nenhum — cookie manipulado é tratado como sessão corrompida

🔴 Cenário 5: Atacante apaga o cookie de role, mantém tokens
EtapaO que aconteceAçãoApaga só user_roleMiddlewarehasRefreshToken=true, role=undefined → cookies corrompidos → limpa tudo + loginResultadoLogout forçadoRisco⚪ Nenhum

🟠 Cenário 6: Refresh token expirado/revogado no servidor
EtapaO que aconteceSituaçãoUtilizador volta após 8 dias (refresh expirou)MiddlewareCookie ainda existe (TTL local) → deixa passaruseFetchUserChama /auth/me → 401InterceptorTenta refresh → /auth/refresh retorna 401InterceptorDispara evento session:expireduseFetchUserCaptura evento → chama clearLocalSession() → redirect loginResultado✅ Logout limpoRisco⚪ Nenhum

🟠 Cenário 7: Utilizador CASHIER tenta digitar URL /admin/dashboard
EtapaO que aconteceMiddlewareTem cookies válidos → deixa passarAuthProviderBusca user (CASHIER real do backend)RouteProtector (na página)allowed=["ADMIN"], user.role="CASHIER" → unauthorizedResultadoRedirect /unauthorizedUXTela "Não tens permissão"Risco⚪ Nenhum

🟠 Cenário 8: Plano insuficiente (Base tentando feature Pro)
EtapaO que aconteceUtilizadorOWNER com plano Base acede a /dashboard/analytics (requer Pro)RouteProtectorallowed OK, mas currentPlanLevel < required → plan_insufficientRedirectPara getRouteByRole(OWNER) = /dashboardResultadoVolta ao dashboard básicoUXIdeal: mostrar toast/modal "Upgrade necessário"Risco⚪ Nenhum no frontend, mas o backend tem que validar isto também

🔴 Cenário 9: Dois separadores abertos, logout num deles
EtapaO que aconteceAba 1/dashboardAba 2/settingsAção na Aba 1Click em "Logout" → cookies apagadosAba 2Próximo request à API → 401 → interceptor tenta refresh → falha → evento session:expiredAba 2Hard redirect para /auth/loginResultado✅ Ambas as abas sincronizadasMelhoria opcionalUsar BroadcastChannel ou storage event para sincronização imediata

🟠 Cenário 10: Atacante usa cookies de outro utilizador (roubo de sessão)
EtapaO que aconteceAçãoAtacante copia cookies da vítima e cola no próprio browserMiddlewareAceita (cookies válidos)Backend/auth/me retorna user da vítimaResultado🔴 Atacante tem acesso completoMitigaçãoCookies são httpOnly (não acessíveis via JS, protege de XSS), secure (só HTTPS), sameSite: lax (protege de CSRF parcial). Mas se o atacante tiver acesso físico ao device, está dentro.Recomendações extraFingerprinting (IP, User-Agent), refresh token rotativo, detecção de uso simultâneo

🟠 Cenário 11: Network down durante login
EtapaO que aconteceAçãoUtilizador clica "Entrar" sem internetloginActionapi.post throws → catch → messageError = "Network error"ResultadoForm mostra erro, utilizador permanece em /auth/loginRisco⚪ Nenhum, UX correta

🟠 Cenário 12: Backend retorna 500 em /auth/me
EtapaO que aconteceuseFetchUserErro 500 → não é 401, não tenta refreshHookquery.isError=true → chama clearLocalSession()ResultadoLogout forçadoProblema⚠️ Bug de servidor causa logout do utilizador (mau UX)Melhoria recomendadaDiferenciar 401 (logout) de 500 (mostrar erro retry-able)
Aqui está a versão mais refinada que recomendo:
typescript// Em useFetchUser, no error handler:
if (query.isError) {
  const status = (query.error as any)?.response?.status;
  if (status === 401 || status === 403) {
    // Sessão inválida → logout
    clearLocalSession().then(() => {
      setUser(null);
      setIsAuthenticating(false);
    });
  } else {
    // Erro de servidor → não desloga, mostra erro
    setIsAuthenticating(false);
    // toast.error("Erro ao carregar dados do utilizador. Tenta novamente.")
  }
}

🟠 Cenário 13: Múltiplos requests simultâneos com access token expirado
EtapaO que aconteceSituaçãoPágina carrega → faz 5 requests em paralelo, todos 401InterceptorSem proteção: 5 refreshes simultâneos → servidor revoga refresh token usado uma vez → caosCom fixPrimeiro request faz refresh, outros 4 entram em refreshQueue e aguardamResultado✅ Um único refresh, todos os requests retentam com novo tokenRisco⚪ Nenhum no código corrigido

🟠 Cenário 14: Utilizador faz login e atualiza role no backend (admin promoveu)
EtapaO que aconteceEstadoCookie tem role=CASHIER, backend agora tem MANAGERuseFetchUserDevolve MANAGERCookieContinua CASHIER → usado só para redirect inicial (não importa)RouteProtectorUsa user.role (= MANAGER) → permissões corretasResultado✅ Funciona, mas...Edge caseSe utilizador acede a /dashboard direto, middleware redireciona para /pos/counter (cookie diz CASHIER).SoluçãoAtualizar cookie após useFetchUser se role mudou:
typescript// No useFetchUser, após sucesso:
if (query.data && query.data.role !== cookieRole) {
  await updateRoleCookieAction(query.data.role);
}

🔴 Cenário 15: CSRF — atacante envia request em nome do utilizador
EtapaO que aconteceAçãoAtacante envia link com form malicioso <form action="...api/delete-account">BrowserEnvia cookies automaticamenteMitigaçãosameSite: "lax" impede envio de cookies em requests cross-siteResultado⚪ Bloqueado pelo browserLimitaçãolax permite GET cross-site com cookies. Se tens GET que modifica estado (😱), usa sameSite: "strict"

🔴 Cenário 16: XSS — script malicioso na página
EtapaO que aconteceAçãoAtacante injeta <script>fetch('/api/sensitive')</script>MitigaçãohttpOnly impede JS de ler cookies, mas o script ainda usa cookies do browser para fazer requests autenticadosResultado🔴 Atacante consegue agir como utilizador via fetchMitigação realCSP (Content Security Policy), sanitização de input, evitar dangerouslySetInnerHTML

Resumo dos comportamentos por utilizador
CenárioAtacante consegue?Tela mostradaApagar refresh tokenLogout do próprio/auth/loginMudar role para ADMIN no cookie❌ (backend rejeita)/unauthorizedRole lixo no cookie❌ (middleware limpa)/auth/loginAcessar rota acima da role❌/unauthorizedAcessar feature acima do plano❌Volta ao dashboardRoubar cookies (físico)✅ (limitação inerente)Acesso totalCSRF❌ (sameSite=lax)—XSS✅ se houver vulnerabilidadeDepende

Recomendações finais de segurança

Backend é a fonte autoritativa. Frontend só dá UX. Toda permissão é re-validada no servidor.
Refresh token rotativo: cada refresh emite novo refresh token, invalida o antigo. Detecta reuso = roubo.
Fingerprinting: associa sessão a IP/User-Agent. Mudança brusca = força re-login.
CSP estrito no next.config.js para mitigar XSS.
Rate limiting em /auth/login para prevenir brute force.
Logs de auditoria no backend: logins, logouts, mudanças de role, tentativas de acesso negado.
Não retornar role no /auth/me se não vais re-validá-lo no endpoint específico (cada endpoint privado deve verificar role).

Os 12 ficheiros estão prontos para uso. Queres que eu também faça o subscription-guard.tsx, ou queres ajuda em algum endpoint específico do backend (ex: refresh com rotação)?