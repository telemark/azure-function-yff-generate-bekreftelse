const getTemplatePath = require('tfk-saksbehandling-minelev-templates')
const getSchoolInfo = require('tfk-schools-info')
const getSkoleAar = require('get-skole-aar')
const birthdateFromId = require('birthdate-from-id')
const generateTitle = require('elev-varsel-generate-document-title')
const datePadding = require('./date-padding')
const getTemplate = require('./get-template')
const buildLareplan = require('./yff-build-lareplan')
const generateMottaker = require('./yff-generate-mottaker')
const toNynorsk = require('./to-nynorsk')

function repackLareplan (lines) {
  let plans = []
  lines.forEach(line => {
    plans.push(`\n${line.utplasseringsSted}`)
    line.line.forEach(l => {
      plans.push(`\nProgramområde: ${l.programomrade}\nKompetansemål: ${l.kompetanseMaal}\nArbeidsoppgaver: ${l.arbeidsOppgaver}`)
    })
  })
  return plans.join('\n')
}

function checkCopyTo (lines) {
  let emails = lines.filter(line => line.epost && line.epost !== '').map(line => line.epost)
  return emails.length > 0 ? `Kopi sendt via e-post til ${emails.join(', ')}` : ''
}

function getRecipients (lines) {
  return lines.filter(line => line.epost && line.epost !== '').map(line => line.epost)
}

function repackPerson (lines) {
  let kontaktperson = []
  lines.forEach(line => {
    kontaktperson.push(`${line.navn} - telefon: ${line.telefon}${line.epost && line.epost !== '' ? ' - e-post: ' : ''}${line.epost || ''}${line.avdeling && line.avdeling !== '' ? ' - ' : ''}${line.avdeling || ''}`)
  })
  return kontaktperson.join('\n')
}

function repackTilbakemelding (lines) {
  let tilbakemelding = []
  lines.forEach(line => {
    if (/0/.test(line.score) !== true) {
      if (line.hasOwnProperty('description')) {
        if (line.description) {
          tilbakemelding.push(`Kompetansemål: ${line.name}\nArbeidsoppgaver: ${line.description}\nMåloppnåelse: ${line.score}\n`)
        } else {
          tilbakemelding.push(`Kompetansemål: ${line.name}\nMåloppnåelse: ${line.score}\n`)
        }
      } else {
        tilbakemelding.push(`${line.name} - ${line.score}`)
      }
    }
  })
  return tilbakemelding.join('\n')
}

function repackArbeidstid (data) {
  let arbeidstid = []
  arbeidstid.push(`Tidsrom: ${data.startDato} - ${data.sluttDato}`)
  arbeidstid.push(`Arbeidsdag: ${data.startTid} - ${data.sluttTid}`)
  arbeidstid.push(`Dager i uken: ${data.daysPerWeek}`)
  if (data.oppmotested !== '') {
    arbeidstid.push(`Oppmøtested: ${data.oppmotested}`)
  }
  return arbeidstid.join('\n')
}

function repackFravar (data) {
  let fravar = ''
  if (/0/.test(data.fravarDager) !== true || /0/.test(data.fravarTimer) !== true) {
    if (data.varsletFravar === 'ja') {
      fravar = 'Eleven varslet selv om fraværet.'
    } else if (data.varsletFravar === 'nei') {
      fravar = 'Eleven varslet ikke om fraværet.'
    } else if (data.varsletFravar === 'av og til') {
      fravar = 'Eleven varslet selv om noe av fraværet.'
    }
  }
  return fravar
}

function programomradeOrUtdanningsprogram (data) {
  let output = data.utdanningsProgram || ''
  if (data.programomrade !== '' && data.classLevel === 'VG2') {
    output = data.programomrade
  }
  return output
}

module.exports = data => {
  const now = new Date()
  const date = datePadding(now.getDate()) + '.' + datePadding(now.getMonth() + 1) + '.' + now.getFullYear()
  const schoolInfo = getSchoolInfo({ organizationNumber: data.schoolOrganizationNumber.replace(/\D/g, '') })[0]
  const template = getTemplate(data)
  const offTitle = generateTitle(data)
  const tilbakemeldingInntrykk = data.evaluation ? repackTilbakemelding(data.evaluation) : ''
  const tilbakemeldingInntrykkNN = data.evaluation ? toNynorsk(tilbakemeldingInntrykk) : ''
  const document = {
    title: generateTitle(data, true),
    offTitle: offTitle,
    data: {
      dato: date,
      navnElev: data.studentName,
      tlfElev: data.studentPhone,
      epostElev: data.studentMail,
      fodselsdatoElev: birthdateFromId(data.studentId),
      fodselsNummerElev: data.studentId,
      klasseElev: data.studentMainGroupName,
      klasseTrinn: data.classLevel ? data.classLevel.toLowerCase() : '',
      utdanningsProgram: programomradeOrUtdanningsprogram(data),
      paarorendeElev: data.parorendeData ? repackPerson(data.parorendeData) : '',
      navnMottaker: generateMottaker(data),
      kontaktBedrift: data.kontaktpersonData ? repackPerson(data.kontaktpersonData) : '',
      kopiTilEpost: data.kontaktpersonData ? checkCopyTo(data.kontaktpersonData) : '',
      navnOpplaeringssted: data.bedriftsNavn || '',
      utplasseringsTidsrom: data.utplasseringsPeriode || '',
      skoleAar: getSkoleAar(),
      arbeidsTid: data.utplasseringData ? repackArbeidstid(data.utplasseringData) : '',
      navnLaerer: data.userName,
      epostLaerer: data.userMail,
      navnSkole: schoolInfo.officialName,
      tlfSkole: schoolInfo.phoneNumber,
      yffDokument: offTitle,
      lokalLaereplan: data.lokalPlanMaal ? repackLareplan(buildLareplan(data.lokalPlanMaal)) : '',
      tilbakemeldingKompetansemaal: data.maal ? repackTilbakemelding(data.maal) : '',
      tilbakemeldingInntrykk: tilbakemeldingInntrykk,
      tilbakemeldingInntrykkNN: tilbakemeldingInntrykkNN,
      fravaerAntallDager: data.fravarDager || '',
      fravaerAntallTimer: data.fravarTimer || '',
      fravaerVarsling: data.documentCategory === 'yff-tilbakemelding' ? repackFravar(data) : ''
    },
    templateId: template,
    template: getTemplatePath(template),
    type: data.documentType,
    recipients: data.kontaktpersonData ? getRecipients(data.kontaktpersonData) : []
  }
  return document
}
