import type { Collection, Identifier, JSCodeshift } from 'jscodeshift'

const testApiProps = ['concurrent', 'each', 'only', 'skip', 'todo', 'failing']
const jestGlobalApiProps = {
  describe: ['each', 'only', 'skip'],
  fit: ['each', 'failing'],
  it: testApiProps,
  test: testApiProps,
}

export const getApisFromMemberExpression = (j: JSCodeshift, source: Collection<any>): string[] => {
  const apisFromMemberExpression = []

  for (const [jestApi, jestApiProps] of Object.entries(jestGlobalApiProps)) {
    const propNamesList = source.find(j.MemberExpression, {
      object: { name: jestApi },
      property: { type: 'Identifier' },
    }).nodes().map(node => (node.property as Identifier).name)

    const propNames = [...new Set(propNamesList)]
    for (const propName of propNames) {
      if (jestApiProps.includes(propName)) {
        apisFromMemberExpression.push(jestApi !== 'fit' ? jestApi : 'it')
        break
      }
    }
  }

  return apisFromMemberExpression
}
