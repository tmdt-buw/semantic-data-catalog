import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import SemanticSearch from './SemanticSearch';
import SemanticSearchResults from './SemanticSearchResults';
import { I18nProvider } from '../i18n';

describe('Semantic Search', () => {
  let container, root, originalFetch;
  beforeAll(() => { global.IS_REACT_ACT_ENVIRONMENT = true; });
  beforeEach(() => {
    originalFetch = global.fetch;
    container = document.createElement('div'); document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(async () => { await act(async () => root.unmount()); container.remove(); global.fetch = originalFetch; });
  const reply = (body, contentType = 'application/json') => ({ ok: true, headers: { get: name => name === 'content-type' ? contentType : '12' }, json: async () => body, text: async () => body });
  const render = async node => act(async () => root.render(<I18nProvider language="en">{node}</I18nProvider>));

  test('queries only its configured API and opens returned dataset details', async () => {
    const url = 'https://pod.example/catalog/ds/1.ttl#it';
    const open = jest.fn();
    global.fetch = jest.fn().mockResolvedValueOnce(reply({status:'ready', dataspaceId:'dace', datasetCount:1, modelCount:1}))
      .mockResolvedValueOnce(reply({head:{vars:['dataset','title']},results:{bindings:[{dataset:{type:'uri',value:url},title:{type:'literal',value:'Steel beam'}}]}}));
    await render(<SemanticSearch onOpenDataset={open} />);
    expect(container.querySelector('button[type="submit"]').disabled).toBe(false);
    await act(async () => container.querySelector('form').dispatchEvent(new Event('submit', {bubbles:true,cancelable:true})));
    const [endpoint, options] = global.fetch.mock.calls[1];
    expect(endpoint).toBe('/api/semantic-search/query');
    expect(options.credentials).toBe('omit');
    expect(Object.keys(JSON.parse(options.body))).toEqual(['query']);
    await act(async () => container.querySelector('.semantic-search-dataset').click());
    expect(open).toHaveBeenCalledWith(url);
  });

  test('does not submit queries against a stale index', async () => {
    global.fetch = jest.fn().mockResolvedValue(reply({status:'stale',dataspaceId:'test'}));
    await render(<SemanticSearch />);
    expect(container.querySelector('button[type="submit"]').disabled).toBe(true);
    expect(container.textContent).toContain('Search is currently unavailable');
  });

  test('renders ASK and RDF results and keeps unsafe IRIs inert', async () => {
    await render(<SemanticSearchResults result={{body:{boolean:false}}} />);
    expect(container.textContent).toContain('false');
    await render(<SemanticSearchResults result={{body:'<urn:a> <urn:b> "<script>" .'}} />);
    expect(container.querySelector('pre').textContent).toContain('<script>');
    expect(container.querySelector('script')).toBeNull();
    await render(<SemanticSearchResults result={{body:{head:{vars:['url']},results:{bindings:[{url:{type:'uri',value:'javascript:alert(1)'}}]}}}} />);
    expect(container.querySelector('a')).toBeNull();
  });
});
