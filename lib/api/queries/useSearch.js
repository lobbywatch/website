import { useParliamentarians } from './useParliamentarians'
import { descending } from 'd3-array'
import { useGuests } from './useGuests'
import { useLobbyGroups } from './useLobbyGroups'
import { useBranchen } from './useBranchen'
import { useOrganisations } from './useOrganisations'

const diacritics = [
  { base: 'a', letters: ['ä', 'â', 'à'] },
  { base: 'c', letters: ['ç'] },
  { base: 'e', letters: ['é', 'ê', 'è', 'ë'] },
  { base: 'i', letters: ['î', 'ï', 'ì'] },
  { base: 'o', letters: ['ö', 'ô', 'ò'] },
  { base: 'u', letters: ['ü', 'ù', 'û'] },
  { base: 'ss', letters: ['ß'] },
]

const diacriticsMap = diacritics.reduce((map, diacritic) => {
  for (const letter of diacritic.letters) {
    map[letter] = diacritic.base
  }
  return map
}, {})

const normalize = (keyword) =>
  keyword
    .toLowerCase() // eslint-disable-next-line no-control-regex
    .replace(/[^\u0000-\u007E]/g, (a) => diacriticsMap[a] || a)
const cleanKeywords = (keywords) =>
  keywords.filter(Boolean).map((keyword) => normalize(keyword))

const BOOSTS = {
  Parliamentarian: 1,
  Guest: 0.5,
  Organisation: 0,
  LobbyGroup: 0,
  Branch: 0,
}

const search = (term, index) => {
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
        return [match + BOOSTS[item.type], item]
      }
    })
    .filter(Boolean)
    .sort((a, b) => descending(a[0], b[0]))
    .slice(0, 30)
    .map(([score, item]) => item.raw)
}

const buildIndex = ({
  parliamentarians,
  guests,
  lobbyGroups,
  branchen,
  organisations,
}) => {
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
  return parliamentarians.data.parliamentarians
    .map((parliamentarian) => ({
      type: 'Parliamentarian',
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
    }))
    .concat(
      guests.data.guests.map((guest) => ({
        type: 'Guest',
        raw: guest,
        keywords: cleanKeywords([
          guest.lastName,
          guest.firstName,
          guest.middleName,
          ...guest.function?.split(','),
        ]),
      })),
    )
    .concat(
      lobbyGroups.data.lobbyGroups.map((lobbyGroup) => ({
        type: 'LobbyGroup',
        raw: lobbyGroup,
        keywords: cleanKeywords([
          lobbyGroup.name,
          lobbyGroup.branche,
          ...lobbyGroup.commissions.flatMap((commission) => [
            commission.abbr,
            commission.name,
          ]),
        ]),
      })),
    )
    .concat(
      branchen.data.branchen.map((branch) => ({
        type: 'Branch',
        raw: branch,
        keywords: cleanKeywords([branch.name]),
      })),
    )
    .concat(
      organisations.data.organisations.map((organisation) => ({
        type: 'Organisation',
        raw: organisation,
        keywords: cleanKeywords([
          organisation.name,
          organisation.uid,
          organisation.abbr,
          ...organisation.lobbyGroups.map((group) => group.name),
        ]),
      })),
    )
}

export const useSearch = ({ locale, term }) => {
  const parliamentarians = useParliamentarians({
    locale,
    query: {
      select_fields: [
        'parlament_number',
        'vorname',
        'zweiter_vorname',
        'nachname',
        'beruf',
        'geschlecht',
        'geburtstag',
        'parteifunktion',
        'partei_name',
        'partei_name_fr',
        'partei',
        'partei_fr',
        'kanton_name_de',
        'kanton_name_fr',
        'ratstyp',
        'aktiv',
        'im_rat_bis_unix',
        'im_rat_seit_unix',
        'kommissionen_namen_de',
        'kommissionen_namen_fr',
        'kommissionen_abkuerzung_de',
        'kommissionen_abkuerzung_fr',
      ].join(','),
    },
  })
  const guests = useGuests({
    locale,
    query: {
      select_fields: [
        'id',
        'vorname',
        'nachname',
        'beruf',
        'geschlecht',
        'funktion',
        'zweiter_vorname',
        'bis_unix',
      ].join(','),
    },
  })
  const lobbyGroups = useLobbyGroups({ locale })
  const branchen = useBranchen({ locale })
  const organisations = useOrganisations({
    locale,
    query: {
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
    },
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
