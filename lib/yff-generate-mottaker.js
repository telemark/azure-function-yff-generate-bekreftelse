module.exports = data => {
  let mottaker = []
  if (data.documentCategory === 'yff-bekreftelse') {
    mottaker.push(data.studentName)
  }
  if (data.documentCategory === 'yff-bekreftelse-bedrift') {
    mottaker.push(data.bedriftsNavn)
    if (data.bedriftsData && data.bedriftsData.avdeling !== '') {
      mottaker.push(data.bedriftsData.avdeling)
    }
    if (data.kontaktpersonData && data.kontaktpersonData.length > 0) {
      data.kontaktpersonData.forEach(line => {
        const avdeling = line.avdeling !== '' ? ` - ${line.avdeling}` : ''
        mottaker.push(`${line.navn}${avdeling}`)
      })
    }
  }
  return mottaker.join('\n')
}
