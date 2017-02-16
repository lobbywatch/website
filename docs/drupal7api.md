Index:
https://host/de?load-entity-refs=taxonomy_term,file&max-depth=1&limit=3&sort=created&direction=DESC

Article with entities:
https://host/de/artikel/wandelhalle-persoenlich-burson-marsteller-stockt?load-entity-refs=taxonomy_term,file&max-depth=1

Content:
https://host/de/content/team?load-entity-refs=taxonomy_term,file&max-depth=1

Menu & Blocks:
https://host/de/daten/meta

Dependencies: restws, restws_entityreference, lobbywatch_meta, cors: '*|*|GET|*|false'

Test:
curl -H 'Accept: application/json' 'URL' | python -m json.tool
