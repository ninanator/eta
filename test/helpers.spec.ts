/* global it, expect, describe */

import { render, defaultConfig, compileToString } from '../src/index'

// SHOULD TEST COMMON ETA USAGE PATTERNS HERE

var eachTemplate = `
The Daugherty's have 5 kids:
<ul>
<% it.kids.forEach(function(kid){ %>
<li><%= kid %></li>
<% }) %>
</ul>`

describe('Helper tests', () => {
  it('parses a simple array foreach', () => {
    var res = render(eachTemplate, { kids: ['Ben', 'Polly', 'Joel', 'Phronsie', 'Davie'] })
    expect(res).toEqual(
      `
The Daugherty's have 5 kids:
<ul>
<li>Ben</li>
<li>Polly</li>
<li>Joel</li>
<li>Phronsie</li>
<li>Davie</li>
</ul>`
    )
  })
})
