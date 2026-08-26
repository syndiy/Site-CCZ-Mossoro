export type Bloco =
  | { tipo: "texto"; texto: string }
  | { tipo: "lista"; itens: string[] }
  | { tipo: "passos"; itens: string[] };

export type Secao = {
  titulo: string;
  blocos: Bloco[];
};

export type ServicoPagina = {
  slug: string;
  eyebrow: string;
  title: string;
  metaDescription: string;
  intro: string;
  ilustracao?: { src: string; alt: string };
  secoes: Secao[];
  cta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  conteudoPendente?: boolean;
};

export const servicoPaginas: ServicoPagina[] = [
  {
    slug: "vacinacao-antirrabica",
    eyebrow: "Vacinação",
    title: "Vacinação antirrábica de cães e gatos",
    metaDescription:
      "Vacinação antirrábica gratuita para cães e gatos em Mossoró: quem pode vacinar, onde e quando. Vacinação o ano todo na sede do CCZ e pontos volantes durante a campanha.",
    intro:
      "A vacina contra a raiva é gratuita e protege cães e gatos de uma doença que também atinge pessoas. Vacinar o seu animal todo ano é a forma mais simples de manter Mossoró livre da raiva.",
    ilustracao: { src: "/img/seringa.png", alt: "Seringa e frasco de vacina" },
    secoes: [
      {
        titulo: "Quem pode vacinar",
        blocos: [
          {
            tipo: "lista",
            itens: [
              "Cães e gatos saudáveis, a partir de 3 meses de idade.",
              "A vacina deve ser repetida uma vez por ano, mesmo que o animal já tenha sido vacinado.",
              "Avise a equipe se o animal estiver doente, em tratamento ou se for uma fêmea prenha.",
              "Animais agressivos devem ser levados com focinheira.",
            ],
          },
        ],
      },
      {
        titulo: "Onde vacinar",
        blocos: [
          {
            tipo: "texto",
            texto:
              "Na sede do CCZ a vacinação acontece o ano todo, de segunda a sexta, das 7h às 11h e das 13h às 17h.",
          },
          {
            tipo: "texto",
            texto:
              "Durante a campanha anual, o CCZ monta pontos volantes em Unidades Básicas de Saúde e locais de grande movimento, às sextas-feiras e aos sábados. Os pontos da semana são divulgados a cada início de semana.",
          },
        ],
      },
      {
        titulo: "A campanha de 2026",
        blocos: [
          {
            tipo: "texto",
            texto:
              "A meta do município é imunizar 50.686 animais, sendo 25.961 gatos e 24.725 cães.",
          },
        ],
      },
    ],
  },
  {
    slug: "castracao",
    eyebrow: "Castração",
    title: "Castração gratuita de cães e gatos",
    metaDescription:
      "Castração gratuita de cães e gatos em Mossoró: quem pode participar, documentos necessários, preparo do animal e jejum antes da cirurgia.",
    intro:
      "A castração é gratuita e ajuda a controlar a população de animais nas ruas, reduzindo o abandono e a transmissão de doenças. O procedimento é feito com agendamento.",
    ilustracao: { src: "/img/mascote-cao-gato.png", alt: "Um cão e um gato" },
    secoes: [
      {
        titulo: "Como participar",
        blocos: [
          {
            tipo: "passos",
            itens: [
              "Faça o cadastro do animal e aguarde o contato da equipe.",
              "A equipe entra em contato pelo telefone informado para marcar a data da cirurgia.",
              "No dia, leve um documento com foto e um comprovante de endereço.",
              "Leve o animal preparado, conforme as orientações abaixo.",
            ],
          },
        ],
      },
      {
        titulo: "Como preparar o animal",
        blocos: [
          {
            tipo: "lista",
            itens: [
              "O animal deve estar saudável e livre de pulgas e carrapatos.",
              "Cães devem chegar com guia e coleira.",
              "Gatos devem ser levados em caixa de transporte, para evitar fugas.",
              "Jejum de 8 horas para filhotes (até 1 ano) e de 12 horas para adultos.",
            ],
          },
        ],
      },
      {
        titulo: "Ainda tem dúvidas?",
        blocos: [
          {
            tipo: "texto",
            texto:
              "Fale com a equipe do CCZ pelo telefone para tirar dúvidas sobre o cadastro e o agendamento.",
          },
        ],
      },
    ],
  },
  {
    slug: "leishmaniose",
    eyebrow: "Leishmaniose",
    title: "Leishmaniose visceral (calazar)",
    metaDescription:
      "Leishmaniose visceral (calazar) em Mossoró: como é transmitida, sinais nos cães, diagnóstico laboratorial e prevenção.",
    intro:
      "A leishmaniose visceral, conhecida como calazar, é transmitida pela picada do mosquito-palha. Cães podem adoecer e o diagnóstico é feito em laboratório.",
    ilustracao: { src: "/img/3d/microscopio.png", alt: "Microscópio de laboratório" },
    secoes: [
      {
        titulo: "Como é transmitida",
        blocos: [
          {
            tipo: "texto",
            texto:
              "A doença não passa de um animal direto para uma pessoa. A transmissão acontece pela picada da fêmea do mosquito-palha, um inseto pequeno que se reproduz em matéria orgânica em decomposição, como folhas e restos de comida acumulados no quintal.",
          },
        ],
      },
      {
        titulo: "Sinais nos cães",
        blocos: [
          {
            tipo: "lista",
            itens: [
              "Emagrecimento, mesmo comendo normalmente.",
              "Feridas na pele que não cicatrizam, principalmente nas orelhas e no focinho.",
              "Queda de pelo e unhas muito compridas.",
              "Apatia e crescimento anormal das unhas.",
            ],
          },
        ],
      },
      {
        titulo: "Como prevenir",
        blocos: [
          {
            tipo: "lista",
            itens: [
              "Mantenha o quintal limpo, sem folhas e restos orgânicos acumulados.",
              "Use coleira repelente no cão, conforme orientação veterinária.",
              "Procure o CCZ se o seu cão apresentar os sinais acima.",
            ],
          },
        ],
      },
    ],
    conteudoPendente: true,
  },
  {
    slug: "acidentes-com-animais",
    eyebrow: "Emergência",
    title: "Acidentes com animais",
    metaDescription:
      "O que fazer em caso de mordedura de cão ou gato e de acidente com animais peçonhentos, como escorpiões, em Mossoró.",
    intro:
      "Mordeduras e acidentes com animais peçonhentos exigem atendimento rápido. Saiba o que fazer nos primeiros minutos e onde procurar ajuda.",
    ilustracao: { src: "/img/3d/escorpiao.png", alt: "Escorpião" },
    secoes: [
      {
        titulo: "Em caso de mordedura",
        blocos: [
          {
            tipo: "passos",
            itens: [
              "Lave o local com água corrente e sabão por alguns minutos.",
              "Procure imediatamente uma unidade de saúde para avaliar a necessidade da vacina antirrábica.",
              "Se possível, identifique o animal e observe o seu comportamento nos dias seguintes.",
              "Comunique o caso ao CCZ.",
            ],
          },
        ],
      },
      {
        titulo: "Acidentes com escorpiões",
        blocos: [
          {
            tipo: "lista",
            itens: [
              "Procure atendimento médico imediatamente, principalmente em crianças e idosos.",
              "Não faça torniquete, não corte e não perfure o local da picada.",
              "Mantenha o quintal limpo e vede ralos e frestas para evitar a entrada dos escorpiões.",
              "Denuncie ao CCZ locais com muitos escorpiões.",
            ],
          },
        ],
      },
    ],
    cta: { label: "Fazer uma denúncia", href: "/reports/" },
    conteudoPendente: true,
  },
  {
    slug: "prevencao-de-zoonoses",
    eyebrow: "Prevenção",
    title: "Prevenção de zoonoses",
    metaDescription:
      "Prevenção de zoonoses em Mossoró: raiva, dengue, zika, chikungunya e doença de Chagas. Como se proteger e proteger os animais.",
    intro:
      "Zoonoses são doenças que passam de animais para pessoas. A maioria pode ser evitada com cuidados simples no dia a dia.",
    ilustracao: { src: "/img/3d/escudo.png", alt: "Escudo de proteção" },
    secoes: [
      {
        titulo: "Raiva",
        blocos: [
          {
            tipo: "texto",
            texto:
              "Vacine cães e gatos todo ano. Em caso de mordedura, lave o local e procure uma unidade de saúde imediatamente.",
          },
        ],
      },
      {
        titulo: "Dengue, zika e chikungunya",
        blocos: [
          {
            tipo: "lista",
            itens: [
              "Não deixe água parada em pneus, vasos, calhas e caixas d'água.",
              "Tampe bem os recipientes que guardam água.",
              "Denuncie terrenos baldios e focos que você não consegue resolver sozinho.",
            ],
          },
        ],
      },
      {
        titulo: "Doença de Chagas",
        blocos: [
          {
            tipo: "texto",
            texto:
              "Transmitida pelo barbeiro, um inseto que se esconde em frestas de paredes e telhados. Vede rachaduras e avise o CCZ se encontrar o inseto.",
          },
        ],
      },
    ],
    cta: { label: "Denunciar um foco", href: "/reports/" },
    secondaryCta: { label: "Ler artigo sobre dengue", href: "/articles/dengue/" },
    conteudoPendente: true,
  },
  {
    slug: "educacao-em-saude",
    eyebrow: "Educação",
    title: "Educação em saúde",
    metaDescription:
      "Ações educativas do CCZ Mossoró: palestras em escolas e comunidades, materiais educativos e orientação sobre guarda responsável.",
    intro:
      "O CCZ leva informação sobre zoonoses, guarda responsável e prevenção para escolas, comunidades e grupos organizados.",
    ilustracao: { src: "/img/3d/livros.png", alt: "Livros" },
    secoes: [
      {
        titulo: "O que oferecemos",
        blocos: [
          {
            tipo: "lista",
            itens: [
              "Palestras em escolas, associações e comunidades.",
              "Orientação sobre guarda responsável e bem-estar animal.",
              "Materiais educativos sobre prevenção de zoonoses.",
            ],
          },
        ],
      },
      {
        titulo: "Como solicitar uma palestra",
        blocos: [
          {
            tipo: "texto",
            texto: "Entre em contato com o CCZ pelo telefone para verificar a agenda da equipe.",
          },
        ],
      },
    ],
    conteudoPendente: true,
  },
];

export function servicoPorSlug(slug: string) {
  return servicoPaginas.find((s) => s.slug === slug);
}
