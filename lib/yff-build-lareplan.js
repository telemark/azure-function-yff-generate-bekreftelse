function repackPlanLine (prev, curr) {
  const key = curr.utplasseringID !== '' ? curr.utplasseringID : 'ub'
  if (prev.hasOwnProperty(key)) {
    prev[key].line.push(curr)
  } else {
    prev[key] = {
      utplasseringsSted: curr.utplasseringsSted,
      line: [curr]
    }
  }
  return prev
}

module.exports = maal => {
  const reduced = maal.reduce(repackPlanLine, {})
  return Object.values(reduced)
}
