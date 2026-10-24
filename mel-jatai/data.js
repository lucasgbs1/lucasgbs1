/* Catálogo de méis. Edite aqui: a página monta os cards a partir destes dados.
   Regiões: N Norte, NE Nordeste, CO Centro-Oeste, SE Sudeste, S Sul.
   A distribuição é indicativa. A lista oficial de espécies por estado prevalece. */
window.MEIS = {
  regioes: {
    N: "Norte",
    NE: "Nordeste",
    CO: "Centro-Oeste",
    SE: "Sudeste",
    S: "Sul",
  },

  especies: [
    {
      id: "jatai",
      nome: "Jataí",
      cientifico: "Tetragonisca angustula",
      grupo: "Sem ferrão",
      regioes: ["N", "NE", "CO", "SE", "S"],
      biomas: "Todos os biomas",
      cor: "#f4c24f",
      mel: "Claro, fluido e ácido, com final cítrico.",
      temperamento: "Dócil. Guardas pairam diante da entrada, mas não picam.",
      tamanho: "Pequena",
      producao: 1,
      manejo: 1,
      curiosidade: "Constrói na entrada um tubo de cera clara, fácil de reconhecer em muros e ocos de árvore.",
    },
    {
      id: "mandacaia",
      nome: "Mandaçaia",
      cientifico: "Melipona quadrifasciata",
      grupo: "Sem ferrão",
      regioes: ["NE", "CO", "SE", "S"],
      biomas: "Mata Atlântica",
      cor: "#e6a23a",
      mel: "Doce suave, levemente ácido e bem fluido.",
      temperamento: "Dócil.",
      tamanho: "Grande",
      producao: 2,
      manejo: 2,
      curiosidade: "A entrada é um anel raiado de barro e resina por onde passa uma abelha de cada vez.",
    },
    {
      id: "urucu-nordestina",
      nome: "Uruçu-nordestina",
      cientifico: "Melipona scutellaris",
      grupo: "Sem ferrão",
      regioes: ["NE"],
      biomas: "Mata Atlântica do Nordeste",
      cor: "#db8e2a",
      mel: "Fluido, aromático e de doçura marcante.",
      temperamento: "Dócil.",
      tamanho: "Grande",
      producao: 3,
      manejo: 2,
      curiosidade: "Uma das maiores abelhas sem ferrão do país e uma das mais criadas no litoral nordestino.",
    },
    {
      id: "jandaira",
      nome: "Jandaíra",
      cientifico: "Melipona subnitida",
      grupo: "Sem ferrão",
      regioes: ["NE"],
      biomas: "Caatinga",
      cor: "#f0c25a",
      mel: "Claro e delicado, com o perfume das floradas da Caatinga.",
      temperamento: "Dócil.",
      tamanho: "Média",
      producao: 2,
      manejo: 2,
      curiosidade: "Adaptada ao semiárido, atravessa longos períodos de seca entre uma florada e outra.",
    },
    {
      id: "tiuba",
      nome: "Tiúba",
      cientifico: "Melipona fasciculata",
      grupo: "Sem ferrão",
      regioes: ["N", "NE", "CO"],
      biomas: "Amazônia, Cerrado e Mata dos Cocais",
      cor: "#c9801f",
      mel: "Ácido, fluido e aromático.",
      temperamento: "Dócil.",
      tamanho: "Grande",
      producao: 3,
      manejo: 2,
      curiosidade: "É a base de uma tradição forte de meliponicultura no Maranhão.",
    },
    {
      id: "urucu-amarela",
      nome: "Uruçu-amarela",
      cientifico: "Melipona rufiventris",
      grupo: "Sem ferrão",
      regioes: ["NE", "CO", "SE"],
      biomas: "Cerrado e Mata Atlântica",
      cor: "#e2a444",
      mel: "Doce e floral, de acidez moderada.",
      temperamento: "Dócil.",
      tamanho: "Grande",
      producao: 2,
      manejo: 3,
      curiosidade: "Sensível à perda de habitat, ficou rara em várias áreas do Cerrado.",
    },
    {
      id: "manduri",
      nome: "Manduri",
      cientifico: "Melipona marginata",
      grupo: "Sem ferrão",
      regioes: ["NE", "CO", "SE", "S"],
      biomas: "Mata Atlântica",
      cor: "#e9b04b",
      mel: "Suave e floral. A produção é pequena.",
      temperamento: "Dócil.",
      tamanho: "Média",
      producao: 1,
      manejo: 2,
      curiosidade: "Está entre as menores abelhas do gênero Melipona.",
    },
    {
      id: "guaraipo",
      nome: "Guaraipo",
      cientifico: "Melipona bicolor",
      grupo: "Sem ferrão",
      regioes: ["NE", "SE", "S"],
      biomas: "Mata Atlântica",
      cor: "#d9963a",
      mel: "Aromático e fluido.",
      temperamento: "Dócil.",
      tamanho: "Média",
      producao: 1,
      manejo: 3,
      curiosidade: "Uma mesma colônia pode ter várias rainhas ao mesmo tempo, algo raro entre as abelhas.",
    },
    {
      id: "boca-de-renda",
      nome: "Uruçu-boca-de-renda",
      cientifico: "Melipona seminigra",
      grupo: "Sem ferrão",
      regioes: ["N", "NE", "CO"],
      biomas: "Amazônia e transição com o Cerrado",
      cor: "#c27a22",
      mel: "Fluido e ácido, típico das floradas amazônicas.",
      temperamento: "Dócil.",
      tamanho: "Grande",
      producao: 3,
      manejo: 2,
      curiosidade: "O nome vem da entrada do ninho, cujo desenho lembra um bordado de renda.",
    },
    {
      id: "mandaguari",
      nome: "Mandaguari",
      cientifico: "Scaptotrigona spp.",
      grupo: "Sem ferrão",
      regioes: ["N", "NE", "CO", "SE", "S"],
      biomas: "Espécies diferentes em cada região",
      cor: "#b9711e",
      mel: "Ácido e marcante, com boa produção.",
      temperamento: "Defensiva. Não pica, mas morde e se enrosca no cabelo.",
      tamanho: "Pequena",
      producao: 3,
      manejo: 2,
      curiosidade: "A entrada é um tubo largo de cerume aberto como uma trombeta.",
    },
    {
      id: "bora",
      nome: "Borá",
      cientifico: "Tetragona clavipes",
      grupo: "Sem ferrão",
      regioes: ["N", "NE", "CO", "SE", "S"],
      biomas: "Ampla distribuição",
      cor: "#9e5a16",
      mel: "Escuro, forte e ácido, com um toque amargo.",
      temperamento: "Defensiva. Morde quando a colônia é aberta.",
      tamanho: "Pequena",
      producao: 2,
      manejo: 2,
      curiosidade: "Tem um sabor tão intenso que divide opiniões até entre meliponicultores.",
    },
    {
      id: "irai",
      nome: "Iraí",
      cientifico: "Nannotrigona testaceicornis",
      grupo: "Sem ferrão",
      regioes: ["N", "NE", "CO", "SE", "S"],
      biomas: "Cerrado e Mata Atlântica",
      cor: "#ecc066",
      mel: "Claro e doce, guardado em pouca quantidade.",
      temperamento: "Dócil.",
      tamanho: "Pequena",
      producao: 1,
      manejo: 1,
      curiosidade: "Aparece em estudos de polinização de culturas em estufa, como o morango.",
    },
    {
      id: "mirim",
      nome: "Mirim",
      cientifico: "Plebeia spp.",
      grupo: "Sem ferrão",
      regioes: ["N", "NE", "CO", "SE", "S"],
      biomas: "Espécies diferentes em cada região",
      cor: "#f3ce76",
      mel: "Raro e delicado. A colônia guarda muito pouco.",
      temperamento: "Dócil.",
      tamanho: "Muito pequena",
      producao: 1,
      manejo: 1,
      curiosidade: "No Sul, algumas espécies fazem uma pausa na criação de novas abelhas durante o inverno.",
    },
    {
      id: "moca-branca",
      nome: "Moça-branca",
      cientifico: "Frieseomelitta varia",
      grupo: "Sem ferrão",
      regioes: ["N", "NE", "CO", "SE", "S"],
      biomas: "Cerrado e Caatinga",
      cor: "#d7a04a",
      mel: "Produção pequena, muito apreciada onde é criada.",
      temperamento: "Dócil.",
      tamanho: "Pequena",
      producao: 1,
      manejo: 2,
      curiosidade: "Comum em ocos de árvores do Cerrado e da Caatinga.",
    },
    {
      id: "apis",
      nome: "Apis africanizada",
      cientifico: "Apis mellifera",
      grupo: "Com ferrão",
      regioes: ["N", "NE", "CO", "SE", "S"],
      biomas: "Exótica, presente em todo o país",
      cor: "#d08a1c",
      mel: "Muda com a florada: de quase branco a escuro, de suave a intenso.",
      temperamento: "Pica. O manejo exige roupa e equipamento de proteção.",
      tamanho: "Média",
      producao: 3,
      manejo: 2,
      curiosidade: "A abelha africanizada surgiu no Brasil a partir de cruzamentos iniciados em 1956.",
    },
  ],

  /* Méis de Apis mellifera classificados pela florada predominante */
  floradas: [
    { id: "laranjeira", nome: "Laranjeira", cor: "#f2c86a", nota: "Claro e floral, com perfume de flor de laranja." },
    { id: "eucalipto", nome: "Eucalipto", cor: "#c27d26", nota: "Âmbar, encorpado, com toque herbáceo." },
    { id: "silvestre", nome: "Silvestre", cor: "#d99536", nota: "Mistura de floradas. Cada lote é diferente." },
    { id: "assa-peixe", nome: "Assa-peixe", cor: "#f0d38a", nota: "Claro e suave, cristaliza com facilidade." },
    { id: "aroeira", nome: "Aroeira", cor: "#7d3b0e", nota: "Escuro e intenso, de sabor persistente." },
    { id: "cipo-uva", nome: "Cipó-uva", cor: "#f5dc9a", nota: "Muito claro, delicado e pouco ácido." },
    { id: "bracatinga", nome: "Melato de bracatinga", cor: "#5e2a0b", nota: "Escuro. Não vem do néctar, mas da seiva doce excretada por insetos na bracatinga." },
  ],

  /* Exemplos de Indicação Geográfica para mel registrados no INPI */
  indicacoes: [
    { nome: "Mel do Pantanal", tipo: "Indicação de Procedência" },
    { nome: "Mel de Ortigueira", tipo: "Indicação de Procedência" },
    { nome: "Mel de Melato da Bracatinga do Planalto Sul Brasileiro", tipo: "Denominação de Origem" },
  ],
};

