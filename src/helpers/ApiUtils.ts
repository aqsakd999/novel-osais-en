export const buildPath = (template: string, params: any) => {
  return template.replace(/:([a-zA-Z]+)/g, (_, key) => params[key] || '')
}
