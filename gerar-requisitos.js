const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, Header, Footer, PageNumber
} = require('C:/Users/rv.teixeira/AppData/Roaming/npm/node_modules/docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 300, after: 120 },
    children: [new TextRun({ text, bold: true, size: 32, font: "Arial", color: "1F4E79" })]
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, bold: true, size: 26, font: "Arial", color: "2E75B6" })]
  });
}

function bodyText(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 22, font: "Arial", ...opts })]
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, size: 22, font: "Arial" })]
  });
}

function tableHeaderCell(text, width) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: "1F4E79", type: ShadingType.CLEAR },
    margins: cellMargins,
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, bold: true, size: 20, font: "Arial", color: "FFFFFF" })]
    })]
  });
}

function tableCell(text, width, fill = "FFFFFF") {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill, type: ShadingType.CLEAR },
    margins: cellMargins,
    children: [new Paragraph({
      children: [new TextRun({ text, size: 20, font: "Arial" })]
    })]
  });
}

function emptyLine() {
  return new Paragraph({ children: [new TextRun("")] });
}

const userStories = [
  { grupo: "Estrutura Base", id: "#12", titulo: "Criar estrutura de pastas e arquivos", us: "Como desenvolvedor, quero uma estrutura organizada de pastas e arquivos, para que o time tenha um padrão claro de onde cada arquivo deve ficar." },
  { grupo: "Estrutura Base", id: "#13", titulo: "Configurar TailwindCSS", us: "Como desenvolvedor, quero o TailwindCSS configurado no projeto, para que eu possa estilizar componentes de forma rápida e consistente." },
  { grupo: "Estrutura Base", id: "#14", titulo: "Criar componentes base (Header, Footer, Layout)", us: "Como desenvolvedor, quero componentes base reutilizáveis, para que todas as páginas tenham estrutura visual consistente." },
  { grupo: "Estrutura Base", id: "#15", titulo: "Definir paleta de cores e tema visual", us: "Como usuário, quero uma identidade visual definida, para que o site tenha aparência profissional e padronizada." },
  { grupo: "Colaboradores", id: "#16", titulo: "Tela de cadastro de colaborador", us: "Como colaborador, quero me cadastrar no sistema, para que eu possa registrar e acompanhar minhas férias." },
  { grupo: "Colaboradores", id: "#17", titulo: "Listagem de colaboradores", us: "Como gestor, quero visualizar a lista de todos os colaboradores, para que eu tenha uma visão geral do time." },
  { grupo: "Colaboradores", id: "#18", titulo: "Página de perfil do colaborador", us: "Como colaborador, quero ter uma página de perfil com meu histórico de férias, para que eu acompanhe minhas informações de forma centralizada." },
  { grupo: "Calendário", id: "#19", titulo: "Tela principal com calendário anual", us: "Como colaborador, quero visualizar um calendário anual com as férias do time, para que eu possa planejar meu período sem conflitos." },
  { grupo: "Calendário", id: "#20", titulo: "Formulário de intenção de férias", us: "Como colaborador, quero registrar minhas intenções de férias, para que o time e o gestor saibam minha intenção com antecedência." },
  { grupo: "Calendário", id: "#21", titulo: "Visualização das férias por colaborador", us: "Como gestor, quero visualizar as férias de cada colaborador individualmente, para que eu acompanhe a situação de cada pessoa." },
  { grupo: "Calendário", id: "#22", titulo: "Visualização consolidada do time por período", us: "Como gestor, quero ver quem está de férias em cada período do ano, para que eu garanta cobertura adequada do time." },
  { grupo: "Calendário", id: "#23", titulo: "Validação de conflito de datas", us: "Como colaborador, quero ser avisado quando meu período conflita com o de outro colega, para que o time nunca fique sem cobertura." },
  { grupo: "Aprovação", id: "#24", titulo: "Botão de confirmação de aprovação", us: "Como colaborador, quero confirmar no sistema quando minhas férias forem aprovadas, para que o time saiba que estão confirmadas." },
  { grupo: "Aprovação", id: "#25", titulo: "Indicador visual de status das férias", us: "Como colaborador, quero visualizar o status das minhas férias (Intenção, Aprovado, Negado), para que eu saiba em que etapa está minha solicitação." },
  { grupo: "Backup", id: "#26", titulo: "Formulário para indicar backup", us: "Como colaborador, quero indicar meu backup durante as férias, para que o time saiba quem me substitui durante minha ausência." },
  { grupo: "Backup", id: "#27", titulo: "Notificação visual para o colaborador de backup", us: "Como colaborador de backup, quero ser notificado visualmente, para que eu me prepare para cobrir o período de ausência do colega." },
  { grupo: "Fluig", id: "#28", titulo: "Botão de abertura de solicitação no Fluig", us: "Como colaborador, quero abrir minha solicitação de férias no Fluig pelo site, para que eu não precise acessar o Fluig separadamente." },
  { grupo: "Fluig", id: "#29", titulo: "Exibição do status da solicitação no Fluig", us: "Como colaborador, quero visualizar o status da solicitação no Fluig dentro do site, para que eu acompanhe sem precisar sair da plataforma." },
  { grupo: "UX/UI", id: "#30", titulo: "Layout responsivo para mobile", us: "Como colaborador, quero acessar o site pelo celular com boa experiência, para que eu possa consultar e registrar férias de qualquer lugar." },
  { grupo: "UX/UI", id: "#31", titulo: "Dashboard com visão geral do time", us: "Como gestor, quero um dashboard com a visão geral do time e status das férias, para que eu tenha uma visão rápida e consolidada da equipe." },
];

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      }
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } }
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "1F4E79", space: 1 } },
          children: [new TextRun({ text: "PMOSite — Documento de Requisitos", size: 18, font: "Arial", color: "1F4E79", bold: true })]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC", space: 1 } },
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Página ", size: 18, font: "Arial", color: "888888" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, font: "Arial", color: "888888" }),
            new TextRun({ text: " — Confidencial | PMO", size: 18, font: "Arial", color: "888888" }),
          ]
        })]
      })
    },
    children: [
      // Título
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 120 },
        children: [new TextRun({ text: "PMOSite", bold: true, size: 56, font: "Arial", color: "1F4E79" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "Documento de Requisitos", size: 28, font: "Arial", color: "2E75B6" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 400 },
        children: [new TextRun({ text: "Versão 1.0 — Abril de 2026", size: 20, font: "Arial", color: "888888" })]
      }),

      // 1. Visão Geral
      heading1("1. Visão Geral do Projeto"),
      bodyText("O PMOSite é uma plataforma web desenvolvida pelo time de PMO para centralizar o gerenciamento de férias dos colaboradores. O sistema permite o registro de intenções de férias, confirmação de aprovações e indicação de backups, com integração ao Fluig para abertura de solicitações formais."),
      emptyLine(),

      // 2. Objetivo
      heading1("2. Objetivo"),
      bodyText("Desenvolver um Calendário de Férias com as seguintes funcionalidades:"),
      bullet("Registro de intenções de férias para o ano"),
      bullet("Confirmação pelo próprio colaborador quando as férias forem aprovadas"),
      bullet("Registro de backup durante o período de férias"),
      bullet("Abertura de solicitação no Fluig"),
      emptyLine(),

      // 3. Colaboradores
      heading1("3. Colaboradores"),
      new Table({
        width: { size: 9026, type: WidthType.DXA },
        columnWidths: [4513, 4513],
        rows: [
          new TableRow({
            children: [
              tableHeaderCell("Colaborador", 4513),
              tableHeaderCell("GitHub", 4513),
            ]
          }),
          new TableRow({
            children: [
              tableCell("rafael.silva", 4513, "F5F5F5"),
              tableCell("@rafaelhdev", 4513, "F5F5F5"),
            ]
          }),
          new TableRow({
            children: [
              tableCell("rv.teixeira", 4513),
              tableCell("@rebecavalgueiro", 4513),
            ]
          }),
        ]
      }),
      emptyLine(),

      // 4. Stack
      heading1("4. Stack Tecnológica"),
      new Table({
        width: { size: 9026, type: WidthType.DXA },
        columnWidths: [3000, 6026],
        rows: [
          new TableRow({ children: [tableHeaderCell("Camada", 3000), tableHeaderCell("Tecnologia", 6026)] }),
          new TableRow({ children: [tableCell("Frontend", 3000, "F5F5F5"), tableCell("React + Vite", 6026, "F5F5F5")] }),
          new TableRow({ children: [tableCell("Estilização", 3000), tableCell("TailwindCSS", 6026)] }),
        ]
      }),
      emptyLine(),

      // 5. Fluxo de Branches
      heading1("5. Fluxo de Branches"),
      new Table({
        width: { size: 9026, type: WidthType.DXA },
        columnWidths: [3000, 6026],
        rows: [
          new TableRow({ children: [tableHeaderCell("Branch", 3000), tableHeaderCell("Descrição", 6026)] }),
          new TableRow({ children: [tableCell("main", 3000, "F5F5F5"), tableCell("Produção — código estável", 6026, "F5F5F5")] }),
          new TableRow({ children: [tableCell("dev", 3000), tableCell("Integração — PRs das branches individuais vão aqui antes da main", 6026)] }),
          new TableRow({ children: [tableCell("rafael.silva", 3000, "F5F5F5"), tableCell("Branch de desenvolvimento individual", 6026, "F5F5F5")] }),
          new TableRow({ children: [tableCell("rv.teixeira", 3000), tableCell("Branch de desenvolvimento individual", 6026)] }),
        ]
      }),
      emptyLine(),

      // 6. Fluxo do Board
      heading1("6. Fluxo do Board"),
      new Table({
        width: { size: 9026, type: WidthType.DXA },
        columnWidths: [2500, 6526],
        rows: [
          new TableRow({ children: [tableHeaderCell("Status", 2500), tableHeaderCell("Gatilho", 6526)] }),
          new TableRow({ children: [tableCell("In Progress", 2500, "FFF3CD"), tableCell("Issue atribuída e em desenvolvimento", 6526, "FFF3CD")] }),
          new TableRow({ children: [tableCell("In Review", 2500, "D6EAF8"), tableCell("PR aberta para dev", 6526, "D6EAF8")] }),
          new TableRow({ children: [tableCell("Testing", 2500, "FDEBD0"), tableCell("PR aprovada pelo revisor", 6526, "FDEBD0")] }),
          new TableRow({ children: [tableCell("Done", 2500, "D5F5E3"), tableCell("PR mergeada na main", 6526, "D5F5E3")] }),
        ]
      }),
      emptyLine(),

      // 7. User Stories
      heading1("7. User Stories"),
      bodyText("As funcionalidades estão organizadas em User Stories agrupadas por tema:"),
      emptyLine(),

      ...Object.entries(
        userStories.reduce((acc, us) => {
          if (!acc[us.grupo]) acc[us.grupo] = [];
          acc[us.grupo].push(us);
          return acc;
        }, {})
      ).flatMap(([grupo, items]) => [
        heading2(`7.${Object.keys(userStories.reduce((a, u) => { a[u.grupo] = true; return a; }, {})).indexOf(grupo) + 1} ${grupo}`),
        new Table({
          width: { size: 9026, type: WidthType.DXA },
          columnWidths: [600, 2500, 5926],
          rows: [
            new TableRow({
              children: [
                tableHeaderCell("ID", 600),
                tableHeaderCell("Título", 2500),
                tableHeaderCell("User Story", 5926),
              ]
            }),
            ...items.map((us, i) => new TableRow({
              children: [
                tableCell(us.id, 600, i % 2 === 0 ? "F5F5F5" : "FFFFFF"),
                tableCell(us.titulo, 2500, i % 2 === 0 ? "F5F5F5" : "FFFFFF"),
                tableCell(us.us, 5926, i % 2 === 0 ? "F5F5F5" : "FFFFFF"),
              ]
            }))
          ]
        }),
        emptyLine(),
      ]),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("C:/Users/rv.teixeira/Desktop/PMOsite/Requisitos-PMOSite.docx", buffer);
  console.log("Documento gerado com sucesso!");
});
