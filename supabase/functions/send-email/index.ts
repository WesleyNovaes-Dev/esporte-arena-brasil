
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
    subject: `Bem-vindo ao Agenda Esporte, ${data.userName}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🏆 Agenda Esporte</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px;">
          <h2 style="color: #374151;">Bem-vindo, ${data.userName}! 🎉</h2>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
            Parabéns por se juntar à maior plataforma de esportes do Brasil! Agora você pode:
          </p>
          <ul style="color: #6b7280; font-size: 16px; line-height: 1.8;">
            <li>⚽ Criar e participar de eventos esportivos</li>
            <li>👥 Formar equipes e encontrar companheiros</li>
            <li>🏆 Participar de campeonatos</li>
            <li>📍 Descobrir eventos próximos a você</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${Deno.env.get('SITE_URL')}/dashboard" 
               style="background: linear-gradient(135deg, #10b981, #3b82f6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Começar Agora
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 14px; text-align: center;">
            Dúvidas? Responda este email que nossa equipe te ajuda!
          </p>
        </div>
      </div>
    `
  }),

  login: (data: any) => ({
    subject: `Olá novamente, ${data.userName}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">🏆 Agenda Esporte</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px;">
          <h2 style="color: #374151;">Bem-vindo de volta! 👋</h2>
          <p style="color: #6b7280; font-size: 16px;">
            Que bom te ver novamente, ${data.userName}! Continue aproveitando os melhores eventos esportivos.
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${Deno.env.get('SITE_URL')}/events" 
               style="background: linear-gradient(135deg, #10b981, #3b82f6); color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px;">
              Ver Eventos
            </a>
          </div>
        </div>
      </div>
    `
  }),

  event_created: (data: any) => ({
    subject: `Evento "${data.eventTitle}" criado com sucesso! 🎉`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">🏆 Agenda Esporte</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px;">
          <h2 style="color: #374151;">Evento Criado! 🎉</h2>
          <p style="color: #6b7280; font-size: 16px;">
            Parabéns! Seu evento foi criado e já está disponível para participações.
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="margin: 0 0 10px 0; color: #374151;">${data.eventTitle}</h3>
            <p style="margin: 5px 0; color: #6b7280;"><strong>📅 Data:</strong> ${new Date(data.eventDate).toLocaleDateString('pt-BR')}</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>⏰ Horário:</strong> ${data.eventTime}</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>📍 Local:</strong> ${data.location}</p>
          </div>
          <div style="text-align: center;">
            <a href="${Deno.env.get('SITE_URL')}/events" 
               style="background: linear-gradient(135deg, #10b981, #3b82f6); color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px;">
              Gerenciar Evento
            </a>
          </div>
        </div>
      </div>
    `
  }),

  event_joined: (data: any) => ({
    subject: `Confirmação: Você se inscreveu em "${data.eventTitle}"! ✅`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">🏆 Agenda Esporte</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px;">
          <h2 style="color: #374151;">Inscrição Confirmada! ✅</h2>
          <p style="color: #6b7280; font-size: 16px;">
            Oba! Você se inscreveu com sucesso no evento. Não esqueça dos detalhes:
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="margin: 0 0 10px 0; color: #374151;">${data.eventTitle}</h3>
            <p style="margin: 5px 0; color: #6b7280;"><strong>📅 Data:</strong> ${new Date(data.eventDate).toLocaleDateString('pt-BR')}</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>⏰ Horário:</strong> ${data.eventTime}</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>📍 Local:</strong> ${data.location}</p>
          </div>
          <p style="background: #fef3c7; padding: 15px; border-radius: 8px; color: #92400e; margin: 20px 0;">
            💡 <strong>Dica:</strong> Adicione o evento ao seu calendário para não esquecer!
          </p>
        </div>
      </div>
    `
  }),

  new_participant: (data: any) => ({
    subject: `Nova inscrição no seu evento "${data.eventTitle}"! 🎉`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">🏆 Agenda Esporte</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px;">
          <h2 style="color: #374151;">Nova Inscrição! 🎉</h2>
          <p style="color: #6b7280; font-size: 16px;">
            Ótimas notícias! <strong>${data.participantName}</strong> se inscreveu no seu evento:
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="margin: 0 0 10px 0; color: #374151;">${data.eventTitle}</h3>
            <p style="margin: 5px 0; color: #6b7280;"><strong>📅 Data:</strong> ${new Date(data.eventDate).toLocaleDateString('pt-BR')}</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>⏰ Horário:</strong> ${data.eventTime}</p>
          </div>
          <div style="text-align: center;">
            <a href="${Deno.env.get('SITE_URL')}/events" 
               style="background: linear-gradient(135deg, #10b981, #3b82f6); color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px;">
              Ver Participantes
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

    // If 'to' is a user ID, get the email
    let emailAddress = to;
    if (to.length === 36 && to.includes('-')) { // UUID format
      const { data: userData } = await supabase.auth.admin.getUserById(to);
      if (userData.user?.email) {
        emailAddress = userData.user.email;
      }
    }

    const template = emailTemplates[type as keyof typeof emailTemplates];
    if (!template) {
      throw new Error(`Email template '${type}' not found`);
    }

    const emailContent = template(data);

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
