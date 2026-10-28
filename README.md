# Aliados Burguer

Sistema web para registrar o caixa diário e acompanhar os insumos da loja. O
backend usa Express e PostgreSQL, e serve o frontend responsivo em JavaScript.

## Requisitos

- Node.js 18 ou superior
- PostgreSQL 14 ou superior

## Configuração do banco

Crie um banco PostgreSQL chamado `aliados_burguer` (ou escolha outro nome) e
configure a URL de conexão no arquivo `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:SUA_SENHA@localhost:5432/aliados_burguer
JWT_SECRET=COLOQUE_UMA_CHAVE_ALEATORIA_AQUI
```

Troque `SUA_SENHA` pela senha do usuário PostgreSQL. Gere uma chave para
`JWT_SECRET` com:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Para PostgreSQL em nuvem que exige SSL, adicione também `PGSSL=true`. A conexão
SSL valida o certificado do servidor.

Na primeira inicialização, o backend cria as tabelas e o índice necessários
automaticamente. Não compartilhe o arquivo `.env` nem publique as credenciais.

## Iniciar o sistema

No PowerShell:

```powershell
cd "C:\Users\Lenovo\Documents\GitHub\Aliados-Burguer\backend"
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Não é necessário iniciar
o frontend em um terminal separado: ele é servido pelo backend. Deixe o
terminal aberto enquanto usa o sistema.

## Funcionalidades

- Lançamento diário por data, com dia da semana preenchido automaticamente.
- Registro de valor recebido, sangria, motivo da sangria e valor do motoboy.
- Saldo calculado como recebido menos sangria e motoboy.
- Histórico completo de todos os dias cadastrados, com edição por data.
- Cadastro, edição e exclusão de insumos com preço unitário e quantidade.
- Resumo do estoque com quantidade total e valor calculado dos insumos.
- Layout adaptável para celular, tablet e desktop.

As tabelas utilizadas são `daily_cash`, `ingredients` e `users`. Os dados
existentes no MongoDB não são transferidos automaticamente; exporte-os e
importe-os no PostgreSQL se precisar preservá-los.
