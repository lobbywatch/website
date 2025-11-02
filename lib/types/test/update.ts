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
import { branchesUrl, branchUrl } from '../../api/queries/branchen'
import {
  organisationsUrl,
  organisationUrl,
} from '../../api/queries/organisations'
import { lobbyGroupsUrl, lobbyGroupUrl } from '../../api/queries/lobbyGroups'
import {
  parliamentariansUrl,
  parliamentarianUrl,
} from '../../api/queries/parliamentarians'
import { fetchGuest, guestsUrl } from '../../api/queries/guests'
import { flow } from 'effect'
import { fetcher } from '../../api/fetch'

const fetchRawData = (url: string) => fetcher(url).then(({ data }) => data)

const resources = [
  {
    name: 'branches',
    decoder: RawBranch.toString(),
    fetchAll: flow(branchesUrl, fetchRawData),
    fetchById: flow(branchUrl, fetchRawData),
  },
  {
    name: 'guests',
    decoder: RawGuest.toString(),
    fetchAll: flow(guestsUrl, fetchRawData),
    fetchById: fetchGuest,
  },
  {
    name: 'lobbyGroups',
    decoder: RawLobbyGroup.toString(),
    fetchAll: flow(lobbyGroupsUrl, fetchRawData),
    fetchById: flow(lobbyGroupUrl, fetchRawData),
  },
  {
    name: 'organisations',
    decoder: RawOrganisation.toString(),
    fetchAll: flow(organisationsUrl, fetchRawData),
    fetchById: flow(organisationUrl, fetchRawData),
  },
  {
    name: 'parliamentarians',
    decoder: RawParliamentarian.toString(),
    fetchAll: flow(parliamentariansUrl, fetchRawData),
    fetchById: flow(parliamentarianUrl, fetchRawData),
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
