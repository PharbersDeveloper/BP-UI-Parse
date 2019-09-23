// copy from ember.js
export function uniqBy(array: any[], key: any) {
    const ret: any[] = []
    const seen = new Set()
    const getter =  (item: any) => item[key]
    // const getter = function(item:any) {
    //   return item[key]
    // }

    array.forEach((item) => {
      const val = getter(item)
      if (!seen.has(val)) {
        seen.add(val)
        ret.push(item)
      }
    })

    return ret
  }
