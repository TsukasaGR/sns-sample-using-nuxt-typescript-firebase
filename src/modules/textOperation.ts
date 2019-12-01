export function textAutoLink(text: string): string {
  // eslint-disable-next-line no-useless-escape
  const reUrl = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi
  // eslint-disable-next-line no-useless-escape
  const reMail = /((?:\w+\.?)*\w+@(?:\w+\.)+\w+)/gi

  text = text.replace(reUrl, '<a href="$1" target="_blank">$1</a>')
  text = text.replace(reMail, '<a href="mailto:$1">$1</a>')

  return text
}
