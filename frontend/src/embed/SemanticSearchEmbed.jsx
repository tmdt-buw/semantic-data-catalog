import React from 'react';
import { I18nProvider } from '../i18n';
import SemanticSearch from '../components/SemanticSearch';
import './embed.css';

export default function SemanticSearchEmbed({ language, onOpenDataset, apiBaseUrl }) {
  return <I18nProvider language={language}><SemanticSearch onOpenDataset={onOpenDataset} apiBaseUrl={apiBaseUrl} /></I18nProvider>;
}
