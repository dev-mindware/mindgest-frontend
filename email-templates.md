  --------------------------------TEMPLATE SUBSCRIPTION ACTIVATED EMAIL--------------------------------

  private getSubscriptionActivatedEmailTemplate(userName: string): string {
    return `
    <!DOCTYPE html>
    <html lang="pt">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Subscrição Ativada - MindGest</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
            body { font-family: 'Outfit', sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #712467; padding-bottom: 20px; margin-bottom: 20px; }
            .content { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .footer { text-align: center; font-size: 12px; color: #666; margin-top: 30px; }
            .button { display: inline-block; background: #712467; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1 style="color: #712467; margin: 0;">MindGest</h1>
        </div>
        <div class="content">
            <h2>Subscrição Ativada! 🎉</h2>
            <p>Olá <strong>${userName}</strong>,</p>
            <p>A sua subscrição foi ativada com sucesso. Estamos muito felizes por continuar a tê-lo connosco.</p>
            <p>Em anexo encontra o comprovativo de pagamento (Fatura/Recibo) referente a esta subscrição.</p>
            <center>
                <a href="${this.configService.get<string>('FRONTEND_URL')}" class="button" style="color: #fff;">Aceder à Minha Conta</a>
            </center>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} MINDWARE. Todos os direitos reservados.</p>
        </div>
    </body>
    </html>
    `;
  }

  --------------------------------TEMPLATE PASSWORD RESET EMAIL--------------------------------


  private getPasswordResetEmailTemplate(
    userName: string,
    resetUrl: string,
  ): string {
    return `
    <!DOCTYPE html>
    <html lang="pt">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redefinição de Senha - MindGest</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: 'Outfit', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #F3F4F6;
            }
            .container {
                background-color: #ffffff;
                padding: 40px;
                border-radius: 24px;
                box-shadow: 0 10px 25px rgba(113, 36, 103, 0.1);
                border: 1px solid #e5e7eb;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 30px;
                border-bottom: 1px solid #f3f4f6;
            }
            .logo-container {
                display: inline-flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 10px;
            }
            .logo-icon {
                width: 40px;
                height: 40px;
                background-color: #712467;
                color: white;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 20px;
                line-height: 40px;
                text-align: center;
            }
            .logo-text {
                font-size: 24px;
                font-weight: 800;
                color: #111827;
                letter-spacing: -0.025em;
            }
            .subtitle {
                color: #6b7280;
                font-size: 14px;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin-top: 5px;
            }
            .content {
                margin-bottom: 30px;
                text-align: left;
            }
            .greeting {
                font-size: 20px;
                font-weight: 700;
                margin-bottom: 20px;
                color: #111827;
            }
            .message {
                margin-bottom: 25px;
                line-height: 1.6;
                color: #4b5563;
                font-size: 16px;
            }
            .banner {
                background: linear-gradient(135deg, #712467 0%, #A855F7 100%);
                border-radius: 16px;
                padding: 30px;
                text-align: center;
                margin: 30px 0;
                color: white;
            }
            .banner-title {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 10px;
                color: white;
            }
            .banner-text {
                font-size: 14px;
                opacity: 0.9;
                margin-bottom: 20px;
                color: white;
            }
            .reset-button {
                display: inline-block;
                background-color: #ffffff;
                color: #712467;
                padding: 14px 32px;
                text-decoration: none;
                border-radius: 50px;
                font-weight: 700;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin: 0;
                transition: transform 0.2s;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .warning {
                background-color: #fffbeb;
                border: 1px solid #fcd34d;
                color: #92400e;
                padding: 16px;
                border-radius: 12px;
                margin: 20px 0;
                font-size: 14px;
                display: flex;
                align-items: start;
                gap: 10px;
            }
            .security-note {
                background-color: #f9fafb;
                border-radius: 12px;
                padding: 20px;
                margin: 20px 0;
                font-size: 13px;
                color: #6b7280;
                border: 1px solid #e5e7eb;
            }
            .security-note strong {
                color: #374151;
                display: block;
                margin-bottom: 8px;
            }
            .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
                color: #9ca3af;
                font-size: 12px;
                font-weight: 500;
            }
            .link-fallback {
                margin-top: 30px;
                font-size: 12px;
                color: #9ca3af;
                word-break: break-all;
                text-align: center;
            }
            .link-fallback a {
                color: #712467;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo-container">
                    <img src="cid:logo" alt="MindGest" style="height: 50px; width: auto; border-radius: 8px;" />
                    <!-- <div class="logo-text">MindGest</div> -->
                </div>
                <div class="subtitle">Recuperação de Acesso</div>
            </div>
            
            <div class="content">
                <div class="greeting">Olá, ${userName}</div>
                
                <div class="message">
                    Recebemos um pedido para redefinir a tua palavra-passe. Não te preocupes, acontece aos melhores!
                </div>
                
                <div class="banner">
                    <div class="banner-title">Vamos recuperar o teu acesso?</div>
                    <div class="banner-text">Clica no botão abaixo para criares uma nova palavra-passe segura.</div>
                    <a href="${resetUrl}" class="reset-button">Redefinir Palavra-passe</a>
                </div>
                
                <div class="warning">
                    <span>⚠️</span>
                    <div>
                        <strong>Importante:</strong> Este link expira em 60 minutos por questões de segurança.
                    </div>
                </div>
                
                <div class="security-note">
                    <strong>🔒 Nota de Segurança MindGest</strong>
                    • Se não pediste esta alteração, podes ignorar este email com segurança.<br>
                    • A tua palavra-passe atual continuará a funcionar até que a alteres.<br>
                    • A nossa equipa nunca te pedirá a tua palavra-passe por email ou telefone.
                </div>
                
                <div class="link-fallback">
                    Se o botão não funcionar, copia este link:<br>
                    <a href="${resetUrl}">${resetUrl}</a>
                </div>
            </div>
            
            <div class="footer">
                <p>&copy; 2026 MINDWARE CORP | Todos os direitos reservados</p>
                <p>MindGest - O futuro da sua gestão empresarial.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }



  --------------------------------TEMPLATE PASSWORD RESET EMAIL TEXT--------------------------------

  private getPasswordResetEmailText(
    userName: string,
    resetUrl: string,
  ): string {
    return `
Olá, ${userName}!

Recebemos uma solicitação para redefinir a senha da sua conta no MindGest.

Se você fez esta solicitação, acesse o seguinte link para criar uma nova senha:
${resetUrl}

IMPORTANTE: Este link é válido por apenas 1 hora por motivos de segurança.

NOTA DE SEGURANÇA:
- Se você não solicitou esta redefinição, ignore este email
- Nunca compartilhe este link com outras pessoas
- O link expira automaticamente após 1 hora
- Sua senha atual permanece ativa até que você a altere

Este é um email automático, não responda a esta mensagem.

© 2024 MindGest - Sistema de Facturação e Gestão
    `;
  }

  --------------------------------TEMPLATE WELCOME OWNER EMAIL--------------------------------

  private getWelcomeOwnerTemplate(
    userName: string,
    companyName: string,
  ): string {
    return `
    <!DOCTYPE html>
    <html lang="pt">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo à MindGest</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
            body { font-family: 'Outfit', sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #712467; padding-bottom: 20px; margin-bottom: 20px; }
            .content { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .footer { text-align: center; font-size: 12px; color: #666; margin-top: 30px; }
            .button { display: inline-block; background: #712467; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
            .highlight { color: #712467; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1 style="color: #712467; margin: 0;">MindGest</h1>
        </div>
        <div class="content">
            <h2>Bem-vindo à Revolução na Gestão! 🚀</h2>
            <p>Olá <span class="highlight">${userName}</span>,</p>
            <p>É com enorme prazer que lhe damos as boas-vindas à <span class="highlight">MindGest</span>! A sua empresa <span class="highlight">${companyName}</span> foi registada com sucesso.</p>
            <p>Agora você tem acesso a uma plataforma completa para gerir o seu negócio de forma inteligente, rápida e segura.</p>
            <p><strong>O que pode fazer agora?</strong></p>
            <ul>
                <li>Configurar os dados da sua Loja.</li>
                <li>Cadastrar os seus primeiros produtos/serviços.</li>
                <li>Convidar a sua equipa (Gerentes e Caixas).</li>
                <li>Começar a facturar em conformidade com a AGT.</li>
            </ul>
            <center>
                <a href="${this.configService.get<string>('FRONTEND_URL')}" class="button" style="color: #fff;">Começar Agora</a>
            </center>
            <p>Se tiver qualquer dúvida, a nossa equipa de suporte está à disposição.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} MINDWARE. Todos os direitos reservados.</p>
        </div>
    </body>
    </html>
    `;
  }

  --------------------------------TEMPLATE WELCOME USER EMAIL--------------------------------


  private getWelcomeUserTemplate(
    userName: string,
    role: string,
    companyName: string,
  ): string {
    const roleMap: Record<string, string> = {
      MANAGER: 'Gerente',
      CASHIER: 'Operador de Caixa',
      ADMIN: 'Administrador de Sistema',
    };
    const roleDisplay = roleMap[role] || role;

    return `
    <!DOCTYPE html>
    <html lang="pt">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Novo Acesso MindGest</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
            body { font-family: 'Outfit', sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #712467; padding-bottom: 20px; margin-bottom: 20px; }
            .content { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .footer { text-align: center; font-size: 12px; color: #666; margin-top: 30px; }
            .button { display: inline-block; background: #712467; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
            .highlight { color: #712467; font-weight: bold; }
            .badge { background: #f3f4f6; padding: 5px 10px; border-radius: 12px; font-size: 13px; font-weight: bold; color: #712467; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1 style="color: #712467; margin: 0;">MindGest</h1>
        </div>
        <div class="content">
            <h2>Olá ${userName}! 👋</h2>
            <p>Você foi convidado para se juntar à equipa da <span class="highlight">${companyName}</span> no MindGest.</p>
            <p>Foi-lhe atribuído o perfil de: <span class="badge">${roleDisplay}</span></p>
            <p>A partir de agora, poderá aceder ao portal para realizar as suas tarefas diárias com toda a agilidade que a nossa plataforma oferece.</p>
            <p><strong>Dicas para começar:</strong></p>
            <ul>
                <li>Aceda utilizando as credenciais fornecidas pelo seu administrador.</li>
                <li>Verifique as suas permissões de acesso.</li>
                <li>Mantenha o seu perfil sempre actualizado.</li>
            </ul>
            <center>
                <a href="${this.configService.get<string>('FRONTEND_URL')}" class="button" style="color: #fff;">Aceder ao Portal</a>
            </center>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} MINDWARE. Todos os direitos reservados.</p>
        </div>
    </body>
    </html>
    `;
  }
