# Semantic Data Catalog

A FAIR-compliant **Semantic Data Catalog** for decentralized Solid-based dataspaces. The catalog stores metadata directly in a Solid Pod using DCAT and supports **datasets** and **dataset series** for discovery.

---

## Architecture (Current)

- **Frontend (React)**: The UI that reads/writes DCAT metadata directly in the user's Solid Pod.
- **Solid Pod**: Source of truth for catalog metadata (Turtle documents).
- **Backend API (FastAPI)**: Helper API for public Solid catalog reads, SHACL validation, merged Turtle export, and service-account dataset creation.

The previous SQL database and Fuseki setup is no longer used by the current `docker-compose.yaml`.

---

## Quickstart (Docker)

```bash
docker-compose up -d --build
```

Services:
- Frontend: `http://localhost:5000`
- Backend API: `http://localhost:8000/api`

---

## Configuration

Edit the environment variables in `docker-compose.yaml` for the frontend:

```env
REACT_APP_OIDC_ISSUER=https://solidcommunity.net
```

For backend writes, configure a Solid service account:

```env
CATALOG_SERVICE_WEBID=https://solid-community-server.tmdt.info/solidservice/profile/card#me
CATALOG_SERVICE_OIDC_ISSUER=https://solid-community-server.tmdt.info
CATALOG_SERVICE_CLIENT_ID=
CATALOG_SERVICE_CLIENT_SECRET=
CATALOG_SERVICE_TOKEN_URL=
```

The service WebID needs write access to the target user's `catalog/` container
and inherited write access for `catalog/ds/` and `catalog/records/`. To make
new metadata documents publicly readable, it also needs ACL control access for
those metadata resources. The backend uses Solid-OIDC client credentials with
DPoP proofs for Solid requests.

Notes:
- The UI base path is `/semantic-data-catalog` (see `frontend/package.json` `homepage` and the `PUBLIC_URL` script flags).
- If you deploy under a different base path, adjust `PUBLIC_URL` accordingly (see the `frontend/package.json` scripts).

---

## Data Model (DCAT)

Catalog data is stored inside the user's Solid Pod under:

- `catalog/cat.ttl` (Catalog)
- `catalog/ds/*.ttl` (Datasets)
- `catalog/series/*.ttl` (Dataset Series)
- `catalog/records/*.ttl` (Catalog Records)

Modeling rules used by the UI:

- `dcat:Catalog` lists **datasets and series** via `dcat:dataset` (Series is a subclass of Dataset).
- Dataset series members are linked from **datasets** via `dcat:inSeries`.
- `dcat:seriesMember` on the series is optional/inverse.

---

## Backend API

The API does not maintain a separate database or triple store. It reads public DCAT
metadata directly from Solid Pods and returns JSON summaries.

Useful endpoints:

- `GET /api/docs` (Swagger UI)
- `GET /api/redoc`
- `GET /api/openapi.json`
- `GET /api/health`
- `GET /api/catalog?webId=...` or `GET /api/catalog?catalogUrl=...`
- `GET /api/datasets?webId=...&q=...&theme=...&type=dataset|series`
- `GET /api/datasets/count?webId=...`
- `GET /api/datasets/resolve?url=...`
- `POST /api/datasets`
- `POST /api/validate` with `{ "turtle": "...", "base_uri": "..." }`
- `GET /api/export/catalog?webId=...`

`POST /api/datasets` writes one DCAT dataset document, links it from the
owner's catalog, writes a catalog record document, and tries to make these
metadata documents publicly readable. For public datasets, local Pod resources
referenced by `access_url_dataset` or `access_url_semantic_model` are also made
public-readable when the service account has ACL control access. If
`identifier` is omitted, the backend generates a UUID. If `publisher` or
`contact_point` are omitted, they are read from the owner WebID profile
(`vcard:fn`/`foaf:name` and `vcard:hasEmail`). Example body:

```json
{
  "ownerWebId": "https://solid-community-server.tmdt.info/alice/profile/card#me",
  "title": "Air Quality Measurements",
  "description": "Hourly sensor observations.",
  "publisher": "City of Wuppertal",
  "contact_point": "data@example.org",
  "is_public": true,
  "access_url_dataset": "https://example.org/data/air-quality.csv",
  "distribution_access_type": "download",
  "file_format": "text/csv",
  "theme": "environment"
}
```

Update, delete, ACL management, file uploads, and series creation are not part
of the first backend write endpoint.

Optional backend environment variables:

- `CATALOG_FETCH_TIMEOUT_SECONDS` (default: `10`)
- `CATALOG_FETCH_HOST_ALLOWLIST` (comma-separated hostnames; empty means no host restriction)
- `CATALOG_SERVICE_AUTHORIZATION_HEADER` or `CATALOG_SERVICE_ACCESS_TOKEN` as alternatives to client credentials
- `CATALOG_SERVICE_SCOPE` (default: `webid`)

---

## Access Requests (Solid Notifications)

Access requests are delivered as Solid inbox notifications to the dataset owner.
Approval/denial handling is implemented in a separate application. The catalog itself remains usable on its own.

---

## License

This project is licensed under the [Apache License 2.0](LICENSE). See [NOTICE](NOTICE) for attribution information.

---

## Citation

If you use this tool in your research, please cite:

> **Bridging the Discovery Gap in Solid Dataspaces with a Semantic Data Catalog**  
> Florian Hoelken, Alexander Paulus, Tobias Meisen, Andre Pomp.  
> *The 2nd Solid Symposium*, Leiden, Netherlands, April 24-25, 2025.  

```bibtex
@inproceedings{hoelken2025solidcatalog,
  title={Bridging the Discovery Gap in Solid Dataspaces with a Semantic Data Catalog},
  author={Hoelken, Florian and Paulus, Alexander and Meisen, Tobias and Pomp, Andre},
  booktitle={The 2nd Solid Symposium Poster Session},
  year={2025},
  location={Leiden, Netherlands}
}
```

---

## Acknowledgements

This work has been supported as part of the research project _Gesundes Tal_ in collaboration with the city of Wuppertal, funded by the Federal Ministry of Housing, Urban Development and Building (BMWSB) and the Reconstruction Loan Corporation (KfW) through the funding program “Modellprojekte Smart Cities: Stadtentwicklung und Digitalisierung” (grant number 19454890).

---

## Contact

For questions or contributions, please contact:

- Florian Hoelken — [hoelken@uni-wuppertal.de](mailto:hoelken@uni-wuppertal.de)
