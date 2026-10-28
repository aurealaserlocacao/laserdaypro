# Laser Day Pro

Sistema de gestão para clínicas que alugam equipamentos de depilação a laser.

## Stack inicial

- Next.js (App Router) + TypeScript
- Supabase: PostgreSQL, Auth e Storage
- Vercel: deploy e hospedagem
- Tailwind CSS + componentes acessíveis

## Módulos previstos

- Painel da clínica
- Agenda e atendimentos
- Cadastro e histórico de clientes
- Financeiro (recebimentos e despesas)
- Documentos, termos e consentimentos versionados
- Relatórios
- Administração da plataforma e gestão de clínicas

## Princípios de segurança

- Isolamento de dados por clínica (multi-tenant)
- Row Level Security (RLS) em tabelas acessíveis pelo cliente
- Autorização baseada em associação e função no banco, não em dados editáveis pelo usuário
- Chaves secretas apenas em ambiente server-side
- Coleta mínima de dados pessoais e atenção à LGPD

## Localização

Interface em português brasileiro, moeda BRL, datas DD/MM/AAAA e fuso horário padrão America/Sao_Paulo.

## Desenvolvimento

As variáveis de ambiente necessárias serão documentadas em `.env.example`. Nunca versionar segredos reais.