import { getAllParliamentarians } from './parliamentarians'
import { descending } from 'd3-array'
import { getAllGuests } from './guests'
import { getAllLobbyGroups } from './lobbyGroups'
import { getAllBranchen } from './branchen'
import { getAllOrganisations } from './organisations'
import type {
  Locale,
  MappedBranch,
  MappedGuest,
  MappedLobbyGroup,
  MappedObject,
  MappedObjectType,
  MappedOrganisation,
  MappedParliamentarian,
} from 'src/domain'
import { useFetcher } from '../fetch'

const diacritics = [
  { base: 'a', letters: ['ä', 'â', 'à'] },
  { base: 'c', letters: ['ç'] },
  { base: 'e', letters: ['é', 'ê', 'è', 'ë'] },
  { base: 'i', letters: ['î', 'ï', 'ì'] },
  { base: 'o', letters: ['ö', 'ô', 'ò'] },
  { base: 'u', letters: ['ü', 'ù', 'û'] },
  { base: 'ss', letters: ['ß'] },
] as const

type DiacriticBase = (typeof diacritics)[number]['base']
type DiacriticLetter = (typeof diacritics)[number]['letters'][number]
type DiacriticsMap = Record<DiacriticLetter, DiacriticBase>

const diacriticsMap = diacritics.reduce((map, diacritic) => {
  for (const letter of diacritic.letters) {
    map[letter] = diacritic.base
  }
  return map
}, {} as DiacriticsMap)

const isDiacriticLetter = (a: string): a is DiacriticLetter =>
  a in diacriticsMap

const normalize = (keyword: string) =>
  keyword
    .toLowerCase() // eslint-disable-next-line no-control-regex
    .replace(/[^\u0000-\u007E]/g, (a) =>
      isDiacriticLetter(a) ? diacriticsMap[a] : a,
    )

const cleanKeywords = (keywords: Array<string | undefined>) =>
  keywords.filter((x) => x != null).map((keyword) => normalize(keyword))

const BOOSTS = {
  Parliamentarian: 1,
  Guest: 0.5,
  Organisation: 0,
  LobbyGroup: 0,
  Branch: 0,
}

const search = (term: string, index: ReturnType<typeof buildIndex>) => {
  if (term.length === 0) {
    return []
  }

  const terms = term
    .split(/\s+/)
    .map((term) => normalize(term.trim()))
    .filter(Boolean)
  return index
    .map((item) => {
      let matchedTerms = 0
      const match = item.keywords.reduce((sum, keyword, keywordIndex) => {
        for (const term of terms) {
          const index = keyword.indexOf(term)
          if (index !== -1) {
            matchedTerms += 1
            let score = term === keyword ? 24 : 12
            score /= index + 1
            score -= keywordIndex
            sum += Math.max(score, 0)
          }
        }
        return sum
      }, 0)
      if (matchedTerms >= terms.length && match > 0) {
        return [match + BOOSTS[item.type as MappedObjectType], item] as const
      }
    })
    .filter((x) => x != null)
    .sort((a, b) => descending(a[0], b[0]))
    .slice(0, 30)
    .map(([_score, item]) => item.raw)
}

const buildIndex = ({
  parliamentarians,
  guests,
  lobbyGroups,
  branchen,
  organisations,
}: {
  parliamentarians: {
    data: Array<MappedParliamentarian>
    error: unknown
    isLoading: boolean
  }
  guests: { data: Array<MappedGuest>; error: unknown; isLoading: boolean }
  lobbyGroups: {
    data: Array<MappedLobbyGroup>
    error: unknown
    isLoading: boolean
  }
  branchen: { data: Array<MappedBranch>; error: unknown; isLoading: boolean }
  organisations: {
    data: Array<MappedOrganisation>
    error: unknown
    isLoading: boolean
  }
}): Array<{
  type: MappedObject['__typename']
  raw: MappedObject
  keywords: Array<string>
}> => {
  const notReady =
    parliamentarians.isLoading ||
    !parliamentarians.data ||
    guests.isLoading ||
    !guests.data ||
    lobbyGroups.isLoading ||
    !lobbyGroups.data ||
    branchen.isLoading ||
    !branchen.data ||
    organisations.isLoading ||
    !organisations.data
  if (notReady) {
    return []
  }

  return [
    ...parliamentarians.data.map((parliamentarian) => ({
      type: parliamentarian.__typename,
      raw: parliamentarian,
      keywords: cleanKeywords([
        parliamentarian.lastName,
        parliamentarian.firstName,
        parliamentarian.middleName,
        parliamentarian.canton,
        parliamentarian.partyMembership?.party.abbr,
        ...(parliamentarian.kommissionen_abkuerzung
          ? parliamentarian.kommissionen_abkuerzung.split(',')
          : []),
        ...(parliamentarian.kommissionen_namen
          ? parliamentarian.kommissionen_namen.split(';')
          : []),
      ]),
    })),
    ...guests.data.map((guest) => ({
      type: guest.__typename,
      raw: guest,
      keywords: cleanKeywords([
        guest.lastName,
        guest.firstName,
        guest.middleName,
        ...guest.function?.split(','),
      ]),
    })),
    ...lobbyGroups.data.map((lobbyGroup) => ({
      type: lobbyGroup.__typename,
      raw: lobbyGroup,
      keywords: cleanKeywords([
        lobbyGroup.name,
        lobbyGroup.branch.name,
        ...lobbyGroup.commissions.flatMap((commission) => [
          commission.abbr,
          commission.name,
        ]),
      ]),
    })),
    ...branchen.data.map((branch) => ({
      type: branch.__typename,
      raw: branch,
      keywords: cleanKeywords([branch.name]),
    })),
    ...organisations.data.map((organisation) => ({
      type: organisation.__typename,
      raw: organisation,
      keywords: cleanKeywords([
        organisation.name,
        organisation.uid,
        organisation.abbr,
        ...organisation.lobbyGroups.map((group) => group.name),
      ]),
    })),
  ]
}

export const useSearch = ({
  locale,
  term,
}: {
  locale: Locale
  term: string
}) => {
  const parliamentarians = useFetcher(locale, getAllParliamentarians, {
    select_fields: [
      'id',
      'parlament_number',
      'vorname',
      'zweiter_vorname',
      'nachname',
      'beruf',
      'geschlecht',
      'geburtstag',
      'parteifunktion',
      'partei_name',
      'partei',
      'ratstyp',
      'aktiv',
      'im_rat_bis_unix',
      'im_rat_seit_unix',
    ],
  })
  const guests = useFetcher(locale, getAllGuests, {
    select_fields: [
      'id',
      'vorname',
      'nachname',
      'beruf',
      'geschlecht',
      'funktion',
      'zweiter_vorname',
    ],
  })
  const lobbyGroups = useFetcher(locale, getAllLobbyGroups)
  const branchen = useFetcher(locale, getAllBranchen)
  const organisations = useFetcher(locale, getAllOrganisations, {
    select_fields: [
      'id',
      'name',
      'rechtsform',
      'ort',
      'interessengruppe_id',
      'uid',
    ],
  })

  const index = buildIndex({
    parliamentarians,
    guests,
    lobbyGroups,
    branchen,
    organisations,
  })

  return {
    data: search(term, index),
    error: [
      parliamentarians.error,
      guests.error,
      lobbyGroups.error,
      branchen.error,
      organisations.error,
    ].find((error) => !!error),
    isLoading:
      parliamentarians.isLoading ||
      guests.isLoading ||
      lobbyGroups.isLoading ||
      branchen.isLoading ||
      organisations.isLoading,
  }
}
