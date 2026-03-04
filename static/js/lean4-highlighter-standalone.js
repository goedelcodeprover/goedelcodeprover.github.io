/**
 * Lean 4 highlighter: standalone JS for static demo pages.
 */
(function (global) {
  'use strict';

  var KEYWORDS = {
    'lemma':1,'theorem':1,'def':1,'instance':1,'inductive':1,'structure':1,'class':1,
    'namespace':1,'section':1,'end':1,'variable':1,'variables':1,'open':1,'import':1,
    'export':1,'abbrev':1,'opaque':1,'axiom':1,'sorry':1,'by':1,'match':1,'with':1,
    'if':1,'then':1,'else':1,'let':1,'in':1,'have':1,'show':1,'from':1,'calc':1,
    'rfl':1,'where':1,'fun':1,'do':1,'return':1,'classical':1,'subst':1,'at':1
  };
  var TACTICS = {
    'exact':1,'apply':1,'simp':1,'intro':1,'intros':1,'cases':1,'rcases':1,
    'constructor':1,'refine':1,'by_contra':1,'use':1,'obtain':1,'rewrite':1,'rw':1,
    'unfold':1,'induction':1,'split':1,'left':1,'right':1,'repeat':1,'try':1,
    'done':1,'fail':1,'simpa':1,'simp_all':1,'omega':1,'linarith':1,'ring':1,
    'norm_num':1,'decide':1,'trivial':1,'assumption':1,'contradiction':1,'exfalso':1,
    'absurd':1,'ext':1,'push_neg':1
  };
  var TYPES = {
    'Prop':1,'Type':1,'Int':1,'Nat':1,'List':1,'Option':1,'Bool':1,'True':1,'False':1,
    'Eq':1,'And':1,'Or':1,'Not':1,'Unit':1,'String':1,'Char':1,'Float':1,'Array':1,
    'Vector':1,'Set':1,'Finset':1,'Multiset':1
  };

  var UNICODE_MAP = {
    '\u2192':'operator','\u2190':'operator','\u21D2':'operator','\u21D0':'operator',
    '\u2194':'operator','\u2227':'operator','\u2228':'operator','\u00AC':'operator',
    '\u2200':'operator','\u2203':'operator','\u2260':'operator','\u2264':'operator',
    '\u2265':'operator','\u2208':'operator','\u2209':'operator','\u2286':'operator',
    '\u222A':'operator','\u2229':'operator','\u00D7':'operator','\u00B7':'operator',
    '\u27E8':'operator','\u27E9':'operator','\u25B8':'operator',
    '\u03B1':'ident','\u03B2':'ident','\u03B3':'ident','\u03B4':'ident',
    '\u03B5':'ident','\u03B6':'ident','\u03B7':'ident','\u03B8':'ident',
    '\u03B9':'ident','\u03BA':'ident','\u03BB':'ident','\u03BC':'ident',
    '\u03BD':'ident','\u03BE':'ident','\u03C0':'ident','\u03C1':'ident',
    '\u03C3':'ident','\u03C4':'ident','\u03C5':'ident','\u03C6':'ident',
    '\u03C7':'ident','\u03C8':'ident','\u03C9':'ident'
  };

  function tokenize(code) {
    var tokens = [];
    var i = 0;
    var n = code.length;

    while (i < n) {
      var c = code[i];
      var code0 = c.charCodeAt(0);

      // line comment --
      if (c === '-' && code[i+1] === '-') {
        var j = i;
        while (j < n && code[j] !== '\n') j++;
        tokens.push({ type: 'comment', value: code.slice(i, j) });
        i = j;
        continue;
      }

      // string
      if (c === '"') {
        var j = i + 1;
        while (j < n && code[j] !== '"') {
          if (code[j] === '\\') j++;
          j++;
        }
        tokens.push({ type: 'string', value: code.slice(i, j + 1) });
        i = j + 1;
        continue;
      }

      // number
      if (code0 >= 48 && code0 <= 57) {
        var j = i;
        while (j < n && /[\dxa-fA-F.]/.test(code[j])) j++;
        tokens.push({ type: 'number', value: code.slice(i, j) });
        i = j;
        continue;
      }

      // ASCII identifier
      if ((code0 >= 65 && code0 <= 90) || (code0 >= 97 && code0 <= 122) || c === '_') {
        var j = i;
        while (j < n) {
          var cc0 = code.charCodeAt(j);
          if ((cc0 >= 65 && cc0 <= 90) || (cc0 >= 97 && cc0 <= 122) ||
              (cc0 >= 48 && cc0 <= 57) || cc0 === 95 || cc0 === 39) {
            j++;
          } else {
            break;
          }
        }
        var word = code.slice(i, j);
        var type_ = KEYWORDS[word] ? 'keyword' : TACTICS[word] ? 'tactic' : TYPES[word] ? 'type' : 'ident';
        tokens.push({ type: type_, value: word });
        i = j;
        continue;
      }

      // Unicode: lookup table
      if (code0 > 127) {
        var utype = UNICODE_MAP[c];
        tokens.push({ type: utype || 'plain', value: c });
        i++;
        continue;
      }

      // ASCII operator
      if (':=<>+*/%|!&^~'.indexOf(c) !== -1) {
        tokens.push({ type: 'operator', value: c });
        i++;
        continue;
      }

      // ASCII punctuation
      if ('(){}[];.,#@$\\`'.indexOf(c) !== -1) {
        tokens.push({ type: 'punct', value: c });
        i++;
        continue;
      }

      tokens.push({ type: 'plain', value: c });
      i++;
    }
    return tokens;
  }

  var TOKEN_COLORS = {
    comment:  '#7fba6e',
    string:   '#f0a070',
    number:   '#d19a66',
    keyword:  '#e06cff',
    tactic:   '#56d4b8',
    type:     '#61afef',
    operator: '#e5c07b',
    punct:    '#abb2bf',
    ident:    '#c8d8ff',
    plain:    '#e8e8e8'
  };

  function escapeHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function highlightToHtml(code) {
    var lines = code.split('\n');
    var out = [];
    for (var li = 0; li < lines.length; li++) {
      var tokens = tokenize(lines[li]);
      var lineHtml = '';
      for (var ti = 0; ti < tokens.length; ti++) {
        var tok = tokens[ti];
        var color = TOKEN_COLORS[tok.type] || TOKEN_COLORS.plain;
        lineHtml += '<span style="color:' + color + '">' + escapeHtml(tok.value) + '</span>';
      }
      out.push(lineHtml);
    }
    return out.join('\n');
  }

  function highlightAll(container) {
    if (!container) return;
    var codes = container.querySelectorAll('code.language-lean');
    for (var k = 0; k < codes.length; k++) {
      var el = codes[k];
      var text = el.textContent || el.innerText || '';
      el.innerHTML = highlightToHtml(text);
    }
  }

  global.Lean4Highlighter = {
    tokenize: tokenize,
    highlightToHtml: highlightToHtml,
    highlightAll: highlightAll,
    TOKEN_COLORS: TOKEN_COLORS
  };
})(typeof window !== 'undefined' ? window : this);