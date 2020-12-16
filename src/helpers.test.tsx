import {asset, fakePromise, plural, truncateMiddle} from "./helpers";

describe('Helpers script', () => {

  it('asset() should return valid assets url', () => {
    const img1 = asset('/my-image.jpg')
    const img2 = asset('img/my-image.jpg')
    expect(img1).toBe('/test/my-image.jpg')
    expect(img2).toBe('/test/img/my-image.jpg')
  })

  it('fakePromise() should wait for fake promise', async () => {
    expect(fakePromise(123)).resolves.toBe('Promise timeout reached (limit: 123 ms)')

  })


  it('truncateMiddle() should trim string', async () => {
    let str1 = truncateMiddle('a very long string', 10)
    let str2 = truncateMiddle('a very long string', 11)
    let str3 = truncateMiddle('a very long string', 12)
    let str4 = truncateMiddle('Bruno Barros Soares', 16)

    expect(str1).toEqual('a ve...ing')
    expect(str2).toEqual('a ve...ring')
    expect(str3).toEqual('a ver...ring')
    expect(str4).toEqual('Bruno B...Soares')
  })

  it('plural() should return single OR plural form', () => {

    const str0 = plural(0, 'item', 'itens', 'nada')
    const str1 = plural(0, 'item', 'itens')
    const str2 = plural(1, 'item', 'itens')
    const str3 = plural(2, 'item', 'itens')
    const str4 = plural(5, 'item', 'itens')
    expect(str0).toBe('nada')
    expect(str1).toBe('item')
    expect(str2).toBe('item')
    expect(str3).toBe('itens')
    expect(str4).toBe('itens')
  })

  it('plural() should return single OR plural form with count', () => {

    const str1 = plural(0, 'item (%c)', 'itens (%c)')
    const str2 = plural(1, 'item (%c)', 'itens (%c)')
    const str3 = plural(2, 'item (%c)', 'itens (%c)')
    const str4 = plural(5, '%c% de tudo', '%c% de todos')
    expect(str1).toBe('item (0)')
    expect(str2).toBe('item (1)')
    expect(str3).toBe('itens (2)')
    expect(str4).toBe('5% de todos')
  })

})
