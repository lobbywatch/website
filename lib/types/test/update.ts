import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  Locale,
  RawBranch,
  RawGuest,
  RawLobbyGroup,
  RawOrganisation,
  RawParliamentarian,
} from '../types'
import { fetchAllBranchen, fetchBranche } from '../../api/queries/branchen'
import {
  fetchAllOrganisations,
  fetchOrganisation,
} from '../../api/queries/organisations'
import {
  fetchAllLobbyGroups,
  fetchLobbyGroup,
} from '../../api/queries/lobbyGroups'
import {
  fetchAllParliamentarians,
  fetchParliamentarian,
} from '../../api/queries/parliamentarians'
import { fetchAllGuests, fetchGuest } from '../../api/queries/guests'

const resources = [
  {
    name: 'branches',
    decoder: RawBranch.toString(),
    fetchAll: fetchAllBranchen,
    fetchById: fetchBranche,
  },
  {
    name: 'guests',
    decoder: RawGuest.toString(),
    fetchAll: fetchAllGuests(),
    fetchById: fetchGuest,
  },
  {
    name: 'lobbyGroups',
    decoder: RawLobbyGroup.toString(),
    fetchAll: fetchAllLobbyGroups,
    fetchById: fetchLobbyGroup,
  },
  {
    name: 'organisations',
    decoder: RawOrganisation.toString(),
    fetchAll: fetchAllOrganisations({
      select_fields: [
        'name_de',
        'name_fr',
        'rechtsform',
        'ort',
        'abkuerzung_de',
        'abkuerzung_fr',
        'interessengruppe_de',
        'interessengruppe_fr',
        'interessengruppe_id',
        'interessengruppe2_de',
        'interessengruppe2_fr',
        'interessengruppe2_id',
        'interessengruppe3_de',
        'interessengruppe3_fr',
        'interessengruppe3_id',
        'uid',
        'alias_namen_de',
        'alias_namen_fr',
      ].join(','),
    }),
    fetchById: fetchOrganisation,
  },
  {
    name: 'parliamentarians',
    decoder: RawParliamentarian.toString(),
    fetchAll: fetchAllParliamentarians(),
    fetchById: fetchParliamentarian,
  },
]

;(async () => {
  const MAX_LEAVES = 10
  const outDir = join(dirname(fileURLToPath(import.meta.url)), 'data')
  await mkdir(outDir, { recursive: true })

  for (const { name, decoder, fetchAll, fetchById } of resources) {
    const responses = []
    for (const locale of Locale.literals) {
      const path = `${name}.${locale}.all`
      console.log('Root', path)

      const data = await fetchAll(locale)
      responses.push({ path, decoder, data })

      for (const { id } of data.slice(0, MAX_LEAVES)) {
        const path = `${name}.${locale}.${id}`
        console.log('  - Leaf', id, 'of', data.length)
        const leaf = await fetchById(locale, id)
        responses.push({ path, decoder, data: [leaf] })
      }
    }

    await writeFile(
      join(outDir, `${name}.json`),
      JSON.stringify(responses.flat()),
    )
  }
})()