/* Créditos das fotos (iNaturalist). Gerado a partir das fontes; mantenha a atribuição ao trocar imagens. */
window.MEIS.fotos = {
  "tiuba": {
    "autor": "The Trustees of the Natural History Museum, London",
    "licenca": "CC BY",
    "url": "https://www.gbif.org/occurrence/2465411828",
    "fonte": "Natural History Museum, London",
    "nota": "Exemplar de museu, fotografado sobre fundo branco e recortado"
  },
  "jatai": {
    "autor": "Grete Pasch",
    "licenca": "CC BY",
    "url": "https://www.inaturalist.org/photos/151637509"
  },
  "mandacaia": {
    "autor": "Douglas",
    "licenca": "CC BY",
    "url": "https://www.inaturalist.org/photos/352998208"
  },
  "urucu-nordestina": {
    "autor": "Gustavo Heleno Ferreira",
    "licenca": "CC BY",
    "url": "https://www.inaturalist.org/photos/506140034"
  },
  "jandaira": {
    "autor": "Gustavo Heleno Ferreira",
    "licenca": "CC BY",
    "url": "https://www.inaturalist.org/photos/445366302"
  },
  "urucu-amarela": {
    "autor": "Martin Vallejos",
    "licenca": "CC BY",
    "url": "https://www.inaturalist.org/photos/386952530"
  },
  "manduri": {
    "autor": "Gabriel O. Keller",
    "licenca": "CC BY",
    "url": "https://www.inaturalist.org/photos/672249852"
  },
  "guaraipo": {
    "autor": "Reinaldo de Oliveira Elias",
    "licenca": "CC BY",
    "url": "https://www.inaturalist.org/photos/632173754"
  },
  "boca-de-renda": {
    "autor": "Renato Moraes",
    "licenca": "CC BY",
    "url": "https://www.inaturalist.org/photos/737689107"
  },
  "mandaguari": {
    "autor": "Liliana Ramírez-Freire",
    "licenca": "CC BY",
    "url": "https://www.inaturalist.org/photos/280491576"
  },
  "bora": {
    "autor": "Pedro Sisnando Araújo dos Santos",
    "licenca": "CC BY",
    "url": "https://www.inaturalist.org/photos/130753951"
  },
  "irai": {
    "autor": "Helio Lourencini",
    "licenca": "CC BY",
    "url": "https://www.inaturalist.org/photos/88651413"
  },
  "mirim": {
    "autor": "Carlos Alexandre Mattos Raposo",
    "licenca": "CC BY",
    "url": "https://www.inaturalist.org/photos/481335265"
  },
  "moca-branca": {
    "autor": "Pedro Alvaro Neves",
    "licenca": "CC BY",
    "url": "https://www.inaturalist.org/photos/308491318"
  },
  "apis": {
    "autor": "Albertus Horn",
    "licenca": "CC BY",
    "url": "https://www.inaturalist.org/photos/67943621"
  },
  "laranjeira": {
    "autor": "Alex Abair",
    "licenca": "CC BY",
    "url": "https://www.inaturalist.org/photos/114776742"
  },
  "eucalipto": {
    "autor": "Kerri-Lee Harris",
    "licenca": "CC BY",
    "url": "https://www.inaturalist.org/photos/519546052"
  },
  "cipo-uva": {
    "autor": "Nicolas Olejnik",
    "licenca": "CC BY",
    "url": "https://www.inaturalist.org/photos/176475818"
  },
  "assa-peixe": {
    "autor": "Lucas Kaminski",
    "licenca": "CC BY",
    "url": "https://www.inaturalist.org/photos/473349272"
  },
  "aroeira": {
    "autor": "Domínio público (CC0)",
    "licenca": "CC0",
    "url": "https://www.inaturalist.org/photos/65070314"
  },
  "bracatinga": {
    "autor": "Fabrício Mil Homens Riella",
    "licenca": "CC BY",
    "url": "https://www.inaturalist.org/photos/316927372"
  },
  "silvestre": {
    "autor": "Mark",
    "licenca": "CC BY",
    "url": "https://www.inaturalist.org/photos/110112602"
  }
};

