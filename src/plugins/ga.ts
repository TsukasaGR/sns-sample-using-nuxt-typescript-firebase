/* eslint-disable */

// TODO: ts-ignoreとanyを使わずに書く
export default ({ app }) => {
  /*
   ** クライアントサイドかつプロダクションモードでのみ実行
   */
  if (process.env.NODE_ENV !== 'production')
    return /*
     ** Google アナリティクスのスクリプトをインクルード
     */
  ;(function(i: any, s: any, o: any, g: any, r: any, a, m) {
    i['GoogleAnalyticsObject'] = r
    ;(i[r] =
      i[r] ||
      function() {
        ;(i[r].q = i[r].q || []).push(arguments)
      }),
      // @ts-ignore
      (i[r].l = 1 * new Date())
    ;(a = s.createElement(o)), (m = s.getElementsByTagName(o)[0])
    // @ts-ignore
    a.async = 1
    // @ts-ignore
    a.src = g
    // @ts-ignore
    m.parentNode.insertBefore(a, m)
  })(
    window,
    document,
    'script',
    'https://www.google-analytics.com/analytics.js',
    'ga'
  )
  /*
   ** 現在のページをセット
   */
  // @ts-ignore
  ga('create', process.env.trackingId, 'auto')

  /*
   ** ルートが変更されるたびに毎回実行（初期化も実行される）
   */
  app.router.afterEach((to, from) => {
    /*
     ** Google アナリティクスにページビューが追加されたことを伝える
     */
    // @ts-ignore
    ga('set', 'page', to.fullPath)
    // @ts-ignore
    ga('send', 'pageview')
  })
}
