import { getPublicResourceAccess, deleteFile, setPublicResourceAccess, saveAclFor, hasResourceAcl, hasAccessibleAcl, createAclFromFallbackAcl, getResourceAcl, getSolidDataset, createSolidDataset, setThing, setUrl, addUrl, saveSolidDatasetAt, getThing, getUrlAll, createThing, setStringNoLocale, setDatetime, removeAll, getSolidDatasetWithAcl, getFileWithAcl, createContainerAt, getContainedResourceUrlAll, getThingAll, getUrl, getStringNoLocale } from '@inrupt/solid-client';
import { DCAT, RDF, DCTERMS, FOAF, VCARD, LDP } from '@inrupt/vocab-common-rdf';
import require$$0 from 'buffer';

function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c),
      u = i.value;
  } catch (n) {
    return void e(n);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
  return function () {
    var t = this,
      e = arguments;
    return new Promise(function (r, o) {
      var a = n.apply(t, e);
      function _next(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
      }
      function _throw(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
      }
      _next(void 0);
    });
  };
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var N3Parser = {};

var N3Lexer = {};

/*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */

var queueMicrotask_1;
var hasRequiredQueueMicrotask;

function requireQueueMicrotask () {
	if (hasRequiredQueueMicrotask) return queueMicrotask_1;
	hasRequiredQueueMicrotask = 1;
	var promise;
	queueMicrotask_1 = typeof queueMicrotask === 'function' ? queueMicrotask.bind(typeof window !== 'undefined' ? window : commonjsGlobal)
	// reuse resolved promise, and allocate it lazily
	: cb => (promise || (promise = Promise.resolve())).then(cb).catch(err => setTimeout(() => {
	  throw err;
	}, 0));
	return queueMicrotask_1;
}

var IRIs = {};

var hasRequiredIRIs;

function requireIRIs () {
	if (hasRequiredIRIs) return IRIs;
	hasRequiredIRIs = 1;

	Object.defineProperty(IRIs, "__esModule", {
	  value: true
	});
	IRIs.default = void 0;
	var RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
	  XSD = 'http://www.w3.org/2001/XMLSchema#',
	  SWAP = 'http://www.w3.org/2000/10/swap/';
	IRIs.default = {
	  xsd: {
	    decimal: "".concat(XSD, "decimal"),
	    boolean: "".concat(XSD, "boolean"),
	    double: "".concat(XSD, "double"),
	    integer: "".concat(XSD, "integer"),
	    string: "".concat(XSD, "string")
	  },
	  rdf: {
	    type: "".concat(RDF, "type"),
	    nil: "".concat(RDF, "nil"),
	    first: "".concat(RDF, "first"),
	    rest: "".concat(RDF, "rest"),
	    langString: "".concat(RDF, "langString")
	  },
	  owl: {
	    sameAs: 'http://www.w3.org/2002/07/owl#sameAs'
	  },
	  r: {
	    forSome: "".concat(SWAP, "reify#forSome"),
	    forAll: "".concat(SWAP, "reify#forAll")
	  },
	  log: {
	    implies: "".concat(SWAP, "log#implies")
	  }
	};
	return IRIs;
}

var hasRequiredN3Lexer;

function requireN3Lexer () {
	if (hasRequiredN3Lexer) return N3Lexer;
	hasRequiredN3Lexer = 1;

	Object.defineProperty(N3Lexer, "__esModule", {
	  value: true
	});
	N3Lexer.default = void 0;
	var _buffer = require$$0;
	var _queueMicrotask = _interopRequireDefault(requireQueueMicrotask());
	var _IRIs = _interopRequireDefault(/*@__PURE__*/ requireIRIs());
	function _interopRequireDefault(e) {
	  return e && e.__esModule ? e : {
	    default: e
	  };
	}
	// **N3Lexer** tokenizes N3 documents.

	var {
	  xsd
	} = _IRIs.default;

	// Regular expression and replacement string to escape N3 strings
	var escapeSequence = /\\u([a-fA-F0-9]{4})|\\U([a-fA-F0-9]{8})|\\([^])/g;
	var escapeReplacements = {
	  '\\': '\\',
	  "'": "'",
	  '"': '"',
	  'n': '\n',
	  'r': '\r',
	  't': '\t',
	  'f': '\f',
	  'b': '\b',
	  '_': '_',
	  '~': '~',
	  '.': '.',
	  '-': '-',
	  '!': '!',
	  '$': '$',
	  '&': '&',
	  '(': '(',
	  ')': ')',
	  '*': '*',
	  '+': '+',
	  ',': ',',
	  ';': ';',
	  '=': '=',
	  '/': '/',
	  '?': '?',
	  '#': '#',
	  '@': '@',
	  '%': '%'
	};
	var illegalIriChars = /[\x00-\x20<>\\"\{\}\|\^\`]/;
	var lineModeRegExps = {
	  _iri: true,
	  _unescapedIri: true,
	  _simpleQuotedString: true,
	  _langcode: true,
	  _blank: true,
	  _newline: true,
	  _comment: true,
	  _whitespace: true,
	  _endOfFile: true
	};
	var invalidRegExp = /$0^/;

	// ## Constructor
	let N3Lexer$1 = class N3Lexer {
	  constructor(options) {
	    // ## Regular expressions
	    // It's slightly faster to have these as properties than as in-scope variables
	    this._iri = /^<((?:[^ <>{}\\]|\\[uU])+)>[ \t]*/; // IRI with escape sequences; needs sanity check after unescaping
	    this._unescapedIri = /^<([^\x00-\x20<>\\"\{\}\|\^\`]*)>[ \t]*/; // IRI without escape sequences; no unescaping
	    this._simpleQuotedString = /^"([^"\\\r\n]*)"(?=[^"])/; // string without escape sequences
	    this._simpleApostropheString = /^'([^'\\\r\n]*)'(?=[^'])/;
	    this._langcode = /^@([a-z]+(?:-[a-z0-9]+)*)(?=[^a-z0-9\-])/i;
	    this._prefix = /^((?:[A-Za-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])(?:\.?[\-0-9A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])*)?:(?=[#\s<])/;
	    this._prefixed = /^((?:[A-Za-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])(?:\.?[\-0-9A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])*)?:((?:(?:[0-:A-Z_a-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff]|%[0-9a-fA-F]{2}|\\[!#-\/;=?\-@_~])(?:(?:[\.\-0-:A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff]|%[0-9a-fA-F]{2}|\\[!#-\/;=?\-@_~])*(?:[\-0-:A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff]|%[0-9a-fA-F]{2}|\\[!#-\/;=?\-@_~]))?)?)(?:[ \t]+|(?=\.?[,;!\^\s#()\[\]\{\}"'<>]))/;
	    this._variable = /^\?(?:(?:[A-Z_a-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])(?:[\-0-:A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])*)(?=[.,;!\^\s#()\[\]\{\}"'<>])/;
	    this._blank = /^_:((?:[0-9A-Z_a-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])(?:\.?[\-0-9A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])*)(?:[ \t]+|(?=\.?[,;:\s#()\[\]\{\}"'<>]))/;
	    this._number = /^[\-+]?(?:(\d+\.\d*|\.?\d+)[eE][\-+]?|\d*(\.)?)\d+(?=\.?[,;:\s#()\[\]\{\}"'<>])/;
	    this._boolean = /^(?:true|false)(?=[.,;\s#()\[\]\{\}"'<>])/;
	    this._keyword = /^@[a-z]+(?=[\s#<:])/i;
	    this._sparqlKeyword = /^(?:PREFIX|BASE|GRAPH)(?=[\s#<])/i;
	    this._shortPredicates = /^a(?=[\s#()\[\]\{\}"'<>])/;
	    this._newline = /^[ \t]*(?:#[^\n\r]*)?(?:\r\n|\n|\r)[ \t]*/;
	    this._comment = /#([^\n\r]*)/;
	    this._whitespace = /^[ \t]+/;
	    this._endOfFile = /^(?:#[^\n\r]*)?$/;
	    options = options || {};

	    // In line mode (N-Triples or N-Quads), only simple features may be parsed
	    if (this._lineMode = !!options.lineMode) {
	      this._n3Mode = false;
	      // Don't tokenize special literals
	      for (var key in this) {
	        if (!(key in lineModeRegExps) && this[key] instanceof RegExp) this[key] = invalidRegExp;
	      }
	    }
	    // When not in line mode, enable N3 functionality by default
	    else {
	      this._n3Mode = options.n3 !== false;
	    }
	    // Don't output comment tokens by default
	    this.comments = !!options.comments;
	    // Cache the last tested closing position of long literals
	    this._literalClosingPos = 0;
	  }

	  // ## Private methods

	  // ### `_tokenizeToEnd` tokenizes as for as possible, emitting tokens through the callback
	  _tokenizeToEnd(callback, inputFinished) {
	    // Continue parsing as far as possible; the loop will return eventually
	    var input = this._input;
	    var currentLineLength = input.length;
	    while (true) {
	      // Count and skip whitespace lines
	      var whiteSpaceMatch = void 0,
	        comment = void 0;
	      while (whiteSpaceMatch = this._newline.exec(input)) {
	        // Try to find a comment
	        if (this.comments && (comment = this._comment.exec(whiteSpaceMatch[0]))) emitToken('comment', comment[1], '', this._line, whiteSpaceMatch[0].length);
	        // Advance the input
	        input = input.substr(whiteSpaceMatch[0].length, input.length);
	        currentLineLength = input.length;
	        this._line++;
	      }
	      // Skip whitespace on current line
	      if (!whiteSpaceMatch && (whiteSpaceMatch = this._whitespace.exec(input))) input = input.substr(whiteSpaceMatch[0].length, input.length);

	      // Stop for now if we're at the end
	      if (this._endOfFile.test(input)) {
	        // If the input is finished, emit EOF
	        if (inputFinished) {
	          // Try to find a final comment
	          if (this.comments && (comment = this._comment.exec(input))) emitToken('comment', comment[1], '', this._line, input.length);
	          input = null;
	          emitToken('eof', '', '', this._line, 0);
	        }
	        return this._input = input;
	      }

	      // Look for specific token types based on the first character
	      var line = this._line,
	        firstChar = input[0];
	      var type = '',
	        value = '',
	        prefix = '',
	        match = null,
	        matchLength = 0,
	        inconclusive = false;
	      switch (firstChar) {
	        case '^':
	          // We need at least 3 tokens lookahead to distinguish ^^<IRI> and ^^pre:fixed
	          if (input.length < 3) break;
	          // Try to match a type
	          else if (input[1] === '^') {
	            this._previousMarker = '^^';
	            // Move to type IRI or prefixed name
	            input = input.substr(2);
	            if (input[0] !== '<') {
	              inconclusive = true;
	              break;
	            }
	          }
	          // If no type, it must be a path expression
	          else {
	            if (this._n3Mode) {
	              matchLength = 1;
	              type = '^';
	            }
	            break;
	          }
	        // Fall through in case the type is an IRI
	        case '<':
	          // Try to find a full IRI without escape sequences
	          if (match = this._unescapedIri.exec(input)) type = 'IRI', value = match[1];
	          // Try to find a full IRI with escape sequences
	          else if (match = this._iri.exec(input)) {
	            value = this._unescape(match[1]);
	            if (value === null || illegalIriChars.test(value)) return reportSyntaxError(this);
	            type = 'IRI';
	          }
	          // Try to find a nested triple
	          else if (input.length > 1 && input[1] === '<') type = '<<', matchLength = 2;
	          // Try to find a backwards implication arrow
	          else if (this._n3Mode && input.length > 1 && input[1] === '=') type = 'inverse', matchLength = 2, value = '>';
	          break;
	        case '>':
	          if (input.length > 1 && input[1] === '>') type = '>>', matchLength = 2;
	          break;
	        case '_':
	          // Try to find a blank node. Since it can contain (but not end with) a dot,
	          // we always need a non-dot character before deciding it is a blank node.
	          // Therefore, try inserting a space if we're at the end of the input.
	          if ((match = this._blank.exec(input)) || inputFinished && (match = this._blank.exec("".concat(input, " ")))) type = 'blank', prefix = '_', value = match[1];
	          break;
	        case '"':
	          // Try to find a literal without escape sequences
	          if (match = this._simpleQuotedString.exec(input)) value = match[1];
	          // Try to find a literal wrapped in three pairs of quotes
	          else {
	            ({
	              value,
	              matchLength
	            } = this._parseLiteral(input));
	            if (value === null) return reportSyntaxError(this);
	          }
	          if (match !== null || matchLength !== 0) {
	            type = 'literal';
	            this._literalClosingPos = 0;
	          }
	          break;
	        case "'":
	          if (!this._lineMode) {
	            // Try to find a literal without escape sequences
	            if (match = this._simpleApostropheString.exec(input)) value = match[1];
	            // Try to find a literal wrapped in three pairs of quotes
	            else {
	              ({
	                value,
	                matchLength
	              } = this._parseLiteral(input));
	              if (value === null) return reportSyntaxError(this);
	            }
	            if (match !== null || matchLength !== 0) {
	              type = 'literal';
	              this._literalClosingPos = 0;
	            }
	          }
	          break;
	        case '?':
	          // Try to find a variable
	          if (this._n3Mode && (match = this._variable.exec(input))) type = 'var', value = match[0];
	          break;
	        case '@':
	          // Try to find a language code
	          if (this._previousMarker === 'literal' && (match = this._langcode.exec(input))) type = 'langcode', value = match[1];
	          // Try to find a keyword
	          else if (match = this._keyword.exec(input)) type = match[0];
	          break;
	        case '.':
	          // Try to find a dot as punctuation
	          if (input.length === 1 ? inputFinished : input[1] < '0' || input[1] > '9') {
	            type = '.';
	            matchLength = 1;
	            break;
	          }
	        // Fall through to numerical case (could be a decimal dot)

	        case '0':
	        case '1':
	        case '2':
	        case '3':
	        case '4':
	        case '5':
	        case '6':
	        case '7':
	        case '8':
	        case '9':
	        case '+':
	        case '-':
	          // Try to find a number. Since it can contain (but not end with) a dot,
	          // we always need a non-dot character before deciding it is a number.
	          // Therefore, try inserting a space if we're at the end of the input.
	          if (match = this._number.exec(input) || inputFinished && (match = this._number.exec("".concat(input, " ")))) {
	            type = 'literal', value = match[0];
	            prefix = typeof match[1] === 'string' ? xsd.double : typeof match[2] === 'string' ? xsd.decimal : xsd.integer;
	          }
	          break;
	        case 'B':
	        case 'b':
	        case 'p':
	        case 'P':
	        case 'G':
	        case 'g':
	          // Try to find a SPARQL-style keyword
	          if (match = this._sparqlKeyword.exec(input)) type = match[0].toUpperCase();else inconclusive = true;
	          break;
	        case 'f':
	        case 't':
	          // Try to match a boolean
	          if (match = this._boolean.exec(input)) type = 'literal', value = match[0], prefix = xsd.boolean;else inconclusive = true;
	          break;
	        case 'a':
	          // Try to find an abbreviated predicate
	          if (match = this._shortPredicates.exec(input)) type = 'abbreviation', value = 'a';else inconclusive = true;
	          break;
	        case '=':
	          // Try to find an implication arrow or equals sign
	          if (this._n3Mode && input.length > 1) {
	            type = 'abbreviation';
	            if (input[1] !== '>') matchLength = 1, value = '=';else matchLength = 2, value = '>';
	          }
	          break;
	        case '!':
	          if (!this._n3Mode) break;
	        case ',':
	        case ';':
	        case '[':
	        case ']':
	        case '(':
	        case ')':
	        case '}':
	          if (!this._lineMode) {
	            matchLength = 1;
	            type = firstChar;
	          }
	          break;
	        case '{':
	          // We need at least 2 tokens lookahead to distinguish "{|" and "{ "
	          if (!this._lineMode && input.length >= 2) {
	            // Try to find a quoted triple annotation start
	            if (input[1] === '|') type = '{|', matchLength = 2;else type = firstChar, matchLength = 1;
	          }
	          break;
	        case '|':
	          // We need 2 tokens lookahead to parse "|}"
	          // Try to find a quoted triple annotation end
	          if (input.length >= 2 && input[1] === '}') type = '|}', matchLength = 2;
	          break;
	        default:
	          inconclusive = true;
	      }

	      // Some first characters do not allow an immediate decision, so inspect more
	      if (inconclusive) {
	        // Try to find a prefix
	        if ((this._previousMarker === '@prefix' || this._previousMarker === 'PREFIX') && (match = this._prefix.exec(input))) type = 'prefix', value = match[1] || '';
	        // Try to find a prefixed name. Since it can contain (but not end with) a dot,
	        // we always need a non-dot character before deciding it is a prefixed name.
	        // Therefore, try inserting a space if we're at the end of the input.
	        else if ((match = this._prefixed.exec(input)) || inputFinished && (match = this._prefixed.exec("".concat(input, " ")))) type = 'prefixed', prefix = match[1] || '', value = this._unescape(match[2]);
	      }

	      // A type token is special: it can only be emitted after an IRI or prefixed name is read
	      if (this._previousMarker === '^^') {
	        switch (type) {
	          case 'prefixed':
	            type = 'type';
	            break;
	          case 'IRI':
	            type = 'typeIRI';
	            break;
	          default:
	            type = '';
	        }
	      }

	      // What if nothing of the above was found?
	      if (!type) {
	        // We could be in streaming mode, and then we just wait for more input to arrive.
	        // Otherwise, a syntax error has occurred in the input.
	        // One exception: error on an unaccounted linebreak (= not inside a triple-quoted literal).
	        if (inputFinished || !/^'''|^"""/.test(input) && /\n|\r/.test(input)) return reportSyntaxError(this);else return this._input = input;
	      }

	      // Emit the parsed token
	      var length = matchLength || match[0].length;
	      var token = emitToken(type, value, prefix, line, length);
	      this.previousToken = token;
	      this._previousMarker = type;

	      // Advance to next part to tokenize
	      input = input.substr(length, input.length);
	    }

	    // Emits the token through the callback
	    function emitToken(type, value, prefix, line, length) {
	      var start = input ? currentLineLength - input.length : currentLineLength;
	      var end = start + length;
	      var token = {
	        type,
	        value,
	        prefix,
	        line,
	        start,
	        end
	      };
	      callback(null, token);
	      return token;
	    }
	    // Signals the syntax error through the callback
	    function reportSyntaxError(self) {
	      callback(self._syntaxError(/^\S*/.exec(input)[0]));
	    }
	  }

	  // ### `_unescape` replaces N3 escape codes by their corresponding characters
	  _unescape(item) {
	    var invalid = false;
	    var replaced = item.replace(escapeSequence, (sequence, unicode4, unicode8, escapedChar) => {
	      // 4-digit unicode character
	      if (typeof unicode4 === 'string') return String.fromCharCode(Number.parseInt(unicode4, 16));
	      // 8-digit unicode character
	      if (typeof unicode8 === 'string') {
	        var charCode = Number.parseInt(unicode8, 16);
	        return charCode <= 0xFFFF ? String.fromCharCode(Number.parseInt(unicode8, 16)) : String.fromCharCode(0xD800 + ((charCode -= 0x10000) >> 10), 0xDC00 + (charCode & 0x3FF));
	      }
	      // fixed escape sequence
	      if (escapedChar in escapeReplacements) return escapeReplacements[escapedChar];
	      // invalid escape sequence
	      invalid = true;
	      return '';
	    });
	    return invalid ? null : replaced;
	  }

	  // ### `_parseLiteral` parses a literal into an unescaped value
	  _parseLiteral(input) {
	    // Ensure we have enough lookahead to identify triple-quoted strings
	    if (input.length >= 3) {
	      // Identify the opening quote(s)
	      var opening = input.match(/^(?:"""|"|'''|'|)/)[0];
	      var openingLength = opening.length;

	      // Find the next candidate closing quotes
	      var closingPos = Math.max(this._literalClosingPos, openingLength);
	      while ((closingPos = input.indexOf(opening, closingPos)) > 0) {
	        // Count backslashes right before the closing quotes
	        var backslashCount = 0;
	        while (input[closingPos - backslashCount - 1] === '\\') backslashCount++;

	        // An even number of backslashes (in particular 0)
	        // means these are actual, non-escaped closing quotes
	        if (backslashCount % 2 === 0) {
	          // Extract and unescape the value
	          var raw = input.substring(openingLength, closingPos);
	          var lines = raw.split(/\r\n|\r|\n/).length - 1;
	          var matchLength = closingPos + openingLength;
	          // Only triple-quoted strings can be multi-line
	          if (openingLength === 1 && lines !== 0 || openingLength === 3 && this._lineMode) break;
	          this._line += lines;
	          return {
	            value: this._unescape(raw),
	            matchLength
	          };
	        }
	        closingPos++;
	      }
	      this._literalClosingPos = input.length - openingLength + 1;
	    }
	    return {
	      value: '',
	      matchLength: 0
	    };
	  }

	  // ### `_syntaxError` creates a syntax error for the given issue
	  _syntaxError(issue) {
	    this._input = null;
	    var err = new Error("Unexpected \"".concat(issue, "\" on line ").concat(this._line, "."));
	    err.context = {
	      token: undefined,
	      line: this._line,
	      previousToken: this.previousToken
	    };
	    return err;
	  }

	  // ### Strips off any starting UTF BOM mark.
	  _readStartingBom(input) {
	    return input.startsWith('\ufeff') ? input.substr(1) : input;
	  }

	  // ## Public methods

	  // ### `tokenize` starts the transformation of an N3 document into an array of tokens.
	  // The input can be a string or a stream.
	  tokenize(input, callback) {
	    this._line = 1;

	    // If the input is a string, continuously emit tokens through the callback until the end
	    if (typeof input === 'string') {
	      this._input = this._readStartingBom(input);
	      // If a callback was passed, asynchronously call it
	      if (typeof callback === 'function') (0, _queueMicrotask.default)(() => this._tokenizeToEnd(callback, true));
	      // If no callback was passed, tokenize synchronously and return
	      else {
	        var tokens = [];
	        var error;
	        this._tokenizeToEnd((e, t) => e ? error = e : tokens.push(t), true);
	        if (error) throw error;
	        return tokens;
	      }
	    }
	    // Otherwise, the input must be a stream
	    else {
	      this._pendingBuffer = null;
	      if (typeof input.setEncoding === 'function') input.setEncoding('utf8');
	      // Adds the data chunk to the buffer and parses as far as possible
	      input.on('data', data => {
	        if (this._input !== null && data.length !== 0) {
	          // Prepend any previous pending writes
	          if (this._pendingBuffer) {
	            data = _buffer.Buffer.concat([this._pendingBuffer, data]);
	            this._pendingBuffer = null;
	          }
	          // Hold if the buffer ends in an incomplete unicode sequence
	          if (data[data.length - 1] & 0x80) {
	            this._pendingBuffer = data;
	          }
	          // Otherwise, tokenize as far as possible
	          else {
	            // Only read a BOM at the start
	            if (typeof this._input === 'undefined') this._input = this._readStartingBom(typeof data === 'string' ? data : data.toString());else this._input += data;
	            this._tokenizeToEnd(callback, false);
	          }
	        }
	      });
	      // Parses until the end
	      input.on('end', () => {
	        if (typeof this._input === 'string') this._tokenizeToEnd(callback, true);
	      });
	      input.on('error', callback);
	    }
	  }
	};
	N3Lexer.default = N3Lexer$1;
	return N3Lexer;
}

var N3DataFactory = {};

var hasRequiredN3DataFactory;

function requireN3DataFactory () {
	if (hasRequiredN3DataFactory) return N3DataFactory;
	hasRequiredN3DataFactory = 1;

	Object.defineProperty(N3DataFactory, "__esModule", {
	  value: true
	});
	N3DataFactory.default = N3DataFactory.Variable = N3DataFactory.Triple = N3DataFactory.Term = N3DataFactory.Quad = N3DataFactory.NamedNode = N3DataFactory.Literal = N3DataFactory.DefaultGraph = N3DataFactory.BlankNode = void 0;
	N3DataFactory.escapeQuotes = escapeQuotes;
	N3DataFactory.fromQuad = fromQuad;
	N3DataFactory.fromTerm = fromTerm;
	N3DataFactory.termFromId = termFromId;
	N3DataFactory.termToId = termToId;
	N3DataFactory.unescapeQuotes = unescapeQuotes;
	var _IRIs = _interopRequireDefault(/*@__PURE__*/ requireIRIs());
	function _interopRequireDefault(e) {
	  return e && e.__esModule ? e : {
	    default: e
	  };
	}
	// N3.js implementations of the RDF/JS core data types
	// See http://rdf.js.org/data-model-spec/

	var {
	  rdf,
	  xsd
	} = _IRIs.default;

	// eslint-disable-next-line prefer-const
	var DEFAULTGRAPH;
	var _blankNodeCounter = 0;
	var escapedLiteral = /^"(.*".*)(?="[^"]*$)/;

	// ## DataFactory singleton
	var DataFactory = {
	  namedNode,
	  blankNode,
	  variable,
	  literal,
	  defaultGraph,
	  quad,
	  triple: quad,
	  fromTerm,
	  fromQuad
	};
	N3DataFactory.default = DataFactory; // ## Term constructor
	class Term {
	  constructor(id) {
	    this.id = id;
	  }

	  // ### The value of this term
	  get value() {
	    return this.id;
	  }

	  // ### Returns whether this object represents the same term as the other
	  equals(other) {
	    // If both terms were created by this library,
	    // equality can be computed through ids
	    if (other instanceof Term) return this.id === other.id;
	    // Otherwise, compare term type and value
	    return !!other && this.termType === other.termType && this.value === other.value;
	  }

	  // ### Implement hashCode for Immutable.js, since we implement `equals`
	  // https://immutable-js.com/docs/v4.0.0/ValueObject/#hashCode()
	  hashCode() {
	    return 0;
	  }

	  // ### Returns a plain object representation of this term
	  toJSON() {
	    return {
	      termType: this.termType,
	      value: this.value
	    };
	  }
	}

	// ## NamedNode constructor
	N3DataFactory.Term = Term;
	class NamedNode extends Term {
	  // ### The term type of this term
	  get termType() {
	    return 'NamedNode';
	  }
	}

	// ## Literal constructor
	N3DataFactory.NamedNode = NamedNode;
	class Literal extends Term {
	  // ### The term type of this term
	  get termType() {
	    return 'Literal';
	  }

	  // ### The text value of this literal
	  get value() {
	    return this.id.substring(1, this.id.lastIndexOf('"'));
	  }

	  // ### The language of this literal
	  get language() {
	    // Find the last quotation mark (e.g., '"abc"@en-us')
	    var id = this.id;
	    var atPos = id.lastIndexOf('"') + 1;
	    // If "@" it follows, return the remaining substring; empty otherwise
	    return atPos < id.length && id[atPos++] === '@' ? id.substr(atPos).toLowerCase() : '';
	  }

	  // ### The datatype IRI of this literal
	  get datatype() {
	    return new NamedNode(this.datatypeString);
	  }

	  // ### The datatype string of this literal
	  get datatypeString() {
	    // Find the last quotation mark (e.g., '"abc"^^http://ex.org/types#t')
	    var id = this.id,
	      dtPos = id.lastIndexOf('"') + 1;
	    var char = dtPos < id.length ? id[dtPos] : '';
	    // If "^" it follows, return the remaining substring
	    return char === '^' ? id.substr(dtPos + 2) :
	    // If "@" follows, return rdf:langString; xsd:string otherwise
	    char !== '@' ? xsd.string : rdf.langString;
	  }

	  // ### Returns whether this object represents the same term as the other
	  equals(other) {
	    // If both literals were created by this library,
	    // equality can be computed through ids
	    if (other instanceof Literal) return this.id === other.id;
	    // Otherwise, compare term type, value, language, and datatype
	    return !!other && !!other.datatype && this.termType === other.termType && this.value === other.value && this.language === other.language && this.datatype.value === other.datatype.value;
	  }
	  toJSON() {
	    return {
	      termType: this.termType,
	      value: this.value,
	      language: this.language,
	      datatype: {
	        termType: 'NamedNode',
	        value: this.datatypeString
	      }
	    };
	  }
	}

	// ## BlankNode constructor
	N3DataFactory.Literal = Literal;
	class BlankNode extends Term {
	  constructor(name) {
	    super("_:".concat(name));
	  }

	  // ### The term type of this term
	  get termType() {
	    return 'BlankNode';
	  }

	  // ### The name of this blank node
	  get value() {
	    return this.id.substr(2);
	  }
	}
	N3DataFactory.BlankNode = BlankNode;
	class Variable extends Term {
	  constructor(name) {
	    super("?".concat(name));
	  }

	  // ### The term type of this term
	  get termType() {
	    return 'Variable';
	  }

	  // ### The name of this variable
	  get value() {
	    return this.id.substr(1);
	  }
	}

	// ## DefaultGraph constructor
	N3DataFactory.Variable = Variable;
	class DefaultGraph extends Term {
	  constructor() {
	    super('');
	    return DEFAULTGRAPH || this;
	  }

	  // ### The term type of this term
	  get termType() {
	    return 'DefaultGraph';
	  }

	  // ### Returns whether this object represents the same term as the other
	  equals(other) {
	    // If both terms were created by this library,
	    // equality can be computed through strict equality;
	    // otherwise, compare term types.
	    return this === other || !!other && this.termType === other.termType;
	  }
	}

	// ## DefaultGraph singleton
	N3DataFactory.DefaultGraph = DefaultGraph;
	DEFAULTGRAPH = new DefaultGraph();

	// ### Constructs a term from the given internal string ID
	// The third 'nested' parameter of this function is to aid
	// with recursion over nested terms. It should not be used
	// by consumers of this library.
	// See https://github.com/rdfjs/N3.js/pull/311#discussion_r1061042725
	function termFromId(id, factory, nested) {
	  factory = factory || DataFactory;

	  // Falsy value or empty string indicate the default graph
	  if (!id) return factory.defaultGraph();

	  // Identify the term type based on the first character
	  switch (id[0]) {
	    case '?':
	      return factory.variable(id.substr(1));
	    case '_':
	      return factory.blankNode(id.substr(2));
	    case '"':
	      // Shortcut for internal literals
	      if (factory === DataFactory) return new Literal(id);
	      // Literal without datatype or language
	      if (id[id.length - 1] === '"') return factory.literal(id.substr(1, id.length - 2));
	      // Literal with datatype or language
	      var endPos = id.lastIndexOf('"', id.length - 1);
	      return factory.literal(id.substr(1, endPos - 1), id[endPos + 1] === '@' ? id.substr(endPos + 2) : factory.namedNode(id.substr(endPos + 3)));
	    case '[':
	      id = JSON.parse(id);
	      break;
	    default:
	      if (!nested || !Array.isArray(id)) {
	        return factory.namedNode(id);
	      }
	  }
	  return factory.quad(termFromId(id[0], factory, true), termFromId(id[1], factory, true), termFromId(id[2], factory, true), id[3] && termFromId(id[3], factory, true));
	}

	// ### Constructs an internal string ID from the given term or ID string
	// The third 'nested' parameter of this function is to aid
	// with recursion over nested terms. It should not be used
	// by consumers of this library.
	// See https://github.com/rdfjs/N3.js/pull/311#discussion_r1061042725
	function termToId(term, nested) {
	  if (typeof term === 'string') return term;
	  if (term instanceof Term && term.termType !== 'Quad') return term.id;
	  if (!term) return DEFAULTGRAPH.id;

	  // Term instantiated with another library
	  switch (term.termType) {
	    case 'NamedNode':
	      return term.value;
	    case 'BlankNode':
	      return "_:".concat(term.value);
	    case 'Variable':
	      return "?".concat(term.value);
	    case 'DefaultGraph':
	      return '';
	    case 'Literal':
	      return "\"".concat(term.value, "\"").concat(term.language ? "@".concat(term.language) : term.datatype && term.datatype.value !== xsd.string ? "^^".concat(term.datatype.value) : '');
	    case 'Quad':
	      var res = [termToId(term.subject, true), termToId(term.predicate, true), termToId(term.object, true)];
	      if (term.graph && term.graph.termType !== 'DefaultGraph') {
	        res.push(termToId(term.graph, true));
	      }
	      return nested ? res : JSON.stringify(res);
	    default:
	      throw new Error("Unexpected termType: ".concat(term.termType));
	  }
	}

	// ## Quad constructor
	class Quad extends Term {
	  constructor(subject, predicate, object, graph) {
	    super('');
	    this._subject = subject;
	    this._predicate = predicate;
	    this._object = object;
	    this._graph = graph || DEFAULTGRAPH;
	  }

	  // ### The term type of this term
	  get termType() {
	    return 'Quad';
	  }
	  get subject() {
	    return this._subject;
	  }
	  get predicate() {
	    return this._predicate;
	  }
	  get object() {
	    return this._object;
	  }
	  get graph() {
	    return this._graph;
	  }

	  // ### Returns a plain object representation of this quad
	  toJSON() {
	    return {
	      termType: this.termType,
	      subject: this._subject.toJSON(),
	      predicate: this._predicate.toJSON(),
	      object: this._object.toJSON(),
	      graph: this._graph.toJSON()
	    };
	  }

	  // ### Returns whether this object represents the same quad as the other
	  equals(other) {
	    return !!other && this._subject.equals(other.subject) && this._predicate.equals(other.predicate) && this._object.equals(other.object) && this._graph.equals(other.graph);
	  }
	}
	N3DataFactory.Triple = N3DataFactory.Quad = Quad;
	// ### Escapes the quotes within the given literal
	function escapeQuotes(id) {
	  return id.replace(escapedLiteral, (_, quoted) => "\"".concat(quoted.replace(/"/g, '""')));
	}

	// ### Unescapes the quotes within the given literal
	function unescapeQuotes(id) {
	  return id.replace(escapedLiteral, (_, quoted) => "\"".concat(quoted.replace(/""/g, '"')));
	}

	// ### Creates an IRI
	function namedNode(iri) {
	  return new NamedNode(iri);
	}

	// ### Creates a blank node
	function blankNode(name) {
	  return new BlankNode(name || "n3-".concat(_blankNodeCounter++));
	}

	// ### Creates a literal
	function literal(value, languageOrDataType) {
	  // Create a language-tagged string
	  if (typeof languageOrDataType === 'string') return new Literal("\"".concat(value, "\"@").concat(languageOrDataType.toLowerCase()));

	  // Automatically determine datatype for booleans and numbers
	  var datatype = languageOrDataType ? languageOrDataType.value : '';
	  if (datatype === '') {
	    // Convert a boolean
	    if (typeof value === 'boolean') datatype = xsd.boolean;
	    // Convert an integer or double
	    else if (typeof value === 'number') {
	      if (Number.isFinite(value)) datatype = Number.isInteger(value) ? xsd.integer : xsd.double;else {
	        datatype = xsd.double;
	        if (!Number.isNaN(value)) value = value > 0 ? 'INF' : '-INF';
	      }
	    }
	  }

	  // Create a datatyped literal
	  return datatype === '' || datatype === xsd.string ? new Literal("\"".concat(value, "\"")) : new Literal("\"".concat(value, "\"^^").concat(datatype));
	}

	// ### Creates a variable
	function variable(name) {
	  return new Variable(name);
	}

	// ### Returns the default graph
	function defaultGraph() {
	  return DEFAULTGRAPH;
	}

	// ### Creates a quad
	function quad(subject, predicate, object, graph) {
	  return new Quad(subject, predicate, object, graph);
	}
	function fromTerm(term) {
	  if (term instanceof Term) return term;

	  // Term instantiated with another library
	  switch (term.termType) {
	    case 'NamedNode':
	      return namedNode(term.value);
	    case 'BlankNode':
	      return blankNode(term.value);
	    case 'Variable':
	      return variable(term.value);
	    case 'DefaultGraph':
	      return DEFAULTGRAPH;
	    case 'Literal':
	      return literal(term.value, term.language || term.datatype);
	    case 'Quad':
	      return fromQuad(term);
	    default:
	      throw new Error("Unexpected termType: ".concat(term.termType));
	  }
	}
	function fromQuad(inQuad) {
	  if (inQuad instanceof Quad) return inQuad;
	  if (inQuad.termType !== 'Quad') throw new Error("Unexpected termType: ".concat(inQuad.termType));
	  return quad(fromTerm(inQuad.subject), fromTerm(inQuad.predicate), fromTerm(inQuad.object), fromTerm(inQuad.graph));
	}
	return N3DataFactory;
}

var hasRequiredN3Parser;

function requireN3Parser () {
	if (hasRequiredN3Parser) return N3Parser;
	hasRequiredN3Parser = 1;

	Object.defineProperty(N3Parser, "__esModule", {
	  value: true
	});
	N3Parser.default = void 0;
	var _N3Lexer = _interopRequireDefault(/*@__PURE__*/ requireN3Lexer());
	var _N3DataFactory = _interopRequireDefault(/*@__PURE__*/ requireN3DataFactory());
	var _IRIs = _interopRequireDefault(/*@__PURE__*/ requireIRIs());
	function _interopRequireDefault(e) {
	  return e && e.__esModule ? e : {
	    default: e
	  };
	}
	// **N3Parser** parses N3 documents.

	var blankNodePrefix = 0;

	// ## Constructor
	let N3Parser$1 = class N3Parser {
	  constructor(options) {
	    this._contextStack = [];
	    this._graph = null;

	    // Set the document IRI
	    options = options || {};
	    this._setBase(options.baseIRI);
	    options.factory && initDataFactory(this, options.factory);

	    // Set supported features depending on the format
	    var format = typeof options.format === 'string' ? options.format.match(/\w*$/)[0].toLowerCase() : '',
	      isTurtle = /turtle/.test(format),
	      isTriG = /trig/.test(format),
	      isNTriples = /triple/.test(format),
	      isNQuads = /quad/.test(format),
	      isN3 = this._n3Mode = /n3/.test(format),
	      isLineMode = isNTriples || isNQuads;
	    if (!(this._supportsNamedGraphs = !(isTurtle || isN3))) this._readPredicateOrNamedGraph = this._readPredicate;
	    // Support triples in other graphs
	    this._supportsQuads = !(isTurtle || isTriG || isNTriples || isN3);
	    // Support nesting of triples
	    this._supportsRDFStar = format === '' || /star|\*$/.test(format);
	    // Disable relative IRIs in N-Triples or N-Quads mode
	    if (isLineMode) this._resolveRelativeIRI = iri => {
	      return null;
	    };
	    this._blankNodePrefix = typeof options.blankNodePrefix !== 'string' ? '' : options.blankNodePrefix.replace(/^(?!_:)/, '_:');
	    this._lexer = options.lexer || new _N3Lexer.default({
	      lineMode: isLineMode,
	      n3: isN3
	    });
	    // Disable explicit quantifiers by default
	    this._explicitQuantifiers = !!options.explicitQuantifiers;
	  }

	  // ## Static class methods

	  // ### `_resetBlankNodePrefix` restarts blank node prefix identification
	  static _resetBlankNodePrefix() {
	    blankNodePrefix = 0;
	  }

	  // ## Private methods

	  // ### `_setBase` sets the base IRI to resolve relative IRIs
	  _setBase(baseIRI) {
	    if (!baseIRI) {
	      this._base = '';
	      this._basePath = '';
	    } else {
	      // Remove fragment if present
	      var fragmentPos = baseIRI.indexOf('#');
	      if (fragmentPos >= 0) baseIRI = baseIRI.substr(0, fragmentPos);
	      // Set base IRI and its components
	      this._base = baseIRI;
	      this._basePath = baseIRI.indexOf('/') < 0 ? baseIRI : baseIRI.replace(/[^\/?]*(?:\?.*)?$/, '');
	      baseIRI = baseIRI.match(/^(?:([a-z][a-z0-9+.-]*:))?(?:\/\/[^\/]*)?/i);
	      this._baseRoot = baseIRI[0];
	      this._baseScheme = baseIRI[1];
	    }
	  }

	  // ### `_saveContext` stores the current parsing context
	  // when entering a new scope (list, blank node, formula)
	  _saveContext(type, graph, subject, predicate, object) {
	    var n3Mode = this._n3Mode;
	    this._contextStack.push({
	      type,
	      subject,
	      predicate,
	      object,
	      graph,
	      inverse: n3Mode ? this._inversePredicate : false,
	      blankPrefix: n3Mode ? this._prefixes._ : '',
	      quantified: n3Mode ? this._quantified : null
	    });
	    // The settings below only apply to N3 streams
	    if (n3Mode) {
	      // Every new scope resets the predicate direction
	      this._inversePredicate = false;
	      // In N3, blank nodes are scoped to a formula
	      // (using a dot as separator, as a blank node label cannot start with it)
	      this._prefixes._ = this._graph ? "".concat(this._graph.value, ".") : '.';
	      // Quantifiers are scoped to a formula
	      this._quantified = Object.create(this._quantified);
	    }
	  }

	  // ### `_restoreContext` restores the parent context
	  // when leaving a scope (list, blank node, formula)
	  _restoreContext(type, token) {
	    // Obtain the previous context
	    var context = this._contextStack.pop();
	    if (!context || context.type !== type) return this._error("Unexpected ".concat(token.type), token);

	    // Restore the quad of the previous context
	    this._subject = context.subject;
	    this._predicate = context.predicate;
	    this._object = context.object;
	    this._graph = context.graph;

	    // Restore N3 context settings
	    if (this._n3Mode) {
	      this._inversePredicate = context.inverse;
	      this._prefixes._ = context.blankPrefix;
	      this._quantified = context.quantified;
	    }
	  }

	  // ### `_readInTopContext` reads a token when in the top context
	  _readInTopContext(token) {
	    switch (token.type) {
	      // If an EOF token arrives in the top context, signal that we're done
	      case 'eof':
	        if (this._graph !== null) return this._error('Unclosed graph', token);
	        delete this._prefixes._;
	        return this._callback(null, null, this._prefixes);
	      // It could be a prefix declaration
	      case 'PREFIX':
	        this._sparqlStyle = true;
	      case '@prefix':
	        return this._readPrefix;
	      // It could be a base declaration
	      case 'BASE':
	        this._sparqlStyle = true;
	      case '@base':
	        return this._readBaseIRI;
	      // It could be a graph
	      case '{':
	        if (this._supportsNamedGraphs) {
	          this._graph = '';
	          this._subject = null;
	          return this._readSubject;
	        }
	      case 'GRAPH':
	        if (this._supportsNamedGraphs) return this._readNamedGraphLabel;
	      // Otherwise, the next token must be a subject
	      default:
	        return this._readSubject(token);
	    }
	  }

	  // ### `_readEntity` reads an IRI, prefixed name, blank node, or variable
	  _readEntity(token, quantifier) {
	    var value;
	    switch (token.type) {
	      // Read a relative or absolute IRI
	      case 'IRI':
	      case 'typeIRI':
	        var iri = this._resolveIRI(token.value);
	        if (iri === null) return this._error('Invalid IRI', token);
	        value = this._factory.namedNode(iri);
	        break;
	      // Read a prefixed name
	      case 'type':
	      case 'prefixed':
	        var prefix = this._prefixes[token.prefix];
	        if (prefix === undefined) return this._error("Undefined prefix \"".concat(token.prefix, ":\""), token);
	        value = this._factory.namedNode(prefix + token.value);
	        break;
	      // Read a blank node
	      case 'blank':
	        value = this._factory.blankNode(this._prefixes[token.prefix] + token.value);
	        break;
	      // Read a variable
	      case 'var':
	        value = this._factory.variable(token.value.substr(1));
	        break;
	      // Everything else is not an entity
	      default:
	        return this._error("Expected entity but got ".concat(token.type), token);
	    }
	    // In N3 mode, replace the entity if it is quantified
	    if (!quantifier && this._n3Mode && value.id in this._quantified) value = this._quantified[value.id];
	    return value;
	  }

	  // ### `_readSubject` reads a quad's subject
	  _readSubject(token) {
	    this._predicate = null;
	    switch (token.type) {
	      case '[':
	        // Start a new quad with a new blank node as subject
	        this._saveContext('blank', this._graph, this._subject = this._factory.blankNode(), null, null);
	        return this._readBlankNodeHead;
	      case '(':
	        // Start a new list
	        this._saveContext('list', this._graph, this.RDF_NIL, null, null);
	        this._subject = null;
	        return this._readListItem;
	      case '{':
	        // Start a new formula
	        if (!this._n3Mode) return this._error('Unexpected graph', token);
	        this._saveContext('formula', this._graph, this._graph = this._factory.blankNode(), null, null);
	        return this._readSubject;
	      case '}':
	        // No subject; the graph in which we are reading is closed instead
	        return this._readPunctuation(token);
	      case '@forSome':
	        if (!this._n3Mode) return this._error('Unexpected "@forSome"', token);
	        this._subject = null;
	        this._predicate = this.N3_FORSOME;
	        this._quantifier = 'blankNode';
	        return this._readQuantifierList;
	      case '@forAll':
	        if (!this._n3Mode) return this._error('Unexpected "@forAll"', token);
	        this._subject = null;
	        this._predicate = this.N3_FORALL;
	        this._quantifier = 'variable';
	        return this._readQuantifierList;
	      case 'literal':
	        if (!this._n3Mode) return this._error('Unexpected literal', token);
	        if (token.prefix.length === 0) {
	          this._literalValue = token.value;
	          return this._completeSubjectLiteral;
	        } else this._subject = this._factory.literal(token.value, this._factory.namedNode(token.prefix));
	        break;
	      case '<<':
	        if (!this._supportsRDFStar) return this._error('Unexpected RDF-star syntax', token);
	        this._saveContext('<<', this._graph, null, null, null);
	        this._graph = null;
	        return this._readSubject;
	      default:
	        // Read the subject entity
	        if ((this._subject = this._readEntity(token)) === undefined) return;
	        // In N3 mode, the subject might be a path
	        if (this._n3Mode) return this._getPathReader(this._readPredicateOrNamedGraph);
	    }

	    // The next token must be a predicate,
	    // or, if the subject was actually a graph IRI, a named graph
	    return this._readPredicateOrNamedGraph;
	  }

	  // ### `_readPredicate` reads a quad's predicate
	  _readPredicate(token) {
	    var type = token.type;
	    switch (type) {
	      case 'inverse':
	        this._inversePredicate = true;
	      case 'abbreviation':
	        this._predicate = this.ABBREVIATIONS[token.value];
	        break;
	      case '.':
	      case ']':
	      case '}':
	        // Expected predicate didn't come, must have been trailing semicolon
	        if (this._predicate === null) return this._error("Unexpected ".concat(type), token);
	        this._subject = null;
	        return type === ']' ? this._readBlankNodeTail(token) : this._readPunctuation(token);
	      case ';':
	        // Additional semicolons can be safely ignored
	        return this._predicate !== null ? this._readPredicate : this._error('Expected predicate but got ;', token);
	      case '[':
	        if (this._n3Mode) {
	          // Start a new quad with a new blank node as subject
	          this._saveContext('blank', this._graph, this._subject, this._subject = this._factory.blankNode(), null);
	          return this._readBlankNodeHead;
	        }
	      case 'blank':
	        if (!this._n3Mode) return this._error('Disallowed blank node as predicate', token);
	      default:
	        if ((this._predicate = this._readEntity(token)) === undefined) return;
	    }
	    // The next token must be an object
	    return this._readObject;
	  }

	  // ### `_readObject` reads a quad's object
	  _readObject(token) {
	    switch (token.type) {
	      case 'literal':
	        // Regular literal, can still get a datatype or language
	        if (token.prefix.length === 0) {
	          this._literalValue = token.value;
	          return this._readDataTypeOrLang;
	        }
	        // Pre-datatyped string literal (prefix stores the datatype)
	        else this._object = this._factory.literal(token.value, this._factory.namedNode(token.prefix));
	        break;
	      case '[':
	        // Start a new quad with a new blank node as subject
	        this._saveContext('blank', this._graph, this._subject, this._predicate, this._subject = this._factory.blankNode());
	        return this._readBlankNodeHead;
	      case '(':
	        // Start a new list
	        this._saveContext('list', this._graph, this._subject, this._predicate, this.RDF_NIL);
	        this._subject = null;
	        return this._readListItem;
	      case '{':
	        // Start a new formula
	        if (!this._n3Mode) return this._error('Unexpected graph', token);
	        this._saveContext('formula', this._graph, this._subject, this._predicate, this._graph = this._factory.blankNode());
	        return this._readSubject;
	      case '<<':
	        if (!this._supportsRDFStar) return this._error('Unexpected RDF-star syntax', token);
	        this._saveContext('<<', this._graph, this._subject, this._predicate, null);
	        this._graph = null;
	        return this._readSubject;
	      default:
	        // Read the object entity
	        if ((this._object = this._readEntity(token)) === undefined) return;
	        // In N3 mode, the object might be a path
	        if (this._n3Mode) return this._getPathReader(this._getContextEndReader());
	    }
	    return this._getContextEndReader();
	  }

	  // ### `_readPredicateOrNamedGraph` reads a quad's predicate, or a named graph
	  _readPredicateOrNamedGraph(token) {
	    return token.type === '{' ? this._readGraph(token) : this._readPredicate(token);
	  }

	  // ### `_readGraph` reads a graph
	  _readGraph(token) {
	    if (token.type !== '{') return this._error("Expected graph but got ".concat(token.type), token);
	    // The "subject" we read is actually the GRAPH's label
	    this._graph = this._subject, this._subject = null;
	    return this._readSubject;
	  }

	  // ### `_readBlankNodeHead` reads the head of a blank node
	  _readBlankNodeHead(token) {
	    if (token.type === ']') {
	      this._subject = null;
	      return this._readBlankNodeTail(token);
	    } else {
	      this._predicate = null;
	      return this._readPredicate(token);
	    }
	  }

	  // ### `_readBlankNodeTail` reads the end of a blank node
	  _readBlankNodeTail(token) {
	    if (token.type !== ']') return this._readBlankNodePunctuation(token);

	    // Store blank node quad
	    if (this._subject !== null) this._emit(this._subject, this._predicate, this._object, this._graph);

	    // Restore the parent context containing this blank node
	    var empty = this._predicate === null;
	    this._restoreContext('blank', token);
	    // If the blank node was the object, restore previous context and read punctuation
	    if (this._object !== null) return this._getContextEndReader();
	    // If the blank node was the predicate, continue reading the object
	    else if (this._predicate !== null) return this._readObject;
	    // If the blank node was the subject, continue reading the predicate
	    else
	      // If the blank node was empty, it could be a named graph label
	      return empty ? this._readPredicateOrNamedGraph : this._readPredicateAfterBlank;
	  }

	  // ### `_readPredicateAfterBlank` reads a predicate after an anonymous blank node
	  _readPredicateAfterBlank(token) {
	    switch (token.type) {
	      case '.':
	      case '}':
	        // No predicate is coming if the triple is terminated here
	        this._subject = null;
	        return this._readPunctuation(token);
	      default:
	        return this._readPredicate(token);
	    }
	  }

	  // ### `_readListItem` reads items from a list
	  _readListItem(token) {
	    var item = null,
	      // The item of the list
	      list = null,
	      // The list itself
	      next = this._readListItem; // The next function to execute
	    var previousList = this._subject,
	      // The previous list that contains this list
	      stack = this._contextStack,
	      // The stack of parent contexts
	      parent = stack[stack.length - 1]; // The parent containing the current list

	    switch (token.type) {
	      case '[':
	        // Stack the current list quad and start a new quad with a blank node as subject
	        this._saveContext('blank', this._graph, list = this._factory.blankNode(), this.RDF_FIRST, this._subject = item = this._factory.blankNode());
	        next = this._readBlankNodeHead;
	        break;
	      case '(':
	        // Stack the current list quad and start a new list
	        this._saveContext('list', this._graph, list = this._factory.blankNode(), this.RDF_FIRST, this.RDF_NIL);
	        this._subject = null;
	        break;
	      case ')':
	        // Closing the list; restore the parent context
	        this._restoreContext('list', token);
	        // If this list is contained within a parent list, return the membership quad here.
	        // This will be `<parent list element> rdf:first <this list>.`.
	        if (stack.length !== 0 && stack[stack.length - 1].type === 'list') this._emit(this._subject, this._predicate, this._object, this._graph);
	        // Was this list the parent's subject?
	        if (this._predicate === null) {
	          // The next token is the predicate
	          next = this._readPredicate;
	          // No list tail if this was an empty list
	          if (this._subject === this.RDF_NIL) return next;
	        }
	        // The list was in the parent context's object
	        else {
	          next = this._getContextEndReader();
	          // No list tail if this was an empty list
	          if (this._object === this.RDF_NIL) return next;
	        }
	        // Close the list by making the head nil
	        list = this.RDF_NIL;
	        break;
	      case 'literal':
	        // Regular literal, can still get a datatype or language
	        if (token.prefix.length === 0) {
	          this._literalValue = token.value;
	          next = this._readListItemDataTypeOrLang;
	        }
	        // Pre-datatyped string literal (prefix stores the datatype)
	        else {
	          item = this._factory.literal(token.value, this._factory.namedNode(token.prefix));
	          next = this._getContextEndReader();
	        }
	        break;
	      case '{':
	        // Start a new formula
	        if (!this._n3Mode) return this._error('Unexpected graph', token);
	        this._saveContext('formula', this._graph, this._subject, this._predicate, this._graph = this._factory.blankNode());
	        return this._readSubject;
	      default:
	        if ((item = this._readEntity(token)) === undefined) return;
	    }

	    // Create a new blank node if no item head was assigned yet
	    if (list === null) this._subject = list = this._factory.blankNode();

	    // Is this the first element of the list?
	    if (previousList === null) {
	      // This list is either the subject or the object of its parent
	      if (parent.predicate === null) parent.subject = list;else parent.object = list;
	    } else {
	      // Continue the previous list with the current list
	      this._emit(previousList, this.RDF_REST, list, this._graph);
	    }
	    // If an item was read, add it to the list
	    if (item !== null) {
	      // In N3 mode, the item might be a path
	      if (this._n3Mode && (token.type === 'IRI' || token.type === 'prefixed')) {
	        // Create a new context to add the item's path
	        this._saveContext('item', this._graph, list, this.RDF_FIRST, item);
	        this._subject = item, this._predicate = null;
	        // _readPath will restore the context and output the item
	        return this._getPathReader(this._readListItem);
	      }
	      // Output the item
	      this._emit(list, this.RDF_FIRST, item, this._graph);
	    }
	    return next;
	  }

	  // ### `_readDataTypeOrLang` reads an _optional_ datatype or language
	  _readDataTypeOrLang(token) {
	    return this._completeObjectLiteral(token, false);
	  }

	  // ### `_readListItemDataTypeOrLang` reads an _optional_ datatype or language in a list
	  _readListItemDataTypeOrLang(token) {
	    return this._completeObjectLiteral(token, true);
	  }

	  // ### `_completeLiteral` completes a literal with an optional datatype or language
	  _completeLiteral(token) {
	    // Create a simple string literal by default
	    var literal = this._factory.literal(this._literalValue);
	    switch (token.type) {
	      // Create a datatyped literal
	      case 'type':
	      case 'typeIRI':
	        var datatype = this._readEntity(token);
	        if (datatype === undefined) return; // No datatype means an error occurred
	        literal = this._factory.literal(this._literalValue, datatype);
	        token = null;
	        break;
	      // Create a language-tagged string
	      case 'langcode':
	        literal = this._factory.literal(this._literalValue, token.value);
	        token = null;
	        break;
	    }
	    return {
	      token,
	      literal
	    };
	  }

	  // Completes a literal in subject position
	  _completeSubjectLiteral(token) {
	    this._subject = this._completeLiteral(token).literal;
	    return this._readPredicateOrNamedGraph;
	  }

	  // Completes a literal in object position
	  _completeObjectLiteral(token, listItem) {
	    var completed = this._completeLiteral(token);
	    if (!completed) return;
	    this._object = completed.literal;

	    // If this literal was part of a list, write the item
	    // (we could also check the context stack, but passing in a flag is faster)
	    if (listItem) this._emit(this._subject, this.RDF_FIRST, this._object, this._graph);
	    // If the token was consumed, continue with the rest of the input
	    if (completed.token === null) return this._getContextEndReader();
	    // Otherwise, consume the token now
	    else {
	      this._readCallback = this._getContextEndReader();
	      return this._readCallback(completed.token);
	    }
	  }

	  // ### `_readFormulaTail` reads the end of a formula
	  _readFormulaTail(token) {
	    if (token.type !== '}') return this._readPunctuation(token);

	    // Store the last quad of the formula
	    if (this._subject !== null) this._emit(this._subject, this._predicate, this._object, this._graph);

	    // Restore the parent context containing this formula
	    this._restoreContext('formula', token);
	    // If the formula was the subject, continue reading the predicate.
	    // If the formula was the object, read punctuation.
	    return this._object === null ? this._readPredicate : this._getContextEndReader();
	  }

	  // ### `_readPunctuation` reads punctuation between quads or quad parts
	  _readPunctuation(token) {
	    var next,
	      graph = this._graph;
	    var subject = this._subject,
	      inversePredicate = this._inversePredicate;
	    switch (token.type) {
	      // A closing brace ends a graph
	      case '}':
	        if (this._graph === null) return this._error('Unexpected graph closing', token);
	        if (this._n3Mode) return this._readFormulaTail(token);
	        this._graph = null;
	      // A dot just ends the statement, without sharing anything with the next
	      case '.':
	        this._subject = null;
	        next = this._contextStack.length ? this._readSubject : this._readInTopContext;
	        if (inversePredicate) this._inversePredicate = false;
	        break;
	      // Semicolon means the subject is shared; predicate and object are different
	      case ';':
	        next = this._readPredicate;
	        break;
	      // Comma means both the subject and predicate are shared; the object is different
	      case ',':
	        next = this._readObject;
	        break;
	      // {| means that the current triple is annotated with predicate-object pairs.
	      case '{|':
	        if (!this._supportsRDFStar) return this._error('Unexpected RDF-star syntax', token);
	        // Continue using the last triple as quoted triple subject for the predicate-object pairs.
	        var predicate = this._predicate,
	          object = this._object;
	        this._subject = this._factory.quad(subject, predicate, object, this.DEFAULTGRAPH);
	        next = this._readPredicate;
	        break;
	      // |} means that the current quoted triple in annotation syntax is finalized.
	      case '|}':
	        if (this._subject.termType !== 'Quad') return this._error('Unexpected asserted triple closing', token);
	        this._subject = null;
	        next = this._readPunctuation;
	        break;
	      default:
	        // An entity means this is a quad (only allowed if not already inside a graph)
	        if (this._supportsQuads && this._graph === null && (graph = this._readEntity(token)) !== undefined) {
	          next = this._readQuadPunctuation;
	          break;
	        }
	        return this._error("Expected punctuation to follow \"".concat(this._object.id, "\""), token);
	    }
	    // A quad has been completed now, so return it
	    if (subject !== null) {
	      var _predicate = this._predicate,
	        _object = this._object;
	      if (!inversePredicate) this._emit(subject, _predicate, _object, graph);else this._emit(_object, _predicate, subject, graph);
	    }
	    return next;
	  }

	  // ### `_readBlankNodePunctuation` reads punctuation in a blank node
	  _readBlankNodePunctuation(token) {
	    var next;
	    switch (token.type) {
	      // Semicolon means the subject is shared; predicate and object are different
	      case ';':
	        next = this._readPredicate;
	        break;
	      // Comma means both the subject and predicate are shared; the object is different
	      case ',':
	        next = this._readObject;
	        break;
	      default:
	        return this._error("Expected punctuation to follow \"".concat(this._object.id, "\""), token);
	    }
	    // A quad has been completed now, so return it
	    this._emit(this._subject, this._predicate, this._object, this._graph);
	    return next;
	  }

	  // ### `_readQuadPunctuation` reads punctuation after a quad
	  _readQuadPunctuation(token) {
	    if (token.type !== '.') return this._error('Expected dot to follow quad', token);
	    return this._readInTopContext;
	  }

	  // ### `_readPrefix` reads the prefix of a prefix declaration
	  _readPrefix(token) {
	    if (token.type !== 'prefix') return this._error('Expected prefix to follow @prefix', token);
	    this._prefix = token.value;
	    return this._readPrefixIRI;
	  }

	  // ### `_readPrefixIRI` reads the IRI of a prefix declaration
	  _readPrefixIRI(token) {
	    if (token.type !== 'IRI') return this._error("Expected IRI to follow prefix \"".concat(this._prefix, ":\""), token);
	    var prefixNode = this._readEntity(token);
	    this._prefixes[this._prefix] = prefixNode.value;
	    this._prefixCallback(this._prefix, prefixNode);
	    return this._readDeclarationPunctuation;
	  }

	  // ### `_readBaseIRI` reads the IRI of a base declaration
	  _readBaseIRI(token) {
	    var iri = token.type === 'IRI' && this._resolveIRI(token.value);
	    if (!iri) return this._error('Expected valid IRI to follow base declaration', token);
	    this._setBase(iri);
	    return this._readDeclarationPunctuation;
	  }

	  // ### `_readNamedGraphLabel` reads the label of a named graph
	  _readNamedGraphLabel(token) {
	    switch (token.type) {
	      case 'IRI':
	      case 'blank':
	      case 'prefixed':
	        return this._readSubject(token), this._readGraph;
	      case '[':
	        return this._readNamedGraphBlankLabel;
	      default:
	        return this._error('Invalid graph label', token);
	    }
	  }

	  // ### `_readNamedGraphLabel` reads a blank node label of a named graph
	  _readNamedGraphBlankLabel(token) {
	    if (token.type !== ']') return this._error('Invalid graph label', token);
	    this._subject = this._factory.blankNode();
	    return this._readGraph;
	  }

	  // ### `_readDeclarationPunctuation` reads the punctuation of a declaration
	  _readDeclarationPunctuation(token) {
	    // SPARQL-style declarations don't have punctuation
	    if (this._sparqlStyle) {
	      this._sparqlStyle = false;
	      return this._readInTopContext(token);
	    }
	    if (token.type !== '.') return this._error('Expected declaration to end with a dot', token);
	    return this._readInTopContext;
	  }

	  // Reads a list of quantified symbols from a @forSome or @forAll statement
	  _readQuantifierList(token) {
	    var entity;
	    switch (token.type) {
	      case 'IRI':
	      case 'prefixed':
	        if ((entity = this._readEntity(token, true)) !== undefined) break;
	      default:
	        return this._error("Unexpected ".concat(token.type), token);
	    }
	    // Without explicit quantifiers, map entities to a quantified entity
	    if (!this._explicitQuantifiers) this._quantified[entity.id] = this._factory[this._quantifier](this._factory.blankNode().value);
	    // With explicit quantifiers, output the reified quantifier
	    else {
	      // If this is the first item, start a new quantifier list
	      if (this._subject === null) this._emit(this._graph || this.DEFAULTGRAPH, this._predicate, this._subject = this._factory.blankNode(), this.QUANTIFIERS_GRAPH);
	      // Otherwise, continue the previous list
	      else this._emit(this._subject, this.RDF_REST, this._subject = this._factory.blankNode(), this.QUANTIFIERS_GRAPH);
	      // Output the list item
	      this._emit(this._subject, this.RDF_FIRST, entity, this.QUANTIFIERS_GRAPH);
	    }
	    return this._readQuantifierPunctuation;
	  }

	  // Reads punctuation from a @forSome or @forAll statement
	  _readQuantifierPunctuation(token) {
	    // Read more quantifiers
	    if (token.type === ',') return this._readQuantifierList;
	    // End of the quantifier list
	    else {
	      // With explicit quantifiers, close the quantifier list
	      if (this._explicitQuantifiers) {
	        this._emit(this._subject, this.RDF_REST, this.RDF_NIL, this.QUANTIFIERS_GRAPH);
	        this._subject = null;
	      }
	      // Read a dot
	      this._readCallback = this._getContextEndReader();
	      return this._readCallback(token);
	    }
	  }

	  // ### `_getPathReader` reads a potential path and then resumes with the given function
	  _getPathReader(afterPath) {
	    this._afterPath = afterPath;
	    return this._readPath;
	  }

	  // ### `_readPath` reads a potential path
	  _readPath(token) {
	    switch (token.type) {
	      // Forward path
	      case '!':
	        return this._readForwardPath;
	      // Backward path
	      case '^':
	        return this._readBackwardPath;
	      // Not a path; resume reading where we left off
	      default:
	        var stack = this._contextStack,
	          parent = stack.length && stack[stack.length - 1];
	        // If we were reading a list item, we still need to output it
	        if (parent && parent.type === 'item') {
	          // The list item is the remaining subejct after reading the path
	          var item = this._subject;
	          // Switch back to the context of the list
	          this._restoreContext('item', token);
	          // Output the list item
	          this._emit(this._subject, this.RDF_FIRST, item, this._graph);
	        }
	        return this._afterPath(token);
	    }
	  }

	  // ### `_readForwardPath` reads a '!' path
	  _readForwardPath(token) {
	    var subject, predicate;
	    var object = this._factory.blankNode();
	    // The next token is the predicate
	    if ((predicate = this._readEntity(token)) === undefined) return;
	    // If we were reading a subject, replace the subject by the path's object
	    if (this._predicate === null) subject = this._subject, this._subject = object;
	    // If we were reading an object, replace the subject by the path's object
	    else subject = this._object, this._object = object;
	    // Emit the path's current quad and read its next section
	    this._emit(subject, predicate, object, this._graph);
	    return this._readPath;
	  }

	  // ### `_readBackwardPath` reads a '^' path
	  _readBackwardPath(token) {
	    var subject = this._factory.blankNode();
	    var predicate, object;
	    // The next token is the predicate
	    if ((predicate = this._readEntity(token)) === undefined) return;
	    // If we were reading a subject, replace the subject by the path's subject
	    if (this._predicate === null) object = this._subject, this._subject = subject;
	    // If we were reading an object, replace the subject by the path's subject
	    else object = this._object, this._object = subject;
	    // Emit the path's current quad and read its next section
	    this._emit(subject, predicate, object, this._graph);
	    return this._readPath;
	  }

	  // ### `_readRDFStarTailOrGraph` reads the graph of a nested RDF-star quad or the end of a nested RDF-star triple
	  _readRDFStarTailOrGraph(token) {
	    if (token.type !== '>>') {
	      // An entity means this is a quad (only allowed if not already inside a graph)
	      if (this._supportsQuads && this._graph === null && (this._graph = this._readEntity(token)) !== undefined) return this._readRDFStarTail;
	      return this._error("Expected >> to follow \"".concat(this._object.id, "\""), token);
	    }
	    return this._readRDFStarTail(token);
	  }

	  // ### `_readRDFStarTail` reads the end of a nested RDF-star triple
	  _readRDFStarTail(token) {
	    if (token.type !== '>>') return this._error("Expected >> but got ".concat(token.type), token);
	    // Read the quad and restore the previous context
	    var quad = this._factory.quad(this._subject, this._predicate, this._object, this._graph || this.DEFAULTGRAPH);
	    this._restoreContext('<<', token);
	    // If the triple was the subject, continue by reading the predicate.
	    if (this._subject === null) {
	      this._subject = quad;
	      return this._readPredicate;
	    }
	    // If the triple was the object, read context end.
	    else {
	      this._object = quad;
	      return this._getContextEndReader();
	    }
	  }

	  // ### `_getContextEndReader` gets the next reader function at the end of a context
	  _getContextEndReader() {
	    var contextStack = this._contextStack;
	    if (!contextStack.length) return this._readPunctuation;
	    switch (contextStack[contextStack.length - 1].type) {
	      case 'blank':
	        return this._readBlankNodeTail;
	      case 'list':
	        return this._readListItem;
	      case 'formula':
	        return this._readFormulaTail;
	      case '<<':
	        return this._readRDFStarTailOrGraph;
	    }
	  }

	  // ### `_emit` sends a quad through the callback
	  _emit(subject, predicate, object, graph) {
	    this._callback(null, this._factory.quad(subject, predicate, object, graph || this.DEFAULTGRAPH));
	  }

	  // ### `_error` emits an error message through the callback
	  _error(message, token) {
	    var err = new Error("".concat(message, " on line ").concat(token.line, "."));
	    err.context = {
	      token: token,
	      line: token.line,
	      previousToken: this._lexer.previousToken
	    };
	    this._callback(err);
	    this._callback = noop;
	  }

	  // ### `_resolveIRI` resolves an IRI against the base path
	  _resolveIRI(iri) {
	    return /^[a-z][a-z0-9+.-]*:/i.test(iri) ? iri : this._resolveRelativeIRI(iri);
	  }

	  // ### `_resolveRelativeIRI` resolves an IRI against the base path,
	  // assuming that a base path has been set and that the IRI is indeed relative
	  _resolveRelativeIRI(iri) {
	    // An empty relative IRI indicates the base IRI
	    if (!iri.length) return this._base;
	    // Decide resolving strategy based in the first character
	    switch (iri[0]) {
	      // Resolve relative fragment IRIs against the base IRI
	      case '#':
	        return this._base + iri;
	      // Resolve relative query string IRIs by replacing the query string
	      case '?':
	        return this._base.replace(/(?:\?.*)?$/, iri);
	      // Resolve root-relative IRIs at the root of the base IRI
	      case '/':
	        // Resolve scheme-relative IRIs to the scheme
	        return (iri[1] === '/' ? this._baseScheme : this._baseRoot) + this._removeDotSegments(iri);
	      // Resolve all other IRIs at the base IRI's path
	      default:
	        // Relative IRIs cannot contain a colon in the first path segment
	        return /^[^/:]*:/.test(iri) ? null : this._removeDotSegments(this._basePath + iri);
	    }
	  }

	  // ### `_removeDotSegments` resolves './' and '../' path segments in an IRI as per RFC3986
	  _removeDotSegments(iri) {
	    // Don't modify the IRI if it does not contain any dot segments
	    if (!/(^|\/)\.\.?($|[/#?])/.test(iri)) return iri;

	    // Start with an imaginary slash before the IRI in order to resolve trailing './' and '../'
	    var length = iri.length;
	    var result = '',
	      i = -1,
	      pathStart = -1,
	      segmentStart = 0,
	      next = '/';
	    while (i < length) {
	      switch (next) {
	        // The path starts with the first slash after the authority
	        case ':':
	          if (pathStart < 0) {
	            // Skip two slashes before the authority
	            if (iri[++i] === '/' && iri[++i] === '/')
	              // Skip to slash after the authority
	              while ((pathStart = i + 1) < length && iri[pathStart] !== '/') i = pathStart;
	          }
	          break;
	        // Don't modify a query string or fragment
	        case '?':
	        case '#':
	          i = length;
	          break;
	        // Handle '/.' or '/..' path segments
	        case '/':
	          if (iri[i + 1] === '.') {
	            next = iri[++i + 1];
	            switch (next) {
	              // Remove a '/.' segment
	              case '/':
	                result += iri.substring(segmentStart, i - 1);
	                segmentStart = i + 1;
	                break;
	              // Remove a trailing '/.' segment
	              case undefined:
	              case '?':
	              case '#':
	                return result + iri.substring(segmentStart, i) + iri.substr(i + 1);
	              // Remove a '/..' segment
	              case '.':
	                next = iri[++i + 1];
	                if (next === undefined || next === '/' || next === '?' || next === '#') {
	                  result += iri.substring(segmentStart, i - 2);
	                  // Try to remove the parent path from result
	                  if ((segmentStart = result.lastIndexOf('/')) >= pathStart) result = result.substr(0, segmentStart);
	                  // Remove a trailing '/..' segment
	                  if (next !== '/') return "".concat(result, "/").concat(iri.substr(i + 1));
	                  segmentStart = i + 1;
	                }
	            }
	          }
	      }
	      next = iri[++i];
	    }
	    return result + iri.substring(segmentStart);
	  }

	  // ## Public methods

	  // ### `parse` parses the N3 input and emits each parsed quad through the onQuad callback.
	  parse(input, quadCallback, prefixCallback) {
	    // The second parameter accepts an object { onQuad: ..., onPrefix: ..., onComment: ...}
	    // As a second and third parameter it still accepts a separate quadCallback and prefixCallback for backward compatibility as well
	    var onQuad, onPrefix, onComment;
	    if (quadCallback && (quadCallback.onQuad || quadCallback.onPrefix || quadCallback.onComment)) {
	      onQuad = quadCallback.onQuad;
	      onPrefix = quadCallback.onPrefix;
	      onComment = quadCallback.onComment;
	    } else {
	      onQuad = quadCallback;
	      onPrefix = prefixCallback;
	    }
	    // The read callback is the next function to be executed when a token arrives.
	    // We start reading in the top context.
	    this._readCallback = this._readInTopContext;
	    this._sparqlStyle = false;
	    this._prefixes = Object.create(null);
	    this._prefixes._ = this._blankNodePrefix ? this._blankNodePrefix.substr(2) : "b".concat(blankNodePrefix++, "_");
	    this._prefixCallback = onPrefix || noop;
	    this._inversePredicate = false;
	    this._quantified = Object.create(null);

	    // Parse synchronously if no quad callback is given
	    if (!onQuad) {
	      var quads = [];
	      var error;
	      this._callback = (e, t) => {
	        e ? error = e : t && quads.push(t);
	      };
	      this._lexer.tokenize(input).every(token => {
	        return this._readCallback = this._readCallback(token);
	      });
	      if (error) throw error;
	      return quads;
	    }
	    var processNextToken = (error, token) => {
	      if (error !== null) this._callback(error), this._callback = noop;else if (this._readCallback) this._readCallback = this._readCallback(token);
	    };

	    // Enable checking for comments on every token when a commentCallback has been set
	    if (onComment) {
	      // Enable the lexer to return comments as tokens first (disabled by default)
	      this._lexer.comments = true;
	      // Patch the processNextToken function
	      processNextToken = (error, token) => {
	        if (error !== null) this._callback(error), this._callback = noop;else if (this._readCallback) {
	          if (token.type === 'comment') onComment(token.value);else this._readCallback = this._readCallback(token);
	        }
	      };
	    }

	    // Parse asynchronously otherwise, executing the read callback when a token arrives
	    this._callback = onQuad;
	    this._lexer.tokenize(input, processNextToken);
	  }
	};

	// The empty function
	N3Parser.default = N3Parser$1;
	function noop() {}

	// Initializes the parser with the given data factory
	function initDataFactory(parser, factory) {
	  parser._factory = factory;
	  parser.DEFAULTGRAPH = factory.defaultGraph();

	  // Set common named nodes
	  parser.RDF_FIRST = factory.namedNode(_IRIs.default.rdf.first);
	  parser.RDF_REST = factory.namedNode(_IRIs.default.rdf.rest);
	  parser.RDF_NIL = factory.namedNode(_IRIs.default.rdf.nil);
	  parser.N3_FORALL = factory.namedNode(_IRIs.default.r.forAll);
	  parser.N3_FORSOME = factory.namedNode(_IRIs.default.r.forSome);
	  parser.ABBREVIATIONS = {
	    'a': factory.namedNode(_IRIs.default.rdf.type),
	    '=': factory.namedNode(_IRIs.default.owl.sameAs),
	    '>': factory.namedNode(_IRIs.default.log.implies)
	  };
	  parser.QUANTIFIERS_GRAPH = factory.namedNode('urn:n3:quantifiers');
	}
	initDataFactory(N3Parser$1.prototype, _N3DataFactory.default);
	return N3Parser;
}

var N3ParserExports = /*@__PURE__*/ requireN3Parser();
var Parser = /*@__PURE__*/getDefaultExportFromCjs(N3ParserExports);

var isNotFound$1 = error => {
  var _error$response, _error$response2;
  return (error === null || error === void 0 ? void 0 : error.statusCode) === 404 || (error === null || error === void 0 ? void 0 : error.status) === 404 || (error === null || error === void 0 || (_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.status) === 404 || (error === null || error === void 0 || (_error$response2 = error.response) === null || _error$response2 === void 0 ? void 0 : _error$response2.statusCode) === 404;
};
var deleteCatalogDatasetDocuments = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* (_ref) {
    var {
      datasetDocUrl,
      recordDocUrl = "",
      fetch,
      deleteResource
    } = _ref;
    var targets = [{
      label: "dataset document",
      url: datasetDocUrl
    }, ...(recordDocUrl ? [{
      label: "catalog record",
      url: recordDocUrl
    }] : [])];
    var failures = [];
    for (var target of targets) {
      try {
        yield deleteResource(target.url, {
          fetch
        });
      } catch (error) {
        // A previous partial reset may already have removed this resource. Treating
        // 404 as success makes the operation safe to retry without hiding real
        // authorization, availability, or server failures.
        if (!isNotFound$1(error)) failures.push(_objectSpread2(_objectSpread2({}, target), {}, {
          error
        }));
      }
    }
    if (failures.length) {
      var detail = failures.map(_ref3 => {
        var {
          label,
          url
        } = _ref3;
        return "".concat(label, " (").concat(url, ")");
      }).join(", ");
      var error = new AggregateError(failures.map(failure => failure.error), "Catalog dataset deletion incomplete: ".concat(detail, "."));
      error.failures = failures.map(_ref4 => {
        var _cause$response, _cause$response2;
        var {
          label,
          url,
          error: cause
        } = _ref4;
        return {
          label,
          url,
          status: (cause === null || cause === void 0 ? void 0 : cause.statusCode) || (cause === null || cause === void 0 ? void 0 : cause.status) || (cause === null || cause === void 0 || (_cause$response = cause.response) === null || _cause$response === void 0 ? void 0 : _cause$response.status) || (cause === null || cause === void 0 || (_cause$response2 = cause.response) === null || _cause$response2 === void 0 ? void 0 : _cause$response2.statusCode) || null
        };
      });
      throw error;
    }
  });
  return function deleteCatalogDatasetDocuments(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var CATALOG_CONTAINER = "catalog/";
var DATASET_CONTAINER = "catalog/ds/";
var SERIES_CONTAINER = "catalog/series/";
var RECORDS_CONTAINER = "catalog/records/";
var CATALOG_DOC = "catalog/cat.ttl";
var CACHE_KEY = "sdm.catalog.cache.v1";
var safeNow = () => new Date().toISOString();
var SDP_NS = "https://w3id.org/solid-dcat-profile#";
var SDP_CATALOG = "".concat(SDP_NS, "catalog");
var SDM_NS = "https://w3id.org/solid-dataspace-manager#";
var SDM_REGISTRY_MODE = "".concat(SDM_NS, "registryMode");
var SDM_REGISTRY = "".concat(SDM_NS, "registry");
var SDM_PRIVATE_REGISTRY = "".concat(SDM_NS, "privateRegistry");
var SDM_CHANGELOG = "".concat(SDM_NS, "changeLog");
var SDM_CHANGE_EVENT = "".concat(SDM_NS, "ChangeEvent");
var LEGACY_DCAT_CONFORMS_TO = "http://www.w3.org/ns/dcat#conformsTo";
var VCARD_HAS_URL = VCARD.hasURL || "http://www.w3.org/2006/vcard/ns#hasURL";
VCARD.url || "http://www.w3.org/2006/vcard/ns#url";
var isNotFound = err => {
  var _err$response, _err$response2;
  return (err === null || err === void 0 ? void 0 : err.statusCode) === 404 || (err === null || err === void 0 ? void 0 : err.status) === 404 || (err === null || err === void 0 || (_err$response = err.response) === null || _err$response === void 0 ? void 0 : _err$response.status) === 404 || (err === null || err === void 0 || (_err$response2 = err.response) === null || _err$response2 === void 0 ? void 0 : _err$response2.statusCode) === 404;
};
var toCatalogDatasetRef = (catalogDocUrl, datasetUrl) => {
  if (!catalogDocUrl || !datasetUrl) return datasetUrl;
  try {
    var catalog = new URL(catalogDocUrl);
    var dataset = new URL(datasetUrl, catalogDocUrl);
    if (catalog.origin !== dataset.origin) return datasetUrl;
    var catalogDir = catalog.pathname.replace(/[^/]+$/, "");
    if (!dataset.pathname.startsWith(catalogDir)) return datasetUrl;
    var relPath = dataset.pathname.slice(catalogDir.length);
    return "".concat(relPath).concat(dataset.hash || "");
  } catch (_unused2) {
    return datasetUrl;
  }
};
var buildCatalogTurtle = _ref => {
  var {
    title,
    description,
    modified,
    datasetRefs,
    recordRefs,
    contactPoint
  } = _ref;
  var lines = ["@prefix dcat: <http://www.w3.org/ns/dcat#>.", "@prefix dcterms: <http://purl.org/dc/terms/>.", "@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.", "", "<#it> a dcat:Catalog ;", "  dcterms:title \"".concat((title || "Solid Dataspace Catalog").replace(/\"/g, '\\"'), "\" ;")];
  if (description) {
    lines.push("  dcterms:description \"".concat(description.replace(/\"/g, '\\"'), "\" ;"));
  }
  var modifiedValue = modified || safeNow();
  lines.push("  dcterms:modified \"".concat(modifiedValue, "\"^^xsd:dateTime ;"));
  if (contactPoint) {
    lines.push("  dcat:contactPoint <".concat(contactPoint, "> ;"));
  }
  if (datasetRefs && datasetRefs.length) {
    lines.push("  dcat:dataset");
    lines.push("    ".concat(datasetRefs.map(ref => "<".concat(ref, ">")).join(" ,\n    "), " ."));
  } else if (recordRefs && recordRefs.length) {
    lines.push("  .");
  } else {
    lines.push("  .");
  }
  if (recordRefs && recordRefs.length) {
    lines.push("");
    lines.push("<#it> dcat:record");
    lines.push("    ".concat(recordRefs.map(ref => "<".concat(ref, ">")).join(" ,\n    "), " ."));
  }
  return lines.join("\n");
};
var CATALOG_CAS_MAX_ATTEMPTS = 4;
var CATALOG_CONFLICT_STATUSES = new Set([409, 412]);
var responseHeader = (response, name) => response !== null && response !== void 0 && response.headers && typeof response.headers.get === "function" ? response.headers.get(name) : null;
var isStrongEtag = value => typeof value === "string" && /^"[\x21\x23-\x7e\x80-\xff]*"$/.test(value.trim());
var assertExactCatalogResponse = (response, catalogDocUrl, operation) => {
  var actualUrl = response === null || response === void 0 ? void 0 : response.url;
  var expected;
  var actual;
  try {
    expected = new URL(catalogDocUrl).href;
    actual = actualUrl ? new URL(actualUrl).href : "";
  } catch (_unused3) {
    throw new Error("Catalog ".concat(operation, " did not use a valid exact resource URL."));
  }
  if (response !== null && response !== void 0 && response.redirected || actual !== expected) {
    throw new Error("Catalog ".concat(operation, " did not use the exact resource URL."));
  }
};
var parseCatalogSnapshot = (turtle, catalogDocUrl) => {
  var quads;
  try {
    quads = new Parser({
      baseIRI: catalogDocUrl
    }).parse(turtle);
  } catch (error) {
    throw new Error("Catalog document contains invalid Turtle.", {
      cause: error
    });
  }
  var catalogResourceUrl = "".concat(catalogDocUrl, "#it");
  var values = predicate => quads.filter(quad => quad.subject.value === catalogResourceUrl && quad.predicate.value === predicate).map(quad => quad.object.value);
  var types = values(RDF.type);
  if (!types.includes(DCAT.Catalog)) {
    throw new Error("Catalog document does not contain the expected dcat:Catalog resource.");
  }
  return {
    title: values(DCTERMS.title)[0] || "Solid Dataspace Catalog",
    description: values(DCTERMS.description)[0] || "",
    contactPoint: values(DCAT.contactPoint)[0] || "",
    datasetRefs: Array.from(new Set(values(DCAT.dataset).map(url => toCatalogDatasetRef(catalogDocUrl, url)))),
    recordRefs: Array.from(new Set(values(DCAT.record).map(url => toCatalogDatasetRef(catalogDocUrl, url))))
  };
};
var readCatalogSnapshot = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* (fetch, catalogDocUrl) {
    var response = yield fetch(catalogDocUrl, {
      method: "GET",
      headers: {
        Accept: "text/turtle",
        "Cache-Control": "no-store"
      },
      cache: "no-store",
      redirect: "error"
    });
    assertExactCatalogResponse(response, catalogDocUrl, "read");
    if (response.status === 404) {
      return {
        exists: false,
        etag: "",
        title: "Solid Dataspace Catalog",
        description: "",
        contactPoint: "",
        datasetRefs: [],
        recordRefs: []
      };
    }
    if (!response.ok) {
      throw new Error("Failed to read catalog document (".concat(response.status, ")."));
    }
    var etag = (responseHeader(response, "ETag") || "").trim();
    if (!isStrongEtag(etag)) {
      throw new Error("Catalog document is missing a strong ETag.");
    }
    var turtle = yield response.text();
    return _objectSpread2({
      exists: true,
      etag
    }, parseCatalogSnapshot(turtle, catalogDocUrl));
  });
  return function readCatalogSnapshot(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();
var mutateCatalogDocument = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(function* (session, catalogDocUrl, mutateDatasetRefs) {
    var metadata = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    if (!session || typeof session.fetch !== "function") {
      throw new Error("An authenticated Solid session is required.");
    }
    for (var attempt = 0; attempt < CATALOG_CAS_MAX_ATTEMPTS; attempt += 1) {
      var snapshot = yield readCatalogSnapshot(session.fetch, catalogDocUrl);
      var currentRefs = new Set(snapshot.datasetRefs);
      var updatedRefs = mutateDatasetRefs ? mutateDatasetRefs(currentRefs, snapshot) : currentRefs;
      var datasetRefs = Array.from(updatedRefs || currentRefs);
      var turtle = buildCatalogTurtle({
        title: metadata.title !== undefined ? metadata.title || "Solid Dataspace Catalog" : snapshot.title,
        description: metadata.description !== undefined ? metadata.description || "" : snapshot.description,
        modified: safeNow(),
        datasetRefs,
        recordRefs: snapshot.recordRefs,
        contactPoint: metadata.contactPoint !== undefined ? metadata.contactPoint || "" : snapshot.contactPoint
      });
      var response = yield session.fetch(catalogDocUrl, {
        method: "PUT",
        headers: _objectSpread2({
          "Content-Type": "text/turtle"
        }, snapshot.exists ? {
          "If-Match": snapshot.etag
        } : {
          "If-None-Match": "*"
        }),
        body: turtle,
        redirect: "error"
      });
      assertExactCatalogResponse(response, catalogDocUrl, "write");
      if (response.ok) {
        return {
          datasetRefs,
          created: !snapshot.exists
        };
      }
      if (!CATALOG_CONFLICT_STATUSES.has(response.status)) {
        throw new Error("Failed to write catalog document (".concat(response.status, ")."));
      }
    }
    var conflict = new Error("Catalog document changed during all ".concat(CATALOG_CAS_MAX_ATTEMPTS, " write attempts."));
    conflict.status = 412;
    throw conflict;
  });
  return function mutateCatalogDocument(_x3, _x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();
var ensureCatalogDocument = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(function* (session, catalogDocUrl) {
    var {
      title,
      description,
      contactPoint
    } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return mutateCatalogDocument(session, catalogDocUrl, datasetRefs => datasetRefs, {
      title: title || "Solid Dataspace Catalog",
      description: description || "",
      contactPoint: contactPoint || ""
    });
  });
  return function ensureCatalogDocument(_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();
var getPodRoot = webId => {
  if (!webId) return "";
  var url = new URL(webId);
  var segments = url.pathname.split("/").filter(Boolean);
  var profileIndex = segments.indexOf("profile");
  var baseSegments = profileIndex > -1 ? segments.slice(0, profileIndex) : segments;
  var basePath = baseSegments.length ? "/".concat(baseSegments.join("/"), "/") : "/";
  return "".concat(url.origin).concat(basePath);
};
var buildDefaultPrivateRegistry = webId => {
  if (!webId) return "";
  return "".concat(getPodRoot(webId), "registry/");
};
var normalizeContainerUrl = value => {
  if (!value) return "";
  try {
    var url = new URL(value);
    return url.href.endsWith("/") ? url.href : "".concat(url.href, "/");
  } catch (_unused4) {
    return value.endsWith("/") ? value : "".concat(value, "/");
  }
};
var getDocumentUrl = resourceUrl => resourceUrl.split("#")[0];
var setLocaleString = (thing, predicate, value) => {
  if (!value) return thing;
  return setStringNoLocale(thing, predicate, value);
};
var getCatalogDocUrl = webId => "".concat(getPodRoot(webId)).concat(CATALOG_DOC);
var getCatalogResourceUrl = webId => "".concat(getCatalogDocUrl(webId), "#it");
var DISTRIBUTION_ACCESS_TYPES = {
  download: "download",
  access: "access"
};
var normalizeDistributionAccessType = value => value === DISTRIBUTION_ACCESS_TYPES.access ? DISTRIBUTION_ACCESS_TYPES.access : DISTRIBUTION_ACCESS_TYPES.download;
var validateDatasetInput = input => {
  if (!(input !== null && input !== void 0 && input.access_url_dataset)) {
    throw new Error("Dataset distribution URL is required (dcat:downloadURL or dcat:accessURL).");
  }
  if (normalizeDistributionAccessType(input === null || input === void 0 ? void 0 : input.distribution_access_type) === DISTRIBUTION_ACCESS_TYPES.access && !(input !== null && input !== void 0 && input.is_public)) {
    throw new Error("Public external links are supported only for public datasets.");
  }
};
var clearCache = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CACHE_KEY);
};
var ensureContainer = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(function* (containerUrl, fetch) {
    try {
      var res = yield fetch(containerUrl, {
        method: "GET",
        headers: {
          Accept: "text/turtle"
        }
      });
      if (res.ok) return;
      if (res.status !== 404) return;
    } catch (_unused6) {
      // Continue and attempt creation.
    }
    try {
      yield createContainerAt(containerUrl, {
        fetch
      });
    } catch (err) {
      var _err$response3;
      var status = (err === null || err === void 0 ? void 0 : err.statusCode) || (err === null || err === void 0 || (_err$response3 = err.response) === null || _err$response3 === void 0 ? void 0 : _err$response3.status);
      if (status === 409 || status === 412) {
        return;
      }
      throw err;
    }
  });
  return function ensureContainer(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();
var getResourceWithAcl = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(function* (url, fetch) {
    try {
      return yield getSolidDatasetWithAcl(url, {
        fetch
      });
    } catch (datasetErr) {
      try {
        return yield getFileWithAcl(url, {
          fetch
        });
      } catch (fileErr) {
        throw isNotFound(datasetErr) ? datasetErr : fileErr;
      }
    }
  });
  return function getResourceWithAcl(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();
var getResourceAndAcl = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(function* (url, fetch) {
    var resource = yield getResourceWithAcl(url, fetch);
    var resourceAcl;
    if (!hasResourceAcl(resource)) {
      if (!hasAccessibleAcl(resource)) {
        throw new Error("No access to ACL.");
      }
      resourceAcl = createAclFromFallbackAcl(resource);
    } else {
      resourceAcl = getResourceAcl(resource);
    }
    return {
      resource,
      resourceAcl
    };
  });
  return function getResourceAndAcl(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();
var setPublicReadAccess = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(function* (url, fetch, read) {
    var {
      resource,
      resourceAcl
    } = yield getResourceAndAcl(url, fetch);
    var updatedAcl = setPublicResourceAccess(resourceAcl, {
      read,
      append: false,
      write: false,
      control: false
    });
    yield saveAclFor(resource, updatedAcl, {
      fetch
    });
  });
  return function setPublicReadAccess(_x17, _x18, _x19) {
    return _ref9.apply(this, arguments);
  };
}();
var makePublicReadable = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator(function* (url, fetch) {
    try {
      yield setPublicReadAccess(url, fetch, true);
    } catch (err) {
      console.warn("Failed to set public read ACL for", url, err);
    }
  });
  return function makePublicReadable(_x20, _x21) {
    return _ref10.apply(this, arguments);
  };
}();
var setCatalogLinkInProfile = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator(function* (webId, catalogUrl, fetch) {
    if (!webId || !catalogUrl) return;
    var profileDocUrl = webId.split("#")[0];
    var profileDataset = yield getSolidDataset(profileDocUrl, {
      fetch
    });
    var profileThing = getThing(profileDataset, webId);
    if (!profileThing) {
      profileThing = createThing({
        url: webId
      });
    }
    profileThing = removeAll(profileThing, SDP_CATALOG);
    profileThing = removeAll(profileThing, DCAT.catalog);
    profileThing = setUrl(profileThing, SDP_CATALOG, catalogUrl);
    var updatedProfile = setThing(profileDataset, profileThing);
    yield saveSolidDatasetAt(profileDocUrl, updatedProfile, {
      fetch
    });
  });
  return function setCatalogLinkInProfile(_x22, _x23, _x24) {
    return _ref11.apply(this, arguments);
  };
}();
var loadRegistryConfig = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator(function* (webId, fetch) {
    if (!webId || !fetch) {
      return {
        mode: "research",
        registries: [],
        privateRegistry: ""
      };
    }
    var profileDocUrl = webId.split("#")[0];
    try {
      var profileDataset = yield getSolidDataset(profileDocUrl, {
        fetch
      });
      var profileThing = getThing(profileDataset, webId);
      var mode = (getStringNoLocale(profileThing, SDM_REGISTRY_MODE) || "research").toLowerCase();
      var registries = (getUrlAll(profileThing, SDM_REGISTRY) || []).filter(Boolean).map(url => url.replace(/\/+$/, ""));
      var privateRegistry = getUrl(profileThing, SDM_PRIVATE_REGISTRY) || buildDefaultPrivateRegistry(webId);
      return {
        mode: mode === "private" ? "private" : "research",
        registries,
        privateRegistry
      };
    } catch (err) {
      console.warn("Failed to load registry config from profile:", err);
      return {
        mode: "research",
        registries: [],
        privateRegistry: buildDefaultPrivateRegistry(webId)
      };
    }
  });
  return function loadRegistryConfig(_x25, _x26) {
    return _ref12.apply(this, arguments);
  };
}();
var ensureRegistryContainer = /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator(function* (containerUrl, fetch) {
    yield ensureContainer(containerUrl, fetch);
    yield makePublicReadable(containerUrl, fetch);
  });
  return function ensureRegistryContainer(_x30, _x31) {
    return _ref14.apply(this, arguments);
  };
}();
var resolveRegistryConfig = /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator(function* (webId, fetch, override) {
    var base = override || (yield loadRegistryConfig(webId, fetch));
    var mode = (base === null || base === void 0 ? void 0 : base.mode) === "private" ? "private" : "research";
    var registries = ((base === null || base === void 0 ? void 0 : base.registries) || []).filter(Boolean);
    var privateRegistry = (base === null || base === void 0 ? void 0 : base.privateRegistry) || buildDefaultPrivateRegistry(webId);
    return {
      mode,
      registries,
      privateRegistry
    };
  });
  return function resolveRegistryConfig(_x35, _x36, _x37) {
    return _ref16.apply(this, arguments);
  };
}();
var registerWebIdInRegistryContainer = /*#__PURE__*/function () {
  var _ref17 = _asyncToGenerator(function* (containerUrl, fetch, memberWebId) {
    var {
      allowCreate
    } = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var normalizedUrl = normalizeContainerUrl(containerUrl);
    if (!normalizedUrl || !memberWebId) return;
    if (allowCreate) {
      yield ensureRegistryContainer(normalizedUrl, fetch);
    }
    var containerDataset = yield getSolidDataset(normalizedUrl, {
      fetch
    });
    var resources = getContainedResourceUrlAll(containerDataset);
    for (var resourceUrl of resources) {
      try {
        var memberDataset = yield getSolidDataset(resourceUrl, {
          fetch
        });
        var memberThing = getThing(memberDataset, "".concat(resourceUrl, "#it")) || getThingAll(memberDataset)[0];
        var existingWebId = memberThing ? getUrl(memberThing, FOAF.member) : "";
        if (existingWebId === memberWebId) return;
      } catch (_unused7) {
        // Ignore malformed entries.
      }
    }
    var turtle = ["@prefix foaf: <http://xmlns.com/foaf/0.1/>.", "@prefix dcterms: <http://purl.org/dc/terms/>.", "", "<#it> a foaf:Group ;", "  foaf:member <".concat(memberWebId, "> ;"), "  dcterms:modified \"".concat(new Date().toISOString(), "\"^^<http://www.w3.org/2001/XMLSchema#dateTime> ."), ""].join("\n");
    var res = yield fetch(normalizedUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/turtle",
        "Slug": "member-".concat(encodeURIComponent(memberWebId))
      },
      body: turtle
    });
    if (!res.ok) {
      throw new Error("Failed to write registry (".concat(normalizedUrl, "): ").concat(res.status));
    }
  });
  return function registerWebIdInRegistryContainer(_x38, _x39, _x40) {
    return _ref17.apply(this, arguments);
  };
}();
var registerWebIdInRegistries = /*#__PURE__*/function () {
  var _ref18 = _asyncToGenerator(function* (webId, fetch, registryConfig) {
    if (!webId) return;
    var config = yield resolveRegistryConfig(webId, fetch, registryConfig);
    var containers = [];
    var allowCreate = false;
    if (config.mode === "private") {
      allowCreate = true;
      containers = [config.privateRegistry];
    } else {
      containers = config.registries;
    }
    var normalized = Array.from(new Set(containers.map(normalizeContainerUrl).filter(Boolean)));
    if (!normalized.length) return;
    for (var containerUrl of normalized) {
      try {
        yield registerWebIdInRegistryContainer(containerUrl, fetch, webId, {
          allowCreate
        });
      } catch (err) {
        throw new Error("Failed to access registry (".concat(containerUrl, "): ").concat((err === null || err === void 0 ? void 0 : err.message) || err));
      }
    }
  });
  return function registerWebIdInRegistries(_x41, _x42, _x43) {
    return _ref18.apply(this, arguments);
  };
}();
var ensureCatalogStructure = /*#__PURE__*/function () {
  var _ref21 = _asyncToGenerator(function* (session) {
    var _session$info;
    var {
      title,
      description,
      registryConfig
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!(session !== null && session !== void 0 && (_session$info = session.info) !== null && _session$info !== void 0 && _session$info.webId)) {
      throw new Error("No Solid WebID available.");
    }
    var webId = session.info.webId;
    var podRoot = getPodRoot(webId);
    var fetch = session.fetch;
    yield ensureContainer("".concat(podRoot).concat(CATALOG_CONTAINER), fetch);
    yield ensureContainer("".concat(podRoot).concat(DATASET_CONTAINER), fetch);
    yield ensureContainer("".concat(podRoot).concat(SERIES_CONTAINER), fetch);
    yield ensureContainer("".concat(podRoot).concat(RECORDS_CONTAINER), fetch);

    // Legacy local registry.ttl is no longer used.

    var catalogDocUrl = getCatalogDocUrl(webId);
    var catalogResourceUrl = getCatalogResourceUrl(webId);
    yield ensureCatalogDocument(session, catalogDocUrl, {
      title: title || "Solid Dataspace Catalog",
      description: description || "",
      contactPoint: webId
    });
    yield makePublicReadable(catalogDocUrl, fetch);
    yield makePublicReadable("".concat(podRoot).concat(CATALOG_CONTAINER), fetch);
    yield makePublicReadable("".concat(podRoot).concat(DATASET_CONTAINER), fetch);
    yield makePublicReadable("".concat(podRoot).concat(SERIES_CONTAINER), fetch);
    yield makePublicReadable("".concat(podRoot).concat(RECORDS_CONTAINER), fetch);
    yield setCatalogLinkInProfile(webId, catalogResourceUrl, fetch);
    yield registerWebIdInRegistries(webId, fetch, registryConfig);
    return {
      catalogDocUrl,
      catalogUrl: catalogResourceUrl
    };
  });
  return function ensureCatalogStructure(_x49) {
    return _ref21.apply(this, arguments);
  };
}();
var DEFAULT_THEME_NS = "https://w3id.org/solid-dataspace-manager/theme/";
DCAT.seriesMember || "http://www.w3.org/ns/dcat#seriesMember";
var DCAT_IN_SERIES = DCAT.inSeries || "http://www.w3.org/ns/dcat#inSeries";
var toThemeIri = value => {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  var slug = value.trim().toLowerCase().replace(/\s+/g, "-");
  return "".concat(DEFAULT_THEME_NS).concat(encodeURIComponent(slug));
};
var buildDatasetResource = (datasetDocUrl, input) => {
  var datasetUrl = "".concat(datasetDocUrl, "#it");
  var datasetThing = createThing({
    url: datasetUrl
  });
  datasetThing = addUrl(datasetThing, RDF.type, DCAT.Dataset);
  datasetThing = removeAll(datasetThing, DCTERMS.identifier);
  datasetThing = setStringNoLocale(datasetThing, DCTERMS.identifier, input.identifier);
  datasetThing = removeAll(datasetThing, DCTERMS.title);
  datasetThing = setLocaleString(datasetThing, DCTERMS.title, input.title || "");
  datasetThing = removeAll(datasetThing, DCTERMS.description);
  datasetThing = setLocaleString(datasetThing, DCTERMS.description, input.description || "");
  datasetThing = removeAll(datasetThing, DCTERMS.issued);
  datasetThing = setDatetime(datasetThing, DCTERMS.issued, new Date(input.issued || safeNow()));
  datasetThing = removeAll(datasetThing, DCTERMS.modified);
  datasetThing = setDatetime(datasetThing, DCTERMS.modified, new Date(safeNow()));
  datasetThing = removeAll(datasetThing, DCTERMS.publisher);
  if (input.publisher_url) {
    datasetThing = setUrl(datasetThing, DCTERMS.publisher, input.publisher_url);
  } else if (input.publisher) {
    datasetThing = setLocaleString(datasetThing, DCTERMS.publisher, input.publisher);
  }
  datasetThing = removeAll(datasetThing, DCTERMS.creator);
  if (input.webid) {
    datasetThing = setUrl(datasetThing, DCTERMS.creator, input.webid);
  }
  datasetThing = removeAll(datasetThing, DCAT.theme);
  if (input.theme) {
    datasetThing = setUrl(datasetThing, DCAT.theme, toThemeIri(input.theme));
  }
  datasetThing = removeAll(datasetThing, DCTERMS.conformsTo);
  datasetThing = removeAll(datasetThing, LEGACY_DCAT_CONFORMS_TO);
  if (input.access_url_semantic_model) {
    datasetThing = setUrl(datasetThing, DCTERMS.conformsTo, input.access_url_semantic_model);
  }
  datasetThing = removeAll(datasetThing, DCTERMS.accessRights);
  datasetThing = setStringNoLocale(datasetThing, DCTERMS.accessRights, input.is_public ? "public" : "restricted");
  datasetThing = removeAll(datasetThing, DCAT_IN_SERIES);
  if (input.in_series) {
    var seriesList = Array.isArray(input.in_series) ? input.in_series : [input.in_series];
    seriesList.filter(Boolean).forEach(seriesUrl => {
      datasetThing = addUrl(datasetThing, DCAT_IN_SERIES, seriesUrl);
    });
  }
  return datasetThing;
};
var buildContactThing = (datasetDocUrl, input) => {
  if (!input.contact_point && !input.contact_url) return null;
  var contactUrl = "".concat(datasetDocUrl, "#contact");
  var contactThing = createThing({
    url: contactUrl
  });
  contactThing = addUrl(contactThing, RDF.type, VCARD.Individual);
  if (input.publisher) {
    contactThing = setLocaleString(contactThing, VCARD.fn, input.publisher);
  }
  contactThing = removeAll(contactThing, VCARD.hasEmail);
  if (input.contact_point) {
    contactThing = setUrl(contactThing, VCARD.hasEmail, "mailto:".concat(input.contact_point));
  }
  contactThing = removeAll(contactThing, VCARD_HAS_URL);
  if (input.contact_url) {
    contactThing = setUrl(contactThing, VCARD_HAS_URL, input.contact_url);
  }
  return contactThing;
};
var buildPublisherThing = input => {
  if (!input.publisher_url || !input.publisher) return null;
  var publisherThing = createThing({
    url: input.publisher_url
  });
  publisherThing = addUrl(publisherThing, RDF.type, FOAF.Agent);
  publisherThing = setLocaleString(publisherThing, FOAF.name, input.publisher);
  return publisherThing;
};
var buildDistributionThing = (datasetDocUrl, slug, distributionUrl, mediaType, distributionAccessType) => {
  if (!distributionUrl) return null;
  var distUrl = "".concat(datasetDocUrl, "#").concat(slug);
  var distThing = createThing({
    url: distUrl
  });
  var linkType = normalizeDistributionAccessType(distributionAccessType);
  distThing = addUrl(distThing, RDF.type, DCAT.Distribution);
  distThing = removeAll(distThing, DCAT.downloadURL);
  distThing = removeAll(distThing, DCAT.accessURL);
  distThing = linkType === DISTRIBUTION_ACCESS_TYPES.access ? setUrl(distThing, DCAT.accessURL, distributionUrl) : setUrl(distThing, DCAT.downloadURL, distributionUrl);
  distThing = removeAll(distThing, DCAT.mediaType);
  if (mediaType) {
    distThing = setStringNoLocale(distThing, DCAT.mediaType, mediaType);
  }
  return distThing;
};
var addLdpTypeIfLocal = (solidDataset, webId, targetUrl) => {
  if (!solidDataset || !webId || !targetUrl) return solidDataset;
  try {
    var podRoot = getPodRoot(webId);
    if (!targetUrl.startsWith(podRoot)) return solidDataset;
  } catch (_unused12) {
    return solidDataset;
  }
  var isContainer = targetUrl.endsWith("/");
  var resourceThing = createThing({
    url: targetUrl
  });
  resourceThing = addUrl(resourceThing, RDF.type, LDP.Resource);
  if (isContainer) {
    resourceThing = addUrl(resourceThing, RDF.type, LDP.Container);
  }
  return setThing(solidDataset, resourceThing);
};
var isLocalPodResource = (webId, targetUrl) => {
  if (!webId || !targetUrl) return false;
  try {
    return targetUrl.startsWith(getPodRoot(webId));
  } catch (_unused13) {
    return false;
  }
};
var ensureRestrictedResourceAccess = /*#__PURE__*/function () {
  var _ref30 = _asyncToGenerator(function* (session, resourceUrl) {
    var _session$info4;
    if (!(session !== null && session !== void 0 && (_session$info4 = session.info) !== null && _session$info4 !== void 0 && _session$info4.webId) || typeof session.fetch !== "function") {
      throw new Error("An authenticated Solid session is required.");
    }
    if (!isLocalPodResource(session.info.webId, resourceUrl)) {
      throw new Error("Restricted programmatic datasets must use a resource in the owner's Pod.");
    }
    yield setPublicReadAccess(resourceUrl, session.fetch, false);
    var {
      resourceAcl
    } = yield getResourceAndAcl(resourceUrl, session.fetch);
    var publicAccess = getPublicResourceAccess(resourceAcl);
    if (publicAccess.read || publicAccess.append || publicAccess.write || publicAccess.control) {
      throw new Error("Resource still has public access after ACL update: ".concat(resourceUrl));
    }
  });
  return function ensureRestrictedResourceAccess(_x63, _x64) {
    return _ref30.apply(this, arguments);
  };
}();
var syncLinkedResourceAccess = /*#__PURE__*/function () {
  var _ref31 = _asyncToGenerator(function* (session, input) {
    var urls = [input.access_url_dataset, input.access_url_semantic_model].filter(Boolean);
    for (var url of urls) {
      var _session$info5;
      if (!isLocalPodResource(session === null || session === void 0 || (_session$info5 = session.info) === null || _session$info5 === void 0 ? void 0 : _session$info5.webId, url)) {
        if (input.strict_restricted_acl && !input.is_public) {
          throw new Error("Restricted linked resource is outside the owner's Pod: ".concat(url));
        }
        continue;
      }
      try {
        if (input.strict_restricted_acl && !input.is_public) {
          yield ensureRestrictedResourceAccess(session, url);
        } else {
          yield setPublicReadAccess(url, session.fetch, Boolean(input.is_public));
        }
      } catch (err) {
        console.warn("Failed to sync linked resource ACL for", url, err);
        if (input.is_public || input.strict_restricted_acl) {
          var accessLabel = input.is_public ? "public" : "restricted";
          throw new Error("Failed to make linked resource ".concat(accessLabel, ": ").concat(url));
        }
      }
    }
  });
  return function syncLinkedResourceAccess(_x65, _x66) {
    return _ref31.apply(this, arguments);
  };
}();
var writeDatasetDocument = /*#__PURE__*/function () {
  var _ref32 = _asyncToGenerator(function* (session, datasetDocUrl, input) {
    var solidDataset;
    try {
      solidDataset = yield getSolidDataset(datasetDocUrl, {
        fetch: session.fetch
      });
    } catch (err) {
      if (isNotFound(err)) {
        solidDataset = createSolidDataset();
      } else {
        throw err;
      }
    }
    var datasetThing = buildDatasetResource(datasetDocUrl, input);
    var publisherThing = buildPublisherThing(input);
    if (publisherThing) {
      solidDataset = setThing(solidDataset, publisherThing);
    }
    var contactThing = buildContactThing(datasetDocUrl, input);
    if (contactThing) {
      solidDataset = setThing(solidDataset, contactThing);
      datasetThing = setUrl(datasetThing, DCAT.contactPoint, contactThing.url);
    }
    var distDataset = buildDistributionThing(datasetDocUrl, "dist", input.access_url_dataset, input.file_format, input.distribution_access_type);
    if (distDataset) {
      var _session$info6;
      solidDataset = setThing(solidDataset, distDataset);
      datasetThing = addUrl(datasetThing, DCAT.distribution, distDataset.url);
      solidDataset = addLdpTypeIfLocal(solidDataset, session === null || session === void 0 || (_session$info6 = session.info) === null || _session$info6 === void 0 ? void 0 : _session$info6.webId, input.access_url_dataset);
    }
    if (input.access_url_semantic_model) {
      var _session$info7;
      solidDataset = addLdpTypeIfLocal(solidDataset, session === null || session === void 0 || (_session$info7 = session.info) === null || _session$info7 === void 0 ? void 0 : _session$info7.webId, input.access_url_semantic_model);
    }
    solidDataset = setThing(solidDataset, datasetThing);
    yield saveSolidDatasetAt(datasetDocUrl, solidDataset, {
      fetch: session.fetch
    });
    var head = yield session.fetch(datasetDocUrl, {
      method: "HEAD"
    });
    if (!head.ok) {
      throw new Error("Dataset write failed (".concat(head.status, ")"));
    }
    yield makePublicReadable(datasetDocUrl, session.fetch);
    yield syncLinkedResourceAccess(session, input);
  });
  return function writeDatasetDocument(_x67, _x68, _x69) {
    return _ref32.apply(this, arguments);
  };
}();
var updateCatalogDatasets = /*#__PURE__*/function () {
  var _ref34 = _asyncToGenerator(function* (session, catalogDocUrl, datasetUrl) {
    var {
      remove
    } = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var datasetRef = toCatalogDatasetRef(catalogDocUrl, datasetUrl);
    yield mutateCatalogDocument(session, catalogDocUrl, current => {
      if (remove) {
        current.delete(datasetRef);
      } else {
        current.add(datasetRef);
      }
      return current;
    });
    yield makePublicReadable(catalogDocUrl, session.fetch);
  });
  return function updateCatalogDatasets(_x73, _x74, _x75) {
    return _ref34.apply(this, arguments);
  };
}();
var writeRecordDocument = /*#__PURE__*/function () {
  var _ref37 = _asyncToGenerator(function* (session, datasetDocUrl, identifier) {
    var recordDocUrl = "".concat(getPodRoot(session.info.webId)).concat(RECORDS_CONTAINER).concat(identifier, ".ttl");
    var recordDataset;
    try {
      recordDataset = yield getSolidDataset(recordDocUrl, {
        fetch: session.fetch
      });
    } catch (err) {
      var _err$response6;
      if ((err === null || err === void 0 ? void 0 : err.statusCode) === 404 || (err === null || err === void 0 || (_err$response6 = err.response) === null || _err$response6 === void 0 ? void 0 : _err$response6.status) === 404) {
        recordDataset = createSolidDataset();
      } else {
        throw err;
      }
    }
    var descUrl = "".concat(recordDocUrl, "#desc");
    var existingDesc = getThing(recordDataset, descUrl);
    var existingChanges = existingDesc ? getUrlAll(existingDesc, SDM_CHANGELOG) : [];
    var descThing = createThing({
      url: descUrl
    });
    descThing = addUrl(descThing, RDF.type, DCAT.CatalogRecord);
    descThing = setStringNoLocale(descThing, DCTERMS.title, "Dataset description record");
    descThing = setStringNoLocale(descThing, DCTERMS.description, "Catalog record for dataset metadata.");
    descThing = setUrl(descThing, FOAF.primaryTopic, datasetDocUrl);
    descThing = setDatetime(descThing, DCTERMS.modified, new Date());
    var changeUrl = "".concat(recordDocUrl, "#change-").concat(Date.now());
    var changeThing = createThing({
      url: changeUrl
    });
    changeThing = addUrl(changeThing, RDF.type, SDM_CHANGE_EVENT);
    changeThing = setDatetime(changeThing, DCTERMS.modified, new Date());
    changeThing = setStringNoLocale(changeThing, DCTERMS.description, "Dataset metadata updated.");
    recordDataset = setThing(recordDataset, changeThing);
    existingChanges.forEach(url => {
      descThing = addUrl(descThing, SDM_CHANGELOG, url);
    });
    descThing = addUrl(descThing, SDM_CHANGELOG, changeUrl);
    recordDataset = setThing(recordDataset, descThing);
    var aclUrl = "".concat(datasetDocUrl, ".acl");
    var wacUrl = "".concat(recordDocUrl, "#wac");
    var wacThing = createThing({
      url: wacUrl
    });
    wacThing = addUrl(wacThing, RDF.type, DCAT.CatalogRecord);
    wacThing = setStringNoLocale(wacThing, DCTERMS.title, "Dataset ACL record");
    wacThing = setStringNoLocale(wacThing, DCTERMS.description, "Catalog record for the dataset access control.");
    wacThing = setUrl(wacThing, FOAF.primaryTopic, aclUrl);
    wacThing = setDatetime(wacThing, DCTERMS.modified, new Date());
    recordDataset = setThing(recordDataset, wacThing);
    yield saveSolidDatasetAt(recordDocUrl, recordDataset, {
      fetch: session.fetch
    });
    yield makePublicReadable(recordDocUrl, session.fetch);
  });
  return function writeRecordDocument(_x82, _x83, _x84) {
    return _ref37.apply(this, arguments);
  };
}();
var generateIdentifier$1 = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "dataset-".concat(Date.now());
};
var createDataset = /*#__PURE__*/function () {
  var _ref38 = _asyncToGenerator(function* (session, input) {
    yield ensureCatalogStructure(session);
    validateDatasetInput(input);
    var identifier = input.identifier || generateIdentifier$1();
    var datasetDocUrl = "".concat(getPodRoot(session.info.webId)).concat(DATASET_CONTAINER).concat(identifier, ".ttl");
    var datasetUrl = "".concat(datasetDocUrl, "#it");
    yield writeDatasetDocument(session, datasetDocUrl, _objectSpread2(_objectSpread2({}, input), {}, {
      identifier
    }));
    yield updateCatalogDatasets(session, getCatalogDocUrl(session.info.webId), datasetUrl, {
      remove: false
    });
    yield writeRecordDocument(session, datasetDocUrl, identifier);
    clearCache();
    return {
      datasetUrl,
      identifier
    };
  });
  return function createDataset(_x85, _x86) {
    return _ref38.apply(this, arguments);
  };
}();
var deleteDatasetEntry = /*#__PURE__*/function () {
  var _ref43 = _asyncToGenerator(function* (session, datasetUrl, identifier) {
    if (!datasetUrl) return;
    var datasetDocUrl = getDocumentUrl(datasetUrl);
    try {
      var recordDocUrl = identifier ? "".concat(getPodRoot(session.info.webId)).concat(RECORDS_CONTAINER).concat(identifier, ".ttl") : "";
      yield updateCatalogDatasets(session, getCatalogDocUrl(session.info.webId), datasetUrl, {
        remove: true
      });
      yield deleteCatalogDatasetDocuments({
        datasetDocUrl,
        recordDocUrl,
        fetch: session.fetch,
        deleteResource: deleteFile
      });
    } finally {
      clearCache();
    }
  });
  return function deleteDatasetEntry(_x96, _x97, _x98) {
    return _ref43.apply(this, arguments);
  };
}();

var IDENTIFIER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;
var generateIdentifier = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "dataset-".concat(Date.now());
};
var normalizeContactEmail = value => {
  var candidate = String(value || "").trim().replace(/^mailto:/, "");
  return candidate.includes("@") && !candidate.includes(":") ? candidate : "";
};
var normalizeContactUrl = value => {
  var candidate = String(value || "").trim();
  if (!candidate) return "";
  try {
    var url = new URL(candidate);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch (_unused) {
    return "";
  }
};
function normalizeRestrictedDatasetInput(session) {
  var _session$info;
  var input = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!(session !== null && session !== void 0 && (_session$info = session.info) !== null && _session$info !== void 0 && _session$info.webId) || typeof session.fetch !== "function") {
    throw new Error("An authenticated Solid session is required.");
  }
  var identifier = String(input.identifier || generateIdentifier()).trim();
  if (!IDENTIFIER_PATTERN.test(identifier)) {
    throw new Error("Dataset identifier contains unsupported characters.");
  }
  var distributionUrl = String(input.distributionUrl || input.access_url_dataset || input.dataUrl || "").trim();
  if (!distributionUrl) throw new Error("A dataset distribution URL is required.");
  var includeCreator = input.includeCreator !== false && input.omitCreator !== true;
  var contactPoint = input.contactPoint || input.contact_point || "";
  var explicitContactUrl = input.contactPointWebId || input.contactWebId || input.contactPointUrl || input.contactUrl || input.contact_url || contactPoint;
  return {
    identifier,
    title: String(input.title || "").trim(),
    description: String(input.description || "").trim(),
    issued: input.issued || new Date().toISOString(),
    publisher: String(input.publisher || "").trim(),
    publisher_url: normalizeContactUrl(input.publisherWebId || input.publisherUrl || input.publisher_url),
    contact_point: normalizeContactEmail(contactPoint),
    contact_url: normalizeContactUrl(explicitContactUrl),
    access_url_dataset: distributionUrl,
    access_url_semantic_model: String(input.semanticModelUrl || input.access_url_semantic_model || "").trim(),
    file_format: String(input.mediaType || input.file_format || "").trim(),
    theme: String(input.theme || "").trim(),
    webid: includeCreator ? String(input.creatorWebId || input.webid || session.info.webId).trim() : "",
    distribution_access_type: "download",
    is_public: false,
    strict_restricted_acl: true
  };
}
function publishRestrictedDataset(_x) {
  return _publishRestrictedDataset.apply(this, arguments);
}
function _publishRestrictedDataset() {
  _publishRestrictedDataset = _asyncToGenerator(function* (session) {
    var input = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var normalized = normalizeRestrictedDatasetInput(session, input);
    var podRoot = getPodRoot(session.info.webId);
    var datasetUrl = "".concat(podRoot, "catalog/ds/").concat(normalized.identifier, ".ttl#it");
    var recordUrl = "".concat(podRoot, "catalog/records/").concat(normalized.identifier, ".ttl");
    yield ensureRestrictedResourceAccess(session, normalized.access_url_dataset);
    if (normalized.access_url_semantic_model) {
      yield ensureRestrictedResourceAccess(session, normalized.access_url_semantic_model);
    }
    try {
      var created = yield createDataset(session, normalized);
      return _objectSpread2(_objectSpread2({}, created), {}, {
        recordUrl,
        distributionUrl: normalized.access_url_dataset
      });
    } catch (error) {
      try {
        yield deleteDatasetEntry(session, datasetUrl, normalized.identifier);
      } catch (cleanupError) {
        console.warn("Failed to clean up incomplete restricted dataset metadata.", cleanupError);
      }
      throw error;
    }
  });
  return _publishRestrictedDataset.apply(this, arguments);
}
function removeDataset(_x2) {
  return _removeDataset.apply(this, arguments);
}
function _removeDataset() {
  _removeDataset = _asyncToGenerator(function* (session) {
    var _session$info2;
    var reference = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!(session !== null && session !== void 0 && (_session$info2 = session.info) !== null && _session$info2 !== void 0 && _session$info2.webId) || typeof session.fetch !== "function") {
      throw new Error("An authenticated Solid session is required.");
    }
    var input = typeof reference === "string" ? {
      datasetUrl: reference
    } : reference;
    var identifier = String(input.identifier || "").trim();
    if (identifier && !IDENTIFIER_PATTERN.test(identifier)) {
      throw new Error("Dataset identifier contains unsupported characters.");
    }
    var datasetUrl = String(input.datasetUrl || (identifier ? "".concat(getPodRoot(session.info.webId), "catalog/ds/").concat(identifier, ".ttl#it") : "")).trim();
    if (!datasetUrl) throw new Error("datasetUrl or identifier is required.");
    yield deleteDatasetEntry(session, datasetUrl, identifier);
    return {
      removed: true,
      datasetUrl,
      identifier
    };
  });
  return _removeDataset.apply(this, arguments);
}

export { normalizeRestrictedDatasetInput, publishRestrictedDataset, removeDataset };
//# sourceMappingURL=index.js.map
