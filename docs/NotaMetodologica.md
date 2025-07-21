# Nota Metodológica

## 1. Fontes de Dados Utilizadas

Os dados utilizados no mapa coroplético foram obtidos a partir de diversas fontes confiáveis e públicas:

- **SICG/IPHAN**: Cadastro nacional de bens culturais protegidos, contendo localização, tipo (móvel, imóvel, integrado) e natureza.
- **CEMADEN**: Produto Painel Alertas Cemaden. Indicadores georreferenciados de risco geo-hidrológico por município.
- **INPE**: Dados de risco de fogo para o dia.
- **ANA/SNISB**: Localização de barragens, classificação de risco e dano potencial, e dados de segurança estrutural.
- **IBGE**: Limites municipais e estaduais do Brasil, com informações territoriais padronizadas.

Scripts específicos foram desenvolvidos em Python para processar e integrar esses dados. Os dados processados incluem:

- Cálculo do índice de risco composto por município (comprehensive_risk_score_mean).
- Quantificação de bens culturais por município (NUMPOINTS).
- Cálculo do índice de intensidade de risco ao patrimônio (heritage_heat_index).

Os scripts estão disponíveis no repositório na pasta `/scripts`, e os dados processados são publicados em `/data` nos formatos GeoJSON, Shapefile e QGZ.

## 2. Processamento e Integração dos Dados

As diferentes fontes de dados foram harmonizadas e geocodificadas em QGIS. Utilizamos um modelo de dados comum baseado nos limites municipais (IBGE) para integrar os indicadores:

- Cada município recebe um `comprehensive_risk_score_mean` (0 a >1.5), agregando os componentes: risco de fogo, risco geo-hidrológico, risco por barragens.
- Em seguida, multiplicamos esse índice pela quantidade de bens culturais (`NUMPOINTS`) para gerar o `heritage_heat_index`.

Esses dados foram transformados em camadas vetoriais com campos padronizados, e exportados no formato GeoJSON para publicação da camada cloroplética municipal.

## 3. Estilização e Publicação

- O mapa coroplético foi produzido com QGIS, exportado para web com o plugin `qgis2web`.
- Os polígonos dos municípios são estilizados com base em `heritage_heat_index`, utilizando uma rampa de cor contínua (Turbo).
- Os pontos de bens culturais utilizam símbolos distintos por tipo: círculo (imóvel), losango (móvel).
- Os dados são publicados via GitHub Pages em: [https://lbreduardo.github.io/brazil-heritage-map-dev/](https://lbreduardo.github.io/brazil-heritage-map-dev/).

## 4. Pesquisa de Campo e Referências

Durante o projeto foram realizadas visitas técnicas e entrevistas com equipes do IPHAN, agentes e instituições locais e nacionais de preservação e gestão de emergências.

- **Pelotas**, **Porto Alegre**, **São José dos Campos**, **São Luiz do Paraitinga**, **Ouro Preto**, **Mariana**, **Brasília**, **Goiás Velho**, **Pirenópolis**, **Goiânia**, **Cuiabá**, **Rio Branco** e **Xapuri**.

Foram coletadas informações sobre:

- Políticas públicas e legislações vigentes.
- Estado de conservação e fiscalização dos bens culturais.
- Parcerias com órgãos como o CEMADEN, a ANA e universidades.
- Ações de prevenção, salvamento e resposta a emergências já realizadas.

## 5. Documentos e Protocolos

- Os balões informativos dos bens culturais no mapa exibem dados e, quando disponíveis, **protocolos individualizados ou por área** para prevenção e resposta a emergências.
- Estes protocolos foram elaborados com base nas realidades locais e seguindo as diretrizes do **IPHAN**, **ICCROM**, **Ministério da Cultura da Itália** e **American Institute for Conservation**.
- Além disso, foram criadas fichas-modelo para avaliação de risco, inspeção de rotina, checklist emergencial, e orientações rápidas em caso de desastres.

Todos os documentos estão disponíveis no repositório em `/protocolos` em formato `.pdf` e `.docx`.

## 6. Acesso Aberto e Repositório

- O repositório está disponível em: [https://github.com/lbreduardo/brazil-heritage-map-dev](https://github.com/lbreduardo/brazil-heritage-map-dev)
- Inclui todos os scripts, camadas, documentos e backups do projeto.
- O mapa pode ser visualizado diretamente em: [https://lbreduardo.github.io/brazil-heritage-map-dev/](https://lbreduardo.github.io/brazil-heritage-map-dev/)

