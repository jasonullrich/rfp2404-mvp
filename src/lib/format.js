const format = (time) => {
  const minutes = Math.floor(time / 60000)
  const seconds = Math.floor((time - minutes * 60000) / 1000)
  const milliseconds = time - minutes * 60000 - seconds * 1000
  return `${('000' + minutes).slice(-2)}:${('000' + seconds).slice(-2)}:${(
    '000' + milliseconds
  ).slice(-3)}`
}

export default format