/* Fotos das cenas e do pote (Wikimedia Commons) */
window.MEIS.cenas = [
  { item: "Pote de mel (recortado e dividido em tampa e corpo)", autor: "Marcobeltrametti", licenca: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Honey_miele.jpg" },
  { item: "Entrada de ninho de Jataí", autor: "Sintropepe", licenca: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Tetragonisca_angustula_nest_entrance.jpg" },
  { item: "Tubo de cera de Jataí", autor: "Bernard Dupont", licenca: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Stingless_Bees_(Tetragonisca_angustula)_(6788207763).jpg" },
  { item: "Ninho de abelhas sem ferrão", autor: "Rhododendrites", licenca: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Stingless_bees_nest_(70587).jpg" },
  { item: "Potes de mel de mandaçaia", autor: "Paczki sa nalepsze z dzemem", licenca: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Manda%C3%A7aia_(Melipona_quadrifasciata),_larvae_discs_and_honey_pots_in_nordestino_style_box.jpg" },
  { item: "Mel escorrendo da colher", autor: "Sonja Langford", licenca: "CC0", url: "https://commons.wikimedia.org/wiki/File:Mielpeniko(deSonjaL).jpg" },
  { item: "Mapas de distribuição (um arquivo por espécie, mesmo autor)", autor: "Luisgabriel007", licenca: "CC0", url: "https://commons.wikimedia.org/wiki/File:Distribui%C3%A7%C3%A3o_(range)_%E2%80%93_Melipona_fasciculata_%E2%80%93_Brasil.png" },
];
