// Custom Prism JavaScript
/* eslint-disable */
/* PrismJS 1.23.0
https://prismjs.com/download.html#themes=prism&languages=css+css-extras&plugins=line-numbers+inline-color+toolbar+copy-to-clipboard */
var _self =
    'undefined' != typeof window
      ? window
      : 'undefined' != typeof WorkerGlobalScope &&
        self instanceof WorkerGlobalScope
      ? self
      : {},
  Prism = (function(u) {
    var c = /\blang(?:uage)?-([\w-]+)\b/i,
      n = 0,
      e = {},
      M = {
        manual: u.Prism && u.Prism.manual,
        disableWorkerMessageHandler:
          u.Prism && u.Prism.disableWorkerMessageHandler,
        util: {
          encode: function e(n) {
            return n instanceof W
              ? new W(n.type, e(n.content), n.alias)
              : Array.isArray(n)
              ? n.map(e)
              : n
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/\u00a0/g, ' ')
          },
          type: function(e) {
            return Object.prototype.toString.call(e).slice(8, -1)
          },
          objId: function(e) {
            return (
              e.__id || Object.defineProperty(e, '__id', { value: ++n }), e.__id
            )
          },
          clone: function t(e, r) {
            var a, n
            switch (((r = r || {}), M.util.type(e))) {
              case 'Object':
                if (((n = M.util.objId(e)), r[n])) return r[n]
                for (var i in ((a = {}), (r[n] = a), e))
                  e.hasOwnProperty(i) && (a[i] = t(e[i], r))
                return a
              case 'Array':
                return (
                  (n = M.util.objId(e)),
                  r[n]
                    ? r[n]
                    : ((a = []),
                      (r[n] = a),
                      e.forEach(function(e, n) {
                        a[n] = t(e, r)
                      }),
                      a)
                )
              default:
                return e
            }
          },
          getLanguage: function(e) {
            for (; e && !c.test(e.className); ) e = e.parentElement
            return e
              ? (e.className.match(c) || [, 'none'])[1].toLowerCase()
              : 'none'
          },
          currentScript: function() {
            if ('undefined' == typeof document) return null
            if ('currentScript' in document) return document.currentScript
            try {
              throw new Error()
            } catch (e) {
              var n = (/at [^(\r\n]*\((.*):.+:.+\)$/i.exec(e.stack) || [])[1]
              if (n) {
                var t = document.getElementsByTagName('script')
                for (var r in t) if (t[r].src == n) return t[r]
              }
              return null
            }
          },
          isActive: function(e, n, t) {
            for (var r = 'no-' + n; e; ) {
              var a = e.classList
              if (a.contains(n)) return !0
              if (a.contains(r)) return !1
              e = e.parentElement
            }
            return !!t
          },
        },
        languages: {
          plain: e,
          plaintext: e,
          text: e,
          txt: e,
          extend: function(e, n) {
            var t = M.util.clone(M.languages[e])
            for (var r in n) t[r] = n[r]
            return t
          },
          insertBefore: function(t, e, n, r) {
            var a = (r = r || M.languages)[t],
              i = {}
            for (var l in a)
              if (a.hasOwnProperty(l)) {
                if (l == e)
                  for (var o in n) n.hasOwnProperty(o) && (i[o] = n[o])
                n.hasOwnProperty(l) || (i[l] = a[l])
              }
            var s = r[t]
            return (
              (r[t] = i),
              M.languages.DFS(M.languages, function(e, n) {
                n === s && e != t && (this[e] = i)
              }),
              i
            )
          },
          DFS: function e(n, t, r, a) {
            a = a || {}
            var i = M.util.objId
            for (var l in n)
              if (n.hasOwnProperty(l)) {
                t.call(n, l, n[l], r || l)
                var o = n[l],
                  s = M.util.type(o)
                'Object' !== s || a[i(o)]
                  ? 'Array' !== s || a[i(o)] || ((a[i(o)] = !0), e(o, t, l, a))
                  : ((a[i(o)] = !0), e(o, t, null, a))
              }
          },
        },
        plugins: {},
        highlightAll: function(e, n) {
          M.highlightAllUnder(document, e, n)
        },
        highlightAllUnder: function(e, n, t) {
          var r = {
            callback: t,
            container: e,
            selector:
              'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
          }
          M.hooks.run('before-highlightall', r),
            (r.elements = Array.prototype.slice.apply(
              r.container.querySelectorAll(r.selector)
            )),
            M.hooks.run('before-all-elements-highlight', r)
          for (var a, i = 0; (a = r.elements[i++]); )
            M.highlightElement(a, !0 === n, r.callback)
        },
        highlightElement: function(e, n, t) {
          var r = M.util.getLanguage(e),
            a = M.languages[r]
          e.className =
            e.className.replace(c, '').replace(/\s+/g, ' ') + ' language-' + r
          var i = e.parentElement
          i &&
            'pre' === i.nodeName.toLowerCase() &&
            (i.className =
              i.className.replace(c, '').replace(/\s+/g, ' ') +
              ' language-' +
              r)
          var l = { element: e, language: r, grammar: a, code: e.textContent }
          function o(e) {
            ;(l.highlightedCode = e),
              M.hooks.run('before-insert', l),
              (l.element.innerHTML = l.highlightedCode),
              M.hooks.run('after-highlight', l),
              M.hooks.run('complete', l),
              t && t.call(l.element)
          }
          if (
            (M.hooks.run('before-sanity-check', l),
            (i = l.element.parentElement) &&
              'pre' === i.nodeName.toLowerCase() &&
              !i.hasAttribute('tabindex') &&
              i.setAttribute('tabindex', '0'),
            !l.code)
          )
            return M.hooks.run('complete', l), void (t && t.call(l.element))
          if ((M.hooks.run('before-highlight', l), l.grammar))
            if (n && u.Worker) {
              var s = new Worker(M.filename)
              ;(s.onmessage = function(e) {
                o(e.data)
              }),
                s.postMessage(
                  JSON.stringify({
                    language: l.language,
                    code: l.code,
                    immediateClose: !0,
                  })
                )
            } else o(M.highlight(l.code, l.grammar, l.language))
          else o(M.util.encode(l.code))
        },
        highlight: function(e, n, t) {
          var r = { code: e, grammar: n, language: t }
          return (
            M.hooks.run('before-tokenize', r),
            (r.tokens = M.tokenize(r.code, r.grammar)),
            M.hooks.run('after-tokenize', r),
            W.stringify(M.util.encode(r.tokens), r.language)
          )
        },
        tokenize: function(e, n) {
          var t = n.rest
          if (t) {
            for (var r in t) n[r] = t[r]
            delete n.rest
          }
          var a = new i()
          return (
            I(a, a.head, e),
            (function e(n, t, r, a, i, l) {
              for (var o in r)
                if (r.hasOwnProperty(o) && r[o]) {
                  var s = r[o]
                  s = Array.isArray(s) ? s : [s]
                  for (var u = 0; u < s.length; ++u) {
                    if (l && l.cause == o + ',' + u) return
                    var c = s[u],
                      g = c.inside,
                      f = !!c.lookbehind,
                      h = !!c.greedy,
                      d = c.alias
                    if (h && !c.pattern.global) {
                      var p = c.pattern.toString().match(/[imsuy]*$/)[0]
                      c.pattern = RegExp(c.pattern.source, p + 'g')
                    }
                    for (
                      var v = c.pattern || c, m = a.next, y = i;
                      m !== t.tail && !(l && y >= l.reach);
                      y += m.value.length, m = m.next
                    ) {
                      var b = m.value
                      if (t.length > n.length) return
                      if (!(b instanceof W)) {
                        var k,
                          x = 1
                        if (h) {
                          if (!(k = z(v, y, n, f))) break
                          var w = k.index,
                            A = k.index + k[0].length,
                            P = y
                          for (P += m.value.length; P <= w; )
                            (m = m.next), (P += m.value.length)
                          if (
                            ((P -= m.value.length),
                            (y = P),
                            m.value instanceof W)
                          )
                            continue
                          for (
                            var E = m;
                            E !== t.tail &&
                            (P < A || 'string' == typeof E.value);
                            E = E.next
                          )
                            x++, (P += E.value.length)
                          x--, (b = n.slice(y, P)), (k.index -= y)
                        } else if (!(k = z(v, 0, b, f))) continue
                        var w = k.index,
                          S = k[0],
                          O = b.slice(0, w),
                          L = b.slice(w + S.length),
                          N = y + b.length
                        l && N > l.reach && (l.reach = N)
                        var j = m.prev
                        O && ((j = I(t, j, O)), (y += O.length)), q(t, j, x)
                        var C = new W(o, g ? M.tokenize(S, g) : S, d, S)
                        if (((m = I(t, j, C)), L && I(t, m, L), 1 < x)) {
                          var _ = { cause: o + ',' + u, reach: N }
                          e(n, t, r, m.prev, y, _),
                            l && _.reach > l.reach && (l.reach = _.reach)
                        }
                      }
                    }
                  }
                }
            })(e, a, n, a.head, 0),
            (function(e) {
              var n = [],
                t = e.head.next
              for (; t !== e.tail; ) n.push(t.value), (t = t.next)
              return n
            })(a)
          )
        },
        hooks: {
          all: {},
          add: function(e, n) {
            var t = M.hooks.all
            ;(t[e] = t[e] || []), t[e].push(n)
          },
          run: function(e, n) {
            var t = M.hooks.all[e]
            if (t && t.length) for (var r, a = 0; (r = t[a++]); ) r(n)
          },
        },
        Token: W,
      }
    function W(e, n, t, r) {
      ;(this.type = e),
        (this.content = n),
        (this.alias = t),
        (this.length = 0 | (r || '').length)
    }
    function z(e, n, t, r) {
      e.lastIndex = n
      var a = e.exec(t)
      if (a && r && a[1]) {
        var i = a[1].length
        ;(a.index += i), (a[0] = a[0].slice(i))
      }
      return a
    }
    function i() {
      var e = { value: null, prev: null, next: null },
        n = { value: null, prev: e, next: null }
      ;(e.next = n), (this.head = e), (this.tail = n), (this.length = 0)
    }
    function I(e, n, t) {
      var r = n.next,
        a = { value: t, prev: n, next: r }
      return (n.next = a), (r.prev = a), e.length++, a
    }
    function q(e, n, t) {
      for (var r = n.next, a = 0; a < t && r !== e.tail; a++) r = r.next
      ;((n.next = r).prev = n), (e.length -= a)
    }
    if (
      ((u.Prism = M),
      (W.stringify = function n(e, t) {
        if ('string' == typeof e) return e
        if (Array.isArray(e)) {
          var r = ''
          return (
            e.forEach(function(e) {
              r += n(e, t)
            }),
            r
          )
        }
        var a = {
            type: e.type,
            content: n(e.content, t),
            tag: 'span',
            classes: ['token', e.type],
            attributes: {},
            language: t,
          },
          i = e.alias
        i &&
          (Array.isArray(i)
            ? Array.prototype.push.apply(a.classes, i)
            : a.classes.push(i)),
          M.hooks.run('wrap', a)
        var l = ''
        for (var o in a.attributes)
          l +=
            ' ' +
            o +
            '="' +
            (a.attributes[o] || '').replace(/"/g, '&quot;') +
            '"'
        return (
          '<' +
          a.tag +
          ' class="' +
          a.classes.join(' ') +
          '"' +
          l +
          '>' +
          a.content +
          '</' +
          a.tag +
          '>'
        )
      }),
      !u.document)
    )
      return (
        u.addEventListener &&
          (M.disableWorkerMessageHandler ||
            u.addEventListener(
              'message',
              function(e) {
                var n = JSON.parse(e.data),
                  t = n.language,
                  r = n.code,
                  a = n.immediateClose
                u.postMessage(M.highlight(r, M.languages[t], t)), a && u.close()
              },
              !1
            )),
        M
      )
    var t = M.util.currentScript()
    function r() {
      M.manual || M.highlightAll()
    }
    if (
      (t &&
        ((M.filename = t.src),
        t.hasAttribute('data-manual') && (M.manual = !0)),
      !M.manual)
    ) {
      var a = document.readyState
      'loading' === a || ('interactive' === a && t && t.defer)
        ? document.addEventListener('DOMContentLoaded', r)
        : window.requestAnimationFrame
        ? window.requestAnimationFrame(r)
        : window.setTimeout(r, 16)
    }
    return M
  })(_self)
'undefined' != typeof module && module.exports && (module.exports = Prism),
  'undefined' != typeof global && (global.Prism = Prism)
!(function(s) {
  var e = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/
  ;(s.languages.css = {
    comment: /\/\*[\s\S]*?\*\//,
    atrule: {
      pattern: /@[\w-](?:[^;{\s]|\s+(?![\s{]))*(?:;|(?=\s*\{))/,
      inside: {
        rule: /^@[\w-]+/,
        'selector-function-argument': {
          pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
          lookbehind: !0,
          alias: 'selector',
        },
        keyword: {
          pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
          lookbehind: !0,
        },
      },
    },
    url: {
      pattern: RegExp(
        '\\burl\\((?:' + e.source + '|(?:[^\\\\\r\n()"\']|\\\\[^])*)\\)',
        'i'
      ),
      greedy: !0,
      inside: {
        function: /^url/i,
        punctuation: /^\(|\)$/,
        string: { pattern: RegExp('^' + e.source + '$'), alias: 'url' },
      },
    },
    selector: RegExp(
      '[^{}\\s](?:[^{};"\'\\s]|\\s+(?![\\s{])|' + e.source + ')*(?=\\s*\\{)'
    ),
    string: { pattern: e, greedy: !0 },
    property: /(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
    important: /!important\b/i,
    function: /[-a-z0-9]+(?=\()/i,
    punctuation: /[(){};:,]/,
  }),
    (s.languages.css.atrule.inside.rest = s.languages.css)
  var t = s.languages.markup
  t && (t.tag.addInlined('style', 'css'), t.tag.addAttribute('style', 'css'))
})(Prism)
!(function(e) {
  var a,
    n = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/
  ;(e.languages.css.selector = {
    pattern: e.languages.css.selector,
    inside: a = {
      'pseudo-element': /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/,
      'pseudo-class': /:[-\w]+/,
      class: /\.[-\w]+/,
      id: /#[-\w]+/,
      attribute: {
        pattern: RegExp('\\[(?:[^[\\]"\']|' + n.source + ')*\\]'),
        greedy: !0,
        inside: {
          punctuation: /^\[|\]$/,
          'case-sensitivity': {
            pattern: /(\s)[si]$/i,
            lookbehind: !0,
            alias: 'keyword',
          },
          namespace: {
            pattern: /^(\s*)(?:(?!\s)[-*\w\xA0-\uFFFF])*\|(?!=)/,
            lookbehind: !0,
            inside: { punctuation: /\|$/ },
          },
          'attr-name': {
            pattern: /^(\s*)(?:(?!\s)[-\w\xA0-\uFFFF])+/,
            lookbehind: !0,
          },
          'attr-value': [
            n,
            {
              pattern: /(=\s*)(?:(?!\s)[-\w\xA0-\uFFFF])+(?=\s*$)/,
              lookbehind: !0,
            },
          ],
          operator: /[|~*^$]?=/,
        },
      },
      'n-th': [
        {
          pattern: /(\(\s*)[+-]?\d*[\dn](?:\s*[+-]\s*\d+)?(?=\s*\))/,
          lookbehind: !0,
          inside: { number: /[\dn]+/, operator: /[+-]/ },
        },
        { pattern: /(\(\s*)(?:even|odd)(?=\s*\))/i, lookbehind: !0 },
      ],
      combinator: />|\+|~|\|\|/,
      punctuation: /[(),]/,
    },
  }),
    (e.languages.css.atrule.inside['selector-function-argument'].inside = a),
    e.languages.insertBefore('css', 'property', {
      variable: {
        pattern: /(^|[^-\w\xA0-\uFFFF])--(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*/i,
        lookbehind: !0,
      },
    })
  var r = { pattern: /(\b\d+)(?:%|[a-z]+\b)/, lookbehind: !0 },
    i = { pattern: /(^|[^\w.-])-?(?:\d+(?:\.\d+)?|\.\d+)/, lookbehind: !0 }
  e.languages.insertBefore('css', 'function', {
    operator: { pattern: /(\s)[+\-*\/](?=\s)/, lookbehind: !0 },
    hexcode: { pattern: /\B#(?:[\da-f]{1,2}){3,4}\b/i, alias: 'color' },
    color: [
      /\b(?:AliceBlue|AntiqueWhite|Aqua|Aquamarine|Azure|Beige|Bisque|Black|BlanchedAlmond|Blue|BlueViolet|Brown|BurlyWood|CadetBlue|Chartreuse|Chocolate|Coral|CornflowerBlue|Cornsilk|Crimson|Cyan|DarkBlue|DarkCyan|DarkGoldenRod|DarkGr[ae]y|DarkGreen|DarkKhaki|DarkMagenta|DarkOliveGreen|DarkOrange|DarkOrchid|DarkRed|DarkSalmon|DarkSeaGreen|DarkSlateBlue|DarkSlateGr[ae]y|DarkTurquoise|DarkViolet|DeepPink|DeepSkyBlue|DimGr[ae]y|DodgerBlue|FireBrick|FloralWhite|ForestGreen|Fuchsia|Gainsboro|GhostWhite|Gold|GoldenRod|Gr[ae]y|Green|GreenYellow|HoneyDew|HotPink|IndianRed|Indigo|Ivory|Khaki|Lavender|LavenderBlush|LawnGreen|LemonChiffon|LightBlue|LightCoral|LightCyan|LightGoldenRodYellow|LightGr[ae]y|LightGreen|LightPink|LightSalmon|LightSeaGreen|LightSkyBlue|LightSlateGr[ae]y|LightSteelBlue|LightYellow|Lime|LimeGreen|Linen|Magenta|Maroon|MediumAquaMarine|MediumBlue|MediumOrchid|MediumPurple|MediumSeaGreen|MediumSlateBlue|MediumSpringGreen|MediumTurquoise|MediumVioletRed|MidnightBlue|MintCream|MistyRose|Moccasin|NavajoWhite|Navy|OldLace|Olive|OliveDrab|Orange|OrangeRed|Orchid|PaleGoldenRod|PaleGreen|PaleTurquoise|PaleVioletRed|PapayaWhip|PeachPuff|Peru|Pink|Plum|PowderBlue|Purple|Red|RosyBrown|RoyalBlue|SaddleBrown|Salmon|SandyBrown|SeaGreen|SeaShell|Sienna|Silver|SkyBlue|SlateBlue|SlateGr[ae]y|Snow|SpringGreen|SteelBlue|Tan|Teal|Thistle|Tomato|Transparent|Turquoise|Violet|Wheat|White|WhiteSmoke|Yellow|YellowGreen)\b/i,
      {
        pattern: /\b(?:rgb|hsl)\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\)\B|\b(?:rgb|hsl)a\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*(?:0|0?\.\d+|1)\s*\)\B/i,
        inside: {
          unit: r,
          number: i,
          function: /[\w-]+(?=\()/,
          punctuation: /[(),]/,
        },
      },
    ],
    entity: /\\[\da-f]{1,8}/i,
    unit: r,
    number: i,
  })
})(Prism)
!(function() {
  if ('undefined' != typeof Prism && 'undefined' != typeof document) {
    var o = 'line-numbers',
      a = /\n(?!$)/g,
      e = (Prism.plugins.lineNumbers = {
        getLine: function(e, n) {
          if ('PRE' === e.tagName && e.classList.contains(o)) {
            var t = e.querySelector('.line-numbers-rows')
            if (t) {
              var i = parseInt(e.getAttribute('data-start'), 10) || 1,
                r = i + (t.children.length - 1)
              n < i && (n = i), r < n && (n = r)
              var s = n - i
              return t.children[s]
            }
          }
        },
        resize: function(e) {
          u([e])
        },
        assumeViewportIndependence: !0,
      }),
      t = function(e) {
        return e
          ? window.getComputedStyle
            ? getComputedStyle(e)
            : e.currentStyle || null
          : null
      },
      n = void 0
    window.addEventListener('resize', function() {
      ;(e.assumeViewportIndependence && n === window.innerWidth) ||
        ((n = window.innerWidth),
        u(Array.prototype.slice.call(document.querySelectorAll('pre.' + o))))
    }),
      Prism.hooks.add('complete', function(e) {
        if (e.code) {
          var n = e.element,
            t = n.parentNode
          if (
            t &&
            /pre/i.test(t.nodeName) &&
            !n.querySelector('.line-numbers-rows') &&
            Prism.util.isActive(n, o)
          ) {
            n.classList.remove(o), t.classList.add(o)
            var i,
              r = e.code.match(a),
              s = r ? r.length + 1 : 1,
              l = new Array(s + 1).join('<span></span>')
            ;(i = document.createElement('span')).setAttribute(
              'aria-hidden',
              'true'
            ),
              (i.className = 'line-numbers-rows'),
              (i.innerHTML = l),
              t.hasAttribute('data-start') &&
                (t.style.counterReset =
                  'linenumber ' +
                  (parseInt(t.getAttribute('data-start'), 10) - 1)),
              e.element.appendChild(i),
              u([t]),
              Prism.hooks.run('line-numbers', e)
          }
        }
      }),
      Prism.hooks.add('line-numbers', function(e) {
        ;(e.plugins = e.plugins || {}), (e.plugins.lineNumbers = !0)
      })
  }
  function u(e) {
    if (
      0 !=
      (e = e.filter(function(e) {
        var n = t(e)['white-space']
        return 'pre-wrap' === n || 'pre-line' === n
      })).length
    ) {
      var n = e
        .map(function(e) {
          var n = e.querySelector('code'),
            t = e.querySelector('.line-numbers-rows')
          if (n && t) {
            var i = e.querySelector('.line-numbers-sizer'),
              r = n.textContent.split(a)
            i ||
              (((i = document.createElement('span')).className =
                'line-numbers-sizer'),
              n.appendChild(i)),
              (i.innerHTML = '0'),
              (i.style.display = 'block')
            var s = i.getBoundingClientRect().height
            return (
              (i.innerHTML = ''),
              {
                element: e,
                lines: r,
                lineHeights: [],
                oneLinerHeight: s,
                sizer: i,
              }
            )
          }
        })
        .filter(Boolean)
      n.forEach(function(e) {
        var i = e.sizer,
          n = e.lines,
          r = e.lineHeights,
          s = e.oneLinerHeight
        ;(r[n.length - 1] = void 0),
          n.forEach(function(e, n) {
            if (e && 1 < e.length) {
              var t = i.appendChild(document.createElement('span'))
              ;(t.style.display = 'block'), (t.textContent = e)
            } else r[n] = s
          })
      }),
        n.forEach(function(e) {
          for (
            var n = e.sizer, t = e.lineHeights, i = 0, r = 0;
            r < t.length;
            r++
          )
            void 0 === t[r] &&
              (t[r] = n.children[i++].getBoundingClientRect().height)
        }),
        n.forEach(function(e) {
          var n = e.sizer,
            t = e.element.querySelector('.line-numbers-rows')
          ;(n.style.display = 'none'),
            (n.innerHTML = ''),
            e.lineHeights.forEach(function(e, n) {
              t.children[n].style.height = e + 'px'
            })
        })
    }
  }
})()
!(function() {
  if ('undefined' != typeof Prism && 'undefined' != typeof document) {
    var a = /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/g,
      c = /^#?((?:[\da-f]){3,4}|(?:[\da-f]{2}){3,4})$/i,
      l = [
        function(n) {
          var r = c.exec(n)
          if (r) {
            for (
              var o = 6 <= (n = r[1]).length ? 2 : 1,
                s = n.length / o,
                e = 1 == o ? 1 / 15 : 1 / 255,
                t = [],
                i = 0;
              i < s;
              i++
            ) {
              var a = parseInt(n.substr(i * o, o), 16)
              t.push(a * e)
            }
            return (
              3 == s && t.push(1),
              'rgba(' +
                t
                  .slice(0, 3)
                  .map(function(n) {
                    return String(Math.round(255 * n))
                  })
                  .join(',') +
                ',' +
                String(Number(t[3].toFixed(3))) +
                ')'
            )
          }
        },
        function(n) {
          var r = new Option().style
          return (r.color = n), r.color ? n : void 0
        },
      ]
    Prism.hooks.add('wrap', function(n) {
      if ('color' === n.type || 0 <= n.classes.indexOf('color')) {
        for (
          var r, o = n.content, s = o.split(a).join(''), e = 0, t = l.length;
          e < t && !r;
          e++
        )
          r = l[e](s)
        if (!r) return
        var i =
          '<span class="inline-color-wrapper"><span class="inline-color" style="background-color:' +
          r +
          ';"></span></span>'
        n.content = i + o
      }
    })
  }
})()
!(function() {
  if ('undefined' != typeof Prism && 'undefined' != typeof document) {
    var i = [],
      l = {},
      d = function() {}
    Prism.plugins.toolbar = {}
    var e = (Prism.plugins.toolbar.registerButton = function(e, n) {
        var t
        ;(t =
          'function' == typeof n
            ? n
            : function(e) {
                var t
                return (
                  'function' == typeof n.onClick
                    ? (((t = document.createElement('button')).type = 'button'),
                      t.addEventListener('click', function() {
                        n.onClick.call(this, e)
                      }))
                    : 'string' == typeof n.url
                    ? ((t = document.createElement('a')).href = n.url)
                    : (t = document.createElement('span')),
                  n.className && t.classList.add(n.className),
                  (t.textContent = n.text),
                  t
                )
              }),
          e in l
            ? console.warn(
                'There is a button with the key "' + e + '" registered already.'
              )
            : i.push((l[e] = t))
      }),
      t = (Prism.plugins.toolbar.hook = function(a) {
        var e = a.element.parentNode
        if (
          e &&
          /pre/i.test(e.nodeName) &&
          !e.parentNode.classList.contains('code-toolbar')
        ) {
          var t = document.createElement('div')
          t.classList.add('code-toolbar'),
            e.parentNode.insertBefore(t, e),
            t.appendChild(e)
          var r = document.createElement('div')
          r.classList.add('toolbar')
          var n = i,
            o = (function(e) {
              for (; e; ) {
                var t = e.getAttribute('data-toolbar-order')
                if (null != t)
                  return (t = t.trim()).length ? t.split(/\s*,\s*/g) : []
                e = e.parentElement
              }
            })(a.element)
          o &&
            (n = o.map(function(e) {
              return l[e] || d
            })),
            n.forEach(function(e) {
              var t = e(a)
              if (t) {
                var n = document.createElement('div')
                n.classList.add('toolbar-item'),
                  n.appendChild(t),
                  r.appendChild(n)
              }
            }),
            t.appendChild(r)
        }
      })
    e('label', function(e) {
      var t = e.element.parentNode
      if (t && /pre/i.test(t.nodeName) && t.hasAttribute('data-label')) {
        var n,
          a,
          r = t.getAttribute('data-label')
        try {
          a = document.querySelector('template#' + r)
        } catch (e) {}
        return (
          a
            ? (n = a.content)
            : (t.hasAttribute('data-url')
                ? ((n = document.createElement('a')).href = t.getAttribute(
                    'data-url'
                  ))
                : (n = document.createElement('span')),
              (n.textContent = r)),
          n
        )
      }
    }),
      Prism.hooks.add('complete', t)
  }
})()
!(function() {
  function u(t, e) {
    t.addEventListener('click', function() {
      !(function(t) {
        navigator.clipboard
          ? navigator.clipboard.writeText(t.getText()).then(t.success, t.error)
          : (function(e) {
              var t = document.createElement('textarea')
              ;(t.value = e.getText()),
                (t.style.top = '0'),
                (t.style.left = '0'),
                (t.style.position = 'fixed'),
                document.body.appendChild(t),
                t.focus(),
                t.select()
              try {
                var o = document.execCommand('copy')
                setTimeout(function() {
                  o ? e.success() : e.error()
                }, 1)
              } catch (t) {
                setTimeout(function() {
                  e.error(t)
                }, 1)
              }
              document.body.removeChild(t)
            })(t)
      })(e)
    })
  }
  'undefined' != typeof Prism &&
    'undefined' != typeof document &&
    (Prism.plugins.toolbar
      ? Prism.plugins.toolbar.registerButton('copy-to-clipboard', function(t) {
          var e = t.element,
            o = (function(t) {
              var e = {
                copy: 'Copy',
                'copy-error': 'Press Ctrl+C to copy',
                'copy-success': 'Copied!',
                'copy-timeout': 5e3,
              }
              for (var o in e) {
                for (
                  var n = 'data-prismjs-' + o, r = t;
                  r && !r.hasAttribute(n);

                )
                  r = r.parentElement
                r && (e[o] = r.getAttribute(n))
              }
              return e
            })(e),
            n = document.createElement('button')
          ;(n.className = 'copy-to-clipboard-button'),
            n.setAttribute('type', 'button')
          var r = document.createElement('span')
          return (
            n.appendChild(r),
            i('copy'),
            u(n, {
              getText: function() {
                return e.textContent
              },
              success: function() {
                i('copy-success'), c()
              },
              error: function() {
                i('copy-error'),
                  setTimeout(function() {
                    !(function(t) {
                      window.getSelection().selectAllChildren(t)
                    })(e)
                  }, 1),
                  c()
              },
            }),
            n
          )
          function c() {
            setTimeout(function() {
              i('copy')
            }, o['copy-timeout'])
          }
          function i(t) {
            ;(r.textContent = o[t]), n.setAttribute('data-copy-state', t)
          }
        })
      : console.warn('Copy to Clipboard plugin loaded before Toolbar plugin.'))
})()
/* eslint-enable */

const { $ } = window

const CODE_BLOCK = document.querySelector('code')

const CODE_TEMPLATE = (hue, saturation, lightnessLower, lightnessUpper) => `
:root {
  --shade-one: hsl(${hue}, ${saturation}%, 90%);
  --shade-two: hsl(${hue}, ${saturation}%, 80%);
  --shade-three: hsl(${hue}, ${saturation}%, 70%);
  --shade-four: hsl(${hue}, ${saturation}%, 60%);
  --shade-five: hsl(${hue}, ${saturation}%, 50%);
  --shade-six: hsl(${hue}, ${saturation}%, 40%);
  --shade-seven: hsl(${hue}, ${saturation}%, 30%);
  --shade-eight: hsl(${hue}, ${saturation}%, 20%);
}
`
const UPDATE = () => {
  const CODE = CODE_TEMPLATE(
    $('#hue').slider('value'),
    $('#saturation').slider('value'),
    $('#lightness').slider('values')
  )
  const HTML = Prism.highlight(CODE, Prism.languages.css, 'css')
  CODE_BLOCK.innerHTML = HTML
}

// HUE_SLIDER.addEventListener('input', UPDATE)

$('#hue').slider({
  min: 0,
  max: 360,
  step: 1,
  slide: UPDATE,
})
$('#saturation').slider({
  min: 0,
  max: 100,
  step: 1,
  slide: UPDATE,
})
$('#lightness').slider({
  range: true,
  min: 0,
  max: 100,
  values: [0, 100],
  step: 1,
  slide: UPDATE,
})

UPDATE()
