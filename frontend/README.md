# 💄 Frontend — Gestão de Marcas de Maquiagem

Interface web moderna, responsiva e elegante desenvolvida em **HTML5 Semântico**, **CSS3 Moderno** e **JavaScript Puro (ES6+)**, sem frameworks pesados, para consumo da API RESTful Spring Boot (`MarcasMaquiagem`).

---

## 🎨 Design & Identidade Visual
A interface foi projetada com estética sofisticada e clean inspirada no universo de beleza, cosméticos e alta perfumaria:
- **Paleta de Cores:** Tons *Rose Gold* (`#c57667`), *Nude/Blush* suave (`#fdf7f6`), acentos *Champagne/Gold* (`#cfa352`) e *Velvet Burgundy* (`#4a1e29`) para contraste tipográfico de alto nível.
- **Selo Ético Cruelty-Free:** Badges com destaque visual e ícone (`🐇`) diferenciando marcas certificadas livres de testes em animais.
- **Micro-interações:** Switch toggle animado, botões com efeito hover/press, indicador pulsante de status de conexão com o backend e sistema flutuante de alertas (*toasts*).
- **Tipografia:** Combinação de serif editorial (*Playfair Display*) para títulos e sans-serif contemporânea (*Plus Jakarta Sans*) para formulários e leitura nítida.

---

## 🚀 Como Executar

A aplicação é 100% estática (HTML/CSS/JS puro) e não requer instalação de dependências ou compilação.

### Opção 1: Abrir diretamente no Navegador
Basta dar um duplo clique no arquivo `frontend/index.html` ou arrastá-lo para qualquer navegador moderno (Chrome, Edge, Firefox, Safari).

### Opção 2: Servidor Local Estático (Recomendado)
Para evitar eventuais restrições locais de arquivo e testar em condições reais de servidor HTTP:

- **Via Python:**
  ```bash
  cd frontend
  python -m http.server 3000
  ```
  Acesse: `http://localhost:3000`

- **Via VS Code / IntelliJ:**
  Use a extensão **Live Server** ou a funcionalidade de pré-visualização de HTML embutida.

- **Via Node.js (npx serve):**
  ```bash
  npx serve frontend
  ```

> **Atenção:** Certifique-se de que a aplicação Spring Boot do backend esteja em execução na porta `8080` (`http://localhost:8080`).

---

## 📡 Integração com a API REST (`http://localhost:8080/marca`)

A entidade manipulada segue rigorosamente o formato esperado pelo backend Java:
```json
{
  "id": 1,
  "nome": "Rare Beauty",
  "ano": 2019,
  "pais": "Estados Unidos",
  "crueltyFree": true
}
```

| Funcionalidade | Verbo HTTP | Endpoint | Parâmetros / Body | Resposta |
|---|---|---|---|---|
| **Cadastrar Marca** | `POST` | `/marca` | **Body (JSON):** `{ nome, ano, pais, crueltyFree }` | `200 OK` (vazio) |
| **Buscar por Nome** | `GET` | `/marca?nome={nome}` | **Query Param:** `nome` (com `encodeURIComponent`) | `200 OK` (JSON da marca) |
| **Atualizar por ID** | `PUT` | `/marca?id={id}` | **Query Param:** `id` \| **Body (JSON):** `{ nome, ano, ... }` | `200 OK` (vazio) |
| **Excluir por Nome** | `DELETE` | `/marca?nome={nome}` | **Query Param:** `nome` (com `encodeURIComponent`) | `200 OK` (vazio) |

---

## 📂 Estrutura de Arquivos

```
frontend/
├── index.html        # Estrutura semântica, formulários, modais de edição e exclusão
├── style.css         # Variáveis CSS, design system de maquiagem, grid/flexbox e responsividade
├── script.js         # Lógica com Fetch API, async/await, comentários detalhados e toasts
└── README.md         # Documentação completa de uso e arquitetura
```
