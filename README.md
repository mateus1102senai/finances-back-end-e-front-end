# 💰 Gestor Financeiro Pessoal

Um aplicativo web completo para gerenciamento de finanças pessoais, desenvolvido com Next.js, React e Tailwind CSS.

## 🚀 Funcionalidades

### 🏠 **Dashboard Principal**
- Visão geral do saldo atual
- Resumo de receitas e despesas mensais
- Transações recentes
- Acesso rápido às principais funcionalidades
- Cards informativos com estatísticas financeiras

### 📝 **Gestão de Transações**
- Cadastro de receitas e despesas
- Categorização automática
- Filtros por tipo e categoria
- Histórico completo de transações
- Edição e exclusão de registros

### 📊 **Análise e Gráficos**
- Gráfico de pizza para despesas por categoria
- Gráfico de barras comparando receitas vs despesas
- Gráfico de linha mostrando evolução do saldo
- Filtros por período (mês, ano, todos)
- Visualizações interativas e responsivas

### 🎯 **Metas Financeiras**
- Criação de metas de economia
- Acompanhamento do progresso visual
- Sistema de contribuições
- Notificações de metas alcançadas
- Histórico de metas concluídas

### 📋 **Relatórios**
- Geração de relatórios detalhados
- Exportação em PDF e Excel
- Filtros avançados por data, tipo e categoria
- Análise de despesas por categoria
- Resumo financeiro completo

## 🛠️ Tecnologias Utilizadas

- **Frontend:** Next.js 15, React 19
- **Estilização:** Tailwind CSS 4
- **Gráficos:** Recharts
- **Ícones:** Lucide React
- **Notificações:** React Hot Toast
- **Exportação:** jsPDF, SheetJS (xlsx)
- **Persistência:** LocalStorage

## 📦 Instalação e Execução

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/mateus1102senai/finances-back-end-e-front-end.git
   cd finances-back-end-e-front-end/front
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Execute o projeto:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   ```
   http://localhost:3000
   ```

## 🎨 Estrutura do Projeto

```
front/
├── src/
│   ├── app/                    # App Router do Next.js
│   │   ├── cadastro/          # Página de cadastro de transações
│   │   ├── graficos/          # Página de gráficos e análises
│   │   ├── metas/             # Página de metas financeiras
│   │   ├── relatorios/        # Página de relatórios
│   │   ├── layout.js          # Layout principal
│   │   ├── page.js            # Página inicial (dashboard)
│   │   └── globals.css        # Estilos globais
│   ├── components/
│   │   └── Navigation.js      # Componente de navegação
│   └── context/
│       └── FinanceContext.js  # Context API para gerenciamento de estado
├── public/                    # Arquivos estáticos
├── package.json              # Dependências e scripts
└── README.md                 # Documentação
```

## 💡 Como Usar

### 1. **Primeira Vez**
- Acesse o dashboard principal
- Clique em "Nova Transação" para começar a registrar suas finanças

### 2. **Cadastrar Transações**
- Vá para a página "Cadastro"
- Selecione o tipo (Receita ou Despesa)
- Preencha valor, descrição, categoria e data
- Clique em "Salvar Transação"

### 3. **Visualizar Análises**
- Acesse a página "Gráficos"
- Explore diferentes tipos de visualização
- Use os filtros para analisar períodos específicos

### 4. **Definir Metas**
- Vá para a página "Metas"
- Clique em "Nova Meta"
- Defina nome, valor objetivo e prazo
- Acompanhe o progresso e faça contribuições

### 5. **Gerar Relatórios**
- Acesse a página "Relatórios"
- Configure os filtros desejados
- Exporte em PDF ou Excel

## 🔧 Funcionalidades Técnicas

### **Gerenciamento de Estado**
- Context API para estado global
- LocalStorage para persistência de dados
- Reducers para operações complexas

### **Responsividade**
- Design mobile-first
- Adaptação automática para tablets e desktops
- Navegação otimizada para dispositivos móveis

### **Performance**
- Componentes otimizados
- Lazy loading de gráficos
- Memoização de cálculos financeiros

### **Validações**
- Validação de formulários
- Verificação de dados de entrada
- Tratamento de erros

## 🎯 Público-Alvo

- **Estudantes:** Controle de mesada e gastos acadêmicos
- **Jovens Profissionais:** Organização do primeiro salário
- **Adultos:** Planejamento financeiro familiar
- **Qualquer pessoa** interessada em melhorar sua saúde financeira

## 📱 Compatibilidade

- **Navegadores:** Chrome, Firefox, Safari, Edge
- **Dispositivos:** Desktop, Tablet, Mobile
- **Sistemas:** Windows, macOS, Linux, iOS, Android

## 🚀 Próximas Funcionalidades

- [ ] Integração com bancos via Open Banking
- [ ] Backup na nuvem
- [ ] Compartilhamento de relatórios
- [ ] Modo escuro
- [ ] Múltiplas moedas
- [ ] Lembretes de pagamento
- [ ] Análise de tendências com IA

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Desenvolvedor

**Mateus Santos**
- GitHub: [@mateus1102senai](https://github.com/mateus1102senai)

---

⭐ **Dê uma estrela se este projeto te ajudou!**
