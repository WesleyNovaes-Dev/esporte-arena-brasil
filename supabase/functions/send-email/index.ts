
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { Resend } from 'npm:resend@2.0.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  type: string;
  to: string;
  data: any;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const emailTemplates = {
  welcome: (data: any) => ({
    subject: `Bem-vindo ao Agenda Esporte, ${data.userName}! 🏆`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb;">
        <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🏆 Agenda Esporte</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">A maior plataforma de esportes do Brasil</p>
        </div>
        <div style="padding: 30px; background: white; border-radius: 0 0 10px 10px;">
          <h2 style="color: #374151; margin-bottom: 20px;">Bem-vindo, ${data.userName}! 🎉</h2>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            Parabéns por se juntar à nossa comunidade esportiva! Agora você pode aproveitar todos os recursos da plataforma:
          </p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">O que você pode fazer:</h3>
            <ul style="color: #6b7280; font-size: 16px; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li>⚽ Criar e participar de eventos esportivos</li>
              <li>👥 Formar e gerenciar equipes</li>
              <li>🏆 Organizar e participar de campeonatos</li>
              <li>📍 Descobrir eventos próximos à sua localização</li>
              <li>📊 Acompanhar rankings e estatísticas</li>
              <li>💬 Conectar-se com outros atletas</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://pspmhtufdhkdpqgpefgs.supabase.co/dashboard" 
               style="background: linear-gradient(135deg, #10b981, #3b82f6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Começar Agora
            </a>
          </div>
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #9ca3af; font-size: 14px; text-align: center; margin: 0;">
              💡 <strong>Dica:</strong> Complete seu perfil para ter uma experiência ainda melhor!
            </p>
          </div>
        </div>
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p style="margin: 0;">Dúvidas? Responda este email que nossa equipe te ajuda!</p>
        </div>
      </div>
    `
  }),

  login: (data: any) => ({
    subject: `Bem-vindo de volta, ${data.userName}! 👋`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb;">
        <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 25px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🏆 Agenda Esporte</h1>
        </div>
        <div style="padding: 30px; background: white; border-radius: 0 0 10px 10px;">
          <h2 style="color: #374151; margin-bottom: 15px;">Bem-vindo de volta! 👋</h2>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            Que bom te ver novamente, <strong>${data.userName}</strong>! Sua paixão pelo esporte nos inspira.
          </p>
          <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
            <p style="color: #065f46; margin: 0; font-size: 14px;">
              <strong>🎯 Novidades:</strong> Confira os novos eventos próximos a você e as últimas atualizações dos campeonatos!
            </p>
          </div>
          <div style="text-align: center; margin: 25px 0;">
            <a href="https://pspmhtufdhkdpqgpefgs.supabase.co/events" 
               style="background: linear-gradient(135deg, #10b981, #3b82f6); color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
              Ver Eventos Disponíveis
            </a>
          </div>
        </div>
      </div>
    `
  }),

  event_created: (data: any) => ({
    subject: `Evento "${data.eventTitle}" criado com sucesso! 🎉`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb;">
        <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 25px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🏆 Agenda Esporte</h1>
        </div>
        <div style="padding: 30px; background: white; border-radius: 0 0 10px 10px;">
          <h2 style="color: #374151; margin-bottom: 15px;">Evento Criado com Sucesso! 🎉</h2>
          <p style="color: #6b7280; font-size: 16px; margin-bottom: 25px;">
            Parabéns! Seu evento foi criado e já está disponível para participações na plataforma.
          </p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 18px;">📋 Detalhes do Evento</h3>
            <div style="space-y: 8px;">
              <p style="margin: 8px 0; color: #4b5563;"><strong>🏷️ Título:</strong> ${data.eventTitle}</p>
              <p style="margin: 8px 0; color: #4b5563;"><strong>📅 Data:</strong> ${new Date(data.eventDate).toLocaleDateString('pt-BR')}</p>
              <p style="margin: 8px 0; color: #4b5563;"><strong>⏰ Horário:</strong> ${data.eventTime}</p>
              <p style="margin: 8px 0; color: #4b5563;"><strong>📍 Local:</strong> ${data.location}</p>
            </div>
          </div>
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              <strong>📢 Próximos passos:</strong> Compartilhe seu evento com amigos e acompanhe as inscrições no painel de controle!
            </p>
          </div>
          <div style="text-align: center; margin: 25px 0;">
            <a href="https://pspmhtufdhkdpqgpefgs.supabase.co/events" 
               style="background: linear-gradient(135deg, #10b981, #3b82f6); color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
              Gerenciar Meus Eventos
            </a>
          </div>
        </div>
      </div>
    `
  }),

  event_joined: (data: any) => ({
    subject: `Inscrição confirmada em "${data.eventTitle}"! ✅`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb;">
        <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 25px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🏆 Agenda Esporte</h1>
        </div>
        <div style="padding: 30px; background: white; border-radius: 0 0 10px 10px;">
          <h2 style="color: #374151; margin-bottom: 15px;">Inscrição Confirmada! ✅</h2>
          <p style="color: #6b7280; font-size: 16px; margin-bottom: 25px;">
            Oba! Você se inscreveu com sucesso no evento. Prepare-se para mais uma experiência esportiva incrível!
          </p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #166534; font-size: 18px;">🎯 Detalhes da sua Participação</h3>
            <div style="space-y: 8px;">
              <p style="margin: 8px 0; color: #166534;"><strong>🏷️ Evento:</strong> ${data.eventTitle}</p>
              <p style="margin: 8px 0; color: #166534;"><strong>📅 Data:</strong> ${new Date(data.eventDate).toLocaleDateString('pt-BR')}</p>
              <p style="margin: 8px 0; color: #166534;"><strong>⏰ Horário:</strong> ${data.eventTime}</p>
              <p style="margin: 8px 0; color: #166534;"><strong>📍 Local:</strong> ${data.location}</p>
            </div>
          </div>
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              <strong>⏰ Lembrete:</strong> Chegue 15 minutos antes do horário marcado e não esqueça de levar água e equipamentos necessários!
            </p>
          </div>
          <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
            <p style="color: #1e40af; margin: 0; font-size: 14px;">
              <strong>📱 Dica:</strong> Adicione o evento ao seu calendário para não esquecer!
            </p>
          </div>
          <div style="text-align: center; margin: 25px 0;">
            <a href="https://pspmhtufdhkdpqgpefgs.supabase.co/events" 
               style="background: linear-gradient(135deg, #10b981, #3b82f6); color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
              Ver Meus Eventos
            </a>
          </div>
        </div>
      </div>
    `
  }),

  new_participant: (data: any) => ({
    subject: `Nova inscrição no seu evento "${data.eventTitle}"! 🎉`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb;">
        <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 25px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🏆 Agenda Esporte</h1>
        </div>
        <div style="padding: 30px; background: white; border-radius: 0 0 10px 10px;">
          <h2 style="color: #374151; margin-bottom: 15px;">Nova Inscrição! 🎉</h2>
          <p style="color: #6b7280; font-size: 16px; margin-bottom: 25px;">
            Ótimas notícias! Mais uma pessoa se interessou pelo seu evento e acabou de se inscrever.
          </p>
          <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #0c4a6e; font-size: 18px;">👤 Novo Participante</h3>
            <p style="margin: 8px 0; color: #0c4a6e;"><strong>🏷️ Nome:</strong> ${data.participantName}</p>
            <p style="margin: 8px 0; color: #0c4a6e;"><strong>🎯 Evento:</strong> ${data.eventTitle}</p>
            <p style="margin: 8px 0; color: #0c4a6e;"><strong>📅 Data:</strong> ${new Date(data.eventDate).toLocaleDateString('pt-BR')}</p>
            <p style="margin: 8px 0; color: #0c4a6e;"><strong>⏰ Horário:</strong> ${data.eventTime}</p>
          </div>
          <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
            <p style="color: #065f46; margin: 0; font-size: 14px;">
              <strong>📊 Gestão:</strong> Acompanhe todos os participantes e gerencie seu evento através do painel organizador!
            </p>
          </div>
          <div style="text-align: center; margin: 25px 0;">
            <a href="https://pspmhtufdhkdpqgpefgs.supabase.co/events" 
               style="background: linear-gradient(135deg, #10b981, #3b82f6); color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
              Ver Lista de Participantes
            </a>
          </div>
        </div>
      </div>
    `
  }),

  team_created: (data: any) => ({
    subject: `Time "${data.teamName}" criado com sucesso! 🏆`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb;">
        <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 25px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🏆 Agenda Esporte</h1>
        </div>
        <div style="padding: 30px; background: white; border-radius: 0 0 10px 10px;">
          <h2 style="color: #374151; margin-bottom: 15px;">Time Criado! 🏆</h2>
          <p style="color: #6b7280; font-size: 16px; margin-bottom: 25px;">
            Parabéns! Seu time foi criado e já está disponível para novos membros na plataforma.
          </p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 18px;">⚽ Detalhes do Time</h3>
            <p style="margin: 8px 0; color: #4b5563;"><strong>🏷️ Nome:</strong> ${data.teamName}</p>
            <p style="margin: 8px 0; color: #4b5563;"><strong>🏃 Esporte:</strong> ${data.sportName}</p>
          </div>
          <div style="text-align: center; margin: 25px 0;">
            <a href="https://pspmhtufdhkdpqgpefgs.supabase.co/teams" 
               style="background: linear-gradient(135deg, #10b981, #3b82f6); color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
              Gerenciar Time
            </a>
          </div>
        </div>
      </div>
    `
  }),

  team_joined: (data: any) => ({
    subject: `Você entrou no time "${data.teamName}"! 🎯`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb;">
        <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 25px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🏆 Agenda Esporte</h1>
        </div>
        <div style="padding: 30px; background: white; border-radius: 0 0 10px 10px;">
          <h2 style="color: #374151; margin-bottom: 15px;">Bem-vindo ao Time! 🎯</h2>
          <p style="color: #6b7280; font-size: 16px; margin-bottom: 25px;">
            Parabéns! Você agora faz parte do time <strong>${data.teamName}</strong>. Prepare-se para grandes jogos!
          </p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="https://pspmhtufdhkdpqgpefgs.supabase.co/teams" 
               style="background: linear-gradient(135deg, #10b981, #3b82f6); color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
              Ver Meus Times
            </a>
          </div>
        </div>
      </div>
    `
  })
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, to, data }: EmailRequest = await req.json();

    console.log('Email request received:', { type, to: to.substring(0, 5) + '***' });

    // If 'to' is a user ID, get the email
    let emailAddress = to;
    if (to.length === 36 && to.includes('-')) { // UUID format
      const { data: userData } = await supabase.auth.admin.getUserById(to);
      if (userData.user?.email) {
        emailAddress = userData.user.email;
      } else {
        console.error('User email not found for ID:', to);
        throw new Error('User email not found');
      }
    }

    const template = emailTemplates[type as keyof typeof emailTemplates];
    if (!template) {
      console.error('Email template not found:', type);
      throw new Error(`Email template '${type}' not found`);
    }

    const emailContent = template(data);

    console.log('Sending email to:', emailAddress, 'Subject:', emailContent.subject);

    const emailResponse = await resend.emails.send({
      from: 'Agenda Esporte <noreply@agendaesporte.com>',
      to: [emailAddress],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error('Error in send-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
