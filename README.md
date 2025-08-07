# 🚀 Sistema de Gerenciamento de Pedidos

## 🎯 Objetivo  
Este desafio visa avaliar habilidades em desenvolvimento de aplicações com **Spring Boot**, **JPA**, **PostgreSQL** e **React** para criar um sistema completo de gerenciamento de pedidos de clientes.  
O backend foi desenvolvido com Spring Boot + JPA, integrado ao PostgreSQL, e o frontend foi construído em React.

## 📋 Contexto  
Uma empresa de logística precisa gerenciar pedidos de clientes. A base de dados contém as seguintes tabelas principais:

- **Pedido**  
  - Identificador único do pedido  
  - Identificador do cliente  
  - Data do pedido  
  - Valor total do pedido  
  - Status do pedido (Aprovado/Rejeitado)

- **Cliente**  
  - Identificador único do cliente  
  - Nome do cliente  
  - Limite de crédito do cliente

- **Produto**  
  - Identificador único do produto  
  - Nome do produto  
  - Preço do produto

- **Itens do Pedido**  
  - Identificador único do item  
  - Identificador do pedido  
  - Identificador do produto  
  - Quantidade  
  - Subtotal  

Durante a venda, um pedido pode conter múltiplos produtos, com quantidades variadas ou diferentes tipos de produtos.

Os clientes possuem um limite de crédito e o sistema só aprova pedidos cujo total acumulado dos pedidos nos últimos 30 dias esteja dentro desse limite.

## 🛠 Tarefa

- Criação das tabelas com suas respectivas chaves primárias, estrangeiras e regras para garantir integridade dos dados.  
- Inserção de pelo menos cinco registros nas tabelas Cliente e Produto.  
- Criação de cenários onde pedidos contem múltiplos produtos, podendo ser produtos iguais em maior quantidade ou produtos diferentes.  
- Desenvolvimento de serviço REST utilizando Spring Boot e JPA para o backend e React para o frontend, contemplando:  
  - Cadastro de pedidos onde o usuário seleciona cliente e produto(s).  
  - Validação do limite de crédito: se o total ultrapassa o limite, o pedido é rejeitado; caso contrário, aprovado. O usuário é informado em ambos os casos.

- Envio do modelo ER do banco de dados.

## ⚙ Como fiz o Software:

- Backend estruturado em camadas: **Controller**, **Service**, **Model** e **Repository**.  
- Validações implementadas tanto no backend quanto no frontend para garantir dados consistentes e melhor experiência do usuário.  
- Uso do **PostgreSQL** como banco de dados.  
- Endpoints REST expostos para comunicação com o frontend.  
- Código otimizado usando JpaRepository já que se tratava de querys basicas como insert, so reutilizei as opções que já vem com JpaRepository para nao ter que criar insert, selects simples que era o caso do teste.  
- Biblioteca de componentes moderna utilizada no frontend para interface amigável.  
- Aplicação React comunica-se com o backend Spring Boot via API REST usando fetch para fazer a requisição.
- Não criei rotas customizadas na API REST, pois as operações básicas HTTP (GET, POST, etc.) foram suficientes para o escopo atual.

## ⚙ Possíveis evoluções:
- Para escalar o sistema, poderia-se implementar arquitetura baseada em microserviços, separando as responsabilidades: um serviço para gerenciamento de pedidos e confirmação de valores, outro para cadastro de clientes, outro para produtos, etc. 



## 📦 Tecnologias e Versões Utilizadas  

| Tecnologia      | Versão     |
|-----------------|------------|
| 🟦 Spring Boot  | 2.7.18     |
| ☕ Java         | 1.8        |
| 🐘 PostgreSQL  
| ⚛ React        | 19.1.0     |

