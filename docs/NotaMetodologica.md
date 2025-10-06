# Nota Metodológica  
### Produto 2 — Mapa Coroplético e Repositório de Riscos ao Patrimônio Cultural Brasileiro

---

## 1. Contexto e Objetivos

O Produto 2 integra o acordo de cooperação internacional **PRODOC 914BRZ4018 – UNESCO/IPHAN**, voltado ao desenvolvimento de estratégias integradas de mitigação de riscos e preservação de bens culturais móveis e integrados no Brasil, com foco especial nos efeitos das **mudanças climáticas** e em desastres como **enchentes, deslizamentos e incêndios**.

O mapa coroplético e o repositório que o acompanha representam um **instrumento de análise espacial e de apoio à tomada de decisão** para a gestão do patrimônio cultural brasileiro. Seu objetivo é **identificar e visualizar as vulnerabilidades climáticas e ambientais** que afetam bens culturais protegidos, facilitando a **integração entre políticas patrimoniais e de gestão de riscos**.

Além de reunir informações dispersas em diferentes bases públicas, o produto busca promover **transparência, interoperabilidade e reprodutibilidade** dos dados, fortalecendo uma cultura de **gestão preventiva e colaborativa** no campo do patrimônio cultural.

---

## 2. Descrição do Produto

O objetivo previsto no edital e termo de referência como mapa Coroplético foi desenvolvido em uma plataforma interativa de acesso aberto, publicada gratuitamente via **GitHub Pages**, que reúne dados sobre bens culturais e indicadores de risco ambiental e estrutural.

O produto é composto por dois elementos principais:

- **Mapa interativo** – apresenta a distribuição territorial dos bens culturais e sua exposição a diferentes tipos de risco.  
- **Repositório digital** – armazena os scripts, camadas e documentos técnicos que sustentam o mapa.

O conjunto constitui um **recurso exploratório e dinâmico**, que pode ser atualizado, expandido e integrado a novas bases e protocolos. O Produto 2 vem sendo validado a partir de **15 municípios-piloto** visitados em campo, selecionados pela sua representatividade regional em relação aos riscos climáticos a bens culturais.

---

## 3. Metodologia e Integração de Dados

### 3.1 Fontes de Dados Utilizadas

Os dados que alimentam o mapa foram obtidos exclusivamente de **fontes públicas e oficiais**, produzidas por diferentes órgãos do Estado brasileiro. O conjunto dessas fontes assegura **transparência, confiabilidade e rastreabilidade** das informações, em consonância com as boas práticas de gestão de dados abertos.

A atualização das bases é realizada a cada execução do *pipeline* de scripts em **Python**, garantindo que o mapa reflita um retrato dinâmico e atualizado das condições de risco e da distribuição de bens culturais. Na página inicial do mapa, a data da última atualização fica disponível no canto inferior esquerdo. A última atualização ocorreu em **3 de outubro de 2025**.

---

#### **SICG/IPHAN**

Os dados relativos aos bens culturais foram extraídos do **Sistema Integrado de Conhecimento e Gestão (SICG/IPHAN)**, por meio do *endpoint* público do **GeoServer do IPHAN**:

> [http://portal.iphan.gov.br/geoserver/web/wicket/bookmarkable/org.geoserver.web.demo.MapPreviewPage?1&filter=false](http://portal.iphan.gov.br/geoserver/web/wicket/bookmarkable/org.geoserver.web.demo.MapPreviewPage?1&filter=false)

Foram utilizadas duas camadas principais:

- `Bens Materiais SICG: tg_bem_classificação`  
- `Proteção – Bens Materiais SICG: Bem_Protecao`

A categorização do tipo de bem seguiu a taxonomia institucional do IPHAN, com base no atributo **“natureza”**, distinguindo **bens móveis, imóveis e integrados**.  
O atributo **“tipo de proteção”** permitiu identificar bens **tombados e valorados** (patrimônio ferroviário).  

Não foi necessário realizar curadoria manual, exclusão de duplicatas ou correção de coordenadas, dado que o SICG já adota padrões de consistência espacial e descritiva.  

---

#### **CEMADEN, INPE e ANA/SNISB**

Os indicadores de risco utilizados no mapa foram extraídos das seguintes fontes oficiais:

- **CEMADEN** – *Painel de Alertas Geo-Hidrológicos*, que fornece indicadores de risco de deslizamentos e inundações por município;  
- **INPE** – dados de **risco de fogo** gerados diariamente;  
- **ANA/SNISB** – base nacional de **barragens**, obtida a partir do portal [https://www.snisb.gov.br/portal-snisb/consultar-barragem](https://www.snisb.gov.br/portal-snisb/consultar-barragem).

No caso da ANA/SNISB, foi utilizado o arquivo CSV completo disponibilizado pelo botão **“Base Completa”** da interface do portal. Foram consideradas apenas as barragens classificadas com a combinação de **PDA (Potencial de Dano Associado)** e **CRI (Categoria de Risco)** **médios ou altos**.  
Cada barragem é representada espacialmente no mapa por uma **zona de influência de 5 km** ao seu redor — parâmetro que poderá ser ajustado em futuras versões conforme recomendações técnicas.

As séries de dados são **capturadas pontualmente**, não armazenando séries históricas. Cada atualização do *pipeline* corresponde, portanto, a um **retrato instantâneo das condições de risco** no momento da coleta.

---

#### **IBGE**

A base territorial utilizada corresponde à **Malha Municipal 2024 do IBGE**, disponível em:

> [https://geoftp.ibge.gov.br/organizacao_do_territorio/malhas_territoriais/malhas_municipais/municipio_2024/Brasil/BR_Municipios_2024.zip](https://geoftp.ibge.gov.br/organizacao_do_territorio/malhas_territoriais/malhas_municipais/municipio_2024/Brasil/BR_Municipios_2024.zip)

Os polígonos municipais foram **simplificados** para otimizar o desempenho da aplicação web, preservando a coerência topológica e a legibilidade cartográfica.

---

#### **Confiabilidade e Governança de Dados**

Não foram identificadas lacunas ou divergências significativas entre as fontes.  
Todos os conjuntos utilizados são **dados públicos oficiais**, gerados por instituições reconhecidas e de natureza estatal (IPHAN, CEMADEN, INPE, ANA e IBGE), o que confere ao produto **alto grau de confiabilidade, legitimidade institucional e auditabilidade**.

---

#### **Observação sobre outras fontes**

Estão em análise a incorporação de novas fontes complementares (IDM).


### 3.2 Processamento e Integração

O processamento e a integração dos dados foram realizados por meio de um **pipeline automatizado em Python**, responsável por coletar, padronizar e combinar as diferentes fontes em uma estrutura territorial comum, tomando os **municípios brasileiros como unidade espacial de referência**.

A operação segue um modelo de **integração modular**, no qual cada conjunto de dados (patrimônio, risco geo-hidrológico, risco de fogo, barragens) é processado em blocos independentes e posteriormente consolidado em uma base única para cálculo dos indicadores.

---

#### **Ambiente e Bibliotecas Utilizadas**

Os scripts de processamento foram desenvolvidos em **Python 3**, empregando bibliotecas de manipulação e análise geoespacial, como:

- `pandas` e `geopandas` – estruturação e manipulação de dados tabulares e geográficos;  
- `requests` – extração automatizada de dados a partir de URLs públicas (CEMADEN, INPE, ANA);  
- `shapely` e `fiona` – operações geométricas e conversão de formatos vetoriais;  
- `matplotlib` e `folium` – visualizações preliminares e inspeção manual dos resultados;  
- `os`, `json` e `glob` – automação de diretórios e geração de arquivos intermediários.

---

#### **Arquitetura do Pipeline**

O fluxo de processamento segue uma lógica **linear e automatizada**, composta por quatro etapas principais:

1. **Coleta** – os dados são extraídos automaticamente de cada fonte oficial (via download direto ou API pública).  
2. **Harmonização** – as bases são convertidas para um modelo geográfico comum e compatibilizadas por município.  
3. **Cálculo de indicadores** – são gerados dois índices principais:
   - `comprehensive_risk_score_mean`: indicador agregado de risco geo-hidrológico, de fogo e de barragens.    
   - `heritage_heat_index`: produto entre o índice de risco e o número de bens culturais (`NUMPOINTS`) em cada município.  
     - O cálculo não incorpora densidade territorial (bens/km²), considerando apenas a **quantidade absoluta de bens**.  
4. **Exportação** – as camadas resultantes são exportadas em formatos **GeoJSON, Shapefile e QGZ**, armazenadas em `/data`.

O pipeline é modular, permitindo reprocessamentos pontuais sem necessidade de refazer todas as etapas.  
Essa característica facilita a atualização de uma única camada sem comprometer o restante da base.

---

#### **Verificação e Controle de Qualidade**

A verificação dos resultados é feita por meio de **inspeção visual e espacial** em pontos críticos, observando a coerência entre os índices gerados e as realidades locais conhecidas.  
Municípios com **histórico de desastres reconhecidos**, como enchentes e incêndios em acervos culturais, apresentam correlação direta com áreas de maior intensidade no mapa, reforçando a consistência dos indicadores. Não foram identificadas inconsistências significativas que comprometem a integridade dos dados.

---

#### **Registro e Reprodutibilidade**

A documentação do pipeline encontra-se disponível no repositório público do projeto.  
Com a abertura do repositório, será incluído um registro de **logs automáticos** e um **histórico de execuções**, a fim de rastrear futuras atualizações e permitir a **reprodução integral do processo** por terceiros.O pipeline registra:
- data e hora de execução;  
- fontes atualizadas;  
- número de registros processados;  
- tempo de execução total e eventuais erros capturados.
Essa rastreabilidade consolida o mapa como um produto  verificável e institucionalmente confiável.

---

## 4. Estilização e Publicação

A estilização cartográfica e a publicação do **Mapa Coroplético de Riscos ao Patrimônio Cultural** foram conduzidas com base em princípios de **acessibilidade, legibilidade e transparência**, buscando equilibrar rigor técnico e clareza visual.

O objetivo principal foi permitir que usuários com diferentes níveis de familiaridade com dados geográficos pudessem **compreender de imediato os padrões espaciais de risco** e navegar de forma intuitiva entre as informações do patrimônio cultural brasileiro.

---

### **Design Cartográfico**

O mapa foi desenvolvido no **QGIS**, utilizando o modelo vetorial municipal do IBGE (Malha 2024) como base geográfica.
A camada principal representa o indicador `heritage_heat_index`, calculado para cada município, cuja gradação visual traduz a intensidade relativa de risco ao patrimônio.

- A representação coroplética adota a rampa de cores **Turbo**, pela sua boa performance cromática e compatibilidade com visualizações digitais em monitores variados.  
- As cores seguem um gradiente contínuo, evitando a segmentação abrupta entre classes e permitindo percepção fluida de transições de risco.    
- A escala e o centróide do mapa foram ajustados para **privilegiar a leitura nacional**, mas preservando a identificação de municípios menores.

Os **bens culturais** são representados em pontos sobrepostos à camada coroplética, com simbologia diferenciada por tipo:

- **círculo** → bens **imóveis**  
- **losango** → bens **móveis e integrados**

A transparência dos símbolos e a espessura dos limites municipais foram calibradas para evitar sobrecarga visual e permitir a leitura simultânea das duas dimensões (risco + distribuição patrimonial).

---

### **Exportação e Estrutura da Aplicação Web**

A publicação do mapa foi realizada por meio do **plugin `qgis2web`**, exportando o projeto do QGIS para ambiente **Leaflet**, com posterior refinamento manual em HTML e JavaScript.

A opção pelo Leaflet se deve à sua leveza, compatibilidade com navegadores modernos e ampla comunidade de suporte.  
A estrutura exportada foi ajustada para incluir:

- **Metadados básicos** (camadas, fontes, data de atualização);  
- **Pop-ups personalizados**, vinculados a cada bem cultural e aos protocolos associados.

O código-fonte da aplicação web é aberto, permitindo sua adaptação para outras instâncias regionais ou temáticas.

---

### **Publicação via GitHub Pages**

O site foi hospedado por meio do serviço **GitHub Pages**, garantindo acesso público, versionamento contínuo e integração direta com o repositório técnico do projeto.  
Essa estratégia assegura que todas as atualizações de dados ou scripts reflitam-se automaticamente na visualização pública, promovendo **transparência e reprodutibilidade**.

**Estrutura do repositório:**
/data → arquivos geográficos (GeoJSON, Shapefile, QGZ)
/scripts → scripts Python de coleta e integração
/protocolos → documentos de prevenção e resposta a emergências
/docs → documentação e metadados
/index.html → interface web principal


A versão atualmente publicada pode ser acessada em:

- 🌍 **Mapa interativo:** [https://lbreduardo.github.io/brazil-heritage-map-dev/](https://lbreduardo.github.io/brazil-heritage-map-dev/)  
- 📁 **Repositório completo:** [https://github.com/lbreduardo/brazil-heritage-map-dev](https://github.com/lbreduardo/brazil-heritage-map-dev)

---

### **Princípios de Transparência e Acesso**

A publicação no GitHub, além de possibilitar a navegação pública, permite que outros pesquisadores e técnicos:
- auditem o código-fonte e os dados utilizados;  
- repliquem o processamento em outras escalas (estadual, municipal, temática);  
- proponham correções, atualizações ou aprimoramentos via *pull requests*;  
- integrem o mapa a sistemas institucionais, como o **SIG/Iphan**.

A arquitetura adotada segue o princípio da **ciência aberta** e o **modelo FAIR** (Findable, Accessible, Interoperable, Reusable), garantindo que os resultados possam ser amplamente reutilizados e aprimorados pela comunidade técnica e científica.

---

## 5. Pesquisa de Campo e Referências

A pesquisa de campo desempenha papel essencial na **validação empírica e contextual** dos dados representados no mapa, permitindo confrontar indicadores quantitativos com as realidades locais observadas em diferentes regiões do país.

Foram realizadas **visitas técnicas, entrevistas e levantamentos presenciais** junto a equipes do IPHAN, instituições parceiras e agentes locais.  
Essas ações serviram para verificar a acurácia dos dados e compreender as **condições institucionais, sociais e ambientais** que afetam a proteção dos bens culturais.

---

### **Abrangência Territorial da Missão**

A missão de campo ocorreu em maio de 2025, abrangendo um conjunto de municípios representativos de diferentes regiões, regimes climáticos e contextos de gestão de bens culturais:

**Pelotas-RS, Porto Alegre-RS, São José dos Campos-SP, São Luiz do Paraitinga-SP, Ouro Preto-MG, Mariana-MG, Brasília-DF, Goiás-GO, Pirenópolis-GO, Goiânia-GO, Cuiabá-MT, Rio Branco-AC e Xapuri-AC.**

A seleção dessas localidades complementou os municípios já previstos no edital, considerando a seleção de parceiros técnicos relacionados às fontes, e diferentes graus de complexidade municipal, considerando critérios como:
- **Histórico de eventos extremos** (enchentes, deslizamentos, incêndios, colapsos estruturais);  
- **Presença de bens culturais** (centros históricos, museus, arquivos, bens integrados);  
- **Situação das instituições locais** (Defesa Civil, universidades, secretarias de cultura,);  
- **Distribuição geográfica**, permitindo representar macrorregiões brasileiras.

---

### **Metodologia de  Campo**

Durante as visitas, foram conduzidas **reuniões multilaterais**, **entrevistas semiestruturadas** e **observações técnicas diretas**, registradas em fichas de campo e compartilhadas em tempo real real com IPHAN, que prestou apoio fundamental à missão. Os levantamentos buscaram reunir informações sobre:

- Políticas públicas e aspectos locais sobre preservação e emergência;    
- Parcerias potenciais entre IPHAN, CEMADEN, ANA e outros pares técnicos;  
- Ocorrência prévia de sinistros e capacidade de resposta local;  
- Condições ambientais e urbanas que elevam a vulnerabilidade dos bens culturais.

---

### **Correlação entre Dados e Realidade Local**

Os resultados das visitas confirmaram **correspondência relativa** entre os municípios reconhecidos como vulneráveis e as áreas de maior intensidade no mapa.  
Casos emblemáticos como **Xapuri**, no Acre, município afetado por inundações cada vez mais recorrentes que atingem severamente a **Casa de Chico Mendes** estão em cor intermediária no mapa, que não refletem perfeitamente a gravidade da situação. Outro municípios com situações igualmente emblemáticas, como São Luiz do Paratinga, apresentam índice alarmante no mapa reforçando a validade parcial da metodologia e o potencial do produto como ferramenta de monitoramento contínuo.

---

### **Fontes de Referência e Cooperação Técnica**

As missões de campo contaram com apoio e interlocução de diferentes atores, entre eles:

- **Superintendências Regionais do IPHAN**;  
- **Defesas Civis municipais e estaduais**;  
- **Universidades e centros de pesquisa**;  
- **Agências nacionais de monitoramento**;  
- **Instituições internacionais** de referência em conservação e gestão de riscos.

Os dados e relatos obtidos em campo também subsidiarão a elaboração de **protocolos específicos e fichas-modelo**, garantindo que as recomendações técnicas do mapa estjamm alinhadas às condições observadas nas instituições e territórios analisados.

---

### **Referências Técnicas e Bibliográficas**

A metodologia de campo e análise se baseou em referenciais reconhecidos nacional e internacionalmente, entre os quais:

- **Manual de Primeiros Socorros ao Patrimônio Cultural em Tempos de Crise – ICCROM (2018);**  
- **Estratégia de Redução de Risco de Desastres do Setor de Cultura da UNESCO (2016);**  
- **Portaria IPHAN nº 375/2018** (Diretrizes para Planos de Gestão de Risco);  
- **Classificação e Codificação Brasileira de Desastres – COBRADE (2020);**  
- **Agenda 2030 / ODS 11.4 e 13.1** (Preservação do patrimônio cultural e fortalecimento da resiliência climática).

Essas referências serviram como base teórica e normativa para o cruzamento entre **vulnerabilidade ambiental e patrimônio cultural**, permitindo que o mapa fosse construído sobre fundamentos técnicos sólidos e internacionalmente reconhecidos.

---

## 6. Documentos e Protocolos

A camada de **Documentos e Protocolos** do mapa tem por objetivo disponibilizar, de forma direta e acessível, **instrumentos operacionais de prevenção e resposta a emergências** aplicáveis aos bens culturais georreferenciados.  
Esses documentos apoiarão gestores, equipes técnicas e comunidades locais na **redução de riscos e fortalecimento da resiliência institucional** frente a eventos adversos.

---

### **Conteúdo e Organização dos Protocolos**

Os protocolos associados a cada bem cultural ou grupo de bens foram elaborados com base em **referenciais normativos internacionais e nacionais**, especialmente:

- **ICCROM – Ajuda de Emergência ao Patrimônio Cultural em Tempos de Crise  
- **Ministério da Cultura da Itália – Linee Guida per la Gestione del Rischio nel Patrimonio Culturale (2021);**  
- **American Institute for Conservation (AIC) – Collections Emergency Response Procedures;**  
- **Portaria IPHAN nº 375/2018 – Diretrizes para Planos de Gestão de Risco;**  

Cada protocolo foi adaptado à **realidade institucional e ambiental local**, de modo a refletir as condições de infraestrutura, pessoal e recursos de cada unidade ou território.  
Os documentos seguem uma **estrutura modular**, contendo:

- Identificação do bem cultural e responsabilidades locais;  
- Descrição dos principais riscos e vulnerabilidades;  
- Medidas preventivas e de mitigação;  
- Procedimentos de emergência e evacuação;  
- Estratégias de comunicação e articulação interinstitucional;  
- Planilha de contatos de emergência;  

Esses elementos asseguram a aplicabilidade prática dos protocolos e sua compatibilidade com as **normas de segurança civil** e de **gestão de risco institucional**.

---

### **Integração ao Mapa**

No mapa interativo, os **balões informativos** associados a cada bem cultural exibem atualmentes dados básicos (tipo, localização, natureza e proteção), mas quando disponível, também exibirão **links diretos para os protocolos correspondentes**.  
Essa integração permite que usuários identifiquem rapidamente:

- quais bens dispõem de instrumentos de prevenção formalizados;  
- quais regiões carecem de planos estruturados;  
- e onde há oportunidades de replicação ou cooperação técnica.

Os protocolos são armazenados no repositório do projeto, na pasta `/protocolos`, em formatos **.pdf** e **.docx**, assegurando legibilidade, compatibilidade e possibilidade de edição local.  
Os arquivos seguem padrão de nomenclatura baseado em município e tipo de documento.


---

### **Fichas e Modelos Complementares**

Além dos protocolos específicos, foram produzidos **modelos e formulários** padronizados para uso em campo e rotinas de manutenção, localizados na pasta `/protocolos/modelos`.  
Esses documentos incluem:

- **Ficha de Avaliação de Risco:** identifica agentes de deterioração e grau de vulnerabilidade de cada bem;  
- **Ficha de Inspeção de Rotina:** registra o estado de conservação e ocorrências periódicas;  
- **Checklist Emergencial:** lista as ações imediatas a adotar em caso de desastre;  
- **Guia de Ações Rápidas:** instruções resumidas para evacuação, salvamento e estabilização de bens móveis e integrados.

Os modelos foram concebidos de modo a poder ser **customizados pelas unidades regionais do IPHAN** ou instituições parceiras, mantendo coerência com as diretrizes nacionais.

---

### **Governança e Atualização dos Documentos**

A atualização dos protocolos e fichas é parte integrante da estratégia de **gestão contínua do risco**. Essa lógica permitirá, futuramente, o desenvolvimento de um **módulo de versionamento documental**, com registros de autoria, data e histórico de revisões.

O repositório prevê ainda a inclusão de **metadados mínimos** em formato `.json` para cada protocolo, contendo:

- nome do bem e código SICG;  
- município e estado;  
- data de criação e última revisão;  
- autores e instituições envolvidas;  
- palavras-chave e categorias de risco.

---

### **Finalidade e Alcance**

A disponibilização pública desses documentos tem como objetivo fortalecer a **capacidade de resposta local e a cultura de prevenção** das instituições de memória e das comunidades.  
Ao permitir que protocolos sejam replicados, adaptados e aprimorados por diferentes usuários, o Produto 2 se consolida como uma **plataforma de compartilhamento de conhecimento aplicado à salvaguarda do patrimônio cultural**.

---

## 7. Modo de Uso e Aplicações

A plataforma foi concebida como uma ferramenta de **uso público, técnico e institucional**, capaz de apoiar tanto a formulação de políticas quanto a gestão  de riscos em bens culturais.  
Sua arquitetura aberta e visualização intuitiva permitem que o mesmo produto seja utilizado por **gestores, técnicos, pesquisadores e comunidades** em diferentes níveis de atuação.

---

### **7.1 Interface e Navegação**

A interface do mapa é **interativa e responsiva**, projetada para acesso via desktop.
As principais funcionalidades incluem:

- **Camadas temáticas:** podem ser ativadas ou desativadas na barra lateral, permitindo focar em conjuntos específicos de informações (ex.: risco de fogo, barragens, bens culturais, municípios).  
- **Painéis informativos:** ao clicar sobre um bem cultural ou município, são exibidos dados como tipo, natureza, nível de proteção e, quando disponível, link direto para o protocolo correspondente.  
- **Zoom e navegação livre:** o mapa é totalmente navegável, com escala ajustável e centróide nacional configurado para otimizar a visualização inicial.  

Esses elementos tornam o mapa **autoexplicativo e acessível**, mesmo a usuários sem experiência prévia em sistemas de informação geográfica.

---

### **7.2 Interpretação dos Indicadores**

A camada principal do mapa representa o índice `heritage_heat_index`, que sintetiza o grau de exposição do patrimônio cultural às ameaças ambientais e estruturais.  
Sua interpretação pode ser feita visualmente:

- **Tons mais frios (azulados):** áreas de baixa concentração de risco e menor número de bens culturais.  
- **Tons intermediários (verdes e amarelos):** áreas de atenção, com presença de riscos moderados ou quantidade intermediária de bens culturais.  
- **Tons quentes (alaranjados e vermelhos):** áreas críticas, com alta densidade de bens culturais e elevada exposição a riscos ambientais.

A combinação entre a cor dos municípios e os pontos representando bens culturais fornece um **retrato sintético da vulnerabilidade patrimonial brasileira**, permitindo priorizações espaciais de ação.

---

### **7.3 Aplicações Práticas**

O mapa foi desenvolvido para servir como **base de apoio à tomada de decisão** em diferentes escalas administrativas e setoriais.  
Entre as aplicações possíveis, destacam-se:

- **Planejamento preventivo:** subsidiar planos de gestão de risco e conservação preventiva no âmbito do IPHAN, governos estaduais e municipais.  
- **Priorização de investimentos:** identificar municípios ou regiões com maior densidade de risco para direcionamento de recursos e ações emergenciais.  
- **Monitoramento territorial:** acompanhar a evolução das vulnerabilidades ambientais e patrimoniais ao longo do tempo, com base nas atualizações periódicas do pipeline.  
- **Integração interinstitucional:** favorecer o diálogo entre setores de cultura, meio ambiente e defesa civil, promovendo ações conjuntas.  
- **Formação e capacitação:** apoiar oficinas, cursos e treinamentos em gestão de risco e sustentabilidade no patrimônio cultural.  
- **Pesquisa e inovação:** oferecer dados abertos que possam ser utilizados por universidades, pesquisadores e laboratórios de inovação pública.

---

### **7.4 Públicos-Alvo e Usabilidade**

O mapa foi desenhado para múltiplos perfis de usuários, cada um com finalidades específicas:

| **Perfil de usuário** | **Potenciais usos** |
|------------------------|--------------------|
| **Técnicos do IPHAN e parceiros institucionais** | Planejamento de ações preventivas, elaboração de planos de gestão de risco, leitura integrada com SICG/IPHAN. |
| **Gestores públicos municipais e estaduais** | Apoio a políticas locais de PRESERVAÇÃO e emergências locais. |
| **Defesas Civis e órgãos ambientais** | Identificação de sobreposições entre áreas de risco e bens culturais. |
| **Universidades e centros de pesquisa** | Estudos e modelagens territoriais sobre patrimônio e mudança climática. |
| **Organizações comunitárias e OSCs** | Monitoramento participativo e engajamento em projetos de preservação local. |

---

### **7.5 Reprodutibilidade e Expansão**

O repositório do projeto está estruturado para permitir **replicação e personalização**.  
Qualquer instituição pode:

- Reutilizar o código-fonte e adaptar o mapa a uma região ou tipologia específica (por exemplo, patrimônio ferroviário, museológico, ou imaterial associado).  
- Inserir novas camadas de dados, como indicadores socioeconômicos ou de capacidade de resposta institucional.  
- Criar versões multilíngues (PT/EN/ES) e incorporar interfaces acessíveis a públicos diversos.  

Essa modularidade transforma o mapa em uma **plataforma de aprendizado coletivo**, promovendo o compartilhamento de práticas e a cooperação técnica entre instituições.

---

### **7.6 Acesso e Licenciamento**

O mapa e seus dados associados são de **acesso aberto e gratuito**, em conformidade com os princípios de **dados governamentais abertos e ciência aberta**.  
O código e os dados estão disponíveis sob licença **Creative Commons Attribution 4.0 (CC BY 4.0)**, permitindo uso, modificação e redistribuição com citação da fonte.

- 🌍 **Mapa interativo:** [https://lbreduardo.github.io/brazil-heritage-map-dev/](https://lbreduardo.github.io/brazil-heritage-map-dev/)  
- 📁 **Repositório completo:** [https://github.com/lbreduardo/brazil-heritage-map-dev](https://github.com/lbreduardo/brazil-heritage-map-dev)

A adoção desse modelo de licenciamento reforça o compromisso do projeto com a **transparência, colaboração e sustentabilidade** da informação patrimonial no Brasil.

---

## 8. Próximos Passos e Validação

O **Produto 2** marca uma etapa fundamental no desenvolvimento do PRODOC 914BRZ4018, consolidando uma base para a integração entre **patrimônio cultural, gestão de risco e mudanças climáticas**.  
Sua continuidade depende agora da incorporação institucional e da expansão colaborativa de suas funcionalidades.

---

### **8.2 Ampliação de Escopo e Atualizações Futuras**

A arquitetura do repositório foi desenhada para permitir **evolução modular**.  
Entre as expansões previstas estão:

1. **Integração de novos indicadores** – IDM;  
2. **Módulo de colaboração** – implementação de um sistema de *pull requests* controlado, permitindo que técnicos e pesquisadores contribuam com correções, novos dados e protocolos;  
3. **Atualização automática uma vez ao dia**

Essas melhorias estão sendo planejadas de modo incremental, priorizando estabilidade, transparência e compatibilidade.

---

### **8.3 Sustentabilidade e Transferência Tecnológica**

A manutenção e a atualização do mapa após o encerramento do projeto serão orientadas por um plano de **transferência tecnológica**, visando à sua incorporação plena na estrutura funcional  do IPHAN e na rede de parceiros nacionais.

Entre as medidas propostas estão:
- Treinamento de técnicos regionais no uso e atualização do repositório;  
- Documentação completa do pipeline e publicação do manual de replicação;  
- Migração do mapa para servidores institucionais permanentes (ex.: SIG/Iphan, GeoSNC ou Infraestrutura Nacional de Dados Espaciais);  
- Estabelecimento de rotinas de backup e controle de versões.

---

### **8.4 Compromisso com a Transparência e a Cooperação Internacional**

O Produto 2 reflete o compromisso conjunto da **UNESCO e do IPHAN** com a promoção de práticas de **gestão integrada, aberta e colaborativa** no campo da preservação do patrimônio cultural.  
Sua metodologia se alinha às diretrizes da **Agenda 2030 das Nações Unidas**, especialmente aos **ODS 11.4 (preservar o patrimônio cultural e natural)** e **ODS 13.1 (fortalecer a resiliência e a capacidade de adaptação às mudanças climáticas)**.

O mapa e o repositório, enquanto produtos abertos, constituem um **legado técnico e institucional**, e uma base concreta para futuras cooperações  voltadas ao enfrentamento dos riscos que ameaçam o patrimônio cultural brasileiro e global.


---
