module.exports = data => {
  return data.samtaleCategories && /Eleven ønsker ikke samtale/.test(data.samtaleCategories) ? 'ikke-samtale' : data.documentCategory
}
